import { userMyReviewsApi, userMyVisitedApi } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";

export const useProfileTotal = () => {
  const myReview = useQuery({
    queryKey: ["my-reviewsss"],
    queryFn: () => userMyReviewsApi(),
  });
  const myVisited = useQuery({
    queryKey: ["viisted"],
    queryFn: () => userMyVisitedApi(),
  });

  return {
    myVisited: myVisited?.data?.data,
    myReview: myReview?.data?.data,
    isLoading: myReview?.isLoading || myVisited?.isLoading,
  };
};
