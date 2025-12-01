import {create} from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (access: string | null, refresh: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAuth: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      clearAuth: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getAuthState = () => {
  const s = (useAuthStore as any).getState();
  return {
    accessToken: s.accessToken as string | null,
    refreshToken: s.refreshToken as string | null,
    setAuth: s.setAuth as (a: string | null, r: string | null) => void,
    clearAuth: s.clearAuth as () => void,
  };
};
