import assert from "node:assert/strict";
import { landmarks, books } from "../src/lib/cities/kyoto";
import { estimateMinutes, maxDiameter, pathLength } from "../src/lib/geo";
import { clusterOptions } from "../src/lib/select-stops";
import { boyScore, dayWinners, stopCounts } from "../src/lib/scoring";
import { makeStop } from "../src/lib/stops";
import type { Day } from "../src/lib/types";

function minutesOf(count: number) {
  const ordered = clusterOptions(landmarks, count)[0];
  const minutes = estimateMinutes(pathLength(ordered));
  const diameter = maxDiameter(ordered);
  return { names: ordered.map((place) => place.name), minutes, diameter };
}

const rows = [3, 5, 8].map((count) => ({ count, ...minutesOf(count) }));
for (const row of rows) {
  console.log(
    `${row.count} stops · ${row.minutes.toFixed(0)} min · diameter ${(row.diameter / 1000).toFixed(1)} km · ${row.names.join(" → ")}`,
  );
  assert.ok(row.minutes >= 45 && row.minutes <= 140, `landmarks ${row.count} out of range: ${row.minutes}`);
}
assert.ok(rows[2].diameter < rows[0].diameter, "more stops should use a tighter cluster");

for (const book of books) {
  const count = Math.min(5, book.places.length);
  const ordered = clusterOptions(book.places, count)[0];
  const minutes = estimateMinutes(pathLength(ordered));
  console.log(`${book.title} · ${ordered.length} stops · ${minutes.toFixed(0)} min`);
}

const boys = [
  { id: "a", name: "Ari", ageBand: "6-7" as const },
  { id: "b", name: "Leo", ageBand: "10-15" as const },
];
const stop = makeStop(landmarks[0], boys);
stop.boys.a.photoCounts = true;
stop.boys.a.answerAccepted = true;
stop.boys.b.photoCounts = true;
stop.boys.b.answerAccepted = false;
const day = {
  boys,
  stops: [stop],
  kindness: { b: true },
} as unknown as Day;
assert.equal(stopCounts(stop, "a"), true);
assert.equal(stopCounts(stop, "b"), false);
assert.equal(boyScore(day, boys[0]), 10);
assert.equal(boyScore(day, boys[1]), 5);
stop.manualDone = true;
assert.equal(boyScore({ ...day, stops: [stop] }, boys[1]), 15);
assert.equal(dayWinners({ ...day, stops: [stop], kindness: {} }).length, 2);
console.log("scoring ok");
