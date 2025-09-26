import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MapboxMap from '@/components/map/MapboxMap';
import { touristSpots } from '@/data/touristSpots';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, ArrowRight, X } from 'lucide-react';

const MapPage: React.FC = () => {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle URL parameters for search and focus
  useEffect(() => {
    const focusSpotId = searchParams.get('focus');
    const searchQuery = searchParams.get('search');
    
    if (focusSpotId) {
      setSelectedSpotId(focusSpotId);
    } else if (searchQuery) {
      // Find first spot matching search
      const matchingSpot = touristSpots.find(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      if (matchingSpot) {
        setSelectedSpotId(matchingSpot.id);
      }
    }
  }, [searchParams]);

  const selectedSpot = selectedSpotId 
    ? touristSpots.find(spot => spot.id === selectedSpotId) 
    : null;

  const handleSpotSelect = (spotId: string) => {
    setSelectedSpotId(spotId);
  };

  const handleViewDetails = () => {
    if (selectedSpotId) {
      navigate(`/app/spot/${selectedSpotId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-4 md:pt-32 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Map</h1>
          <p className="text-muted-foreground">
            Discover Gabaldon's tourist spots
          </p>
        </motion.div>

        {/* Map Container */}
        <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
          <MapboxMap
            onSpotSelect={handleSpotSelect}
            selectedSpotId={selectedSpotId}
            className="w-full h-full"
          />

          {/* Selected Spot Card */}
          {selectedSpot && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)]"
            >
              <Card className="glass-card overflow-hidden">
                <button
                  onClick={() => setSelectedSpotId(null)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="relative h-32">
                  <img
                    src={selectedSpot.images[0]}
                    alt={selectedSpot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <div className="bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">
                        {selectedSpot.rating}
                      </span>
                    </div>
                    <Badge className="bg-white/90 text-gray-800 capitalize text-xs">
                      {selectedSpot.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">
                    {selectedSpot.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {selectedSpot.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{selectedSpot.duration}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {selectedSpot.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedSpot.accessibility}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {selectedSpot.features
                        .slice(0, 3)
                        .map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-2 py-1 bg-primary/10 text-primary"
                          >
                            {feature}
                          </Badge>
                        ))}
                      {selectedSpot.features.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-1 bg-muted text-muted-foreground"
                        >
                          +{selectedSpot.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleViewDetails}
                      className="flex-1 bg-gradient-primary text-white h-10 text-sm group"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 h-9"
                      onClick={() => navigate(`/app/booking/${selectedSpotId}`)}
                    >
                      📅
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Map Instructions */}
          {/* {!selectedSpot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 z-20"
            >
              <Card className="glass-card p-4 max-w-sm">
                <h3 className="font-semibold mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  How to Explore
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click map markers to view details</li>
                  <li>• Use controls to change map style</li>
                  <li>• Drag to explore, scroll to zoom</li>
                  <li>• Press navigation button to center</li>
                </ul>
              </Card>
            </motion.div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MapPage;