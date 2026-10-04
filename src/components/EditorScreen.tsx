"use client";

import { useState } from "react";
import { kidsBooks } from "@/lib/cities/kyoto";
import { formatDistance, formatDuration, youtubeIntroUrl } from "@/lib/format";
import { deleteStop, moveStop, patchStop, updateAdultFields, updateKidTask } from "@/lib/mutate";
import { taskSlot } from "@/lib/scoring";
import type { Day, McTask, Stop, WriteTask } from "@/lib/types";

export function EditorScreen({
  day,
  busy,
  error,
  onApply,
  onCommit,
  onStart,
  onRedraft,
  onBack,
}: {
  day: Day;
  busy: boolean;
  error: string | null;
  onApply: (fn: (day: Day) => Day) => void;
  onCommit: (fn: (day: Day) => Promise<Day>) => void;
  onStart: () => void;
  onRedraft: () => void;
  onBack: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmRedraft, setConfirmRedraft] = useState(false);
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [addQuery, setAddQuery] = useState("");
  const minutes = day.route.minutes;
  const outside = minutes != null && (minutes < 55 || minutes > 135);
  const timeNote =
    minutes != null && minutes < 55
      ? "The honest walk is shorter than an hour. I won't add detours just to fill the clock."
      : minutes != null && minutes > 135
        ? "This route runs long. Drop a far stop before you leave if you want it shorter."
        : null;

  return (
    <main className="app-shell">
      <div className="topbar">
        <div>
          <p className="eyebrow">Before you leave · Kyoto</p>
          <h1 className="display text-4xl">{day.bookTitle}</h1>
        </div>
        <button type="button" className="btn ghost small" onClick={onBack}>
          {day.mode === "adult" ? "Change the story" : "Start over"}
        </button>
      </div>
      {day.stops.length < 2 ? (
        <p className="lede mt-2">One place. There is no walk between stops.</p>
      ) : (
        <p className={`lede mt-2 ${outside ? "font-bold" : ""}`}>
          About {formatDuration(minutes)} on foot
          {day.route.meters != null ? ` · ${formatDistance(day.route.meters)}` : ""}
          {day.route.source === "estimate" ? " · estimated, the street route did not load" : ""}
        </p>
      )}
      {day.note && <p className="banner mt-3">{day.note}</p>}
      {timeNote && <p className="banner mt-3">{timeNote}</p>}
      {error && <p className="banner bad mt-3">{error}</p>}
      {day.mode === "kids" && <BooksAside />}
      <ol className="stack mt-4">
        {day.stops.map((stop, index) => (
          <li key={stop.id} className="card">
            <div className="stop-row">
              <span className="num">{index + 1}</span>
              <div className="stack">
                <div>
                  <strong className="display text-2xl">{stop.name}</strong>
                  {stop.uncertain && <span className="check ml-2">Check this</span>}
                  {stop.practical && <p className="lede">{stop.practical}</p>}
                </div>
                <div className="inline-actions">
                  <button type="button" className="btn ghost small" disabled={busy || index === 0} onClick={() => onCommit((current) => Promise.resolve(moveStop(current, stop.id, -1)).then((day) => refresh(day)))}>
                    Up
                  </button>
                  <button type="button" className="btn ghost small" disabled={busy || index === day.stops.length - 1} onClick={() => onCommit((current) => refresh(moveStop(current, stop.id, 1)))}>
                    Down
                  </button>
                  <button type="button" className="btn ghost small" onClick={() => setOpenId(openId === stop.id ? null : stop.id)}>
                    {openId === stop.id ? "Close" : "Rewrite"}
                  </button>
                  <button
                    type="button"
                    className="btn ghost small"
                    disabled={busy}
                    onClick={() => onCommit((current) => importNearby(current, stop.id))}
                  >
                    Nearby
                  </button>
                  {confirmDelete === stop.id ? (
                    <button type="button" className="btn small clay" disabled={busy || day.stops.length < 2} onClick={() => onCommit((current) => refresh(deleteStop(current, stop.id)))}>
                      Confirm remove
                    </button>
                  ) : (
                    <button type="button" className="btn ghost small" disabled={day.stops.length < 2} onClick={() => setConfirmDelete(stop.id)}>
                      Remove
                    </button>
                  )}
                </div>
                <form
                  className="inline-actions"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const query = queries[stop.id]?.trim();
                    if (!query) return;
                    onCommit((current) => importRewrite(current, stop.id, query));
                  }}
                >
                  <input
                    className="text-input"
                    style={{ maxWidth: 280 }}
                    placeholder="Type a replacement place"
                    value={queries[stop.id] ?? ""}
                    onChange={(event) => setQueries((current) => ({ ...current, [stop.id]: event.target.value }))}
                  />
                  <button type="submit" className="btn small" disabled={busy}>
                    Rewrite this pin
                  </button>
                </form>
                {openId === stop.id && <StopEditor day={day} stop={stop} onApply={onApply} />}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <form
        className="card mt-4 inline-actions"
        onSubmit={(event) => {
          event.preventDefault();
          if (!addQuery.trim()) return;
          onCommit(async (current) => {
            const { geocodeInKyoto } = await import("@/lib/places");
            const { makeStop } = await import("@/lib/stops");
            const { withRoute } = await import("@/lib/route-client");
            const place = await geocodeInKyoto(addQuery.trim());
            return withRoute({ ...current, stops: [...current.stops, makeStop(place, current.boys)] });
          });
          setAddQuery("");
        }}
      >
        <input className="text-input" style={{ maxWidth: 280 }} placeholder="Add a place in Kyoto" value={addQuery} onChange={(event) => setAddQuery(event.target.value)} />
        <button type="submit" className="btn ghost" disabled={busy}>
          Add it
        </button>
      </form>
      <div className="btn-row mt-5">
        <button type="button" className="btn clay" disabled={busy || day.stops.length === 0} onClick={onStart}>
          Start walking
        </button>
        {confirmRedraft ? (
          <button type="button" className="btn ghost" disabled={busy} onClick={onRedraft}>
            Confirm a fresh draft
          </button>
        ) : (
          <button type="button" className="btn ghost" onClick={() => setConfirmRedraft(true)}>
            Draft the cluster again
          </button>
        )}
      </div>
    </main>
  );
}

async function refresh(day: Day) {
  const { withRoute } = await import("@/lib/route-client");
  return withRoute(day);
}

async function importNearby(day: Day, stopId: string) {
  const { nearestUnused } = await import("@/lib/places");
  const { makeStop } = await import("@/lib/stops");
  const { replaceStop } = await import("@/lib/mutate");
  const { withRoute } = await import("@/lib/route-client");
  const stop = day.stops.find((item) => item.id === stopId);
  if (!stop) return day;
  const place = nearestUnused(day, stop);
  if (!place) throw new Error("I don't have another checked place that close. Type one and I'll rewrite the pin.");
  return withRoute(replaceStop(day, stopId, makeStop(place, day.boys)));
}

async function importRewrite(day: Day, stopId: string, query: string) {
  const { geocodeInKyoto } = await import("@/lib/places");
  const { makeStop } = await import("@/lib/stops");
  const { replaceStop } = await import("@/lib/mutate");
  const { withRoute } = await import("@/lib/route-client");
  const place = await geocodeInKyoto(query);
  return withRoute(replaceStop(day, stopId, makeStop(place, day.boys)));
}

function BooksAside() {
  return (
    <details className="card mt-4">
      <summary>Books and a short video, if you want them</summary>
      <p className="lede mt-2">Skip both. The walk does not use them, and it does not use the adult book.</p>
      <ul className="mt-3 stack">
        {kidsBooks.map((book) => (
          <li key={book.title}>
            <strong>{book.title}</strong>
            <span className="lede"> {book.author}. {book.why}</span>
          </li>
        ))}
      </ul>
      <a className="btn ghost small mt-3 inline-block" href={youtubeIntroUrl("Kyoto")} target="_blank" rel="noreferrer">
        Open a YouTube search for a short intro to Kyoto
      </a>
    </details>
  );
}

function StopEditor({
  day,
  stop,
  onApply,
}: {
  day: Day;
  stop: Stop;
  onApply: (fn: (day: Day) => Day) => void;
}) {
  function patch(partial: Partial<Stop>) {
    onApply((current) => patchStop(current, stop.id, (item) => ({ ...item, ...partial })));
  }

  return (
    <div className="stack">
      <label className="field">
        Name
        <input value={stop.name} onChange={(event) => patch({ name: event.target.value })} />
      </label>
      <label className="field">
        Practical note
        <input value={stop.practical} onChange={(event) => patch({ practical: event.target.value })} />
      </label>
      <label className="inline-actions">
        <input type="checkbox" checked={stop.uncertain} onChange={(event) => patch({ uncertain: event.target.checked })} />
        Mark as check this
      </label>
      {day.mode === "adult" ? (
        <>
          <label className="field">
            The scene
            <textarea value={stop.scene} onChange={(event) => onApply((current) => updateAdultFields(current, stop.id, { ...stop, scene: event.target.value }))} />
          </label>
          <label className="field">
            Historical backdrop
            <textarea value={stop.history} onChange={(event) => onApply((current) => updateAdultFields(current, stop.id, { ...stop, history: event.target.value }))} />
          </label>
          <label className="field">
            A reflection
            <textarea value={stop.reflection} onChange={(event) => onApply((current) => updateAdultFields(current, stop.id, { ...stop, reflection: event.target.value }))} />
          </label>
        </>
      ) : (
        day.boys.map((boy) => {
          const slot = taskSlot(boy, day.boys);
          const task = slot.band === "young" ? stop.young[slot.index] : stop.older[slot.index];
          return (
            <fieldset key={boy.id} className="stack">
              <legend className="font-bold">
                {boy.name} · {boy.ageBand}
              </legend>
              <label className="field">
                Task
                <textarea
                  value={task.task}
                  onChange={(event) =>
                    onApply((current) => updateKidTask(current, stop.id, boy, { ...task, task: event.target.value }))
                  }
                />
              </label>
              <label className="field">
                Question
                <textarea
                  value={task.question}
                  onChange={(event) =>
                    onApply((current) => updateKidTask(current, stop.id, boy, { ...task, question: event.target.value }))
                  }
                />
              </label>
              {slot.band === "young" && (
                <YoungChoices
                  task={task as McTask}
                  onChange={(next) => onApply((current) => updateKidTask(current, stop.id, boy, next))}
                />
              )}
            </fieldset>
          );
        })
      )}
    </div>
  );
}

function YoungChoices({ task, onChange }: { task: McTask; onChange: (task: McTask | WriteTask) => void }) {
  return (
    <div className="stack">
      {task.choices.map((choice, index) => (
        <label key={index} className="field">
          <span className="inline-actions">
            <input
              type="radio"
              name={`correct-${task.question}`}
              checked={task.correctIndex === index}
              onChange={() => onChange({ ...task, correctIndex: index as 0 | 1 | 2 })}
            />
            Choice {index + 1}
            {task.correctIndex === index ? " · right answer" : ""}
          </span>
          <input
            value={choice}
            onChange={(event) => {
              const choices = [...task.choices] as [string, string, string];
              choices[index] = event.target.value;
              onChange({ ...task, choices });
            }}
          />
        </label>
      ))}
    </div>
  );
}
