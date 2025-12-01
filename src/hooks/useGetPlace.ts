import { useQuery } from "@tanstack/react-query";
import { getAllPlacesApi, getPlaceByIdApi } from "@/api/placeApi";
import { formatPlace, formatPlaces } from "@/lib/formatPlace";
import type { Place } from "@/types/place";

export const useGetPlaces = () => {
  const query = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: getAllPlacesApi,
  });

  return {
    ...query,
    normalData: query.data ?? [],
    formatData: query.data ? formatPlaces(query.data) : [],
  };
};

export const useGetPlace = (id: string | number | undefined) => {
  const query = useQuery<Place, Error>({
    queryKey: ["places", id],
    queryFn: () => getPlaceByIdApi(id as string | number),
    enabled: Boolean(id),
  });

  return {
    ...query,
    normalData: query.data ?? null,
    formatData: query.data ? formatPlace(query.data) : null,
  };
};
