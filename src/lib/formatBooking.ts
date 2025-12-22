import { BookingRaw, FormattedBooking, PlaceShort, ServiceRaw } from "@/types/booking";

const slugify = (s?: string) =>
  (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
    

export const formatBooking = (b: BookingRaw, index = 0): FormattedBooking => {
  const rawPlace = b.tourist_spot ?? b.place ?? b.service?.tourist_spot ?? null;

  const placeName = rawPlace?.name ?? rawPlace?.title ?? "Unknown place";

  const spotSlug = slugify(placeName) || `place-${rawPlace?.id ?? index + 1}`;

  const bookingId = b.id ? String(b.id) : `book-${spotSlug}-${index + 1}`;

  const firstService =
    b.service && Object.keys(b.service).length
      ? b.service
      : Array.isArray(b.services)
      ? b.services[0]
      : null;

  const serviceId = firstService?.id ?? b.service_id ?? null;
  const serviceName = firstService?.name ?? null;

  const total =
    b.totalAmount ?? (b.total_amount != null ? Number(b.total_amount) : null);

  const formattedService = firstService
    ? {
        id: firstService.id ?? null,
        uuid: firstService.uuid ?? undefined,
        name: firstService.name ?? null,
        type: firstService.type ?? null,
        description: firstService.description ?? null,
        price: firstService.price != null ? Number(firstService.price) : null,
        images:
          Array.isArray(firstService.images) && firstService.images.length
            ? firstService.images
            : firstService.image_url
            ? [firstService.image_url]
            : [],
        image_url: firstService.image_url ?? undefined,
        contact: firstService.contact ?? null,
        amenities: Array.isArray(firstService.amenities)
          ? firstService.amenities
          : [],
        tourist_spot: firstService.tourist_spot ?? null,
        service_reviews: firstService.service_reviews,
        raw: firstService,
      }
    : null;

  const formattedPlace = rawPlace
    ? {
        id: rawPlace.id ?? null,
        uuid: rawPlace.uuid ?? undefined,
        name: rawPlace.name ?? null,
        description: rawPlace.description ?? null,
        category: rawPlace.category ?? null,
        coordinates: rawPlace.coordinates ?? null,
        images: Array.isArray(rawPlace.images) ? rawPlace.images : [],
        gallery: Array.isArray(rawPlace.gallery) ? rawPlace.gallery : [],
        features: Array.isArray(rawPlace.features) ? rawPlace.features : [],
        activities: Array.isArray(rawPlace.activities)
          ? rawPlace.activities
          : [],
        difficulty: rawPlace.difficulty ?? null,
        bestTime: rawPlace.best_time ?? rawPlace.bestTime ?? null,
        duration: rawPlace.duration ?? null,
        entrance: rawPlace.entrance ?? null,
        accessibility: rawPlace.accessibility ?? null,
        raw: rawPlace,
      }
    : null;

  return {
    id: bookingId,
    spotId: spotSlug,
    spotName: placeName,
    serviceId: serviceId ? String(serviceId) : null,
    serviceName,
    checkIn: b.start_date,
    checkOut: b.end_date,
    guests: b.guests ?? 1,
    rooms: b.rooms ?? 1,
    total,
    specialRequests: b.special_requests ?? null,
    place: formattedPlace,
    service: formattedService,
    availability: b.availability,
    tourist_spot: b.tourist_spot,
    status: b.status,
    cancelReason: b.cancel_reason,
    rejectReason: b.reject_reason,
    raw: b,
  };
};


export const formatBookings = (rows: BookingRaw[]) =>
  Array.isArray(rows) ? rows.map((r, i) => formatBooking(r, i)) : [];
