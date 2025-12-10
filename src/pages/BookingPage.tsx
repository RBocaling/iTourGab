import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Check,
  Star,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useGetPlace } from "@/hooks/useGetPlace";
import { createBookingApi } from "@/api/bookingApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectPlaceDialog from "@/components/ui/SelectPlaceDialog";
import { createServiceRatingApi } from "@/api/serviceRatingApi";

function parsePrice(price: string | number | undefined | null): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const digits = String(price).replace(/[^\d.-]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

const steps = [
  { number: 1, title: "Select Service", icon: MapPin },
  { number: 2, title: "Select Availability", icon: MapPin },
  { number: 3, title: "Trip Details", icon: Calendar },
  { number: 4, title: "Review & Confirm", icon: Check },
];

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();

  const query = new URLSearchParams(location.search);
  const spotParam = query.get("spot") ?? query.get("placeId") ?? undefined;
  const serviceParam =
    query.get("service") ?? query.get("serviceId") ?? undefined;

  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(
    undefined
  );
  const [placeDialogOpen, setPlaceDialogOpen] = useState(false);

  const activePlaceId = selectedPlaceId ?? spotParam;
  const { normalData: place, isLoading: placeLoading } = useGetPlace(
    activePlaceId ? (activePlaceId as any) : undefined
  );

  const [step, setStep] = useState<number>(1);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<
    string | number | null
  >(null);
  const [selectedServiceId, setSelectedServiceId] = useState<
   any
  >(serviceParam ?? null);
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

  const [showServiceRatingsModal, setShowServiceRatingsModal] = useState(false);
  const [viewRatingsService, setViewRatingsService] = useState<any | null>(
    null
  );

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
    if (selectedPlaceId) return;
    if (!services || services.length === 0) return;
    if (selectedServiceId) return;
    const svc:any = services.find(
      (s: any) => String(s.id) === String(serviceParam)
    );
    if (svc) {
      setSelectedServiceId(svc.id);
      const firstAvail =
        Array.isArray(svc.availabilities) && svc.availabilities.length
          ? svc.availabilities[0]
          : null;
      if (firstAvail) setSelectedAvailabilityId(firstAvail.id);
    }
  }, [serviceParam, services, selectedPlaceId, selectedServiceId]);

  useEffect(() => {
    if (!selectedPlaceId) return;
    setSelectedAccommodationId(null);
    setSelectedServiceId(null);
    setSelectedAvailabilityId(null);
  }, [selectedPlaceId]);

  const selectedAccommodation = useMemo(
    () =>
      accommodations.find(
        (a: any) => String(a.id) === String(selectedAccommodationId)
      ) ?? null,
    [accommodations, selectedAccommodationId]
  );

  const selectedService:any = useMemo(
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


  const mutation = useMutation({
    mutationFn: (payload: any) => createBookingApi(payload),
    onSuccess: () => {
      qc.invalidateQueries(["bookings", "me"] as any);
      toast({
        title: "Booking submitted",
        description:
          "Your booking request was submitted. Tell us about your experience.",
      });
      setShowConfirmModal(false);
      setShowRatingModal(true);
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

  const canProceedToNext =
    step === 1
      ? selectedAccommodationId != null || selectedServiceId != null
      : step === 2
      ? selectedServiceId != null && selectedAvailabilityId != null
      : step === 3
      ? dates.checkIn && dates.checkOut
      : true;

  function handleSubmit() {
    if (!place) {
      toast({
        title: "No place selected",
        description: "Please choose a place first.",
      });
      return;
    }
    if (!dates.checkIn || !dates.checkOut) {
      toast({
        title: "Missing dates",
        description: "Please choose check-in and check-out dates.",
      });
      return;
    }

    const payload: any = {
      service_id: selectedServiceId ?? null,
      availability_id: selectedAvailabilityId ?? null,
      start_date: dates.checkIn,
      end_date: dates.checkOut,
      guests,
      rooms,
      special_requests: specialRequests,
      total_amount: totalAmount,
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

  return (
    <div className="min-h-screen bg-background pt-3 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/80 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
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

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold mb-2">
                    Choose from {place?.name ?? "a place"}
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
                        src={place.images?.[0] ?? "/placeholder-400x250.png"}
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
                    <h3 className="text-lg font-semibold">
                      Accommodations & Services
                    </h3>
                    {serviceParam && !selectedPlaceId ? (
                      selectedService ? (
                        <Card className="p-3 ring-2 ring-primary bg-primary/5 m-2">
                          <div className="flex items-start gap-3">
                            <div className="w-24 h-16 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center">
                              <img
                                src={
                                  selectedService.images?.[0] ??
                                  "/placeholder-400x250.png"
                                }
                                alt={selectedService.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">
                                    {selectedService.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {selectedService.description}
                                  </p>
                                  <button
                                    type="button"
                                    className="mt-2 inline-flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-600"
                                    onClick={() => {
                                      setViewRatingsService(selectedService);
                                      setShowServiceRatingsModal(true);
                                    }}
                                  >
                                    {(() => {
                                      const { avg, count } =
                                        getServiceRatingSummary(
                                          selectedService
                                        );
                                      if (!avg || !count) {
                                        return (
                                          <>
                                            <Star className="w-3 h-3 text-gray-300" />
                                            <span className="text-[11px] text-muted-foreground">
                                              No ratings yet
                                            </span>
                                          </>
                                        );
                                      }
                                      return (
                                        <>
                                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                          <span className="font-semibold text-[11px]">
                                            {avg.toFixed(1)}
                                          </span>
                                          <span className="text-[11px] text-muted-foreground">
                                            ({count})
                                          </span>
                                        </>
                                      );
                                    })()}
                                  </button>
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
                    ) : services.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No services available
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {services.map((s: any) => {
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
                                const firstAvail =
                                  Array.isArray(s.availabilities) &&
                                  s.availabilities.length
                                    ? s.availabilities[0]
                                    : null;
                                setSelectedAvailabilityId(
                                  firstAvail ? firstAvail.id : null
                                );
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-24 h-16 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center">
                                  <img
                                    src={
                                      s.images?.[0] ??
                                      "/placeholder-400x250.png"
                                    }
                                    alt={s.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold">
                                        {s.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {s.description}
                                      </p>
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

            {step === 2 && (
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
                            className={`p-3 rounded-lg border transition cursor-pointer ${
                              isSelected
                                ? "ring-2 ring-primary bg-primary/5"
                                : "bg-white/3"
                            }`}
                            onClick={() => setSelectedAvailabilityId(a.id)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h4 className="font-semibold">{a.name}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {a.description ?? "—"}
                                </p>
                                <div className="text-xs text-muted-foreground mt-2">
                                  {a.images && a.images.length
                                    ? `${a.images.length} image(s)`
                                    : "No images"}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-semibold">
                                  {a.price
                                    ? `₱${parsePrice(a.price).toLocaleString()}`
                                    : "₱—"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  per night
                                </div>
                              </div>
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
                        min={new Date().toISOString().split("T")[0]}
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
                          setDates((d) => ({ ...d, checkOut: e.target.value }))
                        }
                        min={
                          dates.checkIn ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select
                        value={String(guests)}
                        onValueChange={(v) => setGuests(Number(v))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Guest{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Select
                        value={String(rooms)}
                        onValueChange={(v) => setRooms(Number(v))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Room{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

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
                        src={place.images?.[0] ?? "/placeholder-400x250.png"}
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
                          {dates.checkIn} to {dates.checkOut}
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
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>

              {step < steps.length ? (
                <Button
                  onClick={() => {
                    if (canProceedToNext) setStep(step + 1);
                  }}
                  disabled={!canProceedToNext}
                  className="bg-gradient-primary text-white"
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
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Service</p>
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

                {dates.checkIn && dates.checkOut ? (
                  <>
                    <div className="flex justify-between">
                      <span>Nights</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rooms</span>
                      <span className="font-medium">{rooms}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total</span>
                      <span>₱{totalAmount.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Choose dates to see the total.
                  </p>
                )}
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
                    onClick={() => navigate("/emergency-safe-hotlines")}
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
                  <span>₱{totalAmount.toLocaleString()}</span>
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
              className="w-full h-[50vh] max-w-lg rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
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

                <div className="mt-5 flex gap-2">
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
                    onClick={() => navigate("/bookings")}
                  >
                    Skip
                  </Button>
                </div>
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
                  navigate("/bookings");
                }}
              >
                OK
              </Button>
            </motion.div>
          </motion.div>
        )}

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
