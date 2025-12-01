import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Accommodation = {
  id: string | number;
  name?: string;
  price?: number;
  image?: string;
  features?: string[];
  [k: string]: any;
};

type PlaceLike = {
  id?: string | number;
  name?: string;
  accommodation?: Accommodation[]; // or raw.place.accommodation
  raw?: any;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlace?: PlaceLike | null;
  disabled?: boolean;
  onSelect: (a: Accommodation | null) => void;
};

export default function SelectAccommodationDialog({
  open,
  onOpenChange,
  selectedPlace,
  disabled,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const accommodations: Accommodation[] = useMemo(() => {
    if (!selectedPlace) return [];
    return (selectedPlace.accommodation ??
      selectedPlace.raw?.place?.accommodation ??
      []) as Accommodation[];
  }, [selectedPlace]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return accommodations;
    return accommodations.filter((a) =>
      (a.name ?? "").toLowerCase().includes(q)
    );
  }, [accommodations, search]);

  return (
    <Dialog open={open && !disabled} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Select accommodation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-base">Select accommodation</DialogTitle>
        </DialogHeader>

        <div className="p-3">
          <div className="relative mb-3">
            <Input
              placeholder={
                selectedPlace
                  ? "Search accommodation..."
                  : "Select a place first"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!selectedPlace}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[56vh] overflow-auto pr-2">
            {!selectedPlace ? (
              <div className="text-sm text-muted-foreground p-4">
                Pick a place first to see accommodations
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                No accommodations found
              </div>
            ) : (
              filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onSelect(a);
                    onOpenChange(false);
                  }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/3 text-left"
                >
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center border flex-shrink-0">
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{a.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {(a.features ?? []).slice(0, 2).join(", ")}
                    </div>
                    {a.price != null && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ₱{Number(a.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                </button>
              ))
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSelect(null);
                onOpenChange(false);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
