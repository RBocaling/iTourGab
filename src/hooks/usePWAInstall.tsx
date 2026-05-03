import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return (
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  );
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)");
  if (mq.matches) return true;
  return Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  );
}

type InstallFallback = "ios" | "unsupported" | null;

type PWAInstallContextValue = {
  installApp: () => Promise<void>;
  isInstallAvailable: boolean;
  isInstalled: boolean;
};

const PWAInstallContext = createContext<PWAInstallContextValue | null>(null);

function PWAInstallFallbackDialogs({
  fallback,
  onDismiss,
}: {
  fallback: InstallFallback;
  onDismiss: () => void;
}) {
  const open = fallback !== null;
  const title =
    fallback === "ios"
      ? "Install iTourGab"
      : fallback === "unsupported"
        ? "Install unavailable"
        : "";
  const description =
    fallback === "ios"
      ? "To install this app:\nTap Share → Add to Home Screen"
      : fallback === "unsupported"
        ? "Installation not supported on this device"
        : "";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onDismiss();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-left pt-1 whitespace-pre-line">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onDismiss}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(
    () => typeof window !== "undefined" && isStandaloneDisplay(),
  );
  const [fallback, setFallback] = useState<InstallFallback>(null);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const dismissFallback = useCallback(() => setFallback(null), []);

  const installApp = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (isStandaloneDisplay() || installed) return;

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } finally {
        setDeferredPrompt(null);
      }
      return;
    }

    if (isIOSDevice()) {
      setFallback("ios");
      return;
    }

    setFallback("unsupported");
  }, [deferredPrompt, installed]);

  const isInstalled = installed || isStandaloneDisplay();

  const value = useMemo(
    () => ({
      installApp,
      isInstallAvailable: deferredPrompt !== null,
      isInstalled,
    }),
    [installApp, deferredPrompt, isInstalled],
  );

  return (
    <PWAInstallContext.Provider value={value}>
      {children}
      <PWAInstallFallbackDialogs fallback={fallback} onDismiss={dismissFallback} />
    </PWAInstallContext.Provider>
  );
}

export function usePWAInstall(): PWAInstallContextValue {
  const ctx = useContext(PWAInstallContext);
  if (!ctx) {
    throw new Error("usePWAInstall must be used within PWAInstallProvider");
  }
  return ctx;
}
