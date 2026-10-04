export type AgeBand = "6-7" | "10-15";

export type Mode = "adult" | "kids";

export type Phase = "shelf" | "drafting" | "editor" | "walking" | "ended";

export type Verdict = "looks-right" | "not-sure" | "doesnt-match";

export type Boy = {
  id: string;
  name: string;
  ageBand: AgeBand;
};

export type McTask = {
  task: string;
  question: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
};

export type WriteTask = {
  task: string;
  question: string;
};

export type BoyStopState = {
  photoDataUrl?: string;
  verdict?: Verdict;
  verdictSentence?: string;
  photoCounts: boolean;
  photoDecided: boolean;
  selectedChoice?: number;
  writtenAnswer?: string;
  answerAccepted: boolean;
};

export type Stop = {
  id: string;
  sourceId?: string;
  name: string;
  lat: number;
  lng: number;
  uncertain: boolean;
  scene: string;
  history: string;
  reflection: string;
  practical: string;
  young: [McTask, McTask];
  older: [WriteTask, WriteTask];
  opened: boolean;
  manualDone: boolean;
  boys: Record<string, BoyStopState>;
};

export type RouteInfo = {
  minutes: number | null;
  meters: number | null;
  source: "streets" | "estimate" | null;
  line: [number, number][];
};

export type Day = {
  version: 1;
  phase: Phase;
  cityInput: string;
  cityLabel: string;
  cityKey: string | null;
  center: { lat: number; lng: number };
  mode: Mode;
  stopCount: number;
  boys: Boy[];
  bookId: string | null;
  bookTitle: string | null;
  note: string | null;
  stops: Stop[];
  kindness: Record<string, boolean>;
  route: RouteInfo;
};

export type PlaceTemplate = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  uncertain?: boolean;
  scene: string;
  history: string;
  reflection: string;
  practical?: string;
  young?: [McTask, McTask];
  older?: [WriteTask, WriteTask];
};

export type ShelfBook = {
  id: string;
  title: string;
  author: string;
  why: string;
  places: PlaceTemplate[];
};

export type KidsBook = {
  title: string;
  author: string;
  why: string;
};

export type CityPack = {
  key: string;
  label: string;
  center: { lat: number; lng: number };
  match: (input: string) => boolean;
  books: ShelfBook[];
  landmarks: PlaceTemplate[];
  kidsBooks: KidsBook[];
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  "looks-right": "Looks right",
  "not-sure": "Not sure",
  "doesnt-match": "Doesn't match",
};
