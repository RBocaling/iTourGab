
import type { Place } from "@/types/place";

export function parseEntranceFee(val?: string | null): number {
  if (!val) return 0;

  const normalized = val.toLowerCase().trim();
  if (normalized === "free" || normalized === "₱0" || normalized === "0") {
    return 0;
  }

  const digits = normalized.replace(/[^\d.]/g, "");
  const amount = Number(digits);

  return Number.isFinite(amount) ? amount : 0;
}

export const formatPlace = (p: Place) => {
  const formattedId =
    p.name
      ?.toLowerCase()
      ?.replace(/\s+/g, "-")
      ?.replace(/[^a-z0-9-]/g, "") || p.id;

  const reviews = p.reviews ?? [];
  const total = reviews.reduce((acc, r) => acc + Number(r?.rating ?? 0), 0);
  const avg = (reviews.length ? total / reviews.length : 0)?.toFixed(1);
  const entranceFee = parseEntranceFee(p.entrance);
  return {
    placeId: p?.id,
    id: formattedId,
    name: p.name,
    description: p.description,
    category: p.category,
    coordinates: p.coordinates,
    images: p.images || [],
    gallery: p.gallery || [],
    features: p.features || [],
    activities: p.activities || [],
    difficulty: p.difficulty,
    bestTime: p.best_time ?? p.bestTime,
    duration: p.duration,
    entranceFee,
    entrance: p.entrance,
    accessibility: p.accessibility,
    nearby: p.nearby || [],
    rating: avg ?? 0,

    reviews: Array.isArray(reviews)
      ? reviews.map((r: any) => r.description ?? "")
      : [],
    reviewsCount: reviews.length,
    ratings: reviews,
    services: (p.services || []).map((s: any, index: number) => ({
      id: s.id || `${formattedId}-service-${index}`,
      name: s.name,
      type: s.type,
      description: s.description,
      price: s.price,
      images: s.images || [],
      contact: s.contact,
      amenities: s.amenities || [],
      service_reviews: s?.service_reviews,
      availabilities: s?.availabilities,
      promo: s.promo,
    })),
    accommodation: p.accommodation || [],
    raw: p,
    type: p?.type,
    stores: p?.stores,
  };
};

export const formatPlaces = (places: Place[]) => places.map(formatPlace);
