// src/components/ItineraryIOS.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus, Clock } from "lucide-react";
import SelectPlaceDialog from "@/components/ui/SelectPlaceDialog";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createItineraryApi, updateItineraryApi } from "@/api/iteneraryApi";
import { ItineraryPayload } from "@/types/iteneary";
import { useGetItineraries } from "@/hooks/useGeiTinerary";
import {
  SuccessDialog,
  ErrorDialog,
  ConfirmDialog,
} from "@/components/alert/FeedbackModals";
import Loader from "@/components/loader/Loader";

type TouristSpot = {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  images?: string[];
  category?: string;
};

type ItineraryItem = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  tourist_spot?: TouristSpot | null;
};

export default function ItineraryIOS() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{
    id: number | string;
    payload: Partial<ItineraryPayload>;
  } | null>(null);

  const [successState, setSuccessState] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const [errorState, setErrorState] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const { data, refetch , isLoading} = useGetItineraries();

  const createMutation = useMutation({
    mutationFn: createItineraryApi,
    onSuccess: (data) => {
      console.log("CREATE_ITINERARY_SUCCESS", data);
      refetch();
      setSuccessState({
        open: true,
        title: "Itinerary created",
        message: "Your itinerary has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error("CREATE_ITINERARY_ERROR", error);
      setErrorState({
        open: true,
        title: "Failed to create itinerary",
        message: error?.message ?? "Please try again.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: Partial<ItineraryPayload>;
    }) => updateItineraryApi(id, payload),
    onSuccess: (data) => {
      console.log("UPDATE_ITINERARY_SUCCESS", data);
      setIsUpdateModalOpen(false);
      setEditingItem(null);
      setPendingUpdate(null);
      setSuccessState({
        open: true,
        title: "Itinerary updated",
        message: "Your itinerary has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error("UPDATE_ITINERARY_ERROR", error);
      setErrorState({
        open: true,
        title: "Failed to update itinerary",
        message: error?.message ?? "Please try again.",
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ItineraryPayload = {
      name: form.name,
      description: form.description,
      start_date: form.start_date,
      end_date: form.end_date,
      touristspot_id: selectedPlace?.placeId,
    };

    createMutation.mutate(payload);

    setForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    });
    setSelectedPlace(null);
    setIsModalOpen(false);
  };

  const handleOpenUpdate = (item: ItineraryItem) => {
    setEditingItem(item);
    setUpdateForm({
      name: item.name,
      description: item.description ?? "",
      start_date: item.start_date ? item.start_date.slice(0, 16) : "",
      end_date: item.end_date ? item.end_date.slice(0, 16) : "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const payload: Partial<ItineraryPayload> = {
      name: updateForm.name || undefined,
      description: updateForm.description || undefined,
      start_date: updateForm.start_date || undefined,
      end_date: updateForm.end_date || undefined,
    };

    console.log("UPDATE_ITINERARY_PAYLOAD", payload);
    setPendingUpdate({ id: editingItem.id, payload });
    setIsConfirmUpdateOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (pendingUpdate) {
      updateMutation.mutate(pendingUpdate);
    }
    setIsConfirmUpdateOpen(false);
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "No schedule";
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return `${s.toLocaleString(undefined, opts)} – ${e.toLocaleTimeString(
      undefined,
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  const handleViewDetails = (item: ItineraryItem) => {
    navigate(`/app/spot/${item?.tourist_spot?.id}`);
  };

  if (isLoading) {
    return <Loader/>
  }
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex justify-center px-4 py-5 md:mt-20">
        <div className="w-full max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-[0.18em]">
                Itinerary
              </p>
              <h1 className="text-xl md:text-3xl font-semibold mt-1">
                Your Plan Trips
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Plan and view your upcoming itineraries.
              </p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-4 shadow-sm bg-primary text-white hover:bg-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">New Itinerary</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border border-slate-200 bg-white rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-4 pb-2">
                  <DialogTitle className="text-base font-semibold">
                    Create Itinerary
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Add a new itinerary and link a tourist spot.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmit}
                  className="px-5 pb-5 pt-1 space-y-4 text-sm"
                >
                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-600">
                      Tourist Spot
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPlaceDialogOpen(true)}
                      className="w-full flex items-center justify-between gap-2 px-3 h-10 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-left text-xs text-slate-700 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="truncate">
                          {selectedPlace?.name ?? "Select a tourist spot"}
                        </span>
                      </div>
                    </button>

                    <SelectPlaceDialog
                      open={isPlaceDialogOpen}
                      onOpenChange={setIsPlaceDialogOpen}
                      onSelect={(place) => {
                        setSelectedPlace(place);
                        console.log("SELECTED_PLACE", place);
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-600">
                      Title
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Sunrise River Escape"
                      className="rounded-2xl h-9"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-slate-600">
                        Start
                      </label>
                      <Input
                        type="datetime-local"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        className="rounded-2xl h-9"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs text-slate-600">
                        End
                      </label>
                      <Input
                        type="datetime-local"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                        className="rounded-2xl h-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-600">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="What will you do on this trip?"
                      className="rounded-2xl min-h-[70px] resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-2xl px-4 bg-primary text-white hover:bg-primary/50"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending
                        ? "Saving..."
                        : "Save Itinerary"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isUpdateModalOpen}
              onOpenChange={setIsUpdateModalOpen}
            >
              <DialogContent className="max-w-lg border border-slate-200 bg-white rounded-3xl p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-4 pb-2">
                  <DialogTitle className="text-base font-semibold">
                    Update Itinerary
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Update your itinerary details.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleSubmitUpdate}
                  className="px-5 pb-5 pt-1 space-y-4 text-sm"
                >
                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-600">
                      Title
                    </label>
                    <Input
                      name="name"
                      value={updateForm.name}
                      onChange={handleUpdateChange}
                      placeholder="e.g. Updated Weekend Trip"
                      className="rounded-2xl h-9"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-slate-600">
                        Start
                      </label>
                      <Input
                        type="datetime-local"
                        name="start_date"
                        value={updateForm.start_date}
                        onChange={handleUpdateChange}
                        className="rounded-2xl h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs text-slate-600">
                        End
                      </label>
                      <Input
                        type="datetime-local"
                        name="end_date"
                        value={updateForm.end_date}
                        onChange={handleUpdateChange}
                        className="rounded-2xl h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-slate-600">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      value={updateForm.description}
                      onChange={handleUpdateChange}
                      placeholder="What will you do on this trip?"
                      className="rounded-2xl min-h-[70px] resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => setIsUpdateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-2xl px-4 bg-primary text-white hover:bg-primary/50"
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending
                        ? "Updating..."
                        : "Update Itinerary"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Upcoming Itineraries</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {data?.length} planned
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data?.map((item: any) => {
              const spotName = item.tourist_spot?.name ?? "No spot selected";
              const img =
                item.tourist_spot?.images?.[0] ?.url??
                "https://images.pexels.com/photos/2404370/pexels-photo-2404370.jpeg?auto=compress&cs=tinysrgb&w=800";

              const date = new Date(item.start_date);
              const day = date.getDate().toString().padStart(2, "0");
              const month = date.toLocaleString(undefined, {
                month: "short",
              });

              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-3xl bg-white border border-slate-200/70 shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden hover:shadow-[0_14px_40px_rgba(15,23,42,0.12)] hover:-translate-y-[2px] transition-transform transition-shadow"
                >
                  <div className="relative w-full h-28 bg-slate-200 overflow-hidden">
                    <img
                      src={img}
                      alt={spotName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute left-3 top-3 flex flex-col items-center justify-center w-12 rounded-2xl bg-white shadow-sm overflow-hidden border border-slate-200/80">
                      <div className="w-full text-[10px] text-center font-medium bg-red-500 text-white py-0.5 uppercase tracking-wide">
                        {month}
                      </div>
                      <div className="py-1 text-lg font-semibold text-slate-900 leading-none">
                        {day}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Itinerary #{item.id}
                        </span>
                        <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                          {item.name}
                        </h2>
                      </div>
                      <Badge className="rounded-full bg-primary text-white border-none text-[10px] font-normal">
                        {item.tourist_spot?.category ?? "Trip"}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                      {item.description}
                    </p>

                    <div className="mt-auto space-y-1.5 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span className="truncate">
                          {formatDateRange(item.start_date, item.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{spotName}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">
                        Itinerary No: {item.uuid.slice(0, 8)}…
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(item)}
                          className="text-[11px] text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-200 inline-flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          View details
                        </button>
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-[11px] rounded-full px-3 bg-primary hover:bg-primary/70 text-white"
                          onClick={() => handleOpenUpdate(item)}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {data?.length === 0 && (
              <div className="col-span-full text-xs text-slate-400 text-center py-6">
                No itinerary yet. Tap{" "}
                <span className="font-medium text-slate-700">
                  “New Itinerary”
                </span>{" "}
                to get started.
              </div>
            )}
          </div>
        </div>

        <SuccessDialog
          open={successState.open}
          onOpenChange={(open) =>
            setSuccessState((prev) => ({ ...prev, open }))
          }
          title={successState.title}
          description={successState.message}
        />

        <ErrorDialog
          open={errorState.open}
          onOpenChange={(open) => setErrorState((prev) => ({ ...prev, open }))}
          title={errorState.title}
          description={errorState.message}
        />

        <ConfirmDialog
          open={isConfirmUpdateOpen}
          onOpenChange={setIsConfirmUpdateOpen}
          title="Confirm update"
          description="Do you want to update this itinerary with the new details?"
          primaryLabel={
            updateMutation.isPending ? "Updating..." : "Yes, update"
          }
          secondaryLabel="Not now"
          onPrimary={handleConfirmUpdate}
          onSecondary={() => {
            setPendingUpdate(null);
          }}
        />
      </div>
    );
}
