import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { useGetPlaces } from "@/hooks/useGetPlace";
import { Button } from "@/components/ui/button";

type PlaceItem = {
  id: string;
  name?: string;
  description?: string;
  images?: string[];
  raw?: any;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (place: PlaceItem) => void;
};

export default function SelectPlaceDialog({
  open,
  onOpenChange,
  onSelect,
}: Props) {
  const { formatData: places = [], isLoading } = useGetPlaces();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return places;
    return places.filter((p: any) => (p.name ?? "").toLowerCase().includes(q));
  }, [places, search]);

  console.log("filtered", filtered);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* <Button variant="outline" size="sm">
          Select place
        </Button> */}
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-base">Select a place</DialogTitle>
        </DialogHeader>

        <div className="p-3">
          <div className="relative mb-3">
            <Input
              placeholder="Search places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[48vh] overflow-auto pr-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 rounded-lg animate-pulse"
                />
              ))
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                No places found
              </div>
            ) : (
              filtered.map((p: any) => {
                const img =
                  p.raw?.images?.[0]?.url ??
                  p.images?.[0]?.url ??
                  "/placeholder-400x250.png";
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelect(p);
                      onOpenChange(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg text-left hover:bg-white/3"
                  >
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center border flex-shrink-0">
                      <img
                        src={img}
                        alt={p.name}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="flex items-center gap-1 py-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(Number(p?.rating))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {p.description ?? ""}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
