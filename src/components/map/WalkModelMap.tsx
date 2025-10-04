import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  Navigation,
  Layers,
  Play,
  Pause,
  RotateCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmV5bmFsZG8xMjMxIiwiYSI6ImNtZnVxOXE1MzAxZWwycW9waWxpMmJ2MzMifQ.lmC2pB2Wg7-k-UPj1t--ig";

interface WalkModeMapProps {
  fromLocation: string;
  toLocation: string;
  toCoordinates: { lat: number; lng: number };
}

const WalkModeMap: React.FC<WalkModeMapProps> = ({
  fromLocation,
  toLocation,
  toCoordinates,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");
  const [isWalking, setIsWalking] = useState(false);
  const [walkProgress, setWalkProgress] = useState(0);
  const routeCoordinates = useRef<[number, number][]>([]);

  // Geocode location to coordinates
  const geocodeLocation = async (
    location: string
  ): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center as [number, number];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // Fetch walking route from Mapbox Directions API
  const fetchWalkingRoute = async (
    start: [number, number],
    end: [number, number]
  ) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setDistance((route.distance / 1000).toFixed(2));
        setDuration(Math.round(route.duration / 60).toString());
        routeCoordinates.current = route.geometry.coordinates as [
          number,
          number
        ][];
        return route.geometry;
      }
      return null;
    } catch (error) {
      console.error("Route fetching error:", error);
      return null;
    }
  };

  // Animated walking simulation
  useEffect(() => {
    if (!isWalking || routeCoordinates.current.length === 0) return;

    const interval = setInterval(() => {
      setWalkProgress((prev) => {
        const next = prev + 0.5;
        if (next >= 100) {
          setIsWalking(false);
          return 100;
        }

        // Move camera along route
        const index = Math.floor(
          (next / 100) * routeCoordinates.current.length
        );
        if (map.current && routeCoordinates.current[index]) {
          map.current.easeTo({
            center: routeCoordinates.current[index],
            zoom: 18,
            pitch: 60,
            duration: 100,
          });
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isWalking]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${
        mapStyle === "satellite" ? "satellite-streets-v12" : "streets-v12"
      }`,
      center: [toCoordinates.lng, toCoordinates.lat],
      zoom: 13,
      pitch: mapStyle === "satellite" ? 45 : 30,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Load route when map is ready
    map.current.on("load", async () => {
      if (!map.current) return;

      const fromCoords = await geocodeLocation(fromLocation);
      const toCoords: [number, number] = [toCoordinates.lng, toCoordinates.lat];

      if (!fromCoords) {
        setLoading(false);
        return;
      }

      const routeGeometry = await fetchWalkingRoute(fromCoords, toCoords);

      if (routeGeometry) {
        // Add the route as a layer
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#22c55e",
            "line-width": 6,
            "line-opacity": 0.9,
          },
        });

        // Add animated overlay
        map.current.addLayer({
          id: "route-outline",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": 8,
            "line-opacity": 0.4,
          },
        });

        // Add start marker (A)
        const startEl = document.createElement("div");
        startEl.className = "marker-label";
        startEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          ">A</div>
        `;
        new mapboxgl.Marker(startEl).setLngLat(fromCoords).addTo(map.current);

        // Add end marker (B)
        const endEl = document.createElement("div");
        endEl.className = "marker-label";
        endEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
          ">B</div>
        `;
        new mapboxgl.Marker(endEl).setLngLat(toCoords).addTo(map.current);

        // Fit map to show entire route
        const coordinates = routeGeometry.coordinates;
        const bounds = coordinates.reduce(
          (bounds: mapboxgl.LngLatBounds, coord: number[]) => {
            return bounds.extend(coord as [number, number]);
          },
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        map.current.fitBounds(bounds, {
          padding: 80,
          duration: 1000,
        });
      }

      setLoading(false);
    });

    return () => {
      map.current?.remove();
    };
  }, [fromLocation, toCoordinates, mapStyle]);

  const handleZoomIn = () => {
    map.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    map.current?.zoomOut({ duration: 300 });
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => (prev === "satellite" ? "streets" : "satellite"));
    if (map.current) {
      map.current.setStyle(
        `mapbox://styles/mapbox/${
          mapStyle === "satellite" ? "streets-v12" : "satellite-streets-v12"
        }`
      );
      map.current.setPitch(mapStyle === "satellite" ? 30 : 45);
    }
  };

  const recenterMap = () => {
    setWalkProgress(0);
    setIsWalking(false);
    if (map.current && routeCoordinates.current.length > 0) {
      const bounds = routeCoordinates.current.reduce(
        (bounds, coord) => bounds.extend(coord),
        new mapboxgl.LngLatBounds(
          routeCoordinates.current[0],
          routeCoordinates.current[0]
        )
      );
      map.current.fitBounds(bounds, { padding: 80, duration: 1000 });
    }
  };

  const startWalking = () => {
    if (walkProgress >= 100) {
      setWalkProgress(0);
    }
    setIsWalking(true);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-xl" />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium">
              Calculating walking route...
            </p>
          </div>
        </div>
      )}

      {/* Walking Progress */}
      {!loading && distance && isWalking && (
        <div className="absolute top-4 left-4 right-4 glass-card p-3 z-10">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Walking Progress</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(walkProgress)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-100"
                  style={{ width: `${walkProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Walking Controls */}
      {!loading && routeCoordinates.current.length > 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          <Button
            onClick={isWalking ? () => setIsWalking(false) : startWalking}
            className="btn-floating bg-primary hover:bg-primary/90 text-white shadow-lg px-6"
          >
            {isWalking ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : walkProgress >= 100 ? (
              <>
                <RotateCw className="w-5 h-5 mr-2" />
                Restart Walk
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Walking
              </>
            )}
          </Button>
        </div>
      )}

      {/* Directional Arrow Controls */}
      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        {/* Up Arrow */}
        <Button
          onClick={() => {
            if (map.current) {
              const center = map.current.getCenter();
              map.current.panTo([center.lng, center.lat + 0.001]);
            }
          }}
          size="icon"
          className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          {/* Left Arrow */}
          <Button
            onClick={() => {
              if (map.current) {
                const center = map.current.getCenter();
                map.current.panTo([center.lng - 0.001, center.lat]);
              }
            }}
            size="icon"
            className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Recenter */}
          <Button
            onClick={recenterMap}
            size="icon"
            className="btn-floating bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            <Navigation className="w-5 h-5" />
          </Button>

          {/* Right Arrow */}
          <Button
            onClick={() => {
              if (map.current) {
                const center = map.current.getCenter();
                map.current.panTo([center.lng + 0.001, center.lat]);
              }
            }}
            size="icon"
            className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Down Arrow */}
        <Button
          onClick={() => {
            if (map.current) {
              const center = map.current.getCenter();
              map.current.panTo([center.lng, center.lat - 0.001]);
            }
          }}
          size="icon"
          className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
        >
          <ChevronDown className="w-5 h-5" />
        </Button>
      </div>

      {/* Map Controls - Right Side */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <Button
          onClick={handleZoomIn}
          size="icon"
          className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="icon"
          className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          onClick={toggleMapStyle}
          size="icon"
          className="btn-floating bg-white/90 hover:bg-white text-foreground shadow-lg"
        >
          <Layers className="w-5 h-5" />
        </Button>
      </div>

      {/* Info Card - Bottom Left */}
      {!loading && distance && (
        <div className="absolute bottom-4 left-4 glass-card p-4 max-w-xs z-10">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm mb-2">{toLocation}</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>📍 Distance: {distance} km</p>
                <p>⏱️ Walking time: ~{duration} min</p>
                <p className="text-primary">From: {fromLocation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkModeMap;
