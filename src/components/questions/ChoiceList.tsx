type Props = {
  choices: string[];
  correctIndex: number;
  selected: number | null;
  reveal: boolean;
  onSelect: (i: number) => void;
};

/** Liste de choix partagée par QCM et Notions. */
export function ChoiceList({ choices, correctIndex, selected, reveal, onSelect }: Props) {
  const locked = selected !== null;
  return (
    <div className="choices">
      {choices.map((c, i) => {
        let cls = 'choice';
        if (locked && reveal) {
          if (i === correctIndex) cls += ' correct';
          else if (i === selected) cls += ' wrong';
        } else if (i === selected) cls += ' picked';
        return (
          <button key={i} className={cls} disabled={locked} onClick={() => onSelect(i)}>
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
            <span>{c}</span>
          </button>
        );
      })}
    </div>
  );
}
