import api from "./api";

export const getFavoritesApi = async () => {
  try {
    const { data } = await api.get("/tourist_ai");
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
  payload: any
) => {
  try {
    const { data } = await api.post("/tourist_ai", payload);
    return data.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ??
      err?.message ??
      "Failed to create favorite";
    throw new Error(msg);
  }
};
