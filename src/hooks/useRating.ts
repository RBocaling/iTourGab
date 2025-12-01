import { getRatingsApi } from "@/api/ratingApi";
import { useQuery } from "@tanstack/react-query"

export const useRatings = (id:any) => {
  return useQuery({
    queryKey: ["ratings"],
    queryFn:() =>getRatingsApi(id),
  });
}