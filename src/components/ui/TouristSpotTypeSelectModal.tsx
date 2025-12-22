// src/components/ui/TouristSpotTypeSelectModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOURIST_SPOT_TYPES, TouristSpotType } from "@/types/touristSpotType";

type Props = {
  open: boolean;
  value?: TouristSpotType | null;
  onChange: (value: TouristSpotType | null) => void;
  onClose: () => void;
  allowAll?: boolean;
};

export default function TouristSpotTypeSelectModal({
  open,
  value,
  onChange,
  onClose,
  allowAll = true,
}: Props) {
  const items = allowAll
    ? [{ value: null, label: "All Types" }, ...TOURIST_SPOT_TYPES]
    : TOURIST_SPOT_TYPES;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-background shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Select Place Type</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto px-3 py-2">
              {items.map((item) => {
                const active = value === item.value;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      onChange(item.value as any);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition",
                      active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <span className="font-medium">{item.label}</span>
                    {active && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>

            {/* Footer (iOS-style grab area) */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
