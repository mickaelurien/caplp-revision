import type { PreparedQuestion, UserAnswer } from '../../types';
import { Mcq } from './Mcq';
import { TrueFalse } from './TrueFalse';
import { Definition } from './Definition';
import { Chronology } from './Chronology';

export type QuestionProps = {
  pq: PreparedQuestion;
  answer: UserAnswer | null;
  /** Afficher la correction (faux en mode examen tant que l'examen n'est pas fini). */
  reveal: boolean;
  onAnswer: (a: UserAnswer) => void;
};

export function QuestionView(props: QuestionProps) {
  switch (props.pq.q.type) {
    case 'mcq':
      return <Mcq {...props} />;
    case 'truefalse':
      return <TrueFalse {...props} />;
    case 'definition':
      return <Definition {...props} />;
    case 'chronology':
      return <Chronology {...props} />;
  }
}
