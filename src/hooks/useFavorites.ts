// hooks/useGetFavorites.ts
import { useQuery } from "@tanstack/react-query";
import { getFavoritesApi } from "@/api/favoriteApi";
import type { FavoriteRaw, FormattedFavorite } from "@/types/favorite";

const formatFavorite = (f: FavoriteRaw): FormattedFavorite => {
  const place = f.tourist_spot ?? null;

  const placeName = place?.name ?? String(f.touristspot_id ?? "");

  const thumb =
    Array.isArray(place?.images) && place.images.length > 0
      ? place.images[0]
      : null;

  const formattedId =
    place?.name
      ?.toLowerCase()
      ?.replace(/\s+/g, "-")
      ?.replace(/[^a-z0-9-]/g, "") ?? String(f.touristspot_id ?? f.id);

  return {
    id: String(f.id),
    placeId: place?.id,
    placeName,
    placeThumb: thumb,
    description: f.description ?? null,
    createdAt: f.created_at ?? null,
    raw: f,
  };
};


export const useGetFavorites = () => {
  const q = useQuery<FavoriteRaw[], Error>({
    queryKey: ["favorites"],
    queryFn: getFavoritesApi,
  });

  return {
    ...q,
    normalData: q.data ?? ([] as FavoriteRaw[]),
    formatData: q.data
      ? q.data.map(formatFavorite)
      : ([] as FormattedFavorite[]),
  };
};
