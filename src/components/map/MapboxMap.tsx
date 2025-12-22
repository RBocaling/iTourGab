import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { MapPin, Navigation, Layers, Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mapbox token provided by user
mapboxgl.accessToken =
  "pk.eyJ1IjoicmV5bmFsZG8xMjMxIiwiYSI6ImNtZnVxOXE1MzAxZWwycW9waWxpMmJ2MzMifQ.lmC2pB2Wg7-k-UPj1t--ig";

interface MapboxMapProps {
  onSpotSelect?: (spotId: string) => void;
  selectedSpotId?: string;
  className?: string;
  touristSpots: any;
}

/* ✅ ADD ONLY THIS HELPER */
const getMarkerIcon = (category?: string) => {
  if (category?.toLowerCase() === "resort") return "/resort.png";
  if (category?.toLowerCase() === "attraction") return "/attraction.png";
  return "/icons/location.png";
};

const MapboxMap: React.FC<MapboxMapProps> = ({
  onSpotSelect,
  selectedSpotId,
  className = "",
  touristSpots,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] = useState(touristSpots);
  const [mapStyle, setMapStyle] = useState<string>("satellite-streets-v12");
  const [showNearbyLocations, setShowNearbyLocations] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  console.log("touristSpots", touristSpots);
  
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

  const centerCoordinates: [number, number] = [121.3240814, 15.5018428];

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}`,
      center: centerCoordinates,
      zoom: 12,
      pitch: mapStyle.includes("satellite") ? 45 : 0,
      bearing: 0,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-right");

    map.current.on("style.load", () => {
      if (!map.current) return;

      map.current.addSource("mapbox-terrain", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
      });

      map.current.setTerrain({
        source: "mapbox-terrain",
        exaggeration: 1.2,
      });

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

    addMarkers();

    return () => {
      map.current?.remove();
    };
  }, []);

useEffect(() => {
  if (!touristSpots) return;

  if (!searchQuery) {
    setFilteredSpots(touristSpots);
    return;
  }

  const q = searchQuery.toLowerCase();

  setFilteredSpots(
    touristSpots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(q) ||
        spot.category.toLowerCase().includes(q) ||
        spot.description.toLowerCase().includes(q)
    )
  );
}, [touristSpots, searchQuery]);


  const addMarkers = () => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    filteredSpots.forEach((spot) => {
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";

      /* 🔥 ONLY CHANGE IS HERE */
      markerElement.innerHTML = `
        <div class="marker-container ${
          selectedSpotId === spot.id ? "marker-selected" : ""
        }">
          <div class="marker-pin">
            <img
              src="${getMarkerIcon(spot.type)}"
              style="width:30px;height:30px;"
            />
          </div>
          <div class="marker-pulse"></div>
        </div>
      `;

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
       
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([spot.coordinates.lng, spot.coordinates.lat])
        .addTo(map.current!);

      markerElement.addEventListener("click", () => {
        onSpotSelect?.(spot.placeId);
        map.current?.flyTo({
          center: [spot.coordinates.lng, spot.coordinates.lat],
          zoom: 15,
          pitch: 60,
          duration: 2000,
        });
      });

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    addMarkers();
  }, [filteredSpots, selectedSpotId]);

  const handleMapStyleChange = (styleId: string) => {
    setMapStyle(styleId);
    setShowStyleMenu(false);
    map.current?.setStyle(`mapbox://styles/mapbox/${styleId}`);
    map.current?.setPitch(styleId.includes("satellite") ? 45 : 0);
  };

  const centerOnGabaldon = () => {
    map.current?.flyTo({
      center: centerCoordinates,
      zoom: 12,
      pitch: 45,
      duration: 2000,
    });
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg shadow-lg"
      />

      <div className="absolute top-4 left-4 z-10 space-y-3 hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-white/90 backdrop-blur-sm border-white/20"
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          className="glass-card px-4 py-2 flex items-center gap-2"
        >
          <Layers className="w-5 h-5" />
          <span className="text-sm font-medium">
            {mapStyles.find((s) => s.id === mapStyle)?.name || "Map Style"}
          </span>
        </motion.button>

        {showStyleMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 glass-card p-3 min-w-[240px] space-y-2"
          >
            {mapStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleMapStyleChange(style.id)}
                className="w-full px-3 py-3 rounded-lg hover:bg-white/10 text-left"
              >
                {style.icon} {style.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={centerOnGabaldon}
        className="absolute bottom-20 right-4 z-10 btn-floating"
      >
        <Navigation className="w-6 h-6" />
      </motion.button>

      {selectedSpotId && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNearbyLocations(!showNearbyLocations)}
          className="absolute bottom-4 right-4 z-10 btn-floating"
        >
          <MapPin className="w-6 h-6" />
        </motion.button>
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default MapboxMap;
