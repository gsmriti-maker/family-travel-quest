import { estimateRoute } from "@/lib/geo";
import type { RouteInfo } from "@/lib/types";

type Point = { lat: number; lng: number };

export async function POST(req: Request) {
  const body = (await req.json()) as { points?: Point[] };
  const points = Array.isArray(body.points) ? body.points.filter(validPoint) : [];
  if (points.length < 2) {
    const empty: RouteInfo = {
      minutes: points.length === 0 ? null : 0,
      meters: points.length === 0 ? null : 0,
      source: "estimate",
      line: points.map((point) => [point.lat, point.lng]),
    };
    return Response.json(empty);
  }

  const path = points.map((point) => `${point.lng},${point.lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/foot/${path}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "FamilyWalk/1.0 (Kyoto family walking day)" } });
    if (!res.ok) throw new Error("osrm");
    const data = (await res.json()) as {
      routes?: { duration: number; distance: number; geometry: { coordinates: [number, number][] } }[];
    };
    const route = data.routes?.[0];
    if (!route) throw new Error("osrm");
    const meters = Math.round(route.distance);
    // The public foot router often reports a racing pace. Time the street distance at an easy walk.
    const minutes = Math.max(1, Math.round(meters / (4000 / 60)));
    const payload: RouteInfo = {
      minutes,
      meters,
      source: "streets",
      line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    };
    return Response.json(payload);
  } catch {
    const estimate = estimateRoute(points);
    const payload: RouteInfo = {
      minutes: estimate.minutes,
      meters: estimate.meters,
      source: "estimate",
      line: points.map((point) => [point.lat, point.lng]),
    };
    return Response.json(payload);
  }
}

function validPoint(point: Point): boolean {
  return Number.isFinite(point?.lat) && Number.isFinite(point?.lng);
}
