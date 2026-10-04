import { estimateRoute } from "./geo";
import type { Day, RouteInfo, Stop } from "./types";

export async function fetchRoute(stops: Pick<Stop, "lat" | "lng">[]): Promise<RouteInfo> {
  const points = stops.map((stop) => ({ lat: stop.lat, lng: stop.lng }));
  if (points.length < 2) {
    return {
      minutes: points.length === 0 ? null : 0,
      meters: points.length === 0 ? null : 0,
      source: "estimate",
      line: points.map((point) => [point.lat, point.lng]),
    };
  }
  try {
    const res = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points }),
    });
    if (!res.ok) throw new Error("route");
    const data = (await res.json()) as RouteInfo;
    if (!data || !Array.isArray(data.line)) throw new Error("route");
    return data;
  } catch {
    const estimate = estimateRoute(points);
    return {
      minutes: estimate.minutes,
      meters: estimate.meters,
      source: "estimate",
      line: points.map((point) => [point.lat, point.lng]),
    };
  }
}

export async function withRoute(day: Day): Promise<Day> {
  const route = await fetchRoute(day.stops);
  return { ...day, route };
}
