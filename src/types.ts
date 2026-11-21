export type QuestionType = 'mcq' | 'truefalse' | 'definition' | 'chronology';

type Base = {
  id: string;
  theme: string;
  difficulty: 1 | 2 | 3;
  explanation: string;
  tags?: string[];
};

export type Mcq = Base & { type: 'mcq'; prompt: string; choices: string[]; answer: number };
export type TrueFalse = Base & { type: 'truefalse'; statement: string; answer: boolean };
export type Definition = Base & { type: 'definition'; definition: string; choices: string[]; answer: number };
/** `year` sert de clé de tri ; `marker` (optionnel) est affiché à sa place pour un ordre non daté (ex. « Acte II »). */
export type ChronoEvent = { label: string; year: number; marker?: string };
export type Chronology = Base & { type: 'chronology'; prompt: string; events: ChronoEvent[] };

export type Question = Mcq | TrueFalse | Definition | Chronology;

export type Theme = {
  id: string;
  title: string;
  section: string; // ex. « Histoire », « Géographie »
  isNew?: boolean;
  questions: Question[];
};

export type Subject = {
  id: string;
  title: string;
  themes: Theme[];
};

export type Mode = 'training' | 'errors' | 'exam';

export type QuizConfig = {
  mode: Mode;
  themeIds: string[];
  types: QuestionType[];
  count: number;
};

/** Réponse donnée par l'utilisatrice, normalisée par type. */
export type UserAnswer =
  | { type: 'choice'; index: number } // index dans les choix *affichés*
  | { type: 'bool'; value: boolean }
  | { type: 'order'; order: number[] }; // indices d'événements (dans l'ordre affiché) rangés par l'utilisatrice

/** Question préparée pour l'affichage (choix mélangés). */
export type PreparedQuestion = {
  q: Question;
  choices?: string[]; // choix mélangés (mcq/definition)
  correctIndex?: number; // index de la bonne réponse dans `choices`
  events?: ChronoEvent[]; // événements mélangés (chronology)
};

export type AnswerRecord = {
  pq: PreparedQuestion;
  answer: UserAnswer;
  correct: boolean;
};

export const TYPE_LABELS: Record<QuestionType, string> = {
  mcq: 'QCM',
  truefalse: 'Vrai / Faux',
  definition: 'Notions',
  chronology: 'Chronologie',
};
