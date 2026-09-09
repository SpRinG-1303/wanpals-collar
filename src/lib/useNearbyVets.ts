import { useEffect, useState } from "react";
import { useGeoLocation } from "@/lib/useGeoLocation";

export type NearbyVet = {
  jp: string;
  en: string;
  rating: number; // 0 = unknown (real data has no rating)
  km: number;
  open: boolean;
  em: boolean;
  lat: number;
  lon: number;
  address?: string;
  real: true;
};

const CACHE_KEY = "momentum-nearby-vets";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useNearbyVets() {
  const geo = useGeoLocation();
  const [vets, setVets] = useState<NearbyVet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!geo.coords) return;
    const { lat, lon } = geo.coords;

    // Use cache when the user hasn't moved far
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (
          Date.now() - cached.at < CACHE_TTL &&
          haversineKm(lat, lon, cached.lat, cached.lon) < 1
        ) {
          setVets(
            cached.vets.map((v: NearbyVet) => ({
              ...v,
              km: Math.round(haversineKm(lat, lon, v.lat, v.lon) * 10) / 10,
            }))
          );
          return;
        }
      }
    } catch { /* ignore */ }

    let cancelled = false;
    setLoading(true);
    const query = `[out:json][timeout:15];(node["amenity"="veterinary"](around:6000,${lat},${lon});way["amenity"="veterinary"](around:6000,${lat},${lon}););out center 25;`;
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (cancelled) return;
        const found: NearbyVet[] = (json.elements ?? [])
          .map((el: any) => {
            const vLat = el.lat ?? el.center?.lat;
            const vLon = el.lon ?? el.center?.lon;
            if (vLat == null || vLon == null) return null;
            const name = el.tags?.name || el.tags?.["name:en"] || "Veterinary Clinic";
            const addr = [el.tags?.["addr:street"], el.tags?.["addr:city"]]
              .filter(Boolean)
              .join(", ");
            return {
              jp: name,
              en: name,
              rating: 0,
              km: Math.round(haversineKm(lat, lon, vLat, vLon) * 10) / 10,
              open: true,
              em: /24\s*(x|×|\*)\s*7|24\/7|24 hours/i.test(el.tags?.opening_hours ?? ""),
              lat: vLat,
              lon: vLon,
              address: addr || undefined,
              real: true as const,
            };
          })
          .filter(Boolean)
          .sort((a: NearbyVet, b: NearbyVet) => a.km - b.km)
          .slice(0, 20);
        setVets(found);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), lat, lon, vets: found }));
        } catch { /* ignore */ }
      })
      .catch(() => { /* keep previous/mock */ })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [geo.coords?.lat, geo.coords?.lon]);

  return { vets, loading };
}
