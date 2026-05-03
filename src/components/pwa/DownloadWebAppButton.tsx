import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import type { ComponentProps, ReactNode } from "react";

type DownloadWebAppButtonProps = {
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  children?: ReactNode;
};

const LABEL = "Download Web App";

/**
 * Always visible when the app is not already installed (standalone).
 * Uses the global PWA install handler: native prompt when available,
 * otherwise iOS / unsupported instructions via modal.
 */
export default function DownloadWebAppButton({
  className,
  variant = "default",
  size = "default",
  children,
}: DownloadWebAppButtonProps) {
  const { installApp, isInstalled } = usePWAInstall();

  if (isInstalled) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      onClick={() => void installApp()}
    >
      <Download className="h-4 w-4 shrink-0" aria-hidden />
      {children ?? LABEL}
    </Button>
  );
}
