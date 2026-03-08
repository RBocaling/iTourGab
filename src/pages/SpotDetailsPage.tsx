import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
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
  ArrowRight,
  ChevronDown,
  Smartphone,
  User,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import RouteMap from "@/components/map/RouteMap";
import WalkModeMap from "@/components/map/WalkModelMap";
import { useGetPlace } from "@/hooks/useGetPlace";
import Loader from "@/components/loader/Loader";
import { useMutation } from "@tanstack/react-query";
import { createServiceRatingApi } from "@/api/serviceRatingApi";
import { ServiceType } from "@/types/serviceType";
import ServiceTypeSelectModal from "@/components/ui/ServiceTypeSelect";
import ServiceDetailsModal from "@/components/touristspot/ServiceDetailsModal";
import { createFavoriteApi } from "@/api/favoriteApi";
import { ErrorDialog, SuccessDialog } from "@/components/alert/FeedbackModals";
import { createItineraryApi } from "@/api/iteneraryApi";
import ServiceChatModal from "@/components/chat/ServiceChatModal";
import BackButton from "@/components/ui/BackButton";

const isPromoValidToday = (promo: any) => {
  if (!promo) return false;
  if (promo.is_deleted) return false;

  const now = new Date();
  const start = promo.start_date ? new Date(promo.start_date) : null;
  const end = promo.end_date ? new Date(promo.end_date) : null;
  if (start && now < start) return false; 
  if (end && now > end) return false; 

  return promo.is_active !== false;
};

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
  const [showServiceRatingsModal, setShowServiceRatingsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [postWithName, setPostWithName] = useState(false);
  const { isLoading, formatData: spot, refetch } = useGetPlace(spotId);
  const [serviceTypeFilter, setServiceTypeFilter] =
    useState<ServiceType | null>(null);
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [viewService, setViewService] = useState<any | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);

  const [openServiceChat, setOpenServiceChat] = useState(false);

  console.log("spotspot", spot);
  
  const [itineraryForm, setItineraryForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const { mutate } = useMutation({
    mutationFn: createServiceRatingApi,
    onSuccess: () => {
      refetch();
      setShowServiceRatingsModal(false);
      setSelectedService(null);
    },
  });

  const addItineraryMutation = useMutation({
    mutationFn: createItineraryApi,
    onSuccess: () => {
      setItineraryModalOpen(false);
      setItineraryForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      });

      setSuccessAlert({
        open: true,
        title: "Added to Itinerary",
        description: "This place has been added to your itinerary.",
      });
    },
    onError: () => {
      setErrorAlert({
        open: true,
        title: "Failed to add itinerary",
        description: "Please try again.",
      });
    },
  });

  

  const [successAlert, setSuccessAlert] = useState<{
    open: boolean;
    title?: string;
    description?: string;
  }>({
    open: false,
  });

  const [errorAlert, setErrorAlert] = useState<{
    open: boolean;
    title?: string;
    description?: string;
  }>({
    open: false,
  });

  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [favoriteNote, setFavoriteNote] = useState("");

  const addFavoriteMutation = useMutation({
    mutationFn: createFavoriteApi,
    onSuccess: () => {
      setIsFavorite(true);
      setFavoriteModalOpen(false);
      setFavoriteNote("");

      setSuccessAlert({
        open: true,
        title: "Added to Favorites",
        description: "This place has been saved to your favorites.",
      });
    },
    onError: () => {
      setErrorAlert({
        open: true,
        title: "Failed to Add Favorite",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  console.log("spot", spot);

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

  const handleOpenServiceRatings = (service: any) => {
    setSelectedService(service);
    setShowServiceRatingsModal(true);
    setNewRating(0);
    setHoverRating(0);
    setReviewText("");
    setPostWithName(false);
  };

  const getServiceAverageRating = (service: any) => {
    if (!service.service_reviews || service.service_reviews.length === 0)
      return "0.0";
    const total = service.service_reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    return (total / service.service_reviews.length).toFixed(1);
  };

  const handleSubmitServiceReview = async () => {
    if (!selectedService) return;
    if (!newRating) return;
    const payload = {
      service_id: selectedService.id,
      rating: newRating,
      description: reviewText || "",
      is_anonymous: !postWithName,
    };
    mutate(payload as any);
  };

  const priceRangeForService = (service: any) => {
    const av = Array.isArray(
      service.availability ?? service.availabilities ?? service.avail
    )
      ? service.availability ?? service.availabilities ?? service.avail
      : [];
    const prices = av
      .map((a: any) => {
        const p = a?.price ?? a?.amount ?? null;
        const n = Number(p);
        return Number.isFinite(n) ? n : null;
      })
      .filter((p: number | null) => p !== null) as number[];
    if (prices.length === 0) {
      const single = service.price ?? service.amount ?? null;
      const n = Number(single);
      if (Number.isFinite(n)) return { min: n, max: n };
      return null;
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  const fmt = (v: number) => `₱${v.toLocaleString()}`;

  const filteredServices = serviceTypeFilter
    ? spot?.services?.filter((s: any) => s.type === serviceTypeFilter)
    : spot?.services;

  if (isLoading) {
    return <Loader />;
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Spot not found</h2>
          <Button onClick={() => navigate(-1)}></Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background pt-5 md:pt-24 pb-28 md:pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <BackButton />
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{spot.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => navigate(`/app/ratings/${spot.placeId}`)}
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
              onClick={() => setFavoriteModalOpen(true)}
              className={`rounded-full ${
                isFavorite ? "text-red-500 border-red-200 bg-red-50" : ""
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setShareModalOpen(true)}
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6 group"
        >
          <img
            src={(spot.images[currentImageIndex] as any)?.url}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
          <p className="absolute bottom-5 right-5 text-sm md:text-lg text-white font-bold flex items-center gap-1 md:gap-5">
            <span className="font-normal text-gray-300">Date Taken: </span>
            {(spot.images[currentImageIndex] as any)?.taken_at}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 md:flex md:justify-between">
                <div className="mb-2">
                  <p className="text-lg font-bold mb-2">Best Time to Visit</p>
                  <p className="text-sm text-neutral-500">{spot.bestTime}</p>
                </div>
                <div className="mb-2">
                  <p className="text-lg font-bold mb-2">Accessibility</p>
                  <p className="text-sm text-neutral-500">
                    {spot.accessibility}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-lg font-bold mb-2">Location</p>
                  <p className="flex items-center gap-1 text-sm text-neutral-500">
                    <MapPin className="w-3 h-3" />
                    {spot.coordinates.lat.toFixed(4)},{" "}
                    {spot.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <p className="text-lg font-bold mb-4">Contact Information</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {/* Authority Contact */}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Authority:</span>
                    {spot.authority_contact_number ? (
                      <a
                        href={`tel:${spot.authority_contact_number}`}
                        className="hover:underline"
                      >
                        {spot.authority_contact_number}
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Contact:</span>
                    <span>{spot.contact_person_name || "N/A"}</span>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Smartphone className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Mobile:</span>
                    {spot.contact_person_number ? (
                      <a
                        href={`tel:${spot.contact_person_number}`}
                        className="hover:underline"
                      >
                        {spot.contact_person_number}
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>

                  {/* Facebook */}
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Facebook:</span>
                    {spot.facebook_page ? (
                      <a
                        href={spot.facebook_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        Visit Page
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

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

            {spot?.services?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="md:text-lg font-bold mb-4 flex items-center gap-2">
                      <Bed className="w-5 h-5 text-primary" />
                      Services & Accommodations
                    </h3>
                    <div className="">
                      <ServiceTypeSelectModal
                        open={openTypeModal}
                        value={serviceTypeFilter}
                        onOpenChange={setOpenTypeModal}
                        onChange={(val) => {
                          setServiceTypeFilter(val);
                          setOpenTypeModal(false);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setOpenTypeModal(true)}
                        className=" rounded-xl border border-primary/30 flex items-center gap-1 text-primary px-4 py-1.5 text-left text-xs"
                      >
                        {serviceTypeFilter ?? "Filter By  types"}{" "}
                        <ChevronDown size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {filteredServices?.map((service: any) => {
                      const averageRating = getServiceAverageRating(service);
                      const reviewsCount = service.service_reviews?.length || 0;
                      const hasReviews = reviewsCount > 0;
                      const range = priceRangeForService(service);
                      const priceDisplay = range
                        ? range.min === range.max
                          ? fmt(range.min)
                          : `${fmt(range.min)} — ${fmt(range.max)}`
                        : service.price || service.amount
                          ? fmt(Number(service.price ?? service.amount))
                          : "See availabilities";
                      console.log("service.promo", service);

                      return (
                        <div
                          key={service.id}
                          className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={(service.images[0] as any)?.url}
                              alt={service.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-sm flex items-center gap-2 flex-wrap">
                                    {service.type === "accommodation" && (
                                      <Bed className="w-4 h-4" />
                                    )}
                                    {service.type === "restaurant" && (
                                      <Utensils className="w-4 h-4" />
                                    )}
                                    {service.name}

                                    {isPromoValidToday(service.promo) && (
                                      <Badge className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-md">
                                        🔖 {service.promo.discount_percent}% OFF
                                      </Badge>
                                    )}
                                  </h4>

                                  <p className="text-primary font-bold tracking-wide text-sm mt-2">
                                    {priceDisplay}
                                  </p>

                                  <button
                                    onClick={() =>
                                      handleOpenServiceRatings(service)
                                    }
                                    className={`mt-1 flex items-center gap-1 text-xs rounded-md px-2 py-1 transition-colors ${
                                      hasReviews
                                        ? "hover:bg-muted/60"
                                        : "text-muted-foreground "
                                    }`}
                                  >
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">
                                      {averageRating}
                                    </span>
                                    <span className="text-muted-foreground">
                                      ({reviewsCount})
                                    </span>
                                  </button>
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
                                .map((amenity: string, idx: number) => (
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
                            <div className=" mb-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{service.contact}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="grid grid-cols-3  items-center gap-1">
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs bg-transparent border border-sky-500 text-primary hover:text-white"
                                  onClick={() => {
                                    setViewService(service);
                                    setOpenServiceChat(true);
                                  }}
                                >
                                  Chat
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs bg-transparent border border-sky-500 text-primary hover:text-white"
                                  onClick={() => {
                                    setViewService(service);
                                    setShowServiceDetails(true);
                                  }}
                                >
                                  details
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8 px-3 text-xs bg-gradient-primary"
                                  onClick={() =>
                                    navigate(
                                      `/app/booking?spot=${spot.placeId}&service=${service.id}`,
                                    )
                                  }
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Plan Your Visit</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full btn-primary shadow-xl shadow-primary/10 h-12 rounded-2xl"
                    onClick={() => setItineraryModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Itinerary
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border border-primary/40 h-12"
                    onClick={() => navigate(`/app/map?focus=${spot.id}`)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="border h-12 border-primary/40"
                      onClick={() =>
                        navigate(`/app/tourist-spot/${spotId}/stores`)
                      }
                    >
                      Available Stores
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
                    onClick={() =>
                      navigate(`/app/booking?spot=${spot.placeId}`)
                    }
                  >
                    Book Services
                  </Button>
                </div>

                <Separator className="my-4" />
              </Card>
            </motion.div>
          </div>
        </div>

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
                    src={(spot.gallery[galleryIndex] as any)?.url}
                    alt={`${spot.name} - Image ${galleryIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />

                  {spot.gallery.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setGalleryIndex((prev) =>
                            prev === 0 ? spot.gallery.length - 1 : prev - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() =>
                          setGalleryIndex((prev) =>
                            prev === spot.gallery.length - 1 ? 0 : prev + 1,
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

          <ServiceDetailsModal
            open={showServiceDetails}
            service={viewService}
            onClose={() => {
              setShowServiceDetails(false);
              setViewService(null);
            }}
          />

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
                          `/app/map?focus=${spotId}&from=${encodeURIComponent(
                            fromLocation,
                          )}`,
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

          {showServiceRatingsModal && selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => {
                setShowServiceRatingsModal(false);
                setSelectedService(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-background"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      {selectedService.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">
                        {getServiceAverageRating(selectedService)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({selectedService.service_reviews?.length || 0} total)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowServiceRatingsModal(false);
                      setSelectedService(null);
                    }}
                    className="p-2 rounded-full hover:bg-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 rounded-2xl bg-sky-400/90 text-white p-4">
                  <div className="flex gap-6 items-center">
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div className="text-3xl font-bold">
                        {getServiceAverageRating(selectedService)}
                      </div>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const avg = parseFloat(
                            getServiceAverageRating(selectedService),
                          );
                          return (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i + 1 <= Math.round(avg)
                                  ? "fill-yellow-300 text-yellow-300"
                                  : "text-white/60"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="text-xs mt-1">
                        {selectedService.service_reviews?.length || 0} total
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const list = selectedService.service_reviews || [];
                        const count = list.filter(
                          (r: any) => r.rating === star,
                        ).length;
                        const total = list.length || 1;
                        const pct = (count / total) * 100;
                        return (
                          <div
                            key={star}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div className="w-4 text-right">{star}</div>
                            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                            <div className="flex-1 h-2 rounded-full bg-white/40 overflow-hidden">
                              <div
                                className="h-full bg-yellow-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="w-4 text-right">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mb-4 rounded-2xl bg-white shadow-sm p-4">
                  <h3 className="text-sm font-semibold mb-3">
                    Share Your Experience
                  </h3>
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Rate this service
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const v = i + 1;
                        const active = v <= (hoverRating || newRating);
                        return (
                          <button
                            key={v}
                            type="button"
                            onMouseEnter={() => setHoverRating(v)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(v)}
                            className="p-0.5"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                active
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      Post with name
                    </span>
                    <button
                      type="button"
                      onClick={() => setPostWithName((v) => !v)}
                      className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${
                        postWithName ? "bg-sky-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          postWithName ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience about this service..."
                    className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-400"
                    rows={3}
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-4 text-xs"
                      onClick={handleSubmitServiceReview}
                    >
                      Post Review
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => {
                        setNewRating(0);
                        setHoverRating(0);
                        setReviewText("");
                        setPostWithName(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="space-y-3">
                  {selectedService.service_reviews &&
                  selectedService.service_reviews.length > 0 ? (
                    selectedService.service_reviews
                      ?.sort((a: any, b: any) => b?.id - a?.id)
                      .map((r: any) => {
                        const name =
                          r.is_anonymous ||
                          (!r.user?.first_name && !r.user?.last_name)
                            ? "Anonymous"
                            : `${r.user?.first_name || ""} ${
                                r.user?.last_name || ""
                              }`.trim();
                        return (
                          <div
                            key={r.id ?? r.uuid}
                            className="border border-border rounded-lg p-3 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">
                                {name}
                              </span>
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">
                                  {r.rating}
                                </span>
                              </div>
                            </div>
                            {r.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {r.description}
                              </p>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(r.created_at).toLocaleString()}
                            </p>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No ratings yet for this service.
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {favoriteModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setFavoriteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold mb-4">Add to Favorites</h2>

                {/* Selected Place */}
                <div className="flex gap-3 mb-4">
                  <img
                    src={(spot.images?.[0] as any)?.url}
                    alt={spot.name}
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{spot.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {spot.description}
                    </p>
                  </div>
                </div>

                {/* Optional Description */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">
                    Description (optional)
                  </label>
                  <textarea
                    value={favoriteNote}
                    onChange={(e) => setFavoriteNote(e.target.value)}
                    placeholder="Add a note for this place"
                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFavoriteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-primary text-white"
                    disabled={addFavoriteMutation.isPending}
                    onClick={() =>
                      addFavoriteMutation.mutate({
                        touristspot_id: Number(spot?.placeId),
                        description: favoriteNote || "",
                      })
                    }
                  >
                    {addFavoriteMutation.isPending
                      ? "Saving..."
                      : "Add Favorite"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {shareModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setShareModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Header */}
                <div className="relative h-44 w-full">
                  <img
                    src={(spot.images?.[0] as any)?.url}
                    alt={spot.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <button
                    onClick={() => setShareModalOpen(false)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-4">
                    <p className="text-xs text-white/80">Share place</p>
                    <h3 className="text-lg font-semibold text-white leading-tight">
                      {spot.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* URL Field */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Shareable link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={window.location.href}
                        className="flex-1 rounded-xl border border-border px-3 py-2 text-xs bg-muted/60 truncate"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-xl"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              window.location.href,
                            );
                            setShareModalOpen(false);
                            setSuccessAlert({
                              open: true,
                              title: "Link Copied",
                              description:
                                "The place link has been copied to your clipboard.",
                            });
                          } catch {
                            setErrorAlert({
                              open: true,
                              title: "Copy Failed",
                              description:
                                "Unable to copy the link. Please try again.",
                            });
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => setShareModalOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      className="rounded-xl bg-gradient-primary text-white px-6"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            window.location.href,
                          );
                          setShareModalOpen(false);
                          setSuccessAlert({
                            open: true,
                            title: "Link Copied",
                            description:
                              "The place link has been copied to your clipboard.",
                          });
                        } catch {
                          setErrorAlert({
                            open: true,
                            title: "Copy Failed",
                            description:
                              "Unable to copy the link. Please try again.",
                          });
                        }
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {itineraryModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setItineraryModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold mb-4">Add to Itinerary</h2>

                {/* Selected Place */}
                <div className="flex gap-3 mb-4">
                  <img
                    src={(spot.images?.[0] as any)?.url}
                    alt={spot.name}
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">{spot.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {spot.description}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <input
                  className="w-full mb-2 rounded-xl border px-3 py-2 text-sm"
                  placeholder="Itinerary title"
                  value={itineraryForm.name}
                  onChange={(e) =>
                    setItineraryForm((p) => ({ ...p, name: e.target.value }))
                  }
                />

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="datetime-local"
                    className="rounded-xl border px-3 py-2 text-sm"
                    value={itineraryForm.start_date}
                    onChange={(e) =>
                      setItineraryForm((p) => ({
                        ...p,
                        start_date: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="datetime-local"
                    className="rounded-xl border px-3 py-2 text-sm"
                    value={itineraryForm.end_date}
                    onChange={(e) =>
                      setItineraryForm((p) => ({
                        ...p,
                        end_date: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Description */}
                <textarea
                  rows={3}
                  placeholder="Description (optional)"
                  className="w-full rounded-xl border px-3 py-2 text-sm mb-4"
                  value={itineraryForm.description}
                  onChange={(e) =>
                    setItineraryForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setItineraryModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-primary text-white"
                    disabled={addItineraryMutation.isPending}
                    onClick={() =>
                      addItineraryMutation.mutate({
                        name: itineraryForm.name,
                        description: itineraryForm.description,
                        start_date: itineraryForm.start_date,
                        end_date: itineraryForm.end_date,
                        touristspot_id: Number(spot.placeId),
                      })
                    }
                  >
                    {addItineraryMutation.isPending
                      ? "Saving..."
                      : "Add to Itinerary"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {openServiceChat && viewService && (
        <ServiceChatModal
          open={openServiceChat}
          onClose={() => {
            setOpenServiceChat(false);
            setViewService(null);
          }}
          service={viewService}
          spot={spot}
        />
      )}

      <SuccessDialog
        open={successAlert.open}
        onOpenChange={(open) => setSuccessAlert((prev) => ({ ...prev, open }))}
        title={successAlert.title}
        description={successAlert.description}
      />

      <ErrorDialog
        open={errorAlert.open}
        onOpenChange={(open) => setErrorAlert((prev) => ({ ...prev, open }))}
        title={errorAlert.title}
        description={errorAlert.description}
      />
    </div>
  );
};

export default SpotDetailsPage;
