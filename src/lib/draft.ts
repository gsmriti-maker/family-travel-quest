import { kyoto } from "./cities/kyoto";
import { fetchRoute } from "./route-client";
import { clusterOptions } from "./select-stops";
import { emptyRoute, makeStop } from "./stops";
import type { Boy, Day, Mode, PlaceTemplate, RouteInfo } from "./types";

export const KYOTO_CENTER = { lat: 35.0116, lng: 135.7681 };

function scoreRoute(minutes: number | null): number {
  if (minutes == null) return 1000;
  if (minutes < 60) return (60 - minutes) * 5 + 8;
  if (minutes > 120) return (minutes - 120) * 5 + 8;
  return Math.abs(minutes - 85);
}

async function choosePlaces(pool: PlaceTemplate[], count: number): Promise<{
  places: PlaceTemplate[];
  route: RouteInfo;
}> {
  const ranked = clusterOptions(pool, Math.min(count, pool.length));
  let places = ranked[0] ?? [];
  let route = await fetchRoute(places);
  let best = scoreRoute(route.minutes);
  for (const alt of ranked.slice(1)) {
    const nextRoute = await fetchRoute(alt);
    const score = scoreRoute(nextRoute.minutes);
    if (score < best) {
      places = alt;
      route = nextRoute;
      best = score;
    }
    if (nextRoute.minutes != null && nextRoute.minutes >= 70 && nextRoute.minutes <= 100) break;
  }
  return { places, route };
}

export function createShell(input: { mode: Mode; stopCount: number; boys: Boy[] }): Day {
  return {
    version: 1,
    phase: input.mode === "adult" ? "shelf" : "drafting",
    cityInput: "Kyoto",
    cityLabel: "Kyoto",
    cityKey: "kyoto",
    center: KYOTO_CENTER,
    mode: input.mode,
    stopCount: input.stopCount,
    boys: input.boys,
    bookId: null,
    bookTitle: null,
    note: null,
    stops: [],
    kindness: {},
    route: emptyRoute(),
  };
}

export async function draftDay(day: Day, bookId: string | null): Promise<Day> {
  const book = bookId ? (kyoto.books.find((item) => item.id === bookId) ?? null) : null;
  const pool = book ? book.places : kyoto.landmarks;
  let count = Math.min(day.stopCount, pool.length);
  let { places, route } = await choosePlaces(pool, count);
  while (route.minutes != null && route.minutes > 130 && count > 2) {
    count -= 1;
    const smaller = await choosePlaces(pool, count);
    if (smaller.route.minutes == null || smaller.route.minutes >= (route.minutes ?? Infinity)) break;
    places = smaller.places;
    route = smaller.route;
  }
  const notes: string[] = [];
  if (pool.length < day.stopCount) {
    notes.push(
      `${book ? "This book" : "This walk"} has ${pool.length} ${pool.length === 1 ? "place" : "places"} I can point to. I won't invent more to fill ${day.stopCount}.`,
    );
  }
  if (places.length < Math.min(day.stopCount, pool.length)) {
    notes.push("A far place stayed off this draft so the walk would not run past two hours.");
  }
  if (places.some((place) => place.uncertain)) {
    notes.push("Anything marked Check this is not a sure address. Rewrite it before you go.");
  }
  return {
    ...day,
    phase: "editor",
    bookId: book?.id ?? null,
    bookTitle: book ? book.title : day.mode === "kids" ? "One trail" : "Places and history",
    note: notes.length ? notes.join(" ") : null,
    stops: places.map((place) => makeStop(place, day.boys)),
    route,
  };
}
