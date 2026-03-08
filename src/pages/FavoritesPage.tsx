import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGetFavorites } from "@/hooks/useFavorites";
import { useGetPlaces } from "@/hooks/useGetPlace";
import { createFavoriteApi, removeFavoriteApi } from "@/api/favoriteApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectPlaceDialog from "@/components/ui/SelectPlaceDialog";
import { SuccessDialog, ConfirmDialog } from "@/components/alert/FeedbackModals";

const PLACEHOLDER = "/placeholder-400x250.png";

export default function FavoritesPage() {
  const { formatData: favorites = [], isLoading: favLoading } =
    useGetFavorites();
  const { formatData: places = [] } = useGetPlaces();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [openAdd, setOpenAdd] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [description, setDescription] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [successModal, setSuccessModal] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => createFavoriteApi(payload),
    onSuccess: () => {
      qc.invalidateQueries(["favorites"] as any);
      setOpenAdd(false);
      setSelectedPlace(null);
      setDescription("");
      setSuccessModal({
        open: true,
        title: "Added to favorites",
        message: "This destination was added to your favorites.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => removeFavoriteApi(id),
    onSuccess: () => {
      qc.invalidateQueries(["favorites"] as any);
      setDeleteTarget(null);
      setConfirmOpen(false);
      setSuccessModal({
        open: true,
        title: "Favorite removed",
        message: "The destination has been removed from your favorites.",
      });
    },
    onError: () => {
      setDeleteTarget(null);
      setConfirmOpen(false);
    },
  });

  const handleCreate = () => {
    if (!selectedPlace) return;
    const touristspot_id =
      selectedPlace.raw?.place?.id ??
      selectedPlace.raw?.id ??
      selectedPlace.placeId ??
      selectedPlace.id;
    if (!touristspot_id) return;
    const payload = {
      touristspot_id: Number(touristspot_id),
      description: description || "",
    };
    createMutation.mutate(payload);
  };

  const handleDeleteClick = (f: any) => {
    setDeleteTarget(f);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.raw?.id ?? deleteTarget.id);
  };

  const deleteName =
    deleteTarget?.raw?.tourist_spot?.name ??
    deleteTarget?.placeName ??
    deleteTarget?.name ??
    "this place";

  console.log("selectet", selectedPlace);
  
  return (
    <div className="min-h-screen bg-background pt-5 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center  gap-4">
            <Heart className="w-12 h-12 text-red-500" />
            <div className="flex-1">
              <h1 className="text-xl md:text-3xl font-bold mb-1 text-left">
                My Favorites
              </h1>
              <p className="text-muted-foreground text-left">
                Your saved destinations
              </p>
            </div>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white">
                Add Favorite
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl w-full rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-lg">Add to Favorites</DialogTitle>
              </DialogHeader>

              <div className="p-4 grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      Place
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPickerOpen(true)}
                      >
                        Select place
                      </Button>
                      <div className="flex-1">
                        {selectedPlace ? (
                          <div className="flex items-center gap-3 p-2 rounded-xl border bg-white/40">
                            <div className="w-20 h-12 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center border flex-shrink-0">
                              <img
                                src={
                                  selectedPlace.raw?.place?.images?.[0]?.url
                                   ??
                                  selectedPlace.raw?.images?.[0]?.url ??
                                  selectedPlace.images?.[0]?.url ??
                                  PLACEHOLDER
                                }
                                alt={selectedPlace.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <div className="font-semibold truncate">
                                {selectedPlace.name}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {selectedPlace.description ??
                                  selectedPlace.raw?.place?.description ??
                                  ""}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No place selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description (optional)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a note for this favorite"
                    className="rounded-2xl"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpenAdd(false);
                      setSelectedPlace(null);
                      setDescription("");
                    }}
                    className="rounded-2xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-primary text-white rounded-2xl"
                    onClick={handleCreate}
                    disabled={!selectedPlace || createMutation.isPending}
                  >
                    {createMutation.isPending ? "Saving..." : "Add Favorite"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="flex items-center justify-end mb-4 gap-3"></div>

        <SelectPlaceDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onSelect={(p) => setSelectedPlace(p)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {favLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-slate-100 rounded-lg" />
                <div className="mt-3 h-4 bg-slate-100 rounded w-3/4" />
                <div className="mt-2 h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))
          ) : favorites.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                You have no favorites yet.
              </p>
            </div>
          ) : (
            favorites.map((f) => {
              const img =
                (f.raw?.tourist_spot?.images?.[0] as any)?.url ?? f.placeThumb ?? PLACEHOLDER;
              const spot = f.raw?.tourist_spot ?? f.raw?.place ?? null;
              const title = spot?.name ?? f.placeName ?? "Unknown place";
              const reviews = Array.isArray(spot?.reviews) ? spot.reviews : [];
              const totalRating = reviews.reduce(
                (acc: number, r: any) => acc + Number(r.rating ?? 0),
                0
              );
              const avg = reviews.length ? totalRating / reviews.length : 0;
              const staticDesc =
                f.description ??
                "Saved destination — plan your next trip here.";

              return (
                <Card
                  key={f.id}
                  className="flex flex-col overflow-hidden rounded-3xl border-slate-200/80 shadow-[0_14px_35px_rgba(15,23,42,0.12)]"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-50">
                    <img
                      src={img}
                      alt={title}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 pr-3">
                          <h3 className="text-base font-semibold leading-tight">
                            {title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="text-xs text-muted-foreground">
                              {reviews.length} reviews
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(avg)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground ml-1">
                              {avg ? avg.toFixed(1) : "0.0"}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                            {staticDesc}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="px-2"
                            onClick={() => handleDeleteClick(f)}
                            aria-label="Delete favorite"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </Button>
                          <div className="text-xs text-muted-foreground">
                            {f.createdAt
                              ? new Date(f.createdAt).toLocaleDateString()
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="px-3">
                          <Heart className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full px-4"
                          onClick={() => navigate(`/app/spot/${f.placeId}`)}
                        >
                          View Spot
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Remove favorite?"
        description={`Are you sure you want to remove "${deleteName}" from your favorites?`}
        primaryLabel={deleteMutation.isPending ? "Removing..." : "Remove"}
        secondaryLabel="Cancel"
        onPrimary={confirmDelete}
        onSecondary={() => {
          setDeleteTarget(null);
        }}
      />

      <SuccessDialog
        open={successModal.open}
        onOpenChange={(open) => setSuccessModal((prev) => ({ ...prev, open }))}
        title={successModal.title}
        description={successModal.message}
        primaryLabel="OK"
      />
    </div>
  );
}
