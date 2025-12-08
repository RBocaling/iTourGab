import api from "./api";
import {
  ItineraryListResponse,
  ItineraryPayload,
  ItineraryRaw,
} from "@/types/iteneary";

export const getItineraryApi = async (): Promise<ItineraryRaw[]> => {
  try {
    const { data } = await api.get<ItineraryListResponse>("/iteneraries/me");
    return data.data ?? [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to fetch iteneraries";
    throw new Error(msg);
  }
};

export const createItineraryApi = async (
  payload: ItineraryPayload
): Promise<ItineraryRaw> => {
  try {
    const { data } = await api.post<{
      success: boolean;
      message: string;
      data: ItineraryRaw;
    }>("/iteneraries", payload);
    return data.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to create itinerary";
    throw new Error(msg);
  }
};

export const updateItineraryApi = async (
  id: number | string,
  payload: Partial<ItineraryPayload>
) => {
  try {
    const response = await api.put(`/iteneraries/${id}`, payload);
    return response.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      `Failed to update itinerary ${id}`;
    throw new Error(msg);
  }
};
