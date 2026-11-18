import type { Question, Subject, Theme } from '../types';
import expansion from './hg/expansion-monde-connu.json';
import colonial from './hg/empire-colonial-afrique.json';
import environnements from './hg/environnements.json';
import pacifique from './hg/pacifique.json';

const hgThemes: Theme[] = [
  {
    id: 'expansion',
    section: 'Histoire',
    title: 'L’expansion du monde connu (XVe-XVIIIe siècle)',
    isNew: true,
    questions: expansion as Question[],
  },
  {
    id: 'colonial',
    section: 'Histoire',
    title: 'L’Empire colonial français en Afrique (1884-1962)',
    questions: colonial as Question[],
  },
  {
    id: 'environnements',
    section: 'Géographie',
    title: 'Environnements : approches géographiques',
    questions: environnements as Question[],
  },
  {
    id: 'pacifique',
    section: 'Géographie',
    title: 'Le Pacifique',
    isNew: true,
    questions: pacifique as Question[],
  },
];

/** Registre des matières. Ajouter « Lettres » ici plus tard. */
export const SUBJECTS: Subject[] = [
  { id: 'hg', title: 'Histoire-Géographie', themes: hgThemes },
];

export const ALL_THEMES: Theme[] = SUBJECTS.flatMap((s) => s.themes);
export const ALL_QUESTIONS: Question[] = ALL_THEMES.flatMap((t) => t.questions);
export const QUESTION_BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));
export const themeById = (id: string) => ALL_THEMES.find((t) => t.id === id);
