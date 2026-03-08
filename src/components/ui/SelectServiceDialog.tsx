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

type Service = {
  id: string | number;
  name?: string;
  description?: string;
  price?: string | number;
  images?: string[];
  [k: string]: any;
};

type PlaceLike = {
  id?: string | number;
  name?: string;
  services?: Service[];
  raw?: any;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlace?: PlaceLike | null;
  disabled?: boolean;
  onSelect: (s: Service | null) => void;
};

export default function SelectServiceDialog({
  open,
  onOpenChange,
  selectedPlace,
  disabled,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const services: Service[] = useMemo(() => {
    if (!selectedPlace) return [];
    // allow both normalized and raw shapes
    return (selectedPlace.services ??
      selectedPlace.raw?.place?.services ??
      []) as Service[];
  }, [selectedPlace]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => (s.name ?? "").toLowerCase().includes(q));
  }, [services, search]);

  return (
    <Dialog open={open && !disabled} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          Select service
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-base">Select a service</DialogTitle>
        </DialogHeader>

        <div className="p-3">
          <div className="relative mb-3">
            <Input
              placeholder={
                selectedPlace ? "Search services..." : "Select a place first"
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
                Pick a place first to see services
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 text-center">
                No services found
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelect(s);
                    onOpenChange(false);
                  }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/3 text-left"
                >
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-slate-50 flex items-center justify-center border flex-shrink-0">
                    {s.images?.[0] ? (
                      <img
                        src={(s.images[0] as any)?.url}
                        alt={s.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-slate-200 rounded" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{s.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {s.description}
                    </div>
                    {s.price && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Price: {s.price}
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
