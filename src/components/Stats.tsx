import { useState } from 'react';
import { ALL_THEMES } from '../data/subjects';
import { TYPE_LABELS, type QuestionType } from '../types';
import { isMastered, load, needsReview, reset } from '../lib/storage';

const TYPES: QuestionType[] = ['mcq', 'truefalse', 'definition', 'chronology'];

export function Stats({ onBack }: { onBack: () => void }) {
  const [store, setStore] = useState(load);
  const s = store.questions;

  const rows = ALL_THEMES.map((t) => {
    const qs = t.questions;
    const seen = qs.filter((q) => s[q.id]);
    const answers = seen.reduce((n, q) => n + s[q.id].seen, 0);
    const correct = seen.reduce((n, q) => n + s[q.id].correct, 0);
    return {
      t,
      total: qs.length,
      seen: seen.length,
      mastered: qs.filter((q) => isMastered(s[q.id])).length,
      review: qs.filter((q) => needsReview(s[q.id])).length,
      rate: answers ? Math.round((correct / answers) * 100) : null,
      byType: TYPES.map((ty) => {
        const ofType = qs.filter((q) => q.type === ty && s[q.id]);
        const a = ofType.reduce((n, q) => n + s[q.id].seen, 0);
        const c = ofType.reduce((n, q) => n + s[q.id].correct, 0);
        return { ty, rate: a ? Math.round((c / a) * 100) : null };
      }),
    };
  });

  const sessions = [...store.sessions].reverse().slice(0, 10);

  return (
    <div className="stats">
      <div className="quiz-head">
        <button className="btn ghost small" onClick={onBack}>
          ← Accueil
        </button>
      </div>
      <h1>Ma progression</h1>

      {rows.map((r) => (
        <div className="card" key={r.t.id}>
          <p className="muted small">{r.t.section}</p>
          <h3>{r.t.title}</h3>
          <div className="mini-progress lg">
            <span style={{ width: `${(r.mastered / r.total) * 100}%` }} />
          </div>
          <div className="stat-grid">
            <div>
              <b>{r.mastered}</b>
              <span>maîtrisées</span>
            </div>
            <div>
              <b>{r.review}</b>
              <span>à revoir</span>
            </div>
            <div>
              <b>
                {r.seen}/{r.total}
              </b>
              <span>vues</span>
            </div>
            <div>
              <b>{r.rate === null ? '—' : `${r.rate} %`}</b>
              <span>réussite</span>
            </div>
          </div>
          <div className="chips small">
            {r.byType.map((b) => (
              <span key={b.ty} className="chip static">
                {TYPE_LABELS[b.ty]} : {b.rate === null ? '—' : `${b.rate} %`}
              </span>
            ))}
          </div>
        </div>
      ))}

      {sessions.length > 0 && (
        <>
          <h2>Dernières sessions</h2>
          <div className="card">
            <ul className="sessions">
              {sessions.map((x, i) => (
                <li key={i}>
                  <span>{new Date(x.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  <span className="muted">
                    {x.mode === 'exam' ? 'Examen blanc' : x.mode === 'errors' ? 'Erreurs' : 'Entraînement'}
                  </span>
                  <b>
                    {x.score}/{x.total}
                  </b>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <button
        className="btn ghost danger block"
        onClick={() => {
          if (confirm('Effacer toute la progression ?')) {
            reset();
            setStore(load());
          }
        }}
      >
        Réinitialiser ma progression
      </button>
    </div>
  );
}
