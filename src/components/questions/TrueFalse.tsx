import type { TrueFalse as TfQ } from '../../types';
import type { QuestionProps } from './QuestionView';

export function TrueFalse({ pq, answer, reveal, onAnswer }: QuestionProps) {
  const q = pq.q as TfQ;
  const selected = answer?.type === 'bool' ? answer.value : null;
  const locked = selected !== null;
  const cls = (v: boolean) => {
    let c = 'choice tf';
    if (locked && reveal) {
      if (v === q.answer) c += ' correct';
      else if (v === selected) c += ' wrong';
    } else if (v === selected) c += ' picked';
    return c;
  };
  return (
    <>
      <p className="prompt-label">Vrai ou faux ?</p>
      <p className="prompt">{q.statement}</p>
      <div className="tf-row">
        <button className={cls(true)} disabled={locked} onClick={() => onAnswer({ type: 'bool', value: true })}>
          Vrai
        </button>
        <button className={cls(false)} disabled={locked} onClick={() => onAnswer({ type: 'bool', value: false })}>
          Faux
        </button>
      </div>
    </>
  );
}
