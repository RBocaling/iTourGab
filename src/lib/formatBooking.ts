import { BookingRaw, FormattedBooking, PlaceShort, ServiceRaw } from "@/types/booking";

const slugify = (s?: string) =>
  (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
    

export const formatBooking = (b: BookingRaw, index = 0): FormattedBooking => {
 const place = b?.service?.tourist_spot?.name;
    const formattedId =
      place
        ?.toLowerCase()
        ?.replace(/\s+/g, "-")
        ?.replace(/[^a-z0-9-]/g, "") || b?.service?.tourist_spot?.id;
  
  const placeFromService =
    b.service?.tourist_spot ?? b.service?.tourist_spot ?? null;
  const rawPlace = b.place ?? placeFromService ?? null;
  const placeName =
    rawPlace?.name ??
    rawPlace?.title ??
    (b.placeId ? String(b.placeId) : "unknown");
  const spotSlug = slugify(placeName) || `place-${b.placeId ?? "unknown"}`;
  const checkIn = b.dates?.checkIn ?? b.start_date ?? null;
  const checkOut = b.dates?.checkOut ?? b.end_date ?? null;
  const bookingId = b.id ? String(b.id) : `book-${spotSlug}-${index + 1}`;

  const firstService =
    (b.service && Object.keys(b.service).length
      ? b.service
      : Array.isArray(b.services)
      ? b.services[0]
      : null) ?? null;
  const serviceId = firstService?.id ?? b.service_id ?? b.serviceId ?? null;
  const serviceName = firstService?.name ?? null;

  const accommodationId =
    b.accommodation?.id ?? b.accommodationId ?? b.accommodation_id ?? null;
  const accommodationName = b.accommodation?.name ?? null;

  const total =
    b.totalAmount ??
    (b.total_amount !== undefined && b.total_amount !== null
      ? Number.isFinite(Number(b.total_amount))
        ? Number(b.total_amount)
        : null
      : null);

  const formattedService: ServiceRaw | null = firstService
    ? {
        id: firstService.id ?? firstService.uuid ?? null,
        uuid: firstService.uuid ?? undefined,
        name: firstService.name ?? null,
        type: firstService.type ?? null,
        description: firstService.description ?? null,
        price:
          firstService.price === null || firstService.price === undefined
            ? null
            : Number.isFinite(Number(firstService.price))
            ? Number(firstService.price)
            : firstService.price,
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
        isDeleted: firstService.is_deleted ?? firstService.isDeleted ?? false,
        createdAt: firstService.created_at ?? firstService.createdAt ?? null,
        updatedAt: firstService.updated_at ?? firstService.updatedAt ?? null,
        raw: firstService,
        service_reviews: firstService?.service_reviews,
      }
    : null;

  const formattedPlace: PlaceShort | null = rawPlace
    ? {
        id: formattedId,
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
        isDeleted: rawPlace.is_deleted ?? rawPlace.isDeleted ?? false,
        createdAt: rawPlace.created_at ?? rawPlace.createdAt ?? null,
        updatedAt: rawPlace.updated_at ?? rawPlace.updatedAt ?? null,
      raw: rawPlace,


      }
    : null;
  
  return {
    id: bookingId,
    spotId: spotSlug,
    spotName: placeName,
    serviceId: serviceId ? String(serviceId) : null,
    serviceName: serviceName ?? null,
    accommodationId: accommodationId ?? null,
    accommodationName: accommodationName ?? null,
    checkIn,
    checkOut,
    guests: b.guests ?? 1,
    rooms: b.rooms ?? 1,
    specialRequests: b.special_requests ?? b.specialRequests ?? null,
    total,
    place: formattedPlace,
    service: formattedService,
    raw: b,
    status: b?.status,
    service_reviews: b?.service?.service_reviews,
    cancelReason: b?.cancel_reason,
    rejectReason: b?.reject_reason,
  };
};

export const formatBookings = (rows: BookingRaw[]) =>
  Array.isArray(rows) ? rows.map((r, i) => formatBooking(r, i)) : [];
