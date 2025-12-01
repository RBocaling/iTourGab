import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGetMyBookings } from "@/hooks/useGetBookings";
import BookingViewModal from "@/components/bookings/ViewBookings";
import Loader from "@/components/loader/Loader";
import { format } from "date-fns";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-600",
    label: "Pending",
    icon: AlertCircle,
  },
  confirmed: {
    color: "bg-green-100 text-green-600",
    label: "Confirmed",
    icon: CheckCircle,
  },
  cancelled: {
    color: "bg-red-100 text-red-600",
    label: "Cancelled",
    icon: XCircle,
  },
};

export default function BookingsPage() {
  const { formatData: bookings = [], isLoading } = useGetMyBookings();
  const [selectedBookingId, setSelectedBookingId] = useState<
    string | number | null
  >(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-y-auto bg-background pt-5 md:pt-32 pb-20 md:pb-8">
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
          ) : bookings.length === 0 ? (
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
              const status = (b as any).status ?? "pending";
              const StatusIcon =
                statusConfig[status as keyof typeof statusConfig].icon;
              const img =
                b.place?.images?.[0] ??
                b.service?.images?.[0] ??
                "/placeholder.jpg";
              const contactPhone =
                b.service?.contact ?? b.place?.contact ?? b.contactPhone ?? "—";
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
                                className={`${
                                  statusConfig[
                                    status as keyof typeof statusConfig
                                  ].color
                                } flex items-center gap-2 px-3 py-1 rounded-full`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                <span className="text-xs">
                                  {
                                    statusConfig[
                                      status as keyof typeof statusConfig
                                    ].label
                                  }
                                </span>
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-500 mb-2 truncate">
                              {b.serviceName}
                            </p>

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
                            onClick={() => navigate(`/spot/${b.place?.id}`)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            View on Map
                          </Button>
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
    </div>
  );
}
