"use client";

import { books } from "@/lib/cities/kyoto";

export function ShelfScreen({
  busy,
  error,
  onPick,
  onBack,
}: {
  busy: boolean;
  error: string | null;
  onPick: (bookId: string | null) => void;
  onBack: () => void;
}) {
  return (
    <main className="app-shell">
      <div className="topbar">
        <p className="eyebrow">Adult day · Kyoto</p>
        <button type="button" className="btn ghost small" onClick={onBack}>
          Start over
        </button>
      </div>
      <h1 className="display text-4xl">What should the walk follow?</h1>
      <p className="lede mt-3 max-w-xl">
        Best known first. Each line is a real book. Some of them only have one or two places I can point to without inventing a door.
      </p>
      <div className="stack mt-5">
        {books.map((book) => (
          <button key={book.id} type="button" className="book" disabled={busy} onClick={() => onPick(book.id)}>
            <span className="title display">{book.title}</span>
            <span className="meta">{book.author}</span>
            <span className="why">{book.why}</span>
          </button>
        ))}
        <button type="button" className="book" disabled={busy} onClick={() => onPick(null)}>
          <span className="title display">No book</span>
          <span className="meta">Places and history</span>
          <span className="why">Temples, shrines, and streets. Nothing from a novel laid on top.</span>
        </button>
        {error && <p className="banner bad">{error}</p>}
      </div>
    </main>
  );
}
