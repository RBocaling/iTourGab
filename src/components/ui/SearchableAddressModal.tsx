// src/components/SearchableAddressModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X as XIcon, Search as SearchIcon, ChevronRight } from "lucide-react";
import {
  useProvinces,
  useCitiesMunicipalities,
  useBarangays,
} from "@/hooks/usePSGC";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Province = { code: string; name: string };
type City = { code: string; name: string };
type Barangay = { code: string; name: string };

export type SelectedAddress = {
  province?: { code: string; name: string };
  city?: { code: string; name: string };
  barangay?: { code: string; name: string };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (value: SelectedAddress) => void;
  initial?: SelectedAddress;
  title?: string;
};

const panelVariants = {
  hidden: { y: "6%", opacity: 0, scale: 0.995 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.18 } },
  exit: { y: "6%", opacity: 0, scale: 0.995, transition: { duration: 0.12 } },
};

export default function SearchableAddressModal({
  open,
  onClose,
  onSelect,
  initial,
  title = "Select address",
}: Props) {
  const provincesQ = useProvinces();
  const [provinceQuery, setProvinceQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [barangayQuery, setBarangayQuery] = useState("");

  const [selectedProvince, setSelectedProvince] = useState<
    Province | undefined
  >(initial?.province);
  const [selectedCity, setSelectedCity] = useState<City | undefined>(
    initial?.city
  );
  const [selectedBarangay, setSelectedBarangay] = useState<
    Barangay | undefined
  >(initial?.barangay);

  const [showProvinceList, setShowProvinceList] = useState(true);
  const [showCityList, setShowCityList] = useState(false);
  const [showBarangayList, setShowBarangayList] = useState(false);

  const citiesQ = useCitiesMunicipalities(selectedProvince?.code ?? null);
  const barangaysQ = useBarangays(selectedCity?.code ?? null);

  // initialize from `initial` whenever modal opens
  useEffect(() => {
    if (open) {
      setSelectedProvince(initial?.province);
      setSelectedCity(initial?.city);
      setSelectedBarangay(initial?.barangay);

      // reset filters / lists to sensible defaults
      setProvinceQuery("");
      setCityQuery("");
      setBarangayQuery("");
      setShowProvinceList(true);
      setShowCityList(false);
      setShowBarangayList(false);

      // if initial has province -> show collapsed province (so user can Reselect)
      if (initial?.province) setShowProvinceList(false);
      if (initial?.city) setShowCityList(false);
      if (initial?.barangay) setShowBarangayList(false);
    } else {
      // when closing, keep state cleared to avoid leakage
      setProvinceQuery("");
      setCityQuery("");
      setBarangayQuery("");
      setShowProvinceList(true);
      setShowCityList(false);
      setShowBarangayList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    initial?.province?.code,
    initial?.city?.code,
    initial?.barangay?.code,
  ]);

  // if user changes province, reset dependent values
  useEffect(() => {
    setSelectedCity(undefined);
    setSelectedBarangay(undefined);
    setCityQuery("");
    setBarangayQuery("");
    setShowCityList(false);
    setShowBarangayList(false);
  }, [selectedProvince]);

  // if user changes city, reset barangay
  useEffect(() => {
    setSelectedBarangay(undefined);
    setBarangayQuery("");
    setShowBarangayList(false);
  }, [selectedCity]);

  const provinces = provincesQ.data ?? [];
  const filteredProvinces = useMemo(
    () =>
      provinces.filter((p) =>
        p.name.toLowerCase().includes(provinceQuery.trim().toLowerCase())
      ),
    [provinceQuery, provinces]
  );

  const cities = citiesQ.data ?? [];
  const filteredCities = useMemo(
    () =>
      cities.filter((c) =>
        c.name.toLowerCase().includes(cityQuery.trim().toLowerCase())
      ),
    [cityQuery, cities]
  );

  const barangays = barangaysQ.data ?? [];
  const filteredBarangays = useMemo(
    () =>
      barangays.filter((b) =>
        b.name.toLowerCase().includes(barangayQuery.trim().toLowerCase())
      ),
    [barangayQuery, barangays]
  );

  const handleConfirm = () => {
    onSelect({
      province: selectedProvince
        ? { code: selectedProvince.code, name: selectedProvince.name }
        : undefined,
      city: selectedCity
        ? { code: selectedCity.code, name: selectedCity.name }
        : undefined,
      barangay: selectedBarangay
        ? { code: selectedBarangay.code, name: selectedBarangay.name }
        : undefined,
    });
    // close from parent (Dialog onOpenChange will call onClose)
    onClose();
  };

  // Render as Dialog to use your app's modal behaviour
  return (
    <Dialog
      open={open}
      // When dialog requests to close (click outside or Esc), call onClose
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden">
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white/95 dark:bg-slate-900/90"
        >
          <div className="px-4 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{title}</div>
              <div className="text-xs text-muted-foreground">
                Choose province → city → barangay
              </div>
            </div>
            <button
              onClick={() => onClose()}
              aria-label="Close"
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Province */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Province
              </label>

              {selectedProvince && !showProvinceList ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{selectedProvince.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedProvince.code}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <button
                      onClick={() => {
                        setShowProvinceList(true);
                        setProvinceQuery("");
                      }}
                      className="px-3 py-2 rounded-lg border text-sm"
                    >
                      Reselect
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <SearchIcon className="w-4 h-4" />
                    </span>
                    <input
                      value={provinceQuery}
                      onChange={(e) => setProvinceQuery(e.target.value)}
                      placeholder="Search province..."
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Search province"
                    />
                  </div>

                  <div className="max-h-48 mt-3 overflow-auto space-y-1">
                    {provincesQ.isLoading && (
                      <div className="text-sm text-muted-foreground p-2">
                        Loading provinces…
                      </div>
                    )}
                    {provincesQ.isError && (
                      <div className="text-sm text-red-400 p-2">
                        Failed to load provinces
                      </div>
                    )}
                    {!provincesQ.isLoading &&
                      filteredProvinces.length === 0 && (
                        <div className="text-sm text-muted-foreground p-2">
                          No provinces found
                        </div>
                      )}
                    {filteredProvinces.map((p) => {
                      const active = selectedProvince?.code === p.code;
                      return (
                        <button
                          key={p.code}
                          onClick={() => {
                            setSelectedProvince({ code: p.code, name: p.name });
                            setShowProvinceList(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                            active
                              ? "bg-primary/10 ring-1 ring-primary"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {p.code}
                            </div>
                          </div>
                          {active && <ChevronRight className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* City/Municipality */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                City / Municipality
              </label>

              {!selectedProvince ? (
                <div className="text-sm text-muted-foreground p-2">
                  Select a province first
                </div>
              ) : selectedCity && !showCityList ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{selectedCity.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedCity.code}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <button
                      onClick={() => {
                        setShowCityList(true);
                        setCityQuery("");
                      }}
                      className="px-3 py-2 rounded-lg border text-sm"
                    >
                      Reselect
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <SearchIcon className="w-4 h-4" />
                    </span>
                    <input
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      placeholder={
                        selectedProvince
                          ? "Search city/municipality..."
                          : "Select province first"
                      }
                      disabled={!selectedProvince}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                      aria-label="Search city or municipality"
                    />
                  </div>

                  <div className="max-h-48 mt-3 overflow-auto space-y-1">
                    {citiesQ.isLoading && (
                      <div className="text-sm text-muted-foreground p-2">
                        Loading cities…
                      </div>
                    )}
                    {citiesQ.isError && (
                      <div className="text-sm text-red-400 p-2">
                        Failed to load cities
                      </div>
                    )}
                    {!citiesQ.isLoading && filteredCities.length === 0 && (
                      <div className="text-sm text-muted-foreground p-2">
                        No cities found
                      </div>
                    )}
                    {filteredCities.map((c) => {
                      const active = selectedCity?.code === c.code;
                      return (
                        <button
                          key={c.code}
                          onClick={() => {
                            setSelectedCity({ code: c.code, name: c.name });
                            setShowCityList(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                            active
                              ? "bg-primary/10 ring-1 ring-primary"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {c.code}
                            </div>
                          </div>
                          {active && <ChevronRight className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Barangay */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Barangay
              </label>

              {!selectedCity ? (
                <div className="text-sm text-muted-foreground p-2">
                  Select a city first
                </div>
              ) : selectedBarangay && !showBarangayList ? (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium">{selectedBarangay.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedBarangay.code}
                    </div>
                  </div>
                  <div className="flex gap-2 items-start">
                    <button
                      onClick={() => {
                        setShowBarangayList(true);
                        setBarangayQuery("");
                      }}
                      className="px-3 py-2 rounded-lg border text-sm"
                    >
                      Reselect
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <SearchIcon className="w-4 h-4" />
                    </span>
                    <input
                      value={barangayQuery}
                      onChange={(e) => setBarangayQuery(e.target.value)}
                      placeholder={
                        selectedCity
                          ? "Search barangay..."
                          : "Select city first"
                      }
                      disabled={!selectedCity}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                      aria-label="Search barangay"
                    />
                  </div>

                  <div className="max-h-48 mt-3 overflow-auto space-y-1">
                    {barangaysQ.isLoading && (
                      <div className="text-sm text-muted-foreground p-2">
                        Loading barangays…
                      </div>
                    )}
                    {barangaysQ.isError && (
                      <div className="text-sm text-red-400 p-2">
                        Failed to load barangays
                      </div>
                    )}
                    {!barangaysQ.isLoading &&
                      filteredBarangays.length === 0 && (
                        <div className="text-sm text-muted-foreground p-2">
                          No barangays found
                        </div>
                      )}
                    {filteredBarangays.map((b) => {
                      const active = selectedBarangay?.code === b.code;
                      return (
                        <button
                          key={b.code}
                          onClick={() => {
                            setSelectedBarangay({ code: b.code, name: b.name });
                            setShowBarangayList(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                            active
                              ? "bg-primary/10 ring-1 ring-primary"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{b.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {b.code}
                            </div>
                          </div>
                          {active && <ChevronRight className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Selected codes row */}
            <div className="text-xs text-muted-foreground px-1">
              <div>
                <span className="font-medium">Province code:</span>{" "}
                <span>{selectedProvince?.code ?? "-"}</span>
              </div>
              <div>
                <span className="font-medium">City code:</span>{" "}
                <span>{selectedCity?.code ?? "-"}</span>
              </div>
              <div>
                <span className="font-medium">Barangay code:</span>{" "}
                <span>{selectedBarangay?.code ?? "-"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (selectedBarangay) setSelectedBarangay(undefined);
                  else if (selectedCity) setSelectedCity(undefined);
                  else if (selectedProvince) {
                    setSelectedProvince(undefined);
                    setShowProvinceList(true);
                  } else onClose();
                }}
                className="px-4 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-800"
              >
                Back
              </button>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => onClose()}
                  className="px-4 py-2 rounded-lg text-sm bg-transparent text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedProvince}
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    selectedProvince
                      ? "bg-primary text-white"
                      : "bg-primary/30 text-white/70 cursor-not-allowed"
                  }`}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
