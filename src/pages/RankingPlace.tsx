import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetPlaces } from "@/hooks/useGetPlace";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/BackButton";

function slugify(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default function TouristSpotRanking() {
  const { formatData: places = [], isLoading } = useGetPlaces();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/app");
    }
  };

  const ranked = useMemo(() => {
    return (places ?? [])
      .map((p: any) => {
        const image =
          p.images?.[0]?.image ?? p.images?.[0] ?? "/placeholder-400x250.png";
        const rating = typeof p.rating === "number" ? p.rating : 0;
        const reviewsCount = Array.isArray(p.reviews)
          ? p.reviews.length
          : p.reviewsCount ?? 0;

        return {
          id: p.id,
          name: p.name,
          image,
          rating,
          reviewsCount,
          description: p.description ?? "",
          slug: slugify(p.name),
          placeId: p.placeId,
        };
      })
      .sort((a, b) =>
        b.reviewsCount !== a.reviewsCount
          ? b.reviewsCount - a.reviewsCount
          : b.rating - a.rating
      );
  }, [places]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 md:mt-24">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <BackButton />

        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Tourist Spot Ranking
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ranked by reviews and ratings
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-3 sm:gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 sm:h-24 rounded-2xl animate-pulse bg-muted"
            />
          ))
        ) : ranked.length === 0 ? (
          <Card className="p-4 text-center text-sm">No places found</Card>
        ) : (
          ranked.map((p: any, idx: number) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="p-3 sm:p-4 rounded-2xl flex gap-3 sm:gap-4 hover:shadow-md transition">
                {/* IMAGE */}
                <div className="relative w-20 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold truncate">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 hidden md:block">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">
                          {p.rating.toFixed(1)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {p.reviewsCount} reviews
                      </Badge>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs rounded-lg"
                      onClick={() => navigate(`/app/ratings/${p.placeId}`)}
                    >
                      View Ratings
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs rounded-lg"
                      onClick={() => navigate(`/app/booking?spot=${p.placeId}`)}
                    >
                      Book
                    </Button>
                    <div className=" shrink-0  md:hidden">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">
                          {p.rating.toFixed(1)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {p.reviewsCount} reviews
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
