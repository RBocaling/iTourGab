import api from "./api";
import type {
  RatingRaw,
  RatingListResponse,
  RatingItemResponse,
  CreateRatingPayload,
} from "@/types/rating";

export const getRatingsApi = async (
  placeId: string | number
): Promise<RatingRaw[]> => {
  try {
    const { data } = await api.get<RatingListResponse>(
      `/reviews/by-place/${placeId}`
    );
    return data.data ?? [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ?? err?.message ?? "Failed to fetch ratings";
    throw new Error(msg);
  }
};

export const createServiceRatingApi = async (
  payload: CreateRatingPayload
): Promise<RatingRaw> => {
  try {
    const { data } = await api.post<RatingItemResponse>(
      "/service-reviews",
      payload
    );
    return data.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ?? err?.message ?? "Failed to create rating";
    throw new Error(msg);
  }
};
