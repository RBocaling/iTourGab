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
