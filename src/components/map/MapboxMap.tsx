import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { MapPin, Navigation, Layers, Search, Store } from "lucide-react";
import { touristSpots } from "@/data/touristSpots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mapbox token provided by user
mapboxgl.accessToken =
  "pk.eyJ1IjoicmV5bmFsZG8xMjMxIiwiYSI6ImNtZnVxOXE1MzAxZWwycW9waWxpMmJ2MzMifQ.lmC2pB2Wg7-k-UPj1t--ig";

interface MapboxMapProps {
  onSpotSelect?: (spotId: string) => void;
  selectedSpotId?: string;
  className?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  onSpotSelect,
  selectedSpotId,
  className = "",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState(touristSpots);
  const [mapStyle, setMapStyle] = useState<string>("satellite-streets-v12");
  const [showNearbyLocations, setShowNearbyLocations] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  const mapStyles = [
    {
      id: "satellite-streets-v12",
      name: "3D Satellite",
      icon: "🛰️",
      description: "Aerial view with streets",
    },
    {
      id: "streets-v12",
      name: "Street Map",
      icon: "🗺️",
      description: "Standard street view",
    },
    {
      id: "navigation-day-v1",
      name: "Navigation",
      icon: "🧭",
      description: "Optimized for directions",
    },
    {
      id: "outdoors-v12",
      name: "Terrain",
      icon: "⛰️",
      description: "Topographic map",
    },
    {
      id: "dark-v11",
      name: "Dark Mode",
      icon: "🌙",
      description: "Night-friendly view",
    },
  ];

  // Center coordinates for Gabaldon area
  const centerCoordinates: [number, number] = [121.3240814, 15.5018428];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: centerCoordinates,
      zoom: 12,
      pitch: mapStyle.includes("satellite") ? 45 : 0,
      bearing: 0,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");

    // Add 3D terrain
    map.current.on("style.load", () => {
      if (!map.current) return;

      // Add terrain source
      map.current.addSource("mapbox-terrain", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
      });

      // Add terrain layer
      map.current.setTerrain({
        source: "mapbox-terrain",
        exaggeration: 1.2,
      });

      // Add sky layer for better 3D effect
      map.current.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    // Add markers
    addMarkers();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = touristSpots.filter(
        (spot) =>
          spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          spot.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpots(filtered);
    } else {
      setFilteredSpots(touristSpots);
    }
  }, [searchQuery]);

  const addMarkers = () => {
    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    filteredSpots.forEach((spot) => {
      // Create custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.innerHTML = `
        <div class="marker-container ${
          selectedSpotId === spot.id ? "marker-selected" : ""
        }">
          <div class="marker-pin">
            <div class="marker-icon">📍</div>
          </div>
          <div class="marker-pulse"></div>
        </div>
      `;

      // Add styles
      const style = document.createElement("style");
      style.textContent = `
        .marker-container {
          position: relative;
          cursor: pointer;
          transform-origin: bottom center;
          transition: transform 0.3s ease;
        }
        .marker-container:hover, .marker-selected {
          transform: scale(1.2);
        }
        .marker-pin {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, hsl(195 85% 45%), hsl(145 65% 45%));
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
          border: 3px solid white;
        }
        .marker-icon {
          transform: rotate(45deg);
          font-size: 16px;
        }
        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: hsl(195 85% 45%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          opacity: 0.6;
        }
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([spot.coordinates.lng, spot.coordinates.lat])
        .addTo(map.current!);

      // Add click event
      markerElement.addEventListener("click", () => {
        if (onSpotSelect) {
          onSpotSelect(spot.id);
        }
        // Fly to marker
        map.current?.flyTo({
          center: [spot.coordinates.lng, spot.coordinates.lat],
          zoom: 15,
          pitch: 60,
          duration: 2000,
        });
      });

      // Add popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: "custom-popup",
      }).setHTML(`
        <div class="p-3 max-w-xs">
          <img src="${spot.images[0]}" alt="${
        spot.name
      }" class="w-full h-24 object-cover rounded-lg mb-2" onerror="this.style.display='none'" />
          <h3 class="font-semibold text-lg mb-1">${spot.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${spot.description.substring(
            0,
            100
          )}...</p>
          <div class="flex items-center justify-between text-xs">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${
              spot.category
            }</span>
            <span class="text-yellow-500">⭐ ${spot.rating}</span>
          </div>
        </div>
      `);

      marker.setPopup(popup);
      markers.current.push(marker);
    });
  };

  useEffect(() => {
    addMarkers();
  }, [filteredSpots, selectedSpotId]);

  const handleMapStyleChange = (styleId: string) => {
    setMapStyle(styleId);
    setShowStyleMenu(false);

    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${styleId}`);
      map.current.setPitch(styleId.includes("satellite") ? 45 : 0);
    }
  };

  const centerOnGabaldon = () => {
    if (map.current) {
      map.current.flyTo({
        center: centerCoordinates,
        zoom: 12,
        pitch: 45,
        duration: 2000,
      });
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg shadow-lg"
      />

      {/* Map Controls - Hidden for cleaner design */}
      <div className="absolute top-4 left-4 z-10 space-y-3 hidden">
        {/* Search - Hidden to reduce clutter */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-white/90 backdrop-blur-sm border-white/20"
          />
        </div>
      </div>

      {/* Map Style Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className="glass-card px-4 py-2 flex items-center gap-2 hover:bg-white/20 transition-all"
        >
          <Layers className="w-5 h-5" />
          <span className="text-sm font-medium">
            {mapStyles.find((s) => s.id === mapStyle)?.name || "Map Style"}
          </span>
        </motion.button>

        {/* Map Style Menu */}
        {showStyleMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 glass-card p-3 min-w-[240px] space-y-2"
          >
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              MAP STYLE
            </div>
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleMapStyleChange(style.id)}
                className={`w-full px-3 py-3 rounded-lg text-left transition-all ${
                  mapStyle === style.id
                    ? "bg-primary/20 border-2 border-primary/40"
                    : "hover:bg-white/10 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{style.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {style.description}
                    </div>
                  </div>
                  {mapStyle === style.id && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Center Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={centerOnGabaldon}
        className="absolute bottom-20 right-4 z-10 btn-floating"
      >
        <Navigation className="w-6 h-6" />
      </motion.button>

      {/* Nearby Locations Toggle */}
      {selectedSpotId && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNearbyLocations(!showNearbyLocations)}
          className={`absolute bottom-4 right-4 z-10 btn-floating ${
            showNearbyLocations ? "bg-primary text-white" : ""
          }`}
        >
          <MapPin className="w-6 h-6" />
        </motion.button>
      )}

      {/* Nearby Locations Panel */}
      {showNearbyLocations && selectedSpotId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-4 z-10 glass-card p-4 max-w-xs"
        >
          <h3 className="font-semibold mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            Nearby Locations
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[
              { name: "Restaurant Row", distance: "0.5 km", type: "Food" },
              { name: "General Store", distance: "0.8 km", type: "Shop" },
              { name: "Souvenir Shop", distance: "1.2 km", type: "Shop" },
              { name: "Local Eatery", distance: "1.5 km", type: "Food" },
              { name: "Gas Station", distance: "2.0 km", type: "Service" },
            ].map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium">{location.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {location.type}
                  </p>
                </div>
                <span className="text-xs text-primary font-medium">
                  {location.distance}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default MapboxMap;
