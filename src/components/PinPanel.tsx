"use client";

import { useState } from "react";
import { acceptWritten, markPinDone, setChoice, setPhoto, setPhotoCounts, setWritten } from "@/lib/mutate";
import { shrinkPhoto } from "@/lib/photos";
import { boyScore, taskSlot } from "@/lib/scoring";
import type { Boy, Day, McTask, Stop, Verdict, WriteTask } from "@/lib/types";
import { VERDICT_LABEL } from "@/lib/types";

export function PinPanel({
  day,
  stop,
  busy,
  onClose,
  onApply,
  onCommit,
}: {
  day: Day;
  stop: Stop;
  busy: boolean;
  onClose: () => void;
  onApply: (fn: (day: Day) => Day) => void;
  onCommit: (fn: (day: Day) => Promise<Day>) => void;
}) {
  const index = day.stops.findIndex((item) => item.id === stop.id) + 1;
  const [query, setQuery] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <article className="card stack">
      <div className="topbar">
        <p className="eyebrow">Stop {index}</p>
        <button type="button" className="btn ghost small" onClick={onClose}>
          Back to the list
        </button>
      </div>
      <h2 className="display text-3xl">{stop.name}</h2>
      {stop.uncertain && <span className="check">Check this</span>}
      {stop.practical && <p className="lede">{stop.practical}</p>}
      {day.mode === "adult" ? <AdultBody stop={stop} /> : <KidsBody day={day} stop={stop} onApply={onApply} />}
      <div className="stack">
        <p className="font-bold">If this pin is not practical</p>
        <div className="inline-actions">
          {confirmRemove ? (
            <button
              type="button"
              className="btn small clay"
              disabled={busy || day.stops.length < 2}
              onClick={() =>
                onCommit(async (current) => {
                  const { deleteStop } = await import("@/lib/mutate");
                  const { withRoute } = await import("@/lib/route-client");
                  onClose();
                  return withRoute(deleteStop(current, stop.id));
                })
              }
            >
              Confirm remove
            </button>
          ) : (
            <button type="button" className="btn ghost small" onClick={() => setConfirmRemove(true)}>
              Remove
            </button>
          )}
          <button
            type="button"
            className="btn ghost small"
            disabled={busy}
            onClick={() =>
              onCommit(async (current) => {
                const { nearestUnused } = await import("@/lib/places");
                const { makeStop } = await import("@/lib/stops");
                const { replaceStop } = await import("@/lib/mutate");
                const { withRoute } = await import("@/lib/route-client");
                const place = nearestUnused(current, stop);
                if (!place) throw new Error("I don't have another checked place that close. Type one and I'll rewrite the pin.");
                return withRoute(replaceStop(current, stop.id, makeStop(place, current.boys)));
              })
            }
          >
            A different place nearby
          </button>
          {day.mode === "kids" && (
            <button type="button" className="btn small" onClick={() => onApply((current) => markPinDone(current, stop.id, !stop.manualDone))}>
              {stop.manualDone ? "Undo, don't count it yet" : "We already did this"}
            </button>
          )}
        </div>
        <form
          className="inline-actions"
          onSubmit={(event) => {
            event.preventDefault();
            if (!query.trim()) return;
            onCommit(async (current) => {
              const { geocodeInKyoto } = await import("@/lib/places");
              const { makeStop } = await import("@/lib/stops");
              const { replaceStop } = await import("@/lib/mutate");
              const { withRoute } = await import("@/lib/route-client");
              const place = await geocodeInKyoto(query.trim());
              return withRoute(replaceStop(current, stop.id, makeStop(place, current.boys)));
            });
          }}
        >
          <input className="text-input" style={{ maxWidth: 280 }} placeholder="Type a replacement place" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button className="btn small" type="submit" disabled={busy}>
            Rewrite this pin
          </button>
        </form>
      </div>
    </article>
  );
}

function AdultBody({ stop }: { stop: Stop }) {
  return (
    <div className="stack">
      <section>
        <h3 className="display text-xl">The scene</h3>
        <p className="lede mt-1">{stop.scene}</p>
      </section>
      <section>
        <h3 className="display text-xl">Historical backdrop</h3>
        <p className="lede mt-1">{stop.history}</p>
      </section>
      <section>
        <h3 className="display text-xl">A reflection</h3>
        <p className="lede mt-1">{stop.reflection}</p>
        <p className="lede mt-2">Think about it here. Nothing you think is typed or saved.</p>
      </section>
    </div>
  );
}

function KidsBody({
  day,
  stop,
  onApply,
}: {
  day: Day;
  stop: Stop;
  onApply: (fn: (day: Day) => Day) => void;
}) {
  return (
    <div className="stack">
      <p className="lede">This stop is worth 10 for each boy, once his photo counts and his answer is done.</p>
      {stop.manualDone && <p className="banner">Counted for both boys.</p>}
      {day.boys.map((boy) => (
        <BoyCard key={boy.id} day={day} boy={boy} stop={stop} onApply={onApply} />
      ))}
    </div>
  );
}

function BoyCard({
  day,
  boy,
  stop,
  onApply,
}: {
  day: Day;
  boy: Boy;
  stop: Stop;
  onApply: (fn: (day: Day) => Day) => void;
}) {
  const slot = taskSlot(boy, day.boys);
  const task = slot.band === "young" ? stop.young[slot.index] : stop.older[slot.index];
  const state = stop.boys[boy.id];
  const [checking, setChecking] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [missed, setMissed] = useState<number[]>([]);
  const done = Boolean(state?.photoCounts && state.answerAccepted) || stop.manualDone;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setChecking(true);
    setPhotoError(null);
    try {
      const image = await shrinkPhoto(file);
      const res = await fetch("/api/photo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, task: task.task }),
      });
      const data = (await res.json()) as { verdict?: Verdict; sentence?: string };
      onApply((current) =>
        setPhoto(
          current,
          stop.id,
          boy.id,
          image,
          data.verdict ?? "not-sure",
          data.sentence || "The checker didn't answer, so this one is your call.",
        ),
      );
    } catch {
      setPhotoError("That photo could not be read. Try another one.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <section className="card stack">
      <h3 className="display text-2xl">
        {boy.name} · {boyScore(day, boy)} points
      </h3>
      <p>{task.task}</p>
      <label className="btn ghost small inline-block">
        {checking ? "Checking the photo…" : state?.photoDataUrl ? "Take another photo" : "Take a photo"}
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          capture="environment"
          disabled={checking}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void onFile(file);
          }}
        />
      </label>
      {photoError && <p className="banner bad">{photoError}</p>}
      {state?.photoDataUrl && (
        <>
          <img className="photo-preview" src={state.photoDataUrl} alt={`Photo for ${boy.name} at ${stop.name}`} />
          {state.verdict && (
            <p>
              <span className={`verdict ${state.verdict}`}>{VERDICT_LABEL[state.verdict]}.</span> {state.verdictSentence}
            </p>
          )}
          <div className="inline-actions">
            <button type="button" className="btn small" onClick={() => onApply((current) => setPhotoCounts(current, stop.id, boy.id, true))}>
              Give the points
            </button>
            <button type="button" className="btn ghost small" onClick={() => onApply((current) => setPhotoCounts(current, stop.id, boy.id, false))}>
              Take them away
            </button>
          </div>
          {state.photoDecided && (
            <p className="lede">{state.photoCounts ? "You're counting this photo." : "You're not counting this photo. It stays either way."}</p>
          )}
        </>
      )}
      <p className="font-bold">{task.question}</p>
      {slot.band === "young" ? (
        <YoungAnswers
          task={task as McTask}
          missed={missed}
          accepted={Boolean(state?.answerAccepted)}
          onPick={(choice) => {
            const young = task as McTask;
            if (choice !== young.correctIndex) setMissed((current) => [...new Set([...current, choice])]);
            onApply((day) => setChoice(day, stop.id, boy.id, choice, young.correctIndex));
          }}
        />
      ) : (
        <WrittenAnswer
          value={state?.writtenAnswer ?? ""}
          accepted={Boolean(state?.answerAccepted)}
          onChange={(value) => onApply((current) => setWritten(current, stop.id, boy.id, value))}
          onAccept={(accepted) => onApply((current) => acceptWritten(current, stop.id, boy.id, accepted))}
        />
      )}
      <p className="lede">{done ? "10 points on this stop." : "10 points when the photo counts and the answer is done."}</p>
    </section>
  );
}

function YoungAnswers({
  task,
  missed,
  accepted,
  onPick,
}: {
  task: McTask;
  missed: number[];
  accepted: boolean;
  onPick: (index: number) => void;
}) {
  return (
    <div className="stack">
      {task.choices.map((choice, index) => {
        const right = accepted && index === task.correctIndex;
        const miss = missed.includes(index) && !right;
        return (
          <button key={choice} type="button" className={`choice choice-hit ${right ? "right" : ""} ${miss ? "miss" : ""}`} onClick={() => onPick(index)}>
            {choice}
          </button>
        );
      })}
      {missed.length > 0 && !accepted && <p className="lede">Not that one. Try again.</p>}
    </div>
  );
}

function WrittenAnswer({
  value,
  accepted,
  onChange,
  onAccept,
}: {
  value: string;
  accepted: boolean;
  onChange: (value: string) => void;
  onAccept: (accepted: boolean) => void;
}) {
  return (
    <div className="stack">
      <textarea className="text-input" value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      <div className="inline-actions">
        <button type="button" className="btn small" disabled={value.trim().length === 0} onClick={() => onAccept(true)}>
          That counts
        </button>
        <button type="button" className="btn ghost small" onClick={() => onAccept(false)}>
          Try again
        </button>
      </div>
      {accepted && <p className="lede">That counts.</p>}
    </div>
  );
}
