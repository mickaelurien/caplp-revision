import type { AnswerRecord } from '../types';
import { TYPE_LABELS } from '../types';
import { correctAnswerText, questionText } from './Feedback';

type Props = {
  records: AnswerRecord[];
  onRetryWrong: () => void;
  onHome: () => void;
};

function verdict(pct: number) {
  if (pct >= 90) return 'Excellent, c’est maîtrisé !';
  if (pct >= 70) return 'Très bien, encore quelques points à consolider.';
  if (pct >= 50) return 'Correct — on revoit les erreurs ?';
  return 'Ça se travaille : relis les explications et refais les erreurs.';
}

export function Results({ records, onRetryWrong, onHome }: Props) {
  const score = records.filter((r) => r.correct).length;
  const pct = records.length ? Math.round((score / records.length) * 100) : 0;
  const wrong = records.filter((r) => !r.correct);

  return (
    <div className="results">
      <div className="card center">
        <p className="big-score">
          {score}/{records.length}
        </p>
        <p className="pct">{pct} %</p>
        <p>{verdict(pct)}</p>
        <div className="row center">
          {wrong.length > 0 && (
            <button className="btn primary" onClick={onRetryWrong}>
              Refaire mes {wrong.length} erreur{wrong.length > 1 ? 's' : ''}
            </button>
          )}
          <button className="btn" onClick={onHome}>
            Accueil
          </button>
        </div>
      </div>

      {wrong.length > 0 && (
        <>
          <h2>À retenir</h2>
          {wrong.map((r, i) => (
            <div key={i} className="card review">
              <span className="badge">{TYPE_LABELS[r.pq.q.type]}</span>
              <p className="prompt small">{questionText(r.pq)}</p>
              <p>
                <strong>Réponse : </strong>
                {correctAnswerText(r.pq)}
              </p>
              <p className="explanation">{r.pq.q.explanation}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
