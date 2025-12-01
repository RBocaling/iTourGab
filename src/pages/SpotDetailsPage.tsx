import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Camera,
  Heart,
  Share2,
  Navigation,
  Users,
  Info,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  Grid,
  X,
  Bed,
  Utensils,
  ChevronUp,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import RouteMap from "@/components/map/RouteMap";
import WalkModeMap from "@/components/map/WalkModelMap";
import { useGetPlaces } from "@/hooks/useGetPlace";
import Loader from "@/components/loader/Loader";

const SpotDetailsPage: React.FC = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showWalkMode, setShowWalkMode] = useState(false);
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [routeDistance, setRouteDistance] = useState<string>("");
  const [routeDuration, setRouteDuration] = useState<string>("");
  const { isLoading, formatData: touristSpots } = useGetPlaces();
  console.log("tour", touristSpots);
  

  const spot = touristSpots?.find((s) => s.id === spotId);
  console.log("sdsds", spot);
  

  if (!spot) {
    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Spot not found</h2>
          <Button onClick={() => navigate("")}>Go back to home</Button>
        </div>
      </div>
    );
  }

  const nearbySpots = touristSpots?.filter((s) => spot.nearby.includes(s.id));

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === spot.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? spot.images.length - 1 : prev - 1
    );
  };

   if (isLoading) {
     return <Loader />;
  }
  
  console.log("spot.rating", spot);
  
  return (
    <div className="min-h-screen bg-background pt-5 md:pt-24 pb-28 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full bg-white/80 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{spot.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => navigate(`/ratings/${spot.placeId}`)}
                className="flex items-center gap-1 hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{`${spot.rating}`}</span>
                <span className="text-muted-foreground">
                  ({spot.reviews?.length})
                </span>
              </button>
              <Separator orientation="vertical" className="h-4" />
              <Badge className="capitalize">{spot.category}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`rounded-full ${
                isFavorite ? "text-red-500 border-red-200 bg-red-50" : ""
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6 group"
        >
          <img
            src={spot.images[currentImageIndex]}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Image Navigation */}
          {spot.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {spot.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Photo Count & Gallery Button */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setShowGallery(true)}
              className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-black/70 transition-colors"
            >
              <Grid className="w-4 h-4" />
              Gallery
            </button>
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {currentImageIndex + 1}/{spot.images.length}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  About This Place
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {spot.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{spot.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium capitalize">
                      {spot.difficulty}
                    </p>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">{spot.entrance}</p>
                    <p className="text-xs text-muted-foreground">Entrance</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-medium">Best Time</p>
                    <p className="text-xs text-muted-foreground">to Visit</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">
                  Features & Highlights
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {spot.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-primary/5 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {spot.activities.map((activity, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Services */}
            {spot.services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" />
                    Services & Accommodations
                  </h3>
                  <div className="space-y-4">
                    {spot.services.map((service) => (
                      <div
                        key={service.id}
                        className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={service.images[0]}
                            alt={service.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                  {service.type === "accommodation" && (
                                    <Bed className="w-4 h-4" />
                                  )}
                                  {service.type === "restaurant" && (
                                    <Utensils className="w-4 h-4" />
                                  )}
                                  {service.name}
                                </h4>
                                <p className="text-primary font-bold tracking-wide text-sm mt-2">
                                  {service.price}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="capitalize text-xs"
                              >
                                {service.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {service.amenities
                              .slice(0, 3)
                              .map((amenity, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                            {service.amenities.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-transparent text-primary bg-primary/10"
                              >
                                +{service.amenities.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{service.contact}</span>
                            </div>
                            <Button
                              size="sm"
                              className="h-10 px-9 text-xs bg-gradient-primary"
                              onClick={() =>
                                navigate(
                                  `/booking?spot=${spot.placeId}&service=${service.id}`
                                )
                              }
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Nearby Spots */}
            {nearbySpots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Nearby Attractions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {nearbySpots.map((nearbySpot) => (
                      <div
                        key={nearbySpot.id}
                        onClick={() => navigate(`/spot/${nearbySpot.id}`)}
                        className="flex gap-3 p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <img
                          src={nearbySpot.images[0]}
                          alt={nearbySpot.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {nearbySpot.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {nearbySpot.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{nearbySpot.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Plan Your Visit</h3>
                <div className="space-y-3">
                  <Button className="w-full btn-primary shadow-xl shadow-primary/10 h-12 rounded-2xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Itinerary
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border border-primary/40 h-12"
                    onClick={() => navigate(`/map?focus=${spot.id}`)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="border h-12 border-primary/40"
                      onClick={() => setShowWalkMode(true)}
                    >
                      Explore
                    </Button>
                    <Button
                      variant="outline"
                      className="border h-12 border-primary/40"
                      onClick={() => setShowRangeModal(true)}
                    >
                      Route
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border h-12 border-primary/40"
                    onClick={() => navigate(`/booking?spot=${spot.placeId}`)}
                  >
                    Book Services
                  </Button>
                </div>

                <Separator className="my-4" />

                {/* Quick Info */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Best Time to Visit
                    </p>
                    <p>{spot.bestTime}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Accessibility
                    </p>
                    <p>{spot.accessibility}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Location
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {spot.coordinates.lat.toFixed(4)},{" "}
                      {spot.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Gallery Modal */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
              onClick={() => setShowGallery(false)}
            >
              <div
                className="relative w-full h-full max-w-4xl max-h-4xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowGallery(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={spot.gallery[galleryIndex]}
                    alt={`${spot.name} - Image ${galleryIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />

                  {spot.gallery.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setGalleryIndex((prev) =>
                            prev === 0 ? spot.gallery.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() =>
                          setGalleryIndex((prev) =>
                            prev === spot.gallery.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {galleryIndex + 1} of {spot.gallery.length}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Walk Mode Modal */}
          {showWalkMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowWalkMode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-6xl h-[90vh] glass-card overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowWalkMode(false)}
                  className="absolute top-4 right-4 z-10 glass-card p-3 hover:bg-white/20 transition-all rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>

                {fromLocation ? (
                  <WalkModeMap
                    fromLocation={fromLocation}
                    toLocation={spot.name}
                    toCoordinates={spot.coordinates}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center max-w-md glass-card p-8">
                      <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">
                        Set Starting Location
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Please set a "From Location" in the Range feature first
                        to view the walking route.
                      </p>
                      <Button
                        onClick={() => {
                          setShowWalkMode(false);
                          setShowRangeModal(true);
                        }}
                        className="bg-gradient-primary text-white"
                      >
                        <MapPin className="w-5 h-5 mr-2" />
                        Set Location
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Range/Distance Modal */}
          {showRangeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowRangeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Distance & Route</h2>
                  <button
                    onClick={() => setShowRangeModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    From Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search location (e.g., Cabanatuan City)"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 glass-card border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "Cabanatuan City",
                      "Manila",
                      "San Jose City",
                      "Baler",
                    ].map((location) => (
                      <button
                        key={location}
                        onClick={() => setFromLocation(location)}
                        className="px-3 py-1.5 glass-card rounded-full text-sm hover:bg-white/10 transition-all"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {fromLocation && (
                  <div className="space-y-4">
                    {/* Route Map on Top */}
                    <div className="relative h-[500px] rounded-xl overflow-hidden glass-card border border-white/10">
                      <RouteMap
                        fromLocation={fromLocation}
                        toLocation={spot.name}
                        toCoordinates={spot.coordinates}
                        onRouteCalculated={(distance, duration) => {
                          setRouteDistance(distance);
                          setRouteDuration(duration);
                        }}
                      />
                    </div>

                    {/* Travel Mode Comparison Card - Bottom */}
                    {routeDistance && routeDuration && (
                      <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">
                            Route Overview
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{routeDistance} km</span>
                          </div>
                        </div>

                        <div className="grid gap-3">
                          {/* Walking */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="text-xl">🚶</span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Walking</p>
                                <p className="text-xs text-muted-foreground">
                                  Slowest, scenic route
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {routeDuration} min
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Est. time
                              </p>
                            </div>
                          </div>

                          {/* Motorcycle */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <span className="text-xl">🏍️</span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">
                                  Motorcycle
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Moderate, flexible
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {Math.round(parseInt(routeDuration) * 0.15)} min
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Est. time
                              </p>
                            </div>
                          </div>

                          {/* Car */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="text-xl">🚗</span>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Car</p>
                                <p className="text-xs text-muted-foreground">
                                  Fastest, comfortable
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-green-500">
                                {Math.round(parseInt(routeDuration) * 0.12)} min
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Est. time
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30">
                          <div className="flex items-start gap-2">
                            <Navigation className="w-4 h-4 text-primary mt-0.5" />
                            <div className="text-sm">
                              <p className="font-semibold text-primary">
                                From: {fromLocation}
                              </p>
                              <p className="text-muted-foreground">
                                To: {spot.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-gradient-primary text-white"
                      onClick={() => {
                        setShowRangeModal(false);
                        navigate(
                          `/map?focus=${spotId}&from=${encodeURIComponent(
                            fromLocation
                          )}`
                        );
                      }}
                    >
                      View Full Route on Map
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SpotDetailsPage;
