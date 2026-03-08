import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MapboxMap from '@/components/map/MapboxMap';
import { Place } from '@/types/place';
import BackButton from '@/components/ui/BackButton';

const SearchPage: React.FC = ({ touristSpots }: { touristSpots:Place[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const filteredSpots = touristSpots.filter((spot) => {
    const matchesSearch =
      searchQuery === "" ||
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.features.some((feature) =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      spot.activities.some((activity) =>
        activity.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || spot.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSpotSelect = (spotId: string) => {
    navigate(`/app/spot/${spotId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-primary px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <BackButton />
            <h1 className="text-xl font-bold text-white">
              Search Destinations
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
            <Input
              type="text"
              placeholder="Search destinations, activities, features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-white/80 text-sm">
              {filteredSpots.length} destination
              {filteredSpots.length !== 1 ? "s" : ""} found
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Map View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="glass-card overflow-hidden">
            <div className="h-64 relative">
              <MapboxMap
                onSpotSelect={handleSpotSelect}
                className="w-full h-full"
                touristSpots={touristSpots}
              />
            </div>
          </Card>
        </motion.div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredSpots.map((spot, index) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                className="glass-card p-4 cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => handleSpotSelect(spot.id)}
              >
                <div className="flex gap-4">
                  <img
                    src={(spot.images[0] as any)?.url}
                    alt={spot.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {spot.name}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {spot.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {spot.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{spot.category}</span>
                        <span>•</span>
                        <span>{spot.duration}</span>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {(
                          (spot.reviews?.reduce(
                            (acc, r) => acc + Number(r.rating ?? 0),
                            0
                          ) || 0) / (spot.reviews?.length || 1)
                        ).toFixed(1)}{" "}
                        reviews
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredSpots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No destinations found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;