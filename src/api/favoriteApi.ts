import api from "./api";
import type {
  FavoriteRaw,
  FavoriteListResponse,
  FavoriteItemResponse,
  CreateFavoritePayload,
} from "@/types/favorite";

export const getFavoritesApi = async (): Promise<FavoriteRaw[]> => {
  try {
    const { data } = await api.get<FavoriteListResponse>("/favorites/me");
    return data.data ?? [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to fetch favorites";
    throw new Error(msg);
  }
};

export const createFavoriteApi = async (
  payload: CreateFavoritePayload
): Promise<FavoriteRaw> => {
  try {
    const { data } = await api.post<FavoriteItemResponse>(
      "/favorites",
      payload
    );
    return data.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to create favorite";
    throw new Error(msg);
  }
};

export const removeFavoriteApi = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`/favorites/${id}`);
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      `Failed to remove favorite ${id}`;
    throw new Error(msg);
  }
};
