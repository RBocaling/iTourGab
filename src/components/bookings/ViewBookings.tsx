import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Package } from "lucide-react";
import { useGetBookingById } from "@/hooks/useGetBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBooking } from "@/lib/formatBooking";
import { format } from "date-fns";

type Props = {
  bookingId?: string | number | null;
  onClose: () => void;
  onViewSpot?: (placeId?: string | number | null) => void;
};

function normalizeImagesField(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (e) {
      // fallback: treat comma-separated string as list
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

export default function ViewBooking({ bookingId, onClose, onViewSpot }: Props) {
  const { normalData: raw, isLoading } = useGetBookingById(
    bookingId ?? undefined
  );
  const b: any = raw ? formatBooking(raw) : null;

  const servicesList = b
    ? b.service
      ? [b.service]
      : b.raw?.services ?? []
    : [];

  // availability might exist in different places depending on formatBooking
  const availability =
    b?.availability ?? b?.raw?.availability ?? raw?.availability ?? null;

  const availabilityImages: string[] = normalizeImagesField(
    availability?.images
  );

  const placeGallery: string[] = normalizeImagesField(b?.place?.gallery);
  const serviceImages: string[] = normalizeImagesField(b?.service?.images);

  // keep availability images separate — galleryItems excludes availability images
  const galleryItems = [...placeGallery, ...serviceImages].filter(Boolean);

  
  
  return (
    <Dialog
      open={Boolean(bookingId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="w-full max-w-4xl mx-2 h-screen overflow-y-auto md:mx-auto md:max-h-[80vh] p-0">
        <div className="p-4 md:p-8 grid grid-cols-1 gap-6">
          <DialogHeader className="px-0">
            <DialogTitle className="text-left text-lg md:text-xl">
              Booking Details
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="p-2 grid gap-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-40 md:col-span-2" />
                <Skeleton className="h-40" />
              </div>
            </div>
          ) : !b ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No details available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    {b.place?.name ?? `Place #${b.place?.id ?? "—"}`}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {b.place?.description ?? "—"}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-neutral-700 text-xs">
                        {format(new Date(b.checkIn), "MMM dd yyyy") ?? "—"} →{" "}
                        {format(new Date(b.checkOut), "MMM dd yyyy") ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        {b.guests ?? 1} guest{(b.guests ?? 1) > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        {b.rooms ?? 1} room{(b.rooms ?? 1) > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 md:p-4 rounded-xl shadow-sm">
                  <h4 className="text-sm font-medium mb-3">
                    Accommodation & Services
                  </h4>
                  <div className="space-y-3 max-h-[40vh] md:max-h-[27rem] overflow-auto pr-2">
                    {servicesList && servicesList.length > 0 ? (
                      servicesList.map((s: any) => (
                        <div
                          key={s.id ?? s.uuid}
                          className="flex items-start gap-3"
                        >
                          <div className="w-20 h-14 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center border flex-shrink-0">
                            {s.images && s.images[0] ? (
                              <img
                                src={s.images[0]?.url}
                                alt={s.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">
                              {s.name}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-3">
                              {s.description}
                            </div>
                            <div className="text-sm mt-1 text-muted-foreground">
                              Price: {s.price ?? "—"}
                            </div>
                            {s.contact && (
                              <div className="text-sm mt-1 text-muted-foreground">
                                Contact: {s.contact}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No services included
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-3">Gallery</h4>
                    {galleryItems.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                        {galleryItems.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-full h-20 sm:h-24 rounded-md overflow-hidden bg-slate-50"
                          >
                            <img
                              src={item}
                              alt={`gallery-${idx}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No images available
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 p-3 md:p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-3">Availability</h4>

                    {!availability ? (
                      <div className="text-sm text-muted-foreground">
                        No availability selected
                      </div>
                    ) : (
                      <>
                        <div className="mb-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-semibold">
                                {availability.name}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {availability.description ?? "—"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-semibold">
                                ₱
                                {Number(
                                  availability.price ?? 0
                                ).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                per night
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium mb-2">
                            Availability Gallery
                          </h5>
                          {availabilityImages.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {availabilityImages.map(
                                (img: string, i: number) => (
                                  <div
                                    key={i}
                                    className="w-full h-20 sm:h-24 rounded-md overflow-hidden bg-slate-50"
                                  >
                                    <img
                                      src={img}
                                      alt={`avail-${i}`}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No availability images
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-sm text-muted-foreground">
                    Total Amount
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ₱{Number(b.total ?? 0).toLocaleString()}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="text-sm font-medium mb-2">Place Info</h4>
                  <div className="text-sm font-semibold">
                    {b.place?.name ?? "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {b.place?.category ?? "—"}
                  </div>
                  <div className="text-sm mt-2 text-muted-foreground">
                    Lat: {b.place?.coordinates?.lat ?? "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lng: {b.place?.coordinates?.lng ?? "—"}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-gradient-primary text-white w-full sm:w-auto"
                    onClick={() => onViewSpot?.(b.place?.id)}
                  >
                    View Spot
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Special Requests
                  </h4>
                  <div className="bg-white/5 p-3 rounded-md text-sm text-neutral-800 max-h-40 overflow-auto">
                    {b.specialRequests ?? "—"}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
