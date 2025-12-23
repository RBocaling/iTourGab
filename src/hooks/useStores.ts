import { useQuery } from "@tanstack/react-query";
import { getStoresBySpotApi } from "@/api/storesApi";

export const useStoresBySpot = (spotId?: string) => {
  return useQuery({
    queryKey: ["stores-by-spot", spotId],
    queryFn: () => getStoresBySpotApi(spotId as string),
    enabled: !!spotId,
  });
};
