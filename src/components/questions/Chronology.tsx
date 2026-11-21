import { useState } from 'react';
import type { Chronology as ChronoQ } from '../../types';
import type { QuestionProps } from './QuestionView';

/** L'utilisatrice touche les événements du plus ancien au plus récent. */
export function Chronology({ pq, answer, reveal, onAnswer }: QuestionProps) {
  const q = pq.q as ChronoQ;
  const events = pq.events!;
  const [order, setOrder] = useState<number[]>([]);
  const locked = answer !== null;
  const finalOrder = answer?.type === 'order' ? answer.order : order;

  const toggle = (i: number) => {
    if (locked) return;
    setOrder((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  };

  const sorted = [...events].sort((a, b) => a.year - b.year);

  return (
    <>
      <p className="prompt">{q.prompt}</p>
      <p className="hint">Touchez les événements du plus ancien au plus récent.</p>
      <div className="choices">
        {events.map((e, i) => {
          const rank = finalOrder.indexOf(i);
          let cls = 'choice chrono';
          if (locked && reveal) {
            cls += sorted.indexOf(e) === rank ? ' correct' : ' wrong';
          } else if (rank >= 0) cls += ' picked';
          return (
            <button key={i} className={cls} disabled={locked} onClick={() => toggle(i)}>
              <span className="choice-letter">{rank >= 0 ? rank + 1 : '·'}</span>
              <span>{e.label}</span>
              {locked && reveal && <span className="year">{e.marker ?? e.year}</span>}
            </button>
          );
        })}
      </div>
      {!locked && (
        <div className="row">
          <button className="btn ghost" onClick={() => setOrder([])} disabled={order.length === 0}>
            Recommencer
          </button>
          <button
            className="btn primary"
            disabled={order.length !== events.length}
            onClick={() => onAnswer({ type: 'order', order })}
          >
            Valider l’ordre
          </button>
        </div>
      )}
      {locked && reveal && (
        <ol className="chrono-solution">
          {sorted.map((e) => (
            <li key={e.label}>
              <strong>{e.marker ?? e.year}</strong> — {e.label}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
