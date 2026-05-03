/**
 * Mapbox Directions + Geocoding helpers.
 * Coordinates: { lat, lng }; Mapbox URLs use lng,lat order.
 */

export type MapboxTransportMode = "driving" | "walking" | "cycling";

export function getMapboxAccessToken(): string {
  return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
}

export function toLngLatPair(c: {
  lat: number;
  lng: number;
}): [number, number] {
  return [c.lng, c.lat];
}

export function formatDistanceKm(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return "—";
  const km = meters / 1000;
  const decimals = km >= 100 ? 0 : km >= 10 ? 1 : 2;
  return `${km.toFixed(decimals)} km`;
}

/** e.g. "11 min" or "1 hr 30 min" */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const totalMin = Math.round(seconds / 60);
  if (totalMin < 60) return `${totalMin} min`;
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

export function formatRouteSummaryLine(
  durationLabel: string,
  distanceLabel: string,
): string {
  return `${durationLabel} (${distanceLabel})`;
}

export type LineStringGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

export type DirectionsRouteResult = {
  geometry: LineStringGeometry;
  distanceM: number;
  durationS: number;
};

export async function geocodeForward(
  query: string,
  signal?: AbortSignal,
): Promise<{ lng: number; lat: number } | null> {
  const token = getMapboxAccessToken();
  const q = query.trim();
  if (!q) return null;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    q,
  )}.json?access_token=${token}&limit=1`;

  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const data = await res.json();
  const center = data?.features?.[0]?.center as [number, number] | undefined;
  if (!center) return null;
  return { lng: center[0], lat: center[1] };
}

export async function fetchDirectionsRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  profile: MapboxTransportMode,
  signal?: AbortSignal,
): Promise<
  { ok: true; route: DirectionsRouteResult } | { ok: false; message: string }
> {
  const token = getMapboxAccessToken();
  const a = toLngLatPair(from);
  const b = toLngLatPair(to);
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${a[0]},${a[1]};${b[0]},${b[1]}?geometries=geojson&overview=full&access_token=${token}`;

  const res = await fetch(url, { signal });
  const data = await res.json();

  if (!res.ok) {
    const msg =
      typeof data?.message === "string"
        ? data.message
        : "Directions request failed.";
    return { ok: false, message: msg };
  }

  if (!data.routes?.length) {
    const msg =
      typeof data?.message === "string" && data.message.length > 0
        ? data.message
        : "No route found between these points.";
    return { ok: false, message: msg };
  }

  const route = data.routes[0];
  const geometry = route.geometry as LineStringGeometry | undefined;
  if (!geometry?.coordinates?.length) {
    return { ok: false, message: "No route geometry returned." };
  }

  return {
    ok: true,
    route: {
      geometry,
      distanceM: Number(route.distance),
      durationS: Number(route.duration),
    },
  };
}
