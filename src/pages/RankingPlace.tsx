import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetPlaces } from "@/hooks/useGetPlace";
import { useNavigate } from "react-router-dom";

function slugify(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default function TouristSpotRanking() {
  const { formatData: places = [], isLoading } = useGetPlaces();
const navigate = useNavigate()
  const ranked = useMemo(() => {
    return (places ?? [])
      .map((p: any) => {
        const image =
          p.images?.[0]?.image ?? p.images?.[0] ?? "/placeholder-400x250.png";
        const rating = typeof p.rating === "number" ? p.rating : 0;
        const reviewsCount = Array.isArray(p.reviews)
          ? p.reviews.length
          : typeof p.reviews === "number"
          ? p.reviews
          : typeof p.reviewsCount === "number"
          ? p.reviewsCount
          : 0;
        return {
          id: p.id,
          name: p.name,
          image,
          rating,
          reviewsCount,
          description: p.description ?? "",
            slug: slugify(p.name),
          placeId: p?.placeId
        };
      })
      .sort((a, b) => {
        if (b.reviewsCount !== a.reviewsCount)
          return b.reviewsCount - a.reviewsCount;
        return b.rating - a.rating;
      });
  }, [places]);

    console.log("ranked", ranked);
    
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:mt-24">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Touristspot Ranking
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked by number of reviews (primary) and rating (secondary)
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="ghost">
            See all
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl animate-pulse bg-slate-100"
            />
          ))
        ) : ranked.length === 0 ? (
          <Card className="p-4 text-center">No places found</Card>
        ) : (
          ranked.map((p: any, idx: number) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="relative"
            >
              <Card className="p-3 md:p-4 flex items-center gap-4 hover:shadow-xl transition-shadow rounded-2xl">
                <div className="relative w-20 h-14 md:w-28 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border border-white/6">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute left-2 top-2 bg-black/40 text-white text-xs rounded-full px-2 py-0.5 backdrop-blur-sm">
                    #{idx + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-base font-semibold truncate">
                          {p.name}
                        </h3>
                        <Badge className="hidden md:inline-flex text-xs capitalize">
                          {p.reviewsCount > 0
                            ? `${p.reviewsCount} reviews`
                            : "No reviews"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs md:text-sm truncate line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold text-sm">
                          {(p.rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {p.reviewsCount > 0 ? (
                          `${p.reviewsCount} reviews`
                        ) : (
                          <a
                            href={`/remove-ratings/${p.slug}`}
                            className="inline-block text-primary underline text-xs"
                          >
                            View ratings
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-9 rounded-lg"
                      onClick={() => navigate(`/ratings/${p.placeId}`)}
                    >
                      View Ratings
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-lg"
                      onClick={() => navigate(`/booking?spot=${p.placeId}`)}
                    >
                      Book
                    </Button>

                    <Separator orientation="vertical" className="mx-2 h-6" />
                    <div className="text-xs text-muted-foreground">
                      Ranked by reviews
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
