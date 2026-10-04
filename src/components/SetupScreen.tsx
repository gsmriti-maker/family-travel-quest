"use client";

import { useState } from "react";
import type { AgeBand, Boy, Mode } from "@/lib/types";

export function SetupScreen({
  busy,
  error,
  onStart,
}: {
  busy: boolean;
  error: string | null;
  onStart: (input: { mode: Mode; stopCount: number; boys: Boy[] }) => void;
}) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [stopCount, setStopCount] = useState(5);
  const [names, setNames] = useState(["Karam", "Reyan"]);
  const [ages, setAges] = useState<(AgeBand | null)[]>(["6-7", "10-15"]);
  const [localError, setLocalError] = useState<string | null>(null);

  function start() {
    if (!mode) {
      setLocalError("Choose an adult day or a kids day.");
      return;
    }
    if (mode === "kids") {
      if (names.some((name) => name.trim().length === 0) || ages.some((age) => !age)) {
        setLocalError("Add both names, and an age for each boy.");
        return;
      }
    }
    setLocalError(null);
    const boys: Boy[] =
      mode === "kids"
        ? [0, 1].map((index) => ({
            id: crypto.randomUUID(),
            name: names[index].trim(),
            ageBand: ages[index] as AgeBand,
          }))
        : [];
    onStart({ mode, stopCount, boys });
  }

  return (
    <main className="app-shell">
      <p className="eyebrow">Kyoto Day</p>
      <h1 className="display mt-2 text-5xl">A day on foot.</h1>
      <p className="lede mt-3 max-w-xl">
        One city. One walk. About an hour or two. More stops pull the pins into a tighter part of Kyoto. They do not make a longer day.
      </p>
      <div className="stack mt-6 max-w-xl">
        <section className="card">
          <p className="eyebrow">City</p>
          <p className="display mt-1 text-3xl">Kyoto</p>
        </section>
        <section>
          <p className="mb-2 font-bold">What kind of day?</p>
          <div className="choice-row">
            <button type="button" className="choice" aria-pressed={mode === "adult"} onClick={() => setMode("adult")}>
              <strong className="display">Adult day</strong>
              <span>A book, or the places themselves. No score.</span>
            </button>
            <button type="button" className="choice" aria-pressed={mode === "kids"} onClick={() => setMode("kids")}>
              <strong className="display">Kids day</strong>
              <span>Both boys, one trail, ten points a stop.</span>
            </button>
          </div>
        </section>
        {mode === "kids" && (
          <section className="stack">
            <p className="font-bold">Both boys share the trail.</p>
            {[0, 1].map((index) => (
              <div key={index} className="card stack">
                <label className="field">
                  {index === 0 ? "Younger boy" : "Older boy"}
                  <input
                    value={names[index]}
                    onChange={(event) =>
                      setNames((current) => current.map((name, i) => (i === index ? event.target.value : name)))
                    }
                    autoComplete="off"
                  />
                </label>
                <div className="choice-row">
                  {(["6-7", "10-15"] as const).map((band) => (
                    <button
                      key={band}
                      type="button"
                      className="choice"
                      aria-pressed={ages[index] === band}
                      onClick={() => setAges((current) => current.map((age, i) => (i === index ? band : age)))}
                    >
                      <strong>{band === "6-7" ? "Ages 6–7" : "Ages 10–15"}</strong>
                      <span>{band === "6-7" ? "Find it, photo, multiple choice." : "A harder task, photo, written answer."}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
        <section className="card">
          <p className="font-bold">How many stops?</p>
          <div className="stepper mt-3">
            <button type="button" className="btn ghost" onClick={() => setStopCount((count) => Math.max(3, count - 1))} aria-label="Fewer stops">
              −
            </button>
            <b>{stopCount}</b>
            <button type="button" className="btn ghost" onClick={() => setStopCount((count) => Math.min(8, count + 1))} aria-label="More stops">
              +
            </button>
          </div>
          <p className="lede mt-2">Between 3 and 8. A book with only a few real places will not invent the rest.</p>
        </section>
        {(localError || error) && <p className="banner bad">{localError || error}</p>}
        <button type="button" className="btn clay" disabled={busy} onClick={start}>
          {busy ? "Drafting the walk…" : "Draft the day"}
        </button>
      </div>
    </main>
  );
}
