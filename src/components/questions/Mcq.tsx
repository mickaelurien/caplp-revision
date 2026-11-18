import type { Mcq as McqQ } from '../../types';
import type { QuestionProps } from './QuestionView';
import { ChoiceList } from './ChoiceList';

export function Mcq({ pq, answer, reveal, onAnswer }: QuestionProps) {
  const q = pq.q as McqQ;
  return (
    <>
      <p className="prompt">{q.prompt}</p>
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
