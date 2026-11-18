import { useMemo, useState } from 'react';
import type { QuestionType, QuizConfig } from '../types';
import { TYPE_LABELS } from '../types';
import { SUBJECTS } from '../data/subjects';
import { errorPool, pool } from '../lib/quiz';
import { isMastered, load } from '../lib/storage';

type Props = {
  onStart: (cfg: QuizConfig) => void;
  onStats: () => void;
};

const ALL_TYPES: QuestionType[] = ['mcq', 'truefalse', 'definition', 'chronology'];
const COUNTS = [10, 20, 30];

export function Home({ onStart, onStats }: Props) {
  const subject = SUBJECTS[0];
  const [themeIds, setThemeIds] = useState<string[]>(subject.themes.map((t) => t.id));
  const [types, setTypes] = useState<QuestionType[]>(ALL_TYPES);
  const [count, setCount] = useState(10);
  const stats = useMemo(() => load().questions, []);

  const toggle = <T,>(list: T[], v: T, set: (l: T[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const available = pool({ themeIds, types }).length;
  const errors = errorPool({ themeIds, types }).length;
  const sections = [...new Set(subject.themes.map((t) => t.section))];

  return (
    <div className="home">
      <header className="hero">
        <h1>Révisions CAPLP interne</h1>
        <p className="muted">Lettres – Histoire-Géographie · session 2027</p>
      </header>

      <h2>Thèmes du programme</h2>
      {sections.map((section) => (
        <div key={section}>
          <h3 className="section-title">{section}</h3>
          <div className="themes">
            {subject.themes
              .filter((t) => t.section === section)
              .map((t) => {
                const on = themeIds.includes(t.id);
                const mastered = t.questions.filter((q) => isMastered(stats[q.id])).length;
                const pct = t.questions.length ? (mastered / t.questions.length) * 100 : 0;
                return (
                  <button
                    key={t.id}
                    className={`theme ${on ? 'on' : ''}`}
                    onClick={() => toggle(themeIds, t.id, setThemeIds)}
                    aria-pressed={on}
                  >
                    <span className="check">{on ? '✓' : ''}</span>
                    <span className="theme-body">
                      <span className="theme-title">
                        {t.title}
                        {t.isNew && <span className="badge new">nouveau</span>}
                      </span>
                      <span className="mini-progress">
                        <span style={{ width: `${pct}%` }} />
                      </span>
                      <span className="muted small">
                        {mastered}/{t.questions.length} maîtrisées
                      </span>
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}

      <h2>Formats</h2>
      <div className="chips">
        {ALL_TYPES.map((ty) => (
          <button
            key={ty}
            className={`chip ${types.includes(ty) ? 'on' : ''}`}
            onClick={() => toggle(types, ty, setTypes)}
            aria-pressed={types.includes(ty)}
          >
            {TYPE_LABELS[ty]}
          </button>
        ))}
      </div>

      <h2>Nombre de questions</h2>
      <div className="chips">
        {COUNTS.map((c) => (
          <button key={c} className={`chip ${count === c ? 'on' : ''}`} onClick={() => setCount(c)}>
            {c}
          </button>
        ))}
        <button className={`chip ${count === 9999 ? 'on' : ''}`} onClick={() => setCount(9999)}>
          Toutes ({available})
        </button>
      </div>

      <div className="actions">
        <button
          className="btn primary big"
          disabled={available === 0}
          onClick={() => onStart({ mode: 'training', themeIds, types, count })}
        >
          S’entraîner
          <small>{Math.min(count, available)} questions</small>
        </button>
        <button
          className="btn big"
          disabled={errors === 0}
          onClick={() => onStart({ mode: 'errors', themeIds, types, count })}
        >
          Revoir mes erreurs
          <small>{errors} à revoir</small>
        </button>
        <button
          className="btn big"
          onClick={() =>
            onStart({ mode: 'exam', themeIds: subject.themes.map((t) => t.id), types: ALL_TYPES, count: 20 })
          }
        >
          Examen blanc
          <small>20 questions, tous thèmes, correction à la fin</small>
        </button>
      </div>

      <button className="btn ghost block" onClick={onStats}>
        📊 Ma progression
      </button>
    </div>
  );
}
