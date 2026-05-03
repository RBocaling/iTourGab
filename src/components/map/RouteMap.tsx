import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZoomIn, ZoomOut, Layers, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchDirectionsRoute,
  formatDistanceKm,
  formatDuration,
  getMapboxAccessToken,
  type MapboxTransportMode,
  toLngLatPair,
} from "@/lib/mapboxDirections";

export type RouteMapCalculatedPayload = {
  distanceLabel: string;
  durationLabel: string;
  profile: MapboxTransportMode;
};

interface RouteMapProps {
  /** Resolved origin; when null, route is cleared and map stays centered on destination. */
  fromCoordinates: { lat: number; lng: number } | null;
  toCoordinates: { lat: number; lng: number };
  fromLabel?: string;
  toLabel?: string;
  profile: MapboxTransportMode;
  onRouteCalculated?: (payload: RouteMapCalculatedPayload) => void;
  onRouteError?: (message: string | null) => void;
}

const EMPTY_ROUTE_COLLECTION: mapboxgl.GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const RouteMap: React.FC<RouteMapProps> = ({
  fromCoordinates,
  toCoordinates,
  fromLabel = "Start",
  toLabel = "End",
  profile,
  onRouteCalculated,
  onRouteError,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapStyle, setMapStyle] = useState<"3d" | "2d">("3d");
  const fetchIdRef = useRef(0);
  const onCalculatedRef = useRef(onRouteCalculated);
  const onErrorRef = useRef(onRouteError);
  onCalculatedRef.current = onRouteCalculated;
  onErrorRef.current = onRouteError;

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const setRouteData = useCallback(
    (coordinates: [number, number][]) => {
      if (!map.current) return;
      const src = map.current.getSource("route") as mapboxgl.GeoJSONSource;
      if (!src) return;
      const line =
        coordinates.length >= 2
          ? coordinates
          : coordinates.length === 1
            ? [coordinates[0], coordinates[0]]
            : [];
      if (line.length < 2) {
        src.setData(EMPTY_ROUTE_COLLECTION);
        return;
      }
      src.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: line },
          },
        ],
      });
    },
    [],
  );

  useEffect(() => {
    mapboxgl.accessToken = getMapboxAccessToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    const to = toLngLatPair(toCoordinates);
    const currentStyle =
      mapStyle === "3d"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/streets-v12";

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: currentStyle,
      center: to,
      zoom: 12,
      pitch: mapStyle === "3d" ? 45 : 0,
      bearing: 0,
      attributionControl: false,
    });

    map.current = m;

    m.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right",
    );

    const onLoad = () => {
      if (!m.getSource("route")) {
        m.addSource("route", {
          type: "geojson",
          data: EMPTY_ROUTE_COLLECTION,
        });
        m.addLayer({
          id: "route-casing",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#1e40af",
            "line-width": 8,
            "line-opacity": 0.55,
          },
        });
        m.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 5,
            "line-opacity": 0.92,
          },
        });
      }
      setMapReady(true);
    };

    if (m.loaded()) onLoad();
    else m.once("load", onLoad);

    return () => {
      setMapReady(false);
      clearMarkers();
      m.remove();
      map.current = null;
    };
  }, [mapStyle, toCoordinates.lat, toCoordinates.lng, clearMarkers]);

  useEffect(() => {
    if (!mapReady || !map.current) return;

    const ac = new AbortController();
    const signal = ac.signal;

    const run = async () => {
      if (!fromCoordinates) {
        fetchIdRef.current += 1;
        setIsLoading(false);
        clearMarkers();
        setRouteData([]);
        onErrorRef.current?.(null);
        const to = toLngLatPair(toCoordinates);
        map.current?.flyTo({ center: to, zoom: 12, duration: 600 });
        const toMarker = document.createElement("div");
        toMarker.innerHTML = `
        <div style="
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 18px; border: 4px solid white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
        ">B</div>`;
        const tm = new mapboxgl.Marker(toMarker)
          .setLngLat(to)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 10px; font-weight: 600;">${toLabel}</div>`,
            ),
          )
          .addTo(map.current!);
        markersRef.current.push(tm);
        return;
      }

      const id = ++fetchIdRef.current;
      setIsLoading(true);
      onErrorRef.current?.(null);

      let result: Awaited<ReturnType<typeof fetchDirectionsRoute>>;
      try {
        result = await fetchDirectionsRoute(
          fromCoordinates,
          toCoordinates,
          profile,
          signal,
        );
      } catch {
        if (id !== fetchIdRef.current) return;
        setIsLoading(false);
        if (!signal.aborted) {
          onErrorRef.current?.("Could not load directions. Try again.");
        }
        return;
      }

      if (id !== fetchIdRef.current || !map.current) return;
      setIsLoading(false);

      if (!result.ok) {
        setRouteData([]);
        clearMarkers();
        onErrorRef.current?.(result.message);
        onCalculatedRef.current?.({
          distanceLabel: "—",
          durationLabel: "—",
          profile,
        });
        return;
      }

      const { geometry, distanceM, durationS } = result.route;
      const coords = geometry.coordinates as [number, number][];
      setRouteData(coords);
      onErrorRef.current?.(null);

      const distanceLabel = formatDistanceKm(distanceM);
      const durationLabel = formatDuration(durationS);
      onCalculatedRef.current?.({ distanceLabel, durationLabel, profile });

      clearMarkers();
      const fromLL = toLngLatPair(fromCoordinates);
      const toLL = toLngLatPair(toCoordinates);

      const fromEl = document.createElement("div");
      fromEl.innerHTML = `
        <div style="
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 18px; border: 4px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
        ">A</div>`;
      markersRef.current.push(
        new mapboxgl.Marker(fromEl)
          .setLngLat(fromLL)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 10px; font-weight: 600;">${fromLabel}</div>`,
            ),
          )
          .addTo(map.current),
      );

      const toEl = document.createElement("div");
      toEl.innerHTML = `
        <div style="
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 18px; border: 4px solid white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
        ">B</div>`;
      markersRef.current.push(
        new mapboxgl.Marker(toEl)
          .setLngLat(toLL)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 10px; font-weight: 600;">${toLabel}</div>`,
            ),
          )
          .addTo(map.current),
      );

      const bounds = coords.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(coords[0], coords[0]),
      );
      map.current.fitBounds(bounds, {
        padding: { top: 90, bottom: 90, left: 50, right: 50 },
        maxZoom: 15,
      });
    };

    void run();

    return () => {
      ac.abort();
    };
  }, [
    mapReady,
    fromCoordinates?.lat,
    fromCoordinates?.lng,
    toCoordinates.lat,
    toCoordinates.lng,
    profile,
    fromLabel,
    toLabel,
    clearMarkers,
    setRouteData,
  ]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const toggleMapStyle = () => setMapStyle((p) => (p === "3d" ? "2d" : "3d"));

  const recenterMap = () => {
    if (!map.current) return;
    if (!fromCoordinates) {
      map.current.flyTo({
        center: toLngLatPair(toCoordinates),
        zoom: 12,
        duration: 500,
      });
      return;
    }
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(toLngLatPair(fromCoordinates));
    bounds.extend(toLngLatPair(toCoordinates));
    map.current.fitBounds(bounds, {
      padding: { top: 100, bottom: 100, left: 50, right: 50 },
      maxZoom: 15,
    });
  };

  return (
    <div className="relative w-full h-full bg-background">
      <div ref={mapContainer} className="w-full h-full" />

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-foreground">
                Calculating route…
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        <Button
          type="button"
          onClick={handleZoomIn}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          type="button"
          onClick={handleZoomOut}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          type="button"
          onClick={toggleMapStyle}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title={mapStyle === "3d" ? "Switch to 2D" : "Switch to 3D"}
        >
          <Layers className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          type="button"
          onClick={recenterMap}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Recenter Map"
        >
          <Navigation className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-full px-4 py-2 shadow-lg">
          <span className="text-xs font-semibold text-foreground">
            {mapStyle === "3d" ? "3D View" : "2D View"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
