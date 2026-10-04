import { kyoto } from "./cities/kyoto";
import { haversine } from "./geo";
import { cautiousCopy, genericTaskPair } from "./tasks";
import type { Day, PlaceTemplate, Stop } from "./types";

export function customPlace(name: string, lat: number, lng: number): PlaceTemplate {
  return {
    id: `typed-${lat.toFixed(5)}-${lng.toFixed(5)}`,
    name,
    lat,
    lng,
    uncertain: true,
    practical: "You typed this place. Check it on the street before you rely on it.",
    ...cautiousCopy(name),
    ...genericTaskPair(name),
  };
}

export function poolFor(day: Day): PlaceTemplate[] {
  if (day.bookId) {
    const book = kyoto.books.find((item) => item.id === day.bookId);
    if (book) return book.places;
  }
  return kyoto.landmarks;
}

export function nearestUnused(day: Day, stop: Stop): PlaceTemplate | null {
  const used = new Set(day.stops.map((item) => item.sourceId).filter(Boolean));
  const options = poolFor(day)
    .filter((place) => place.id !== stop.sourceId && !used.has(place.id))
    .sort((a, b) => haversine(a, stop) - haversine(b, stop));
  const nearest = options[0];
  if (!nearest || haversine(nearest, stop) > 1800) return null;
  return nearest;
}

export async function geocodeInKyoto(query: string): Promise<PlaceTemplate> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  const data = (await res.json()) as { name?: string; lat?: number; lng?: number; error?: string };
  if (!res.ok || data.lat == null || data.lng == null || !data.name) {
    throw new Error(data.error || "I couldn't find that place in Kyoto.");
  }
  return customPlace(data.name, data.lat, data.lng);
}
