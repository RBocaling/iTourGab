import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGetMyBookings } from "@/hooks/useGetBookings";
import BookingViewModal from "@/components/bookings/ViewBookings";
import Loader from "@/components/loader/Loader";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServiceRatingApi } from "@/api/serviceRatingApi";
import { useToast } from "@/hooks/use-toast";
import { updateStatus } from "@/api/bookingApi";

const statusConfig = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-600",
    label: "Pending",
    icon: AlertCircle,
  },
  CONFIRMED: {
    color: "bg-green-100 text-green-600",
    label: "Confirmed",
    icon: CheckCircle,
  },
  CANCELLED: {
    color: "bg-red-100 text-red-600",
    label: "Cancelled",
    icon: XCircle,
  },
  REJECTED: {
    color: "bg-red-100 text-red-600",
    label: "Rejected",
    icon: XCircle,
  },
};

const cancelReasons = [
  "Change of travel plans",
  "Found a better option",
  "Incorrect dates or guest details",
  "Price is higher than expected",
  "Weather or safety concerns",
];

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { formatData: bookings = [], isLoading, refetch } = useGetMyBookings();
  const [selectedBookingId, setSelectedBookingId] = useState<
    string | number | null
  >(null);
  const [showServiceRatingsModal, setShowServiceRatingsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [postWithName, setPostWithName] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBooking, setCancelBooking] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<any>("");
  const [customCancelReason, setCustomCancelReason] = useState("");

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonTitle, setReasonTitle] = useState("");
  const [reasonText, setReasonText] = useState("");

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: createServiceRatingApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings", "me"] as any);
      setShowServiceRatingsModal(false);
      setSelectedService(null);
    },
  });

  const { mutate: cancelMutate, isPending: cancelLoading } = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings", "me"] as any);
      refetch();
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled.",
      });
      setShowCancelModal(false);
      setCancelBooking(null);
      setCancelReason("");
      setCustomCancelReason("");
    },
    onError: (err: any) => {
      toast({
        title: "Failed to cancel booking",
        description: err?.message ?? "Unable to cancel booking",
      });
    },
  });

  const openServiceRatingsModal = (booking: any) => {
    const service = booking.service;
    const reviews =
      booking.service_reviews && booking.service_reviews.length > 0
        ? booking.service_reviews
        : service?.service_reviews || [];
    setSelectedService({
      id: service?.id ?? booking.serviceId,
      name: service?.name ?? booking.serviceName,
      reviews,
    });
    setNewRating(0);
    setHoverRating(0);
    setReviewText("");
    setPostWithName(false);
    setShowServiceRatingsModal(true);
  };

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return "0.0";
    const total = reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    return (total / reviews.length).toFixed(1);
  };

  const handleSubmitServiceReview = () => {
    if (!selectedService || !newRating) return;
    const payload = {
      service_id: selectedService.id,
      rating: newRating,
      description: reviewText || "",
      is_anonymous: !postWithName,
    };
    mutate(payload as any);
  };

  const handleOpenCancel = (booking: any) => {
    setCancelBooking(booking);
    setCancelReason("");
    setCustomCancelReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelBooking) return;
    cancelMutate({
      id: cancelBooking.id,
      reason: cancelBooking.customCancelReason || cancelReason,
    });
  };

  const finalCancelReason = (customCancelReason || cancelReason).trim();

  const openReasonModal = (title: string, text: string) => {
    setReasonTitle(title);
    setReasonText(text || "No reason provided.");
    setShowReasonModal(true);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-background pt-5 md:pt-32 pb-28 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8"
        >
          <div className="w-full md:w-auto">
            <h1 className="text-xl md:text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-neutral-500">
              Manage your reservations and services
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Button
              onClick={() => navigate("/booking")}
              className="bg-gradient-primary text-white w-full md:w-auto flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Booking
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          {isLoading ? (
            <Loader />
          ) : bookings?.sort((a: any, b: any) => b?.id - a?.id).length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-neutral-500 mb-6">
                Start planning your adventure
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-primary text-white"
              >
                Explore Destinations
              </Button>
            </div>
          ) : (
            bookings.map((b: any) => {
              const rawStatus = (b as any).status ?? "PENDING";
              const upperStatus = String(rawStatus).toUpperCase();
              const statusKey = (statusConfig as any)[upperStatus]
                ? (upperStatus as keyof typeof statusConfig)
                : "PENDING";
              const StatusIcon = statusConfig[statusKey].icon;
              const img =
                b.place?.images?.[0] ??
                b.service?.images?.[0] ??
                b.availability?.images?.[0] ??
                "/placeholder.jpg";

              const contactPhone =
                b.service?.contact ?? b.place?.contact ?? b.contactPhone ?? "—";
              const reviews =
                b.service_reviews && b.service_reviews.length > 0
                  ? b.service_reviews
                  : b.service?.service_reviews || [];
              const avgRating = getAverageRating(reviews);
              const canCancel =
                statusKey === "PENDING" || statusKey === "CONFIRMED";

              const availabilityName = b.availability?.name ?? null;
              const availabilityDescription =
                b.availability?.description ?? null;

              console.log("hjhhj",b);
              
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 }}
                >
                  <Card className="card-hover p-4 md:p-5">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="w-full md:w-40 flex-shrink-0">
                        <div className="w-full h-36 md:h-20 rounded-md overflow-hidden bg-slate-50">
                          <img
                            src={img}
                            alt={b.spotName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center justify-between ">
                              <h3 className="text-lg font-semibold truncate">
                                {b.spotName}
                              </h3>
                              <Badge
                                className={`${statusConfig[statusKey].color} flex items-center gap-2 px-3 py-1 rounded-full`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span className="text-xs">
                                  {statusConfig[statusKey].label}
                                </span>
                              </Badge>
                            </div>

                            <div className="mt-1">
                              <p className="text-sm text-neutral-700 mb-1 truncate">
                                {b.serviceName}
                                {availabilityName ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    · {availabilityName}
                                  </span>
                                ) : null}
                              </p>
                              {availabilityDescription ? (
                                <p className="text-xs text-neutral-500 line-clamp-2">
                                  {availabilityDescription}
                                </p>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              onClick={() => openServiceRatingsModal(b)}
                              className="flex items-center gap-1 text-xs mb-2 hover:bg-muted/60 rounded-md px-2 py-1 transition-colors"
                            >
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{avgRating}</span>
                              <span className="text-muted-foreground">
                                ({reviews.length})
                              </span>
                            </button>

                            <div className="flex flex-wrap gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-neutral-700 text-xs">
                                  {format(new Date(b.checkIn), "MMM dd yyyy") ??
                                    "—"}{" "}
                                  →{" "}
                                  {format(
                                    new Date(b.checkOut),
                                    "MMM dd yyyy"
                                  ) ?? "—"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-neutral-700 text-xs font-semibold">
                                  {b.guests ?? 1} guest
                                  {(b.guests ?? 1) !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-neutral-700">
                                  {contactPhone}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-3">
                            <div className="text-left w-full md:text-right flex justify-between items-center">
                              <div className="text-2xl font-bold text-primary">
                                ₱{Number(b.total ?? 0).toLocaleString()}
                              </div>
                              <div className="text-sm text-neutral-500">
                                Total Amount
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBookingId(b.id)}
                            className="w-full sm:w-auto"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/spot/${b.place?.id ?? b.tourist_spot?.id}`
                              )
                            }
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            View on Map
                          </Button>
                          {statusKey === "PENDING" &&canCancel && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenCancel(b)}
                              className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-400"
                            >
                              Cancel Booking
                            </Button>
                          )}

                          {statusKey === "CANCELLED" && b.cancelReason && (
                            <button
                              type="button"
                              onClick={() =>
                                openReasonModal(
                                  "Cancellation Reason",
                                  b.cancelReason
                                )
                              }
                              className="text-sm text-red-600 underline mb-1"
                            >
                              View cancel reason
                            </button>
                          )}

                          {statusKey === "REJECTED" && b.rejectReason && (
                            <button
                              type="button"
                              onClick={() =>
                                openReasonModal(
                                  "Rejection Reason",
                                  b.rejectReason
                                )
                              }
                              className="text-sm text-red-600 underline mb-1"
                            >
                              View rejection reason
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <BookingViewModal
        bookingId={selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
        onViewSpot={(id) => navigate(`/spot/${id}`)}
      />

      <AnimatePresence>
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
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">{selectedService.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">
                      {getAverageRating(selectedService.reviews || [])}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(selectedService.reviews || []).length} total
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
                      {getAverageRating(selectedService.reviews || [])}
                    </div>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const avg = parseFloat(
                          getAverageRating(selectedService.reviews || [])
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
                      {(selectedService.reviews || []).length} total
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const list = selectedService.reviews || [];
                      const count = list.filter(
                        (r: any) => r.rating === star
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
                  className="w-full mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:ring-2事实上 focus:ring-sky-400"
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

              <div className="space-y-3">
                {selectedService.reviews &&
                selectedService.reviews.length > 0 ? (
                  selectedService.reviews
                    ?.sort((a: any, b: any) => b?.id - a?.id)
                    ?.map((r: any) => {
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
                              <span className="font-semibold">{r.rating}</span>
                            </div>
                          </div>
                          {r.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {r.description}
                            </p>
                          )}
                          {r.created_at && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(r.created_at).toLocaleString()}
                            </p>
                          )}
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

        {showCancelModal && cancelBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    Cancel this booking?
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Booking #{cancelBooking.id} · {cancelBooking.spotName}
                  </p>
                </div>
                <button
                  className="p-1.5 rounded-full hover:bg-muted"
                  onClick={() => setShowCancelModal(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Help us understand why you’re cancelling. This won’t take long.
              </p>

              <div className="space-y-2 mb-3">
                {cancelReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setCancelReason(reason)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl border transition-colors ${
                      cancelReason === reason
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-border hover:bg-muted/60"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Or tell us in your own words
                </p>
                <textarea
                  value={customCancelReason}
                  onChange={(e) => setCustomCancelReason(e.target.value)}
                  placeholder="Type your cancellation reason..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Booking
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  disabled={!finalCancelReason || cancelLoading}
                  onClick={handleConfirmCancel}
                >
                  {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showReasonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setShowReasonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{reasonTitle}</h2>
                <button
                  className="p-1.5 rounded-full hover:bg-muted"
                  onClick={() => setShowReasonModal(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-neutral-700 whitespace-pre-line">
                {reasonText}
              </p>
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowReasonModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
