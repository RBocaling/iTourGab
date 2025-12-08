import { getItineraryApi } from "@/api/iteneraryApi";
import { ItineraryRaw } from "@/types/iteneary";
import { useQuery } from "@tanstack/react-query";

export const useGetItineraries = () => {
  return useQuery({
    queryKey: ["iteneraries"],
    queryFn: getItineraryApi,
  });


};
