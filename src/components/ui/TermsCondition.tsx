import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useAuth2 } from "@/hooks/useAuth";

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
  const [agreed, setAgreed] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth2();

  useEffect(() => {
    if (!open) {
      setAgreed(false);
      setScrolledToEnd(false);
    }
  }, [open]);

  // allow enable Accept either by manual checkbox or by scrolling to end
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const isAtEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      setScrolledToEnd(isAtEnd);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]);

  const canAccept = agreed || scrolledToEnd;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden
          />

          {/* modal card */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg mx-4 md:mx-0 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 overflow-hidden"
            role="document"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gradient-primary"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className=" bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <img src="/logo-itour.png" className="w-14" alt="" />
                  </motion.div>
                </motion.div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gabaldon, Nueva Ecija — iTourGab visitor terms
                  </p>
                </div>
              </div>

              {/* <button
                onClick={onClose}
                aria-label="Close terms"
                className="-mr-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button> */}
            </div>

            <div className="px-5 pb-4">
              <div
                ref={contentRef}
                className="max-h-64 md:max-h-80 overflow-auto rounded-xl p-4 border border-slate-100 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* Sample modern-styled terms content. Replace with your official copy. */}
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Welcome to iTourGab
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  iTourGab is an informational and booking portal for tourist
                  spots in Gabaldon, Nueva Ecija. By using this service you
                  agree to follow local rules, respect private and public
                  property, and follow any guidance given by local authorities
                  or site stewards. These terms describe permitted use, content
                  guidelines, privacy basics, and liability limitations.
                </p>

                <h5 className="mt-4 font-medium text-slate-800 dark:text-slate-100">
                  Key points
                </h5>
                <ul className="mt-2 pl-4 list-disc text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
                    Content & photos — by uploading, you grant iTourGab a
                    license to use user-generated content.
                  </li>
                  <li>
                    Limitation of liability — iTourGab is informational and not
                    responsible for third-party acts.
                  </li>
                </ul>

                <h5 className="mt-4 font-medium text-slate-800 dark:text-slate-100">
                  Privacy
                </h5>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  We collect only necessary data for bookings and
                  communications. Personal information is processed according to
                  applicable privacy laws. For detailed privacy policy, view the
                  Privacy Policy document.
                </p>

                <h5 className="mt-4 font-medium text-slate-800 dark:text-slate-100">
                  Acceptable Use
                </h5>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Users must not use iTourGab to harass others, post illegal
                  content, or attempt unauthorized access to systems. Repeated
                  violations may result in suspension.
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  Last updated: December 12, 2025
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {/* <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setAgreed(!agreed)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg ring-1 ${
                      agreed
                        ? "bg-emerald-500 ring-emerald-500"
                        : "bg-white ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    }`}
                    role="checkbox"
                    aria-checked={agreed}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setAgreed(!agreed);
                    }}
                  >
                    {agreed ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-3 h-3 rounded-sm bg-transparent" />
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      I have read and agree to the terms
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      You may also scroll to the end to enable Accept
                    </div>
                  </div>
                </label> */}

                <div className="flex items-center justify-end gap-2 mb-2">
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-transparent border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() => {
                      if (canAccept) onAccept();
                    }}
                    disabled={!canAccept}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm ${
                      canAccept
                        ? "bg-primary hover:bg-sky-600"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    Agree & Continue
                  </button>
                </div>
              </div>

              <div className="mt-3 text-center text-xs text-slate-400">
                By continuing you accept iTourGab terms and privacy practices.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
