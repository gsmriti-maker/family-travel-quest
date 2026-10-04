"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { PinPanel } from "@/components/PinPanel";
import { kidsBooks } from "@/lib/cities/kyoto";
import { formatDistance, formatDuration, youtubeIntroUrl } from "@/lib/format";
import { haversine } from "@/lib/geo";
import { giveKindness, openStop } from "@/lib/mutate";
import { boyScore } from "@/lib/scoring";
import type { Day } from "@/lib/types";

const WalkMap = dynamic(() => import("@/components/WalkMap"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center">Opening the map…</div>,
});

export function WalkScreen({
  day,
  busy,
  error,
  onApply,
  onCommit,
  onEnd,
}: {
  day: Day;
  busy: boolean;
  error: string | null;
  onApply: (fn: (day: Day) => Day) => void;
  onCommit: (fn: (day: Day) => Promise<Day>) => void;
  onEnd: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [geo, setGeo] = useState<"asking" | "ok" | "off">("asking");
  const [snooze, setSnooze] = useState<Record<string, number>>({});
  const [confirmEnd, setConfirmEnd] = useState(false);
  const open = day.stops.find((stop) => stop.id === openId) ?? null;

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeo("off");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setGeo("ok");
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setGeo("off"),
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 12000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const near = useMemo(() => {
    if (!here) return null;
    let best: { id: string; name: string; distance: number } | null = null;
    for (const stop of day.stops) {
      const distance = haversine(here, stop);
      if (distance < 100 && (!best || distance < best.distance)) best = { id: stop.id, name: stop.name, distance };
    }
    if (!best) return null;
    const until = snooze[best.id] ?? 0;
    if (Date.now() < until) return null;
    return best;
  }, [here, day.stops, snooze]);

  function openPin(id: string) {
    setOpenId(id);
    onApply((current) => openStop(current, id));
  }

  return (
    <main className="app-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Walking · Kyoto</p>
          <h1 className="display text-3xl">{day.bookTitle}</h1>
          <p className="lede">
            {day.stops.length < 2
              ? "One place. There is no walk between stops."
              : `About ${formatDuration(day.route.minutes)}${day.route.meters != null ? ` · ${formatDistance(day.route.meters)}` : ""}`}
          </p>
        </div>
        {confirmEnd ? (
          <button type="button" className="btn clay small" onClick={onEnd}>
            End the day now
          </button>
        ) : (
          <button type="button" className="btn ghost small" onClick={() => setConfirmEnd(true)}>
            End the day
          </button>
        )}
      </div>
      {day.mode === "kids" && (
        <div className="score-row mb-3">
          {day.boys.map((boy) => (
            <div key={boy.id} className="score">
              {boy.name} {boyScore(day, boy)}
              {day.kindness[boy.id] ? (
                <span> · 5 added</span>
              ) : (
                <button type="button" className="btn ghost small ml-2" onClick={() => onApply((current) => giveKindness(current, boy.id))}>
                  Add 5 for a good moment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="banner bad mb-3">{error}</p>}
      <div className="walk-layout">
        <div className="map-frame">
          <WalkMap
            stops={day.stops}
            line={day.route.line}
            activeId={openId}
            here={here}
            onSelect={openPin}
          />
        </div>
        <div className="stack">
          {geo === "off" && (
            <p className="banner">Location is off, so the map will not ask “Are you here?” Open any pin yourself. The walk still works.</p>
          )}
          {near && near.id !== openId && (
            <div className="card stack">
              <p className="eyebrow">Are you here?</p>
              <p className="display text-2xl">{near.name}</p>
              <div className="inline-actions">
                <button type="button" className="btn small" onClick={() => openPin(near.id)}>
                  Yes, open it
                </button>
                <button type="button" className="btn ghost small" onClick={() => setSnooze((current) => ({ ...current, [near.id]: Date.now() + 180000 }))}>
                  Not yet
                </button>
              </div>
            </div>
          )}
          {open ? (
            <PinPanel day={day} stop={open} busy={busy} onClose={() => setOpenId(null)} onApply={onApply} onCommit={onCommit} />
          ) : (
            <ol className="stack">
              {day.stops.map((stop, index) => (
                <li key={stop.id} className="card stop-row">
                  <span className="num">{index + 1}</span>
                  <div>
                    <strong>{stop.name}</strong>
                    {stop.uncertain && <span className="check ml-2">Check this</span>}
                    <div className="mt-2">
                      <button type="button" className="btn small" onClick={() => openPin(stop.id)}>
                        Open this pin
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          {day.mode === "kids" && !open && (
            <details className="card">
              <summary>Books and a short video, if you want them</summary>
              <p className="lede mt-2">Skip both. The quest does not depend on them.</p>
              <ul className="mt-2 stack">
                {kidsBooks.map((book) => (
                  <li key={book.title}>
                    <strong>{book.title}</strong> · {book.author}. {book.why}
                  </li>
                ))}
              </ul>
              <a className="btn ghost small mt-3 inline-block" href={youtubeIntroUrl("Kyoto")} target="_blank" rel="noreferrer">
                Open a YouTube search for a short intro to Kyoto
              </a>
            </details>
          )}
        </div>
      </div>
    </main>
  );
}
