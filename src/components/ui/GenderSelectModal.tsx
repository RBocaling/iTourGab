// src/components/GenderSelectModal.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Users, Heart, X as XIcon } from "lucide-react";

export type GenderValue = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";

type Option = {
  id: GenderValue;
  label: string;
  subtitle?: string;
  Icon: React.ComponentType<any>;
  color?: string;
};

const OPTIONS: Option[] = [
  {
    id: "MALE",
    label: "Male",
    subtitle: "Man / He",
    Icon: Users,
    color: "from-blue-100 to-blue-50",
  },
  {
    id: "FEMALE",
    label: "Female",
    subtitle: "Woman / She",
    Icon: Users,
    color: "from-pink-100 to-pink-50",
  },
  {
    id: "OTHER",
    label: "Other",
    subtitle: "Non-binary / They",
    Icon: Heart,
    color: "from-violet-100 to-violet-50",
  },
  {
    id: "UNSPECIFIED",
    label: "Unspecified",
    subtitle: "Prefer not to say",
    Icon: User,
    color: "from-slate-100 to-slate-50",
  },
];

const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const panel = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } };

type Props = {
  open: boolean;
  value?: GenderValue | null; // current value (optional)
  initial?: GenderValue | null; // initial selection to show when opening
  onClose: () => void;
  onSelect: (v: GenderValue) => void;
  title?: string;
};

export default function GenderSelectModal({
  open,
  onClose,
  onSelect,
  value,
  initial = null,
  title = "Select Gender",
}: Props) {
  // local selected state: prefer controlled value prop, fallback to initial
  const [selected, setSelected] = useState<GenderValue | null>(
    value ?? initial ?? null
  );

  // keep selected in sync when parent value or initial changes
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value ?? null);
      return;
    }
    setSelected(initial ?? null);
  }, [value, initial]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handlePick(opt: GenderValue) {
    setSelected(opt);
    try {
      onSelect(opt);
    } catch (err) {
      // swallow to avoid crashing UI; parent should handle errors
      // but still close modal to avoid stuck state
    }
    // delay closing slightly for nicer tap animation
    setTimeout(() => onClose(), 120);
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center h-screen">
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        variants={panel}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="relative w-full max-w-md mx-4 sm:mx-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">
              Choose one option
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {OPTIONS.map((opt) => {
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handlePick(opt.id)}
                  className={`group relative flex flex-col items-start gap-2 p-3 rounded-xl text-left transition-shadow duration-150 focus:outline-none ${
                    active
                      ? "bg-gradient-to-br from-white to-slate-50 ring-1 ring-primary shadow-md"
                      : "bg-slate-50 hover:shadow-sm"
                  }`}
                  aria-pressed={active}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                        active ? "bg-primary/10" : "bg-white"
                      }`}
                      aria-hidden
                    >
                      <opt.Icon
                        className={`w-6 h-6 ${
                          active ? "text-primary" : "text-neutral-600"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-medium ${
                          active ? "text-primary" : "text-slate-900"
                        }`}
                      >
                        {opt.label}
                      </div>
                      {opt.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">
                          {opt.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {active && (
                    <div className="absolute top-2 right-2 text-xs text-primary font-semibold">
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm bg-transparent text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
