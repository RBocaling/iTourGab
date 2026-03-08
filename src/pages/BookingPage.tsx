import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Check,
  Star,
  X,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useGetPlace } from "@/hooks/useGetPlace";
import { createBookingApi } from "@/api/bookingApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectPlaceDialog from "@/components/ui/SelectPlaceDialog";
import { createServiceRatingApi } from "@/api/serviceRatingApi";
import { Badge } from "@/components/ui/badge";
import { ServiceType } from "@/types/serviceType";
import ServiceTypeSelectModal from "@/components/ui/ServiceTypeSelect";
import ServiceDetailsModal from "@/components/touristspot/ServiceDetailsModal";
import BackButton from "@/components/ui/BackButton";
import { format } from "date-fns";

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

const computePromoDiscount = (amount: number, promo: any) => {
  if (!promo) return 0;

  if (promo.discount_percent) {
    return Math.round(amount * (promo.discount_percent / 100));
  }

  if (promo.discount_amount) {
    return Math.min(amount, Number(promo.discount_amount));
  }

  return 0;
};

function parsePrice(price: string | number | undefined | null): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const digits = String(price).replace(/[^\d.-]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();

const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | null>(
  null
  );
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const query = new URLSearchParams(location.search);
  const spotParam = query.get("spot") ?? query.get("placeId") ?? undefined;
  const serviceParam =
    query.get("service") ?? query.get("serviceId") ?? undefined;

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(
    undefined
  );
  const [placeDialogOpen, setPlaceDialogOpen] = useState(false);

  const activePlaceId = selectedPlaceId ?? spotParam;
  const { normalData: place } = useGetPlace(
    activePlaceId ? (activePlaceId as any) : undefined
  );

  const [step, setStep] = useState<number>(1);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<
    string | number | null
  >(null);
  const [selectedServiceId, setSelectedServiceId] = useState<any>(null);

  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<
    string | number | null
  >(null);

  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingText, setRatingText] = useState("");
  const [postWithName, setPostWithName] = useState(false);
  const [showRateSuccessModal, setShowRateSuccessModal] = useState(false);

const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false);
const [viewService, setViewService] = useState<any | null>(null);
  const [showServiceRatingsModal, setShowServiceRatingsModal] = useState(false);
  const [viewRatingsService, setViewRatingsService] = useState<any | null>(
    null
  );

  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [viewAvailability, setViewAvailability] = useState<any | null>(null);

  const accommodations = useMemo(() => place?.accommodation ?? [], [place]);
  const services = useMemo(() => place?.services ?? [], [place]);

  const { mutate: rate } = useMutation({
    mutationFn: createServiceRatingApi,
    onSuccess: () => {
      setShowRateSuccessModal(true);
    },
  });

  useEffect(() => {
    if (!serviceParam) return;
    if (!services || services.length === 0) return;

    const svc = services.find(
      (s: any) => String(s.id) === String(serviceParam)
    );

    if (svc) {
      setSelectedServiceId(svc.id);
      setSelectedAvailabilityId(null);
    }
  }, [serviceParam, services]);

useEffect(() => {
  if (!selectedPlaceId) return;

  setSelectedAccommodationId(null);
  setSelectedAvailabilityId(null);

  if (!serviceParam) {
    setSelectedServiceId(null);
  }
}, [selectedPlaceId, serviceParam]);


  const selectedAccommodation = useMemo(
    () =>
      accommodations.find(
        (a: any) => String(a.id) === String(selectedAccommodationId)
      ) ?? null,
    [accommodations, selectedAccommodationId]
  );

  const selectedService: any = useMemo(
    () =>
      services.find((s: any) => String(s.id) === String(selectedServiceId)) ??
      null,
    [services, selectedServiceId]
  );

  const selectedAvailability = useMemo(() => {
    if (!selectedService || !Array.isArray(selectedService.availabilities))
      return null;
    return (
      selectedService.availabilities.find(
        (a: any) => String(a.id) === String(selectedAvailabilityId)
      ) ?? null
    );
  }, [selectedService, selectedAvailabilityId]);

  const nights = useMemo(() => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const ci = new Date(dates.checkIn);
    const co = new Date(dates.checkOut);
    const diff = (co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(diff));
  }, [dates]);

  const servicePriceRange = (s: any) => {
    if (!s || !Array.isArray(s.availabilities) || s.availabilities.length === 0)
      return { min: 0, max: 0 };
    const prices = s.availabilities
      .map((a: any) => parsePrice(a?.price))
      .filter((p: number) => p > 0);
    if (!prices.length) return { min: 0, max: 0 };
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };

  console.log("selectedService", selectedService);
  
  const unitPrice = useMemo(() => {
    if (selectedAccommodation)
      return parsePrice((selectedAccommodation as any).price);
    if (selectedAvailability) return parsePrice(selectedAvailability.price);
    if (selectedService) {
      const { min } = servicePriceRange(selectedService);
      return min;
    }
    return 0;
  }, [selectedAccommodation, selectedService, selectedAvailability]);

  const totalAmount = useMemo(() => {
    const base = Number(unitPrice) * Math.max(1, nights) * Math.max(1, rooms);
    return Math.round(base);
  }, [unitPrice, nights, rooms]);

  const activePromo = useMemo(() => {
    if (!selectedService?.promo) return null;
    return isPromoValidToday(selectedService.promo)
      ? selectedService.promo
      : null;
  }, [selectedService]);

  const promoDiscount = useMemo(() => {
    if (!activePromo) return 0;
    return computePromoDiscount(totalAmount, activePromo);
  }, [totalAmount, activePromo]);

  const entranceFee = place?.entranceFee ?? 0;

  const finalTotal = useMemo(() => {
    return Math.max(0, totalAmount + entranceFee - promoDiscount);
  }, [totalAmount, entranceFee, promoDiscount]);

  const mutation = useMutation({
    mutationFn: (payload: any) => createBookingApi(payload),
    onSuccess: () => {
      qc.invalidateQueries(["bookings", "me"] as any);
      toast({
        title: "Booking submitted",
        description:
          "Your booking request was submitted. Tell us about your experience.",
      });
      if (!selectedService) {
        navigate("/app/bookings");
      } setShowConfirmModal(false);
      setShowRatingModal(selectedService ? true:false);
      setRatingValue(0);
      setHoverRating(0);
      setRatingText("");
      setPostWithName(false);
    },
    onError: (err: any) => {
      toast({
        title: "Booking failed",
        description: err?.message ?? "Unable to submit booking",
      });
    },
  });

  const canProceedToNext = useMemo(() => {
    if (step === 1) {
      return Boolean(place);
    }

    if (step === 2) {
      if (!selectedService) return false;
      return Boolean(selectedAvailabilityId);
    }

    if (step === 3) {
      if (selectedService?.type === "FOOD") return true;
      return Boolean(dates.checkIn && dates.checkOut);
    }

    return true;
  }, [
    step,
    place,
    selectedService,
    selectedAvailabilityId,
    dates.checkIn,
    dates.checkOut,
  ]);



  function handleSubmit() {
    if (!place) {
      toast({
        title: "No place selected",
        description: "Please choose a place first.",
      });
      return;
    }
    if (selectedService?.type ==="ROOM" &&(!dates.checkIn || !dates.checkOut)) {
      toast({
        title: "Missing dates",
        description: "Please choose check-in and check-out dates.",
      });
      return;
    }

    const payload: any = {
      touristspot_id: place.id,
      service_id: selectedService?.id ?? null,
      availability_id:
        selectedService?.type === "ROOM" ? selectedAvailabilityId : null,
      start_date: selectedService?.type === "ROOM" ? dates.checkIn : null,
      end_date: selectedService?.type === "ROOM" ? dates.checkOut : null,
      rooms: selectedService?.type === "ROOM" ? rooms : null,
      guests:
        selectedService?.type === "ROOM" && selectedAvailability?.max_guests
          ? selectedAvailability.max_guests * rooms
          : null,
      special_requests: specialRequests,
      total_amount: finalTotal,
    };

    mutation.mutate(payload);
  }

  const ratingTargetName =
    selectedService?.name ?? place?.name ?? "this experience";

  const handleSubmitRating = () => {
    if (!ratingValue) return;
    const payload = {
      rating: ratingValue,
      description: ratingText,
      postWithName,
      service_id: selectedService?.id ?? selectedServiceId ?? null,
    };
    rate(payload as any);
  };

  const getServiceRatingSummary = (svc: any) => {
    const reviews = svc?.service_reviews ?? [];
    if (!reviews.length) return { avg: null, count: 0 };
    const sum = reviews.reduce(
      (acc: number, r: any) => acc + Number(r?.rating ?? 0),
      0
    );
    return { avg: sum / reviews.length, count: reviews.length };
  };


  
  const steps = useMemo(() => {
    return [
      { number: 1, title: "Select Place", icon: MapPin },
      { number: 2, title: "Select Availability", icon: MapPin },
      { number: 3, title: "Trip Details", icon: Calendar },
      { number: 4, title: "Review & Confirm", icon: Check },
    ];
  }, []);

  const isRoomService = selectedService?.type === "ROOM";

  useEffect(() => {
    if (selectedAvailability && isRoomService) {
      setViewAvailability(selectedAvailability);
    }
  }, [rooms]);

 

 const getNextStep = () => {
   if (step === 1) {
     if (!selectedService) return 3; // PLACE ONLY
     return 2; // FOOD & ROOM → Availability
   }

   if (step === 2) {
     if (selectedService?.type === "FOOD") return 4;
     return 3;
   }

   if (step === 3) {
     return 4;
   }

   return step;
 };

const getPrevStep = () => {
  // REVIEW
  if (step === 4) {
    if (!selectedService) return 3; // PLACE ONLY → Trip Details
    if (selectedService.type === "FOOD") return 2; // FOOD → Availability
    return 3; // ROOM → Trip Details
  }

  // TRIP DETAILS
  if (step === 3) {
    if (!selectedService) return 1; // PLACE ONLY → Place
    if (selectedService.type === "FOOD") return 2; // FOOD → Availability
    return 2; // ROOM → Availability
  }

  // AVAILABILITY
  if (step === 2) {
    return 1; // Always back to Place
  }

  return step;
};



 const filteredServices = serviceTypeFilter
   ? services?.filter((s: any) => s.type === serviceTypeFilter)
   : services;


  return (
    <div className="min-h-screen bg-background pt-3 md:pt-24 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <BackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Book Your Stay</h1>
            <p className="text-muted-foreground">
              {place
                ? `Plan your visit to ${place.name}`
                : "Choose your accommodation and dates"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-2"
        >
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.number ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step >= s.number
                        ? "bg-gradient-primary shadow-lg shadow-primary/30 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {step > s.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium">{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 md:w-16 mx-2 ${
                      step > s.number ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold mb-2 line-clamp-1">
                    {!place?.name && "Choose from"} {place?.name ?? "a place"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:block text-sm text-muted-foreground">
                      {place ? "Selected place:" : "No place selected"}
                    </div>
                    <Button size="sm" onClick={() => setPlaceDialogOpen(true)}>
                      {place ? "Change place" : "Select place"}
                    </Button>
                  </div>
                </div>

                {place && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center">
                      <img
                        src={(place.images?.[0] as any)?.url ?? "/placeholder-400x250.png"}
                        alt={place.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{place.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {place.description}
                      </div>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPlaceDialogOpen(true)}
                      >
                        Reselect
                      </Button>
                    </div>
                  </div>
                )}

                <div className="max-h-[60vh] overflow-auto pr-2 space-y-4">
                  <div className="mt-4">
                    <div className="mb-3 w-full flex flex-col md:flex-row items-center justify-between">
                      <h3 className="text-sm md:text-base font-semibold flex items-center">
                        Accommodations & Services{" "}
                        <img
                          src="/service.png"
                          className="w-16 rotate-6 animate-pulse"
                          alt=""
                        />
                      </h3>

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
                        className=" rounded-xl w-full md:w-auto border border-primary/30 flex items-center justify-center gap-1 text-primary px-4 py-2.5 md:py-1.5 text-left text-xs"
                      >
                        {serviceTypeFilter ?? "Filter By  types"}{" "}
                        <ChevronDown size={17} />
                      </button>
                    </div>

                    {serviceParam && !selectedPlaceId ? (
                      selectedService ? (
                        <Card className="p-3 ring-2 ring-primary bg-primary/5 m-2">
                          <div className="flex items-start gap-3">
                            <div className="w-24 h-16 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center">
                              <img
                                src={
                                  (selectedService.images?.[0] as any)?.url??
                                  "/placeholder-400x250.png"
                                }
                                alt={selectedService.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold flex items-center gap-2 flex-wrap">
                                    {selectedService.name}

                                    {isPromoValidToday(
                                      selectedService.promo
                                    ) && (
                                      <Badge className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-md">
                                        🔖{" "}
                                        {selectedService.promo.discount_percent}
                                        % OFF
                                      </Badge>
                                    )}
                                  </h4>

                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {selectedService.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-base font-semibold">
                                    {(() => {
                                      const { min, max } =
                                        servicePriceRange(selectedService);
                                      if (!min && !max) return "₱—";
                                      if (min === max)
                                        return `₱${min.toLocaleString()}`;
                                      return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
                                    })()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    price range
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Selected service not found
                        </div>
                      )
                    ) : filteredServices.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No services available
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredServices?.map((s: any) => {
                          const selected =
                            String(s.id) === String(selectedServiceId);
                          const { avg, count } = getServiceRatingSummary(s);
                          const { min, max } = servicePriceRange(s);

                          return (
                            <Card
                              key={s.id}
                              className={`p-3 cursor-pointer transition-all hover:shadow-lg ${
                                selected
                                  ? "ring-2 ring-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedServiceId(s.id);
                                setSelectedAvailabilityId(null);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-24 h-16 rounded-md overflow-hidden bg-slate-50">
                                  <img
                                    src={
                                      (s.images?.[0] as any)?.url ??
                                      "/placeholder-400x250.png"
                                    }
                                    alt={s.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold flex items-center gap-2 flex-wrap">
                                        {s.name}
                                        {isPromoValidToday(s.promo) && (
                                          <Badge className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-md">
                                            🔖 {s.promo.discount_percent}% OFF
                                          </Badge>
                                        )}
                                      </h4>

                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {s.description}
                                      </p>

                                      {/* ratings (unchanged) */}
                                      <div className="flex items-center gap-5 ">
                                        <button
                                          type="button"
                                          className="mt-2 inline-flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewRatingsService(s);
                                            setShowServiceRatingsModal(true);
                                          }}
                                        >
                                          {avg && count ? (
                                            <>
                                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                              <span className="font-semibold text-[11px]">
                                                {avg.toFixed(1)}
                                              </span>
                                              <span className="text-[11px] text-muted-foreground">
                                                ({count})
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <Star className="w-3 h-3 text-gray-300" />
                                              <span className="text-[11px] text-muted-foreground">
                                                No ratings yet
                                              </span>
                                            </>
                                          )}
                                        </button>

                                        <button
                                          type="button"
                                          className="mt-1 block text-xs font-medium text-primary underline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewService(s);
                                            setShowServiceDetailsModal(true);
                                          }}
                                        >
                                          View details
                                        </button>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <div className="text-base font-semibold">
                                        {!min && !max
                                          ? "₱—"
                                          : min === max
                                          ? `₱${min.toLocaleString()}`
                                          : `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        price range
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && selectedService && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Choose Availability
                  </h2>

                  {!selectedService ? (
                    <p className="text-sm text-muted-foreground">
                      Select a service first.
                    </p>
                  ) : !Array.isArray(selectedService.availabilities) ||
                    selectedService.availabilities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      This service has no availabilities.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedService.availabilities.map((a: any) => {
                        const isSelected =
                          String(a.id) === String(selectedAvailabilityId);

                        return (
                          <div
                            key={a.id}
                            onClick={() => setSelectedAvailabilityId(a.id)}
                            className={`border rounded-3xl p-4 cursor-pointer transition
          ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/40"}
        `}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{a.name}</h4>

                                <p className="text-sm text-muted-foreground">
                                  {a.description ?? "—"}
                                </p>

                                {selectedService.type === "ROOM" &&
                                  a.max_guests && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      👥Max guests: {a.max_guests}
                                    </p>
                                  )}
                              </div>

                              <div className="text-right font-semibold">
                                ₱{Number(a.price ?? 0).toLocaleString()}
                              </div>
                            </div>

                            {/* ROOMS SELECTOR — ONLY WHEN SELECTED + ROOM SERVICE */}

                            <div className="mt-3 flex items-center justify-between">
                              <button
                                type="button"
                                className="text-primary whitespace-nowrap underline text-sm font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewAvailability(a);
                                  setShowAvailabilityModal(true);
                                }}
                              >
                                View Details
                              </button>
                              {selectedService.type == "ROOM" && (
                                <div className="flex flex-col md:flex-row items-center md:gap-5">
                                  <div className="text-xs font-semibold text-muted-foreground">
                                    Number Of Rooms
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRooms((r) => Math.max(1, r - 1));
                                      }}
                                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                                    >
                                      −
                                    </button>

                                    <span className="w-6 text-center font-medium">
                                      {rooms}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRooms((r) => r + 1);
                                      }}
                                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Trip Details</h2>
                  {selectedService?.type !== "FOOD" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn">Check-in Date</Label>
                        <Input
                          id="checkIn"
                          type="date"
                          value={dates.checkIn}
                          onChange={(e) =>
                            setDates((d) => ({ ...d, checkIn: e.target.value }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="checkOut">Check-out Date</Label>
                        <Input
                          id="checkOut"
                          type="date"
                          value={dates.checkOut}
                          onChange={(e) =>
                            setDates((d) => ({
                              ...d,
                              checkOut: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label>Special Requests</Label>
                    <Textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements..."
                      rows={4}
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

                  {place && (
                    <div className="flex gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                      <img
                        src={(place.images?.[0] as any)?.url ?? "/placeholder-400x250.png"}
                        alt={place.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{place.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {place.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {place.reviews && place.reviews.length > 0
                              ? (
                                  place.reviews.reduce(
                                    (acc: number, i: any) =>
                                      acc + Number(i?.rating ?? 0),
                                    0
                                  ) / place.reviews.length
                                ).toFixed(1)
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Service</p>
                        <p className="font-medium">
                          {selectedService ? selectedService.name : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Availability</p>
                        <p className="font-medium">
                          {selectedAvailability
                            ? selectedAvailability.name
                            : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Dates</p>
                        <p className="font-medium">
                          {dates.checkIn
                            ? format(new Date(dates.checkIn), "MMM dd")
                            : "-"}{" "}
                          to{" "}
                          {dates.checkOut
                            ? format(new Date(dates.checkOut), "MMM dd")
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Guests / Rooms</p>
                        <p className="font-medium">
                          {guests} guest{guests > 1 ? "s" : ""} · {rooms} room
                          {rooms > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Special Requests
                        </p>
                        <p className="font-medium">{specialRequests || "—"}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(getPrevStep())}
                disabled={step === 1}
              >
                Previous
              </Button>

              {step < steps.length ? (
                <Button
                  onClick={() => {
                    if (!canProceedToNext) return;
                    setStep(getNextStep());
                  }}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-gradient-primary text-white"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Submitting..." : "Confirm Booking"}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-4 lg:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    Service{" "}
                    {selectedService && (
                      <span className="text-xs font-bold tracking-wide text-primary bg-primary/20 rounded-full py-1 px-3">
                        {selectedService?.type}
                      </span>
                    )}
                  </p>
                  <p className="font-medium">
                    {selectedService ? selectedService.name : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Availability</p>
                  <p className="font-medium">
                    {selectedAvailability ? selectedAvailability.name : "—"}
                  </p>
                </div>

                <>
                  {dates.checkIn && dates.checkOut && (
                    <>
                      <div className="flex justify-between">
                        <span>Nights</span>
                        <span className="font-medium">{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rooms</span>
                        <span className="font-medium">{rooms}</span>
                      </div>
                    </>
                  )}
                  <Separator />

                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Entrance Fee</span>
                    {place?.entranceFee > 0 ? (
                      <span className="font-medium">
                        ₱{place.entranceFee.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-medium text-green-500">Free</span>
                    )}
                  </div>

                  <Separator />
                  <div className="space-y-2">
                    {/* ORIGINAL / SUBTOTAL */}
                    <div className="flex justify-between">
                      <span>Total Service Amount</span>
                      <span
                        className={
                          promoDiscount > 0
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        ₱{totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* PROMO */}
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-rose-600 font-semibold">
                        <span>
                          Promo{" "}
                          {activePromo?.discount_percent
                            ? `(${activePromo.discount_percent}% OFF)`
                            : ""}
                        </span>
                        <span>- ₱{promoDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    <Separator />

                    {/* FINAL TOTAL */}
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total</span>
                      <span>₱{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span>📞</span>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-muted-foreground">+63 912 345 6789</p>
                  </div>
                </div>
                <div className="h-16 w-full flex items-center justify-center px-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    onClick={() => navigate("/app/emergency-safe-hotlines")}
                    className="w-full px-2 flex items-center justify-center gap-2 rounded-2xl bg-red-500 text-white text-xs font-semibold py-3 shadow-lg shadow-red-300/40"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Emergency Safe Hotlines
                  </motion.button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <SelectPlaceDialog
        open={placeDialogOpen}
        onOpenChange={setPlaceDialogOpen}
        onSelect={(p: any) => {
          setSelectedPlaceId(String(p.placeId ?? p.id));
          setPlaceDialogOpen(false);
        }}
      />

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-background shadow-xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Check className="w-4 h-4 text-primary" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Confirm your booking
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Please review the details before submitting.
                    </p>
                  </div>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-muted"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">
                    {selectedService ? selectedService.name : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">
                    {selectedAvailability ? selectedAvailability.name : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium">
                    {dates.checkIn} → {dates.checkOut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests / Rooms</span>
                  <span className="font-medium">
                    {guests} guest{guests > 1 ? "s" : ""} · {rooms} room
                    {rooms > 1 ? "s" : ""}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₱{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-primary text-white"
                  onClick={handleSubmit}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Submitting..." : "Confirm"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showRatingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full h-[65vh] max-w-lg rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="h-full overflow-y-auto p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-sky-500">
                      Thank you for booking
                    </p>
                    <h2 className="text-xl font-bold mt-1">
                      Rate your recent experience
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      You booked {ratingTargetName}. How was it?
                    </p>
                  </div>
                  <button
                    className="p-1.5 rounded-full hover:bg-slate-100"
                    onClick={() => setShowRatingModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 mb-6">
                  <p className="text-xs text-muted-foreground mb-2">
                    Overall rating
                  </p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const v = i + 1;
                      const active = v <= (hoverRating || ratingValue);
                      return (
                        <button
                          key={v}
                          type="button"
                          onMouseEnter={() => setHoverRating(v)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRatingValue(v)}
                          className="p-1"
                        >
                          <Star
                            className={`w-7 h-7 ${
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

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">
                    Post with name
                  </span>
                  <button
                    type="button"
                    onClick={() => setPostWithName((v) => !v)}
                    className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${
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

                <Textarea
                  value={ratingText}
                  onChange={(e) => setRatingText(e.target.value)}
                  placeholder="Share a few details about your stay..."
                  rows={5}
                  className="text-sm"
                />

                <div className="mt-1 flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-primary text-white rounded-xl"
                    onClick={handleSubmitRating}
                    disabled={!ratingValue}
                  >
                    Submit Rating
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-xl"
                    onClick={() => navigate("/app/bookings")}
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAvailabilityModal && viewAvailability && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setShowAvailabilityModal(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <h2 className="text-lg font-bold">{viewAvailability.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedService?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price per night</p>
                    <p className="font-semibold">
                      ₱{Number(viewAvailability.price ?? 0).toLocaleString()}
                    </p>
                  </div>

                  {selectedService?.type === "ROOM" &&
                    viewAvailability.max_guests && (
                      <div>
                        <p className="text-muted-foreground">Max guests</p>
                        <p className="font-semibold">
                          {viewAvailability.max_guests}
                        </p>
                      </div>
                    )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">
                    {viewAvailability.description ?? "—"}
                  </p>
                </div>

                {/* SERVICE AMENITIES */}
                {selectedService?.amenities?.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Amenities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.amenities.map((a: string, i: number) => (
                        <Badge key={i} className="bg-slate-100 text-slate-700">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* IMAGE GALLERY — MOVED TO BOTTOM */}
                {(() => {
                  const imgs = viewAvailability.images?.length
                    ? viewAvailability.images
                    : selectedService?.images ?? [];

                  return imgs.length ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Gallery
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {imgs.map((img: string, i: number) => (
                          <div
                            key={i}
                            className="w-full h-32 rounded-xl overflow-hidden bg-slate-100"
                          >
                            <img
                              src={img}
                              alt={`availability-${i}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No images available
                    </div>
                  );
                })()}
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 border-t flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAvailabilityModal(false)}
                >
                  Close
                </Button>
                <Button
                  className="bg-gradient-primary text-white"
                  onClick={() => {
                    setSelectedAvailabilityId(viewAvailability.id);
                    setShowAvailabilityModal(false);
                  }}
                >
                  Select this option
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showRateSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 space-y-4 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold">Thank you for rating</h2>
              <p className="text-sm text-muted-foreground">
                Your feedback helps us keep experiences safe and enjoyable.
              </p>
              <Button
                className="w-full bg-gradient-primary text-white rounded-xl mt-2"
                onClick={() => {
                  setShowRateSuccessModal(false);
                  setShowRatingModal(false);
                  navigate("/app/bookings");
                }}
              >
                OK
              </Button>
            </motion.div>
          </motion.div>
        )}

        <ServiceDetailsModal
          open={showServiceDetailsModal}
          service={viewService}
          onClose={() => {
            setShowServiceDetailsModal(false);
            setViewService(null);
          }}
        />

        {showServiceRatingsModal && viewRatingsService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b">
                <div>
                  <p className="text-xs uppercase tracking-wide text-sky-500">
                    Service ratings
                  </p>
                  <h2 className="text-lg font-semibold">
                    {viewRatingsService.name}
                  </h2>
                </div>
                <button
                  className="p-1.5 rounded-full hover:bg-slate-100"
                  onClick={() => {
                    setShowServiceRatingsModal(false);
                    setViewRatingsService(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 pt-3">
                {(() => {
                  const { avg, count } =
                    getServiceRatingSummary(viewRatingsService);
                  return (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-semibold">
                          {avg ? avg.toFixed(1) : "—"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {count} rating{count === 1 ? "" : "s"}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
                {viewRatingsService.service_reviews &&
                viewRatingsService.service_reviews.length ? (
                  viewRatingsService.service_reviews.map((r: any) => {
                    const userName = r.is_anonymous
                      ? "Anonymous"
                      : `${r.user?.first_name ?? ""} ${
                          r.user?.last_name ?? ""
                        }`.trim() || "Guest";
                    const created = (r.created_at ?? r.createdAt ?? "")?.slice(
                      0,
                      10
                    );
                    return (
                      <div
                        key={r.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i + 1 <= Number(r.rating ?? 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {created}
                          </span>
                        </div>
                        <p className="text-xs font-medium mb-1">{userName}</p>
                        {r.description ? (
                          <p className="text-xs text-muted-foreground">
                            {r.description}
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground italic">
                            No written review
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No ratings yet for this service.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
