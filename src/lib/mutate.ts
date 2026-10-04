import type { Boy, Day, McTask, Stop, WriteTask } from "./types";
import { taskSlot } from "./scoring";
import { blankBoyState } from "./stops";

export function patchStop(day: Day, id: string, fn: (stop: Stop) => Stop): Day {
  return {
    ...day,
    stops: day.stops.map((stop) => (stop.id === id ? fn(stop) : stop)),
  };
}

export function moveStop(day: Day, id: string, direction: -1 | 1): Day {
  const index = day.stops.findIndex((stop) => stop.id === id);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= day.stops.length) return day;
  const stops = day.stops.slice();
  const [item] = stops.splice(index, 1);
  stops.splice(next, 0, item);
  return { ...day, stops };
}

export function deleteStop(day: Day, id: string): Day {
  if (day.stops.length <= 1) return day;
  return { ...day, stops: day.stops.filter((stop) => stop.id !== id) };
}

export function replaceStop(day: Day, id: string, next: Stop): Day {
  return {
    ...day,
    stops: day.stops.map((stop) => (stop.id === id ? { ...next, id: stop.id } : stop)),
  };
}

function boyPatch(stop: Stop, boyId: string, patch: Partial<Stop["boys"][string]>): Stop {
  const current = stop.boys[boyId] ?? blankBoyState();
  return { ...stop, boys: { ...stop.boys, [boyId]: { ...current, ...patch } } };
}

export function setPhoto(
  day: Day,
  stopId: string,
  boyId: string,
  photoDataUrl: string,
  verdict: Stop["boys"][string]["verdict"],
  verdictSentence: string,
): Day {
  return patchStop(day, stopId, (stop) =>
    boyPatch(stop, boyId, {
      photoDataUrl,
      verdict,
      verdictSentence,
      photoCounts: false,
      photoDecided: false,
    }),
  );
}

export function setPhotoCounts(day: Day, stopId: string, boyId: string, counts: boolean): Day {
  return patchStop(day, stopId, (stop) =>
    boyPatch(stop, boyId, { photoCounts: counts, photoDecided: true }),
  );
}

export function setChoice(day: Day, stopId: string, boyId: string, choice: number, correct: number): Day {
  const right = choice === correct;
  return patchStop(day, stopId, (stop) =>
    boyPatch(stop, boyId, {
      selectedChoice: choice,
      answerAccepted: right,
    }),
  );
}

export function setWritten(day: Day, stopId: string, boyId: string, writtenAnswer: string): Day {
  return patchStop(day, stopId, (stop) => boyPatch(stop, boyId, { writtenAnswer, answerAccepted: false }));
}

export function acceptWritten(day: Day, stopId: string, boyId: string, accepted: boolean): Day {
  return patchStop(day, stopId, (stop) => boyPatch(stop, boyId, { answerAccepted: accepted }));
}

export function markPinDone(day: Day, stopId: string, done: boolean): Day {
  return patchStop(day, stopId, (stop) => ({ ...stop, manualDone: done, opened: true }));
}

export function openStop(day: Day, stopId: string): Day {
  return patchStop(day, stopId, (stop) => ({ ...stop, opened: true }));
}

export function giveKindness(day: Day, boyId: string): Day {
  if (day.kindness[boyId]) return day;
  return { ...day, kindness: { ...day.kindness, [boyId]: true } };
}

export function updateAdultFields(
  day: Day,
  stopId: string,
  fields: Pick<Stop, "name" | "scene" | "history" | "reflection" | "uncertain" | "practical">,
): Day {
  return patchStop(day, stopId, (stop) => ({ ...stop, ...fields }));
}

export function updateKidTask(
  day: Day,
  stopId: string,
  boy: Boy,
  task: McTask | WriteTask,
): Day {
  const slot = taskSlot(boy, day.boys);
  return patchStop(day, stopId, (stop) => {
    if (slot.band === "young") {
      const young = [...stop.young] as Stop["young"];
      young[slot.index] = task as McTask;
      return { ...stop, young };
    }
    const older = [...stop.older] as Stop["older"];
    older[slot.index] = task as WriteTask;
    return { ...stop, older };
  });
}
