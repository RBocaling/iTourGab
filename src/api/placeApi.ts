import api from "./api";
import type { Place } from "@/types/place";

type ListResponse = {
  success: boolean;
  message: string;
  data: Place[];
};

type ItemResponse = {
  success: boolean;
  message: string;
  data: Place;
};

export const getAllPlacesApi = async (): Promise<Place[]> => {
  try {
    const { data } = await api.get<ListResponse>("/tourist_spots");
    return data.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Failed to fetch places";
    throw new Error(message);
  }
};

export const getPlaceByIdApi = async (id: string | number): Promise<Place> => {
  try {
    const { data } = await api.get<ItemResponse>(`/tourist_spots/${id}`);
    return data.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ??
      err?.message ??
      `Failed to fetch place with id ${id}`;
    throw new Error(message);
  }
};
