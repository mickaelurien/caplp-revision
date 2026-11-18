import type { PreparedQuestion, Question, QuizConfig, UserAnswer } from '../types';
import { ALL_THEMES } from '../data/subjects';
import { load, needsReview } from './storage';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function prepare(q: Question): PreparedQuestion {
  if (q.type === 'mcq' || q.type === 'definition') {
    const idx = shuffle(q.choices.map((_, i) => i));
    return { q, choices: idx.map((i) => q.choices[i]), correctIndex: idx.indexOf(q.answer) };
  }
  if (q.type === 'chronology') {
    let events = shuffle(q.events);
    // éviter de proposer la liste déjà dans l'ordre
    for (let k = 0; k < 5 && isSorted(events.map((e) => e.year)); k++) events = shuffle(q.events);
    return { q, events };
  }
  return { q };
}

const isSorted = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] <= x);

export function isCorrect(pq: PreparedQuestion, a: UserAnswer): boolean {
  const { q } = pq;
  switch (q.type) {
    case 'mcq':
    case 'definition':
      return a.type === 'choice' && a.index === pq.correctIndex;
    case 'truefalse':
      return a.type === 'bool' && a.value === q.answer;
    case 'chronology':
      return (
        a.type === 'order' &&
        a.order.length === pq.events!.length &&
        isSorted(a.order.map((i) => pq.events![i].year))
      );
  }
}

/** Questions candidates selon les thèmes et formats choisis. */
export function pool(cfg: Pick<QuizConfig, 'themeIds' | 'types'>): Question[] {
  return ALL_THEMES.filter((t) => cfg.themeIds.includes(t.id))
    .flatMap((t) => t.questions)
    .filter((q) => cfg.types.includes(q.type));
}

export function errorPool(cfg: Pick<QuizConfig, 'themeIds' | 'types'>): Question[] {
  const stats = load().questions;
  return pool(cfg).filter((q) => needsReview(stats[q.id]));
}

export function buildQuiz(cfg: QuizConfig): PreparedQuestion[] {
  const stats = load().questions;
  const candidates = pool(cfg);
  let selected: Question[];

  if (cfg.mode === 'errors') {
    // d'abord les questions ratées (les plus récemment ratées en tête), puis les moins vues
    const wrong = shuffle(candidates.filter((q) => needsReview(stats[q.id])));
    const rest = shuffle(candidates.filter((q) => !needsReview(stats[q.id]))).sort(
      (a, b) => (stats[a.id]?.seen ?? 0) - (stats[b.id]?.seen ?? 0),
    );
    selected = [...wrong, ...rest].slice(0, cfg.count);
  } else if (cfg.mode === 'exam') {
    // répartition équilibrée entre thèmes
    const byTheme = cfg.themeIds.map((id) => shuffle(candidates.filter((q) => q.theme === id)));
    selected = [];
    for (let round = 0; selected.length < cfg.count && byTheme.some((l) => l.length > round); round++) {
      for (const l of byTheme) if (l[round] && selected.length < cfg.count) selected.push(l[round]);
    }
  } else {
    // entraînement : priorité légère aux questions jamais vues
    const unseen = shuffle(candidates.filter((q) => !stats[q.id]));
    const seen = shuffle(candidates.filter((q) => stats[q.id]));
    selected = [...unseen, ...seen].slice(0, cfg.count);
  }

  return shuffle(selected).map(prepare);
}
