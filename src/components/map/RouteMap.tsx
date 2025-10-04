import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ZoomIn, ZoomOut, Layers, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmV5bmFsZG8xMjMxIiwiYSI6ImNtZnVxOXE1MzAxZWwycW9waWxpMmJ2MzMifQ.lmC2pB2Wg7-k-UPj1t--ig";

interface RouteMapProps {
  fromLocation: string;
  toLocation: string;
  toCoordinates: { lat: number; lng: number };
  onRouteCalculated?: (distance: string, duration: string) => void;
}

const RouteMap: React.FC<RouteMapProps> = ({
  fromLocation,
  toLocation,
  toCoordinates,
  onRouteCalculated,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<"3d" | "2d">("3d");

  // Simulated coordinates for demo (Cabanatuan area)
  const fromCoords: [number, number] = [121.1166, 15.4839]; // Cabanatuan approximate
  const toCoords: [number, number] = [toCoordinates.lng, toCoordinates.lat];

  // Fetch walking directions from Mapbox Directions API
  const fetchWalkingRoute = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        // Calculate distance in km
        const distanceKm = (route.distance / 1000).toFixed(2);
        setDistance(distanceKm);

        // Calculate duration in minutes
        const durationMin = Math.round(route.duration / 60);
        setDuration(durationMin.toString());

        // Notify parent component
        if (onRouteCalculated) {
          onRouteCalculated(distanceKm, durationMin.toString());
        }

        return route.geometry;
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const currentStyle =
      mapStyle === "3d"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/streets-v12";

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: currentStyle,
      center: [
        (fromCoords[0] + toCoords[0]) / 2,
        (fromCoords[1] + toCoords[1]) / 2,
      ],
      zoom: 12,
      pitch: mapStyle === "3d" ? 45 : 0,
      bearing: 0,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("load", async () => {
      if (!map.current) return;

      // Fetch real walking route
      const routeGeometry = await fetchWalkingRoute();

      // Create custom markers
      const fromMarker = document.createElement("div");
      fromMarker.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
        ">A</div>
      `;

      new mapboxgl.Marker(fromMarker)
        .setLngLat(fromCoords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: "custom-popup" }).setHTML(
            `<div style="padding: 12px; font-weight: 600;">${fromLocation}</div>`
          )
        )
        .addTo(map.current);

      const toMarker = document.createElement("div");
      toMarker.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
        ">B</div>
      `;

      new mapboxgl.Marker(toMarker)
        .setLngLat(toCoords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: "custom-popup" }).setHTML(
            `<div style="padding: 12px; font-weight: 600;">${toLocation}</div>`
          )
        )
        .addTo(map.current);

      if (routeGeometry) {
        // Add route source
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          },
        });

        // Add route casing (outline)
        map.current.addLayer({
          id: "route-casing",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#1e40af",
            "line-width": 8,
            "line-opacity": 0.6,
          },
        });

        // Add main route line
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 5,
            "line-opacity": 0.9,
          },
        });

        // Fit map to route
        const coordinates = routeGeometry.coordinates;
        const bounds = coordinates.reduce(
          (bounds: mapboxgl.LngLatBounds, coord: number[]) =>
            bounds.extend(coord as [number, number]),
          new mapboxgl.LngLatBounds(
            coordinates[0] as [number, number],
            coordinates[0] as [number, number]
          )
        );

        map.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 50, right: 50 },
          maxZoom: 15,
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [fromLocation, toLocation, toCoordinates, mapStyle]);

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => (prev === "3d" ? "2d" : "3d"));
  };

  const recenterMap = () => {
    if (!map.current) return;
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(fromCoords);
    bounds.extend(toCoords);
    map.current.fitBounds(bounds, {
      padding: { top: 100, bottom: 100, left: 50, right: 50 },
      maxZoom: 15,
    });
  };

  return (
    <div className="relative w-full h-full bg-background">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-lg px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-foreground">
                Calculating route...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons - Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        <Button
          onClick={handleZoomIn}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-foreground" />
        </Button>

        <Button
          onClick={handleZoomOut}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-foreground" />
        </Button>

        <Button
          onClick={toggleMapStyle}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title={mapStyle === "3d" ? "Switch to 2D" : "Switch to 3D"}
        >
          <Layers className="w-5 h-5 text-foreground" />
        </Button>

        <Button
          onClick={recenterMap}
          size="icon"
          className="w-12 h-12 rounded-full bg-background/95 backdrop-blur-xl border border-border shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Recenter Map"
        >
          <Navigation className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      {/* Map Style Badge */}
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
