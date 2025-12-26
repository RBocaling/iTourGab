import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getAuthState } from "../store/authStore";
import { refreshAccessToken } from "./authApi";

const BASE_URL = "https://api.itourgab.site/api";
// const BASE_URL = "http://localhost:9000/api";

let api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

type PendingRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
};

let isRefreshing = false;
let queue: PendingRequest[] = [];

const processQueue = (error: any, token: string | null) => {
  while (queue.length) {
    const p = queue.shift()!;
    if (error) p.reject(error);
    else {
      if (token && p.config.headers)
        p.config.headers.Authorization = `Bearer ${token}`;
      api.request(p.config).then(p.resolve).catch(p.reject);
    }
  }
};

api.interceptors.request.use((config) => {
  const token = getAuthState().accessToken;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig:any = err.config;
    if (!originalConfig) return Promise.reject(err);
    const status = err.response?.status;
    if (status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, config: originalConfig });
        });
      }
      originalConfig._retry = true;
      isRefreshing = true;
      try {
        const tokens = await refreshAccessToken();
        const newAccess = tokens?.accessToken ?? null;
        if (newAccess && originalConfig.headers)
          originalConfig.headers.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        return api.request(originalConfig);
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { clearAuth } = getAuthState();
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
