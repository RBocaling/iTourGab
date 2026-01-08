import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Calendar, Camera, Filter, Search, Heart, ArrowRight, Users, Clock, Navigation, Bot, Nfc, Telescope, MapPinHouse, MessageSquareLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useGetPlaces } from '@/hooks/useGetPlace';
import Loader from '@/components/loader/Loader';
import { TouristSpotType } from '@/types/touristSpotType';
import TouristSpotTypeModal from '@/components/ui/TouristSpotTypeModal';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<typeof touristSpots>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<TouristSpotType | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const {isLoading, formatData: touristSpots } = useGetPlaces();
  
const filteredSpots = touristSpots?.filter((spot: any) => {
  const hasSearch = searchQuery.trim().length > 0;

  const matchesSearch = !hasSearch
    ? true
    : spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesType = !typeFilter || spot.raw?.type === typeFilter;

  return matchesSearch && matchesType;
});



  console.log("typeFilter", filteredSpots);
  
  // Search suggestions logic
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const suggestions = touristSpots?.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
        spot.activities.some(activity => activity.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const toggleFavorite = (spotId: string) => {
    setFavorites(prev => 
      prev.includes(spotId) 
        ? prev.filter(id => id !== spotId)
        : [...prev, spotId]
    );
  };

  const handleSpotClick = (spotId: string) => {
    navigate(`/app/spot/${spotId}`);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/app/map?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (spot: typeof touristSpots[0]) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/app/spot/${spot.placeId}`);
  };

  
  if (isLoading) {
     return <Loader />;
  }


  console.log("filteredSpots22", filteredSpots);
  
  return (
    <div className="min-h-screen bg-background pt-2 md:pt-32 pb-28 md:pb-8 p-3">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Discover Gabaldon
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore amazing natural destinations and plan your perfect adventure
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute z-20 left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                type="text"
                placeholder="Search destinations, activities, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="pl-10 h-14 rounded-2xl bg-white/90 backdrop-blur-sm  focus:bg-white shadow-lg border border-primary/50 shadow-gray-200"
              />

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl border border-border/20 overflow-hidden z-50"
                  >
                    {searchSuggestions.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => handleSuggestionClick(spot)}
                        className="w-full p-3 text-left hover:bg-muted/50 flex items-center gap-3 transition-colors"
                      >
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{spot.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {spot.category} • {spot.rating} ⭐
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-left bg-primary/5 text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
                    >
                      Search "{searchQuery}" on map →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Weather & Quick Stats */}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: Telescope,
              label: "Top Tourist spot",
              action: () => navigate("/app/ranking-spot"),
              color: "from-primary to-secondary",
            },
            {
              icon: Calendar,
              label: "My Iteneraries",
              action: () => navigate("/app/itinerary"),
              color: "from-accent to-accent-light",
            },
            {
              icon: Nfc,
              label: "Emergency Hotlines",
              action: () => navigate("/app/emergency-safe-hotlines"),
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: MessageSquareLock,
              label: "Chat Admin",
              action: () => navigate("/app/chat-support"),
              color: "from-pink-500 to-pink-600",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="glass-card p-4 text-center cursor-pointer hover:shadow-xl transition-all duration-300 group transform hover:scale-105"
              onClick={item.action}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-sm">{item.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-9 flex items-center justify-between"
        >
          <p className="text-muted-foreground">
            {filteredSpots.length} destination
            {filteredSpots.length !== 1 ? "s" : ""} found
          </p>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setShowTypeModal(true)}
          >
            Filter by Type
          </Button>
        </motion.div>

        {/* Destination Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSpots.map((spot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                className="card-hover overflow-hidden cursor-pointer"
                // onClick={() => handleSpotClick(spot.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={spot.images[0]}
                    alt={spot.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <p className="absolute top-3 right-3 text-xs font-semibold text-white bg-primary py-1.5 px-3 rounded-full">
                    {spot?.type}
                  </p>

                  {/* Rating */}
                  <div className="absolute top-3 left-3 bg-white/60 rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{spot.rating}</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/60 text-gray-800 capitalize">
                      {spot.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{spot.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {spot.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {spot.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {spot.difficulty}
                      </span>
                    </div>
                    <span className="text-sm text-primary font-medium">
                      {spot.reviews?.length} reviews
                    </span>
                  </div>

                  {/* Services Count */}
                  {spot.services.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>
                        {spot.services.length} service
                        {spot.services.length !== 1 ? "s" : ""} available
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-primary text-white hover:shadow-lg transition-all group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpotClick(spot?.placeId);
                      }}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/map?focus=${spot.id}`);
                      }}
                    >
                      🗺️
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <TouristSpotTypeModal
          open={showTypeModal}
          value={typeFilter}
          onChange={setTypeFilter}
          onClose={() => setShowTypeModal(false)}
        />

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

export default HomePage;