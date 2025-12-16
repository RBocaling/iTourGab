import { getAuthState } from "../store/authStore";
import api from "./api";

type Tokens = { accessToken: string; refreshToken: string };

type LoginPayload = { email_address: string; password: string };
export const login = async (payload: LoginPayload): Promise<Tokens> => {
  const { data } = await api.post<Tokens>("/auth/login", payload);
  getAuthState().setAuth(data.accessToken, data.refreshToken);
  return data;
};

export const googleLogin = async (payload: { token: string }) => {
  const resp = await api.post("/auth/google", payload);
  return resp.data;
};

export const logout = async (): Promise<void> => {
  try {
    const rt = getAuthState().refreshToken;
    if (rt) await api.post("/auth/logout", { refreshToken: rt });
  } catch {}
  getAuthState().clearAuth();
};

export const refreshAccessToken = async (): Promise<Tokens | null> => {
  const rt = getAuthState().refreshToken;
  if (!rt) throw new Error("no refresh token");
  const { data } = await axiosRefresh(rt);
  getAuthState().setAuth(data.accessToken, data.refreshToken);
  return data;
};

const axiosRefresh = (refreshToken: string) => {
  return api.post<Tokens>("/auth/refresh", { refreshToken });
};

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  contactNo: string;
  address: string;
  password: string;
  confirmPassword: string;
  role?: any;
};

export const register = async (payload: RegisterPayload): Promise<Tokens> => {
  const body = payload;
  const { data } = await api.post<Tokens>("/auth/register", body);
  getAuthState().setAuth(data.accessToken, data.refreshToken);
  return data;
};
export const verifyAccountApi = async (payload: any) => {
  const body = payload;
  const { data } = await api.post<any>("/auth/verify-account", body);
  return data;
};
