import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOURIST_SPOT_TYPES, TouristSpotType } from "@/types/touristSpotType";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  value: TouristSpotType | null;
  onChange: (v: TouristSpotType | null) => void;
  onClose: () => void;
  allowAll?: boolean;
};

export default function TouristSpotTypeModal({
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md rounded-3xl bg-background shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-base font-semibold">Filter by Place Type</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-1">
              {items.map((item) => {
                const active = value === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      onChange(item.value as any);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition",
                      active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    {item?.img && <img src={item?.img} className="w-12" alt="" />}
                    <span className="font-medium">{item.label}</span>
                    {active && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
