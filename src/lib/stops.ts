import type { Boy, BoyStopState, PlaceTemplate, RouteInfo, Stop } from "./types";
import { genericTaskPair } from "./tasks";

export function blankBoyState(): BoyStopState {
  return {
    photoCounts: false,
    photoDecided: false,
    answerAccepted: false,
  };
}

export function makeStop(place: PlaceTemplate, boys: Boy[]): Stop {
  const tasks =
    place.young && place.older
      ? { young: place.young, older: place.older }
      : genericTaskPair(place.name);
  const boyState: Stop["boys"] = {};
  for (const boy of boys) boyState[boy.id] = blankBoyState();
  return {
    id: crypto.randomUUID(),
    sourceId: place.id,
    name: place.name,
    lat: place.lat,
    lng: place.lng,
    uncertain: Boolean(place.uncertain),
    scene: place.scene,
    history: place.history,
    reflection: place.reflection,
    practical: place.practical ?? "",
    young: tasks.young,
    older: tasks.older,
    opened: false,
    manualDone: false,
    boys: boyState,
  };
}

export function emptyRoute(): RouteInfo {
  return { minutes: null, meters: null, source: null, line: [] };
}
