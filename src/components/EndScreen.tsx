"use client";

import { boyScore, dayWinners, stopCounts } from "@/lib/scoring";
import type { Day } from "@/lib/types";

export function EndScreen({ day, onAgain }: { day: Day; onAgain: () => void }) {
  if (day.mode === "adult") {
    const opened = day.stops.filter((stop) => stop.opened).length;
    return (
      <main className="app-shell">
        <p className="eyebrow">Kyoto</p>
        <h1 className="display mt-2 text-5xl">That's the walk.</h1>
        <p className="lede mt-3">You opened {opened} of {day.stops.length} stops. An adult day has no score.</p>
        <ol className="stack mt-5">
          {day.stops.map((stop, index) => (
            <li key={stop.id}>
              {index + 1}. {stop.name}
              {stop.opened ? "" : " · not opened"}
            </li>
          ))}
        </ol>
        <button type="button" className="btn mt-6" onClick={onAgain}>
          Start another day
        </button>
      </main>
    );
  }

  const winners = dayWinners(day);
  const tie = winners.length > 1;
  const title = tie ? `${winners.map((boy) => boy.name).join(" and ")} share the day.` : `${winners[0]?.name ?? "Both"} wins the day.`;

  return (
    <main className="app-shell">
      <p className="eyebrow">Kyoto · kids day</p>
      <h1 className="display mt-2 text-5xl">{title}</h1>
      <p className="lede mt-3">There is no champion across days. This day stands on its own.</p>
      <div className="stack mt-5">
        {day.boys.map((boy) => {
          const finished = day.stops.filter((stop) => stopCounts(stop, boy.id)).length;
          return (
            <section key={boy.id} className="card">
              <h2 className="display text-3xl">{boy.name}</h2>
              <p className="mt-2">{boyScore(day, boy)} points</p>
              <p className="lede">
                {finished} finished {finished === 1 ? "stop" : "stops"} · {finished * 10}
                {day.kindness[boy.id] ? " · 5 for a good moment" : ""}
              </p>
            </section>
          );
        })}
      </div>
      <button type="button" className="btn mt-6" onClick={onAgain}>
        Start another day
      </button>
    </main>
  );
}
