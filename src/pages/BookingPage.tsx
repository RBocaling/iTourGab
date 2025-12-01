import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Check, Star } from "lucide-react";
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

function parsePrice(price: string | number | undefined): number {
  if (price == null) return 0;
  if (typeof price === "number") return price;
  const digits = String(price).replace(/[^\d.-]/g, "");
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

const steps = [
  { number: 1, title: "Select Accommodation/Service", icon: MapPin },
  { number: 2, title: "Trip Details", icon: Calendar },
  { number: 3, title: "Review & Confirm", icon: Check },
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
    string | number | null
  >(serviceParam ?? null);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const accommodations = useMemo(() => place?.accommodation ?? [], [place]);
  const services = useMemo(() => place?.services ?? [], [place]);

  useEffect(() => {
    if (!serviceParam) return;
    if (selectedPlaceId) return;
    if (!services || services.length === 0) return;
    if (selectedServiceId) return;
    const svc = services.find(
      (s: any) => String(s.id) === String(serviceParam)
    );
    if (svc) {
      setSelectedServiceId(svc.id);
    }
  }, [serviceParam, services, selectedPlaceId, selectedServiceId]);

  useEffect(() => {
    if (!selectedPlaceId) return;
    setSelectedAccommodationId(null);
    setSelectedServiceId(null);
  }, [selectedPlaceId]);

  const selectedAccommodation = useMemo(
    () =>
      accommodations.find(
        (a: any) => String(a.id) === String(selectedAccommodationId)
      ) ?? null,
    [accommodations, selectedAccommodationId]
  );

  const selectedService = useMemo(
    () =>
      services.find((s: any) => String(s.id) === String(selectedServiceId)) ??
      null,
    [services, selectedServiceId]
  );

  const nights = useMemo(() => {
    if (!dates.checkIn || !dates.checkOut) return 0;
    const ci = new Date(dates.checkIn);
    const co = new Date(dates.checkOut);
    const diff = (co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(diff));
  }, [dates]);

  const unitPrice = useMemo(() => {
    if (selectedAccommodation)
      return parsePrice((selectedAccommodation as any).price);
    if (selectedService) return parsePrice((selectedService as any).price);
    return 0;
  }, [selectedAccommodation, selectedService]);

  const totalAmount = useMemo(() => {
    const base = Number(unitPrice) * Math.max(1, nights) * Math.max(1, rooms);
    const taxes = base * 0.12;
    return Math.round(base + taxes);
  }, [unitPrice, nights, rooms]);

  const mutation = useMutation({
    mutationFn: (payload: any) => createBookingApi(payload),
    onSuccess: () => {
      qc.invalidateQueries(["bookings", "me"] as any);
      toast({
        title: "Booking submitted",
        description:
          "Your booking request was submitted. We'll notify you when confirmed.",
      });
      navigate("/bookings");
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

    const payload = {
      service_id: selectedServiceId ?? null,
      start_date: dates.checkIn,
      end_date:dates.checkOut,
      guests,
      rooms,
      special_requests:specialRequests,
      total_amount:totalAmount,
    };

    mutation.mutate(payload);
  }
console.log("place", place);

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
                      Accomodations & Services
                    </h3>
                    {serviceParam && !selectedPlaceId ? (
                      selectedService ? (
                        <Card className="p-3 ring-2 ring-primary bg-primary/5">
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
                                </div>
                                <div className="text-right">
                                  <div className="text-base font-semibold">
                                    ₱
                                    {parsePrice(
                                      selectedService.price
                                    ).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    price
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
                          return (
                            <Card
                              key={s.id}
                              className={`p-3 cursor-pointer transition-all hover:shadow-lg ${
                                selected
                                  ? "ring-2 ring-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => setSelectedServiceId(s.id)}
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
                                    </div>
                                    <div className="text-right">
                                      <div className="text-base font-semibold">
                                        ₱{parsePrice(s.price).toLocaleString()}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        price
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

            {step === 3 && (
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

                <Card className="p-6 bg-gradient-primary text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Payment</h3>
                  </div>

                  <p className="text-white/80 mb-4">
                    This is a booking request. Payment will be processed after
                    confirmation. We'll email you payment instructions.
                  </p>

                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm text-white/80">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ₱{totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-white/80">
                      Includes estimated taxes
                    </p>
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

              {step < 3 ? (
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
                  onClick={handleSubmit}
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
                <div className="flex gap-2">
                  <span>✉️</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">help@itourgab.com</p>
                  </div>
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
          setSelectedPlaceId(
            String(p.placeId ?? p.placeId ?? p.placeId ?? p.id)
          );
          setPlaceDialogOpen(false);
        }}
      />
    </div>
  );
}
