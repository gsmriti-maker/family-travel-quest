export type LatLng = { lat: number; lng: number };

const EARTH_M = 6371000;
const STREET_FACTOR = 1.32;
const METERS_PER_MIN = 4000 / 60;

export function haversine(a: LatLng, b: LatLng): number {
  const p1 = (a.lat * Math.PI) / 180;
  const p2 = (b.lat * Math.PI) / 180;
  const dp = ((b.lat - a.lat) * Math.PI) / 180;
  const dl = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dp / 2) ** 2 +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function pathLength(points: LatLng[]): number {
  let meters = 0;
  for (let i = 1; i < points.length; i++) meters += haversine(points[i - 1], points[i]);
  return meters;
}

export function maxDiameter(points: LatLng[]): number {
  let max = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      max = Math.max(max, haversine(points[i], points[j]));
    }
  }
  return max;
}

/** Straight-line legs, stretched a little for streets, at an easy walking pace. */
export function estimateMinutes(pathMeters: number): number {
  return (pathMeters * STREET_FACTOR) / METERS_PER_MIN;
}

export function estimateRoute(points: LatLng[]): { minutes: number; meters: number } {
  const crow = pathLength(points);
  const meters = Math.round(crow * STREET_FACTOR);
  return { minutes: Math.round(meters / METERS_PER_MIN), meters };
}
