import { useEffect, useState } from "react";

export interface GeoState {
  /** Full label, e.g. "Bandra West, Mumbai" */
  label: string;
  /** Short area name, e.g. "Bandra West" */
  short: string;
  coords: { lat: number; lon: number } | null;
  loading: boolean;
  denied: boolean;
}

const FALLBACK_LABEL = "Bandra, Mumbai";
const FALLBACK_SHORT = "Bandra";
const CACHE_KEY = "pawsitive_geo";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

interface GeoCache {
  label: string;
  short: string;
  lat: number;
  lon: number;
  ts: number;
}

function readCache(): GeoCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeoCache;
    return typeof parsed?.label === "string" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Real-time location: reads the device GPS via the Geolocation API and
 * reverse-geocodes to a friendly "Area, City" label. Caches for 30 min and
 * falls back to the last known (or default) location when denied/unavailable.
 */
export function useGeoLocation(): GeoState {
  const [state, setState] = useState<GeoState>({
    label: FALLBACK_LABEL,
    short: FALLBACK_SHORT,
    coords: null,
    loading: true,
    denied: false,
  });

  useEffect(() => {
    let cancelled = false;
    const cached = readCache();
    const cachedFresh = cached && Date.now() - cached.ts < CACHE_TTL ? cached : null;

    if (cachedFresh && !cancelled) {
      setState({
        label: cachedFresh.label,
        short: cachedFresh.short,
        coords: { lat: cachedFresh.lat, lon: cachedFresh.lon },
        loading: true,
        denied: false,
      });
    }

    if (!("geolocation" in navigator)) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=16`
          );
          const data = await res.json();
          const a = data?.address ?? {};
          const area: string =
            a.suburb || a.neighbourhood || a.residential || a.village || a.town || a.city_district || "";
          const city: string = a.city || a.town || a.village || a.state_district || a.state || "";
          const short = area || city || "Current Location";
          const label = city && area && area !== city ? `${area}, ${city}` : short;
          if (cancelled) return;
          setState({ label, short, coords: { lat, lon }, loading: false, denied: false });
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ label, short, lat, lon, ts: Date.now() }));
          } catch {
            /* storage full — ignore */
          }
        } catch {
          if (!cancelled) {
            setState({ label: "Current Location", short: "Nearby", coords: { lat, lon }, loading: false, denied: false });
          }
        }
      },
      () => {
        if (cancelled) return;
        setState(
          cached
            ? {
                label: cached.label,
                short: cached.short,
                coords: { lat: cached.lat, lon: cached.lon },
                loading: false,
                denied: true,
              }
            : { label: FALLBACK_LABEL, short: FALLBACK_SHORT, coords: null, loading: false, denied: true }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
