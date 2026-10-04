"use client";

import { useEffect, useRef, useState } from "react";
import { EditorScreen } from "@/components/EditorScreen";
import { EndScreen } from "@/components/EndScreen";
import { SetupScreen } from "@/components/SetupScreen";
import { ShelfScreen } from "@/components/ShelfScreen";
import { WalkScreen } from "@/components/WalkScreen";
import { createShell, draftDay } from "@/lib/draft";
import { loadDay, saveDay } from "@/lib/storage";
import type { Boy, Day, Mode } from "@/lib/types";

export function DayApp() {
  const [day, setDay] = useState<Day | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stored, setStored] = useState(true);
  const dayRef = useRef<Day | null>(null);
  dayRef.current = day;

  useEffect(() => {
    setDay(loadDay());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    setStored(saveDay(day));
  }, [day, ready]);

  function apply(fn: (current: Day) => Day) {
    setDay((current) => (current ? fn(current) : current));
  }

  async function commit(fn: (current: Day) => Promise<Day>) {
    const current = dayRef.current;
    if (!current) return;
    setBusy(true);
    setError(null);
    try {
      const next = await fn(current);
      setDay(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function start(input: { mode: Mode; stopCount: number; boys: Boy[] }) {
    const shell = createShell(input);
    if (input.mode === "adult") {
      setError(null);
      setDay(shell);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setDay(await draftDay(shell, null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "I couldn't draft the walk.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <main className="app-shell">
        <p>Opening the day…</p>
      </main>
    );
  }

  const storageNote = stored ? null : "This browser could not store the latest change. A refresh may drop a photo.";

  if (!day) {
    return <SetupScreen busy={busy} error={error} onStart={(input) => void start(input)} />;
  }

  if (day.phase === "shelf") {
    return (
      <ShelfScreen
        busy={busy}
        error={error}
        onBack={() => setDay(null)}
        onPick={(bookId) => void commit((current) => draftDay(current, bookId))}
      />
    );
  }

  if (day.phase === "editor") {
    return (
      <>
        {storageNote && <p className="banner bad mx-auto mt-3 max-w-3xl">{storageNote}</p>}
        <EditorScreen
          day={day}
          busy={busy}
          error={error}
          onApply={apply}
          onCommit={commit}
          onStart={() => apply((current) => ({ ...current, phase: "walking" }))}
          onRedraft={() => void commit((current) => draftDay(current, current.bookId))}
          onBack={() => {
            if (day.mode === "adult") {
              apply((current) => ({
                ...current,
                phase: "shelf",
                stops: [],
                bookId: null,
                bookTitle: null,
                note: null,
                route: { minutes: null, meters: null, source: null, line: [] },
              }));
            } else {
              setDay(null);
            }
          }}
        />
      </>
    );
  }

  if (day.phase === "walking") {
    return (
      <>
        {storageNote && <p className="banner bad mx-auto mt-3 max-w-3xl">{storageNote}</p>}
        <WalkScreen
          day={day}
          busy={busy}
          error={error}
          onApply={apply}
          onCommit={commit}
          onEnd={() => apply((current) => ({ ...current, phase: "ended" }))}
        />
      </>
    );
  }

  return <EndScreen day={day} onAgain={() => setDay(null)} />;
}
