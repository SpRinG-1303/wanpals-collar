/** Real GPS trail: points are only added from actual device positions. */
export interface TrailPoint {
  t: number;
  lat: number;
  lon: number;
  label?: string;
}

const KEY = "mooomentum.locationTrail.v1";
const MAX = 200;
const MIN_MOVE_KM = 0.05;

export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function readTrail(): TrailPoint[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as TrailPoint[];
  } catch {
    return [];
  }
}

/** Returns the updated trail if the point was recorded, otherwise null. */
export function recordPoint(lat: number, lon: number, label?: string): TrailPoint[] | null {
  const trail = readTrail();
  const last = trail[trail.length - 1];
  if (last && distanceKm(last, { lat, lon }) < MIN_MOVE_KM) return null;
  const next = [...trail, { t: Date.now(), lat, lon, label }].slice(-MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* ignore */ }
  return next;
}
