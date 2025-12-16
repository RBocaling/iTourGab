// src/stores/termsStore.ts
import {create} from "zustand";

const TERMS_KEY = "itourgab_terms_accepted_v1";

type TermsState = {
  isOpen: boolean;
  accepted: boolean;
  open: () => void;
  close: () => void;
  accept: () => void;
  loadFromStorage: () => void;
};

const readAccepted = () => {
  try {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(TERMS_KEY) === "true";
  } catch {
    return false;
  }
};

const writeAccepted = (v: boolean) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(TERMS_KEY, v ? "true" : "false");
  } catch {}
};

const useTermsStore = create<TermsState>((set) => {
  const accepted = readAccepted();
  return {
    isOpen: !accepted,
    accepted,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    accept: () =>
      set(() => {
        writeAccepted(true);
        return { accepted: true, isOpen: false };
      }),
    loadFromStorage: () =>
      set(() => {
        const a = readAccepted();
        return { accepted: a, isOpen: !a };
      }),
  };
});

export default useTermsStore;
