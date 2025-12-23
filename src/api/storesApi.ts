import api from "./api";

export const getStoresBySpotApi = async (spotId: string) => {
  const { data } = await api.get(`/stores/spot/${spotId}`);
  return data?.data ?? data;
};
