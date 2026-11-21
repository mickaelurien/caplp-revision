import type { PreparedQuestion } from '../types';

export function correctAnswerText(pq: PreparedQuestion): string {
  const { q } = pq;
  switch (q.type) {
    case 'mcq':
    case 'definition':
      return q.choices[q.answer];
    case 'truefalse':
      return q.answer ? 'Vrai' : 'Faux';
    case 'chronology':
      return [...q.events]
        .sort((a, b) => a.year - b.year)
        .map((e) => `${e.marker ?? e.year} : ${e.label}`)
        .join(' → ');
  }
}

export function questionText(pq: PreparedQuestion): string {
  const { q } = pq;
  switch (q.type) {
    case 'mcq':
    case 'chronology':
      return q.prompt;
    case 'truefalse':
      return q.statement;
    case 'definition':
      return `Définition : « ${q.definition} »`;
  }
}

export function Feedback({ pq, correct }: { pq: PreparedQuestion; correct: boolean }) {
  return (
    <div className={`feedback ${correct ? 'ok' : 'ko'}`}>
      <p className="feedback-title">{correct ? '✓ Bonne réponse' : '✗ Raté'}</p>
      {!correct && pq.q.type !== 'chronology' && (
        <p>
          Réponse attendue : <strong>{correctAnswerText(pq)}</strong>
        </p>
      )}
      <p className="explanation">{pq.q.explanation}</p>
    </div>
  );
}
