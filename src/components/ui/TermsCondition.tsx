import React, { useEffect, useRef, useState } from "react";
import { useAuth2 } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Usage:
// <TermsModal open={isOpen} onClose={() => setOpen(false)} onAccept={() => handleAccept()} />

type TermsModalProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  title?: string;
};

export default function TermsModal({
  open,
  onClose,
  onAccept,
  title = "iTourGab — Terms & Conditions",
}: TermsModalProps) {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth2();

  useEffect(() => {
    if (!open) {
      setScrolledToEnd(false);
    }
  }, [open]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !open) return;

    const checkScroll = () => {
      const isAtEnd =
        Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
      setScrolledToEnd(isAtEnd);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(() => checkScroll());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [open]);

  const canAccept = scrolledToEnd;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
      modal
    >
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-h-[min(90dvh,900px)] w-[calc(100vw-1.5rem)] max-w-lg gap-0 overflow-hidden rounded-3xl p-0 sm:w-full"
      >
        <div className="flex max-h-[min(90dvh,900px)] flex-col overflow-hidden">
          <DialogHeader className="shrink-0 space-y-0 border-b border-slate-100 px-5 pb-3 pt-4 text-left dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/80 ring-1 ring-black/5 dark:bg-slate-800">
                <img src="/logo-itour.png" className="w-10" alt="" />
              </div>
              <div className="min-w-0 pt-0.5">
                <DialogTitle className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                  {title}
                </DialogTitle>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Gabaldon, Nueva Ecija — iTourGab visitor terms
                </p>
              </div>
            </div>
          </DialogHeader>

          <div
            ref={contentRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 pt-3 [scrollbar-gutter:stable]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Welcome to iTourGab
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                iTourGab is an informational and booking portal for tourist
                spots in Gabaldon, Nueva Ecija. By using this service you agree
                to follow local rules, respect private and public property, and
                follow any guidance given by local authorities or site
                stewards. These terms describe permitted use, content
                guidelines, privacy basics, and liability limitations.
              </p>

              <h5 className="mt-4 font-medium text-slate-800 dark:text-slate-100">
                Key points
              </h5>
              <ul className="mt-2 list-disc pl-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <li>
                  Respect the environment — no littering, avoid loud noise,
                  preserve flora/fauna.
                </li>
                <li>
                  Follow safety instructions — trails, viewpoints, and access
                  points may be restricted.
                </li>
                <li>
                  Bookings & payments — third-party vendors may handle
                  transactions; review their policies.
                </li>
                <li>
                  Content & photos — by uploading, you grant iTourGab a license
                  to use user-generated content.
                </li>
                <li>
                  Limitation of liability — iTourGab is informational and not
                  responsible for third-party acts.
                </li>
              </ul>

              <h5 className="mt-4 font-medium text-slate-800 dark:text-slate-100">
                Privacy
              </h5>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We collect only necessary data for bookings and communications.
                Personal information is processed according to applicable privacy
                laws. For detailed privacy policy, view the Privacy Policy
                document.
              </p>

              <h5 className="mt-4 font-medium text-slate-800 dark:text-slate-100">
                Acceptable Use
              </h5>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Users must not use iTourGab to harass others, post illegal
                content, or attempt unauthorized access to systems. Repeated
                violations may result in suspension.
              </p>

              <p className="mt-4 text-xs text-slate-400">
                Last updated: December 12, 2025
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-100 bg-background px-5 pb-4 pt-3 dark:border-slate-800">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    void logout();
                  }}
                  className="rounded-xl border border-slate-200 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (canAccept) onAccept();
                  }}
                  disabled={!canAccept}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                    canAccept
                      ? "bg-primary hover:bg-sky-600"
                      : "cursor-not-allowed bg-slate-300"
                  }`}
                >
                  Agree & Continue
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              By continuing you accept iTourGab terms and privacy practices.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
