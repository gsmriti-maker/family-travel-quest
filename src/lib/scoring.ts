import type { Boy, Day, Stop } from "./types";

export function stopCounts(stop: Stop, boyId: string): boolean {
  if (stop.manualDone) return true;
  const state = stop.boys[boyId];
  if (!state) return false;
  return state.photoCounts && state.answerAccepted;
}

export function boyScore(day: Day, boy: Boy): number {
  const fromStops = day.stops.filter((stop) => stopCounts(stop, boy.id)).length * 10;
  const kindness = day.kindness[boy.id] ? 5 : 0;
  return fromStops + kindness;
}

export function dayWinners(day: Day): Boy[] {
  if (day.boys.length === 0) return [];
  const scores = day.boys.map((boy) => boyScore(day, boy));
  const top = Math.max(...scores);
  return day.boys.filter((_, index) => scores[index] === top);
}

export function taskSlot(boy: Boy, boys: Boy[]): { band: "young" | "older"; index: 0 | 1 } {
  const peers = boys.filter((peer) => peer.ageBand === boy.ageBand);
  const found = peers.findIndex((peer) => peer.id === boy.id);
  return {
    band: boy.ageBand === "6-7" ? "young" : "older",
    index: found <= 0 ? 0 : 1,
  };
}
