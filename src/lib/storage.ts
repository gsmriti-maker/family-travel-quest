import type { Day } from "./types";

const STORAGE_KEY = "family-walk-day-v1";

export function loadDay(): Day | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Day;
    if (!data || data.version !== 1 || !data.cityLabel || !data.phase) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveDay(day: Day | null): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (!day) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(day));
    return true;
  } catch {
    return false;
  }
}
