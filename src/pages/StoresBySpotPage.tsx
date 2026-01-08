import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { useStoresBySpot } from "@/hooks/useStores";
import Loader from "@/components/loader/Loader";
import BackButton from "@/components/ui/BackButton";

export default function StoresBySpotPage() {
  const { spotId } = useParams<{ spotId: string }>();
  const { data, isLoading } = useStoresBySpot(spotId);

  if (isLoading) return <Loader />;

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <Store className="w-12 h-12 mb-3 opacity-70" />
        <p className="text-sm">No stores available for this tourist spot</p>
      </div>
    );
  }

  const touristSpot = data[0]?.tourist_spot;
  const totalStores = data.length;

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <BackButton />

          <div className="flex flex-col">
            <h1 className="text-[15px] font-semibold leading-tight">
              {touristSpot?.name} — Available Stores
            </h1>
            <span className="text-xs text-muted-foreground">
              {totalStores} {totalStores > 1 ? "Stores" : "Store"}
            </span>
          </div>
        </div>
      </div>

      {/* Store Cards */}
      <div className="px-4 mt-4 grid grid-cols-1 gap-5">
        {data.map((store: any, idx: number) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <div className="rounded-[26px] overflow-hidden bg-white shadow-sm border border-gray-200 active:scale-[0.98] transition">
              {/* Image */}
              <div className="relative h-52 w-full bg-slate-100">
                <img
                  src={store.images?.[0] ?? "/placeholder-400x250.png"}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Store type badge */}
                <span className="absolute left-4 bottom-4 text-[11px] font-semibold uppercase tracking-wide bg-black/70 text-white px-3 py-1 rounded-full">
                  {store.type}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold leading-tight">
                  {store.name}
                </h3>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {store.description ??
                    "A local store available within this tourist destination."}
                </p>

                {store.contact && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    📞 {store.contact}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
