// src/components/ItineraryIOS.tsx
import React, { useEffect, useState } from "react";
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
import { Calendar, MapPin, Plus, Clock, Map, Navigation } from "lucide-react";
import RouteMap from "@/components/map/RouteMap";
import {
  fetchDirectionsRoute,
  formatDistanceKm,
  formatDuration,
  formatRouteSummaryLine,
  type MapboxTransportMode,
} from "@/lib/mapboxDirections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectPlaceDialog from "@/components/ui/SelectPlaceDialog";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createItineraryApi, updateItineraryApi } from "@/api/iteneraryApi";
import { ItineraryPayload, type ItineraryRaw } from "@/types/iteneary";
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
  tourist_spot?: (TouristSpot & {
    coordinates?: { lat?: number; lng?: number } | null;
  }) | null;
};

function coordsFromItinerarySpot(row: ItineraryRaw): {
  lat: number;
  lng: number;
} | null {
  const c = row.tourist_spot?.coordinates;
  if (!c) return null;
  const lat = Number(c.lat);
  const lng = Number(c.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

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

  const [routeMapOpen, setRouteMapOpen] = useState(false);
  const [routeFromId, setRouteFromId] = useState<string>("");
  const [routeToId, setRouteToId] = useState<string>("");
  const [itineraryRouteProfile, setItineraryRouteProfile] =
    useState<MapboxTransportMode>("driving");
  const [itineraryRouteLegs, setItineraryRouteLegs] = useState<
    Partial<
      Record<
        MapboxTransportMode,
        { durationLabel: string; distanceLabel: string }
      >
    >
  >({});
  const [itineraryDirectionsError, setItineraryDirectionsError] = useState<
    string | null
  >(null);
  const [itineraryMapError, setItineraryMapError] = useState<string | null>(
    null,
  );
  const [itineraryRoutesLoading, setItineraryRoutesLoading] = useState(false);

  const { data, refetch , isLoading} = useGetItineraries();

  useEffect(() => {
    if (!routeMapOpen || !data?.length) return;
    const ranked = data.filter((row) => coordsFromItinerarySpot(row));
    if (ranked.length >= 2) {
      setRouteFromId(String(ranked[0].id));
      setRouteToId(String(ranked[1].id));
    } else if (ranked.length === 1) {
      setRouteFromId(String(ranked[0].id));
      setRouteToId(String(ranked[0].id));
    } else {
      setRouteFromId("");
      setRouteToId("");
    }
  }, [routeMapOpen, data]);

  useEffect(() => {
    if (!routeMapOpen) {
      setItineraryRouteLegs({});
      setItineraryDirectionsError(null);
      setItineraryMapError(null);
      setItineraryRoutesLoading(false);
      return;
    }
    if (!data?.length) return;

    const fromRow = data.find((r) => String(r.id) === routeFromId);
    const toRow = data.find((r) => String(r.id) === routeToId);
    const fromCoords = fromRow ? coordsFromItinerarySpot(fromRow) : null;
    const toCoords = toRow ? coordsFromItinerarySpot(toRow) : null;
    const same =
      Boolean(routeFromId && routeToId) && routeFromId === routeToId;

    if (!fromCoords || !toCoords || same) {
      setItineraryRouteLegs({});
      setItineraryDirectionsError(null);
      setItineraryMapError(null);
      setItineraryRoutesLoading(false);
      return;
    }

    const ac = new AbortController();
    const modes: MapboxTransportMode[] = ["driving", "walking", "cycling"];
    setItineraryDirectionsError(null);
    setItineraryRoutesLoading(true);

    (async () => {
      const next: Partial<
        Record<
          MapboxTransportMode,
          { durationLabel: string; distanceLabel: string }
        >
      > = {};
      let anyOk = false;
      for (const m of modes) {
        const r = await fetchDirectionsRoute(
          fromCoords,
          toCoords,
          m,
          ac.signal,
        );
        if (ac.signal.aborted) return;
        if (r.ok) {
          anyOk = true;
          next[m] = {
            distanceLabel: formatDistanceKm(r.route.distanceM),
            durationLabel: formatDuration(r.route.durationS),
          };
        }
      }
      if (ac.signal.aborted) return;
      setItineraryRouteLegs(next);
      setItineraryRoutesLoading(false);
      if (!anyOk) {
        setItineraryDirectionsError(
          "No route found between these points. Try different itineraries.",
        );
      } else {
        setItineraryDirectionsError(null);
      }
    })();

    return () => {
      ac.abort();
      setItineraryRoutesLoading(false);
    };
  }, [routeMapOpen, data, routeFromId, routeToId]);

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

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-4 shadow-sm border-slate-200 bg-white text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                onClick={() => setRouteMapOpen(true)}
              >
                <Map className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  View Map
                </span>
                <span className="text-sm font-medium sm:hidden">Map</span>
              </Button>
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
            </div>
          </div>

            <Dialog open={routeMapOpen} onOpenChange={setRouteMapOpen}>
              <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-0 gap-0">
                <DialogHeader className="px-5 pt-4 pb-2 border-b border-slate-100">
                  <DialogTitle className="text-base font-semibold">
                    Route between itineraries
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Choose two plans that are linked to tourist spots with
                    coordinates. The route updates when you change From, To, or
                    travel mode.
                  </DialogDescription>
                </DialogHeader>
                <div className="px-5 py-4 space-y-4">
                  {(() => {
                    const routable = (data ?? []).filter((row) =>
                      coordsFromItinerarySpot(row),
                    );
                    if (routable.length === 0) {
                      return (
                        <p className="text-sm text-slate-600">
                          None of your itineraries have a linked spot with map
                          coordinates. Create or edit an itinerary and pick a
                          place from the catalog so routing can use live{" "}
                          <code className="text-xs bg-slate-100 px-1 rounded">
                            lat
                          </code>{" "}
                          /{" "}
                          <code className="text-xs bg-slate-100 px-1 rounded">
                            lng
                          </code>{" "}
                          from the API.
                        </p>
                      );
                    }
                    const fromRow = data?.find(
                      (r) => String(r.id) === routeFromId,
                    );
                    const toRow = data?.find((r) => String(r.id) === routeToId);
                    const fromCoords = fromRow
                      ? coordsFromItinerarySpot(fromRow)
                      : null;
                    const toCoords = toRow
                      ? coordsFromItinerarySpot(toRow)
                      : null;
                    const same = routeFromId && routeToId && routeFromId === routeToId;

                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-600">
                              From itinerary
                            </label>
                            <Select
                              value={routeFromId || undefined}
                              onValueChange={setRouteFromId}
                            >
                              <SelectTrigger className="rounded-2xl h-10 text-sm">
                                <SelectValue placeholder="Select start" />
                              </SelectTrigger>
                              <SelectContent>
                                {(data ?? []).map((row) => {
                                  const ok = coordsFromItinerarySpot(row);
                                  return (
                                    <SelectItem
                                      key={row.id}
                                      value={String(row.id)}
                                      disabled={!ok}
                                    >
                                      {row.name} —{" "}
                                      {row.tourist_spot?.name ?? "No spot"}
                                      {!ok ? " (no coordinates)" : ""}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-600">
                              To itinerary
                            </label>
                            <Select
                              value={routeToId || undefined}
                              onValueChange={setRouteToId}
                            >
                              <SelectTrigger className="rounded-2xl h-10 text-sm">
                                <SelectValue placeholder="Select end" />
                              </SelectTrigger>
                              <SelectContent>
                                {(data ?? []).map((row) => {
                                  const ok = coordsFromItinerarySpot(row);
                                  return (
                                    <SelectItem
                                      key={row.id}
                                      value={String(row.id)}
                                      disabled={!ok}
                                    >
                                      {row.name} —{" "}
                                      {row.tourist_spot?.name ?? "No spot"}
                                      {!ok ? " (no coordinates)" : ""}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              ["driving", "🚗", "Driving"],
                              ["walking", "🚶", "Walking"],
                              ["cycling", "🚲", "Cycling"],
                            ] as const
                          ).map(([mode, icon, label]) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() =>
                                setItineraryRouteProfile(
                                  mode as MapboxTransportMode,
                                )
                              }
                              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                                itineraryRouteProfile === mode
                                  ? "bg-primary text-white border-primary"
                                  : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                              }`}
                            >
                              <span className="mr-1">{icon}</span>
                              {label}
                            </button>
                          ))}
                        </div>

                        {same && (
                          <p className="text-sm text-amber-700">
                            Choose two different itineraries to see a route
                            between two places.
                          </p>
                        )}

                        <div className="h-[min(420px,50vh)] min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                          {fromCoords &&
                          toCoords &&
                          !same ? (
                            <RouteMap
                              fromCoordinates={fromCoords}
                              toCoordinates={toCoords}
                              fromLabel={
                                fromRow?.tourist_spot?.name ??
                                fromRow?.name ??
                                "From"
                              }
                              toLabel={
                                toRow?.tourist_spot?.name ??
                                toRow?.name ??
                                "To"
                              }
                              profile={itineraryRouteProfile}
                              onRouteError={setItineraryMapError}
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-sm text-slate-500 px-6 text-center">
                              {same
                                ? "Select two different itineraries with coordinates."
                                : "Select From and To itineraries that include coordinates."}
                            </div>
                          )}
                        </div>

                        {itineraryRoutesLoading &&
                          fromCoords &&
                          toCoords &&
                          !same && (
                            <p className="text-xs text-slate-500 text-center">
                              Calculating routes for all travel modes…
                            </p>
                          )}

                        {itineraryMapError && fromCoords && toCoords && !same && (
                          <p className="text-sm text-amber-700">
                            {itineraryMapError}
                          </p>
                        )}

                        {itineraryDirectionsError &&
                          !Object.keys(itineraryRouteLegs).length &&
                          fromCoords &&
                          toCoords &&
                          !same &&
                          !itineraryRoutesLoading && (
                            <p className="text-sm text-amber-700">
                              {itineraryDirectionsError}
                            </p>
                          )}

                        {!!Object.keys(itineraryRouteLegs).length &&
                          fromCoords &&
                          toCoords &&
                          !same && (
                            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
                              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Route overview
                                </h3>
                                {itineraryRouteLegs[itineraryRouteProfile] && (
                                  <div className="text-lg font-semibold text-emerald-600">
                                    {formatRouteSummaryLine(
                                      itineraryRouteLegs[
                                        itineraryRouteProfile
                                      ]!.durationLabel,
                                      itineraryRouteLegs[
                                        itineraryRouteProfile
                                      ]!.distanceLabel,
                                    )}
                                    <span className="ml-2 text-sm font-normal text-slate-500">
                                      ·{" "}
                                      {itineraryRouteProfile === "driving"
                                        ? "Driving"
                                        : itineraryRouteProfile === "walking"
                                          ? "Walking"
                                          : "Cycling"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="grid gap-3">
                                {(
                                  [
                                    [
                                      "walking",
                                      "🚶",
                                      "Walking",
                                      "Slower, scenic",
                                    ],
                                    [
                                      "cycling",
                                      "🚲",
                                      "Cycling",
                                      "Bike-friendly paths",
                                    ],
                                    [
                                      "driving",
                                      "🚗",
                                      "Driving",
                                      "Fastest door-to-door",
                                    ],
                                  ] as const
                                ).map(([mode, icon, title, sub]) => {
                                  const leg = itineraryRouteLegs[mode];
                                  const active = itineraryRouteProfile === mode;
                                  return (
                                    <button
                                      key={mode}
                                      type="button"
                                      onClick={() =>
                                        setItineraryRouteProfile(
                                          mode as MapboxTransportMode,
                                        )
                                      }
                                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                                        active
                                          ? "border-primary/40 bg-primary/15 ring-1 ring-primary/30"
                                          : "border-slate-200/80 bg-white/70 hover:bg-white"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-lg">
                                          {icon}
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-slate-900">
                                            {title}
                                          </p>
                                          <p className="text-xs text-slate-500">
                                            {sub}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p
                                          className={`text-lg font-bold ${
                                            mode === "driving" && leg
                                              ? "text-emerald-600"
                                              : "text-slate-900"
                                          }`}
                                        >
                                          {leg?.durationLabel ?? "—"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          {leg?.distanceLabel ?? "No route"}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-3">
                                <div className="flex items-start gap-2">
                                  <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <div className="text-sm">
                                    <p className="font-semibold text-primary">
                                      From:{" "}
                                      {fromRow?.tourist_spot?.name ??
                                        fromRow?.name ??
                                        "—"}
                                    </p>
                                    <p className="text-slate-600">
                                      To:{" "}
                                      {toRow?.tourist_spot?.name ??
                                        toRow?.name ??
                                        "—"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    );
                  })()}
                </div>
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
