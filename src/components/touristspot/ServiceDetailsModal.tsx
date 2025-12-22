import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;
  service: any | null;
  onClose: () => void;
  onSelectAvailability?: (availability: any) => void;
};

export default function ServiceDetailsModal({
  open,
  service,
  onClose,
  onSelectAvailability,
}: Props) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end  justify-center md:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full md:max-w-2xl mx-auto md:max-h-[85vh] bg-background rounded-t-3xl md:rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-background border-b px-5 py-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{service.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {service.type}
                  </Badge>
                  {service.promo && (
                    <Badge className="bg-rose-100 text-rose-700 text-xs">
                      🔖 {service.promo.discount_percent}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-6 overflow-y-auto max-h-[calc(90vh-64px)]">
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Available Options
                </h3>

                {service.availabilities?.length ? (
                  <div className="space-y-3">
                    {service.availabilities.map((a: any) => (
                      <div
                        key={a.id}
                        className="border rounded-2xl p-4 hover:bg-muted/40 transition cursor-pointer"
                        onClick={() => {
                          onSelectAvailability?.(a);
                          onClose();
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{a.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {a.description ?? "—"}
                            </p>

                            {a.max_guests && (
                              <p className="text-xs text-muted-foreground mt-1">
                                👥 Max guests: {a.max_guests}
                              </p>
                            )}
                          </div>

                          <div className="font-semibold text-sm">
                            ₱{Number(a.price ?? 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No availabilities available
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Gallery</h3>

                {service.images?.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {service.images.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="h-32 rounded-xl overflow-hidden bg-muted"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No images available
                  </p>
                )}
              </div>
            </div>

            <div className="border-t px-5 py-4">
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
