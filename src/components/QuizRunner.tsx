import { useEffect, useRef, useState } from 'react';
import type { AnswerRecord, Mode, PreparedQuestion, UserAnswer } from '../types';
import { TYPE_LABELS } from '../types';
import { isCorrect } from '../lib/quiz';
import { recordAnswer } from '../lib/storage';
import { themeById } from '../data/subjects';
import { QuestionView } from './questions/QuestionView';
import { Feedback } from './Feedback';

type Props = {
  questions: PreparedQuestion[];
  mode: Mode;
  onFinish: (records: AnswerRecord[]) => void;
  onQuit: () => void;
};

const MODE_LABELS: Record<Mode, string> = {
  training: 'Entraînement',
  errors: 'Révision des erreurs',
  exam: 'Examen blanc',
};

export function QuizRunner({ questions, mode, onFinish, onQuit }: Props) {
  const [idx, setIdx] = useState(0);
  /** Réponses indexées par position de question (les questions déjà répondues restent consultables). */
  const [records, setRecords] = useState<(AnswerRecord | undefined)[]>([]);
  const topRef = useRef<HTMLDivElement>(null);
  const autoNext = useRef<number | undefined>(undefined);
  const exam = mode === 'exam';

  const pq = questions[idx];
  const last = idx === questions.length - 1;
  const done = records.filter((r): r is AnswerRecord => !!r);
  const score = done.filter((r) => r.correct).length;
  const record = records[idx];
  const current = record?.answer ?? null;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [idx]);

  useEffect(() => () => window.clearTimeout(autoNext.current), []);

  const goTo = (i: number) => {
    window.clearTimeout(autoNext.current);
    setIdx(i);
  };

  const next = (recs: (AnswerRecord | undefined)[]) => {
    if (last) onFinish(recs.filter((r): r is AnswerRecord => !!r));
    else goTo(idx + 1);
  };

  const answer = (a: UserAnswer) => {
    if (current) return;
    const correct = isCorrect(pq, a);
    recordAnswer(pq.q.id, correct);
    const recs = [...records];
    recs[idx] = { pq, answer: a, correct };
    setRecords(recs);
    if (exam) autoNext.current = window.setTimeout(() => next(recs), 250);
  };

  const theme = themeById(pq.q.theme);

  return (
    <div className="quiz" ref={topRef}>
      <div className="quiz-head">
        <button className="btn ghost small" onClick={onQuit}>
          ← Quitter
        </button>
        <span className="muted">
          {MODE_LABELS[mode]}
          {!exam && ` · ${score}/${done.length}`}
        </span>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${(done.length / questions.length) * 100}%` }} />
      </div>
      <div className="card">
        <div className="q-meta">
          <span>
            Question {idx + 1}/{questions.length}
          </span>
          <span className="badge">{TYPE_LABELS[pq.q.type]}</span>
          {theme && <span className="badge soft">{theme.section} · {theme.title}</span>}
        </div>
        <QuestionView key={pq.q.id + idx} pq={pq} answer={current} reveal={!exam} onAnswer={answer} />
        {record && !exam && <Feedback pq={pq} correct={record.correct} />}
        {(idx > 0 || record) && (
          <div className="row quiz-nav">
            {idx > 0 && (
              <button className="btn ghost" onClick={() => goTo(idx - 1)}>
                ← Précédente
              </button>
            )}
            {record && (
              <button className="btn primary grow" onClick={() => next(records)} autoFocus>
                {last ? 'Voir le résultat' : 'Question suivante →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
