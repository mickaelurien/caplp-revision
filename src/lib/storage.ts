const KEY = 'caplp-quiz-v1';

export type QStat = {
  seen: number;
  correct: number;
  /** Historique court des dernières réponses (true = juste), le plus récent en dernier. */
  history: boolean[];
  lastSeen: number;
};

export type Store = {
  questions: Record<string, QStat>;
  sessions: { date: number; mode: string; score: number; total: number; themes: string[] }[];
};

const empty = (): Store => ({ questions: {}, sessions: [] });

export function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return { questions: parsed.questions ?? {}, sessions: parsed.sessions ?? [] };
  } catch {
    return empty();
  }
}

function save(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* stockage indisponible : on continue sans persistance */
  }
}

export function recordAnswer(id: string, correct: boolean) {
  const store = load();
  const s = store.questions[id] ?? { seen: 0, correct: 0, history: [], lastSeen: 0 };
  s.seen += 1;
  if (correct) s.correct += 1;
  s.history = [...s.history, correct].slice(-5);
  s.lastSeen = Date.now();
  store.questions[id] = s;
  save(store);
}

export function recordSession(mode: string, score: number, total: number, themes: string[]) {
  const store = load();
  store.sessions = [...store.sessions, { date: Date.now(), mode, score, total, themes }].slice(-100);
  save(store);
}

export function reset() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Maîtrisée = les 2 dernières réponses sont justes. */
export const isMastered = (s?: QStat) =>
  !!s && s.history.length >= 2 && s.history.slice(-2).every(Boolean);

/** À revoir = déjà ratée au moins une fois et pas encore maîtrisée. */
export const needsReview = (s?: QStat) =>
  !!s && s.history.some((h) => !h) && !isMastered(s);
