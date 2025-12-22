import { AnimatePresence, motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICE_TYPES, ServiceType } from "@/types/serviceType";

type Props = {
  open: boolean;
  value?: ServiceType | null;
  onChange: (value: ServiceType | null) => void;
  onOpenChange: (open: boolean) => void;
  allowAll?: boolean;
};

export default function ServiceTypeSelectModal({
  open,
  value,
  onChange,
  onOpenChange,
  allowAll = true,
}: Props) {
  const items = allowAll
    ? [{ value: null, label: "All" }, ...SERVICE_TYPES]
    : SERVICE_TYPES;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center sm:items-center justify-center px-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md  mx-auto rounded-3xl  bg-background shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Service Type</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {items?.map((item: any) => {
                const active = value === item.value;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      onChange(item.value);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted/60 hover:bg-muted"
                    )}
                  >
                    <span>{item.label}</span>
                    {active && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  onOpenChange(false);
                }}
                className="w-full rounded-xl border py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                Clear selection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
