import type { Definition as DefQ } from '../../types';
import type { QuestionProps } from './QuestionView';
import { ChoiceList } from './ChoiceList';

export function Definition({ pq, answer, reveal, onAnswer }: QuestionProps) {
  const q = pq.q as DefQ;
  return (
    <>
      <p className="prompt-label">Quelle notion correspond à cette définition ?</p>
      <blockquote className="definition">{q.definition}</blockquote>
      <ChoiceList
        choices={pq.choices!}
        correctIndex={pq.correctIndex!}
        selected={answer?.type === 'choice' ? answer.index : null}
        reveal={reveal}
        onSelect={(index) => onAnswer({ type: 'choice', index })}
      />
    </>
  );
}
