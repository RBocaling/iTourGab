import { UserRaw } from "@/types/user";
import api from "./api";

export const userGetApi = async (): Promise<UserRaw> => {
  try {
    const { data } = await api.get<UserRaw>("/users/me");
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const userMyReviewsApi = async () => {
  try {
    const { data } = await api.get("/reviews/me");
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const userMyVisitedApi = async () => {
  try {
    const { data } = await api.get("/users/visited/me");
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCurrentUserApi = async (payload) => {
  try {
    const { data } = await api.put("/users/me", payload);
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ?? err?.message ?? "Failed to update user"
    );
  }
};