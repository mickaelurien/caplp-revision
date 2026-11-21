import type { Question, Subject, Theme } from '../types';
import expansion from './hg/expansion-monde-connu.json';
import colonial from './hg/empire-colonial-afrique.json';
import environnements from './hg/environnements.json';
import pacifique from './hg/pacifique.json';
import ronsard from './fr/ronsard.json';
import phedre from './fr/phedre.json';
import manon from './fr/manon-lescaut.json';
import spleen from './fr/spleen-paris.json';
import caligula from './fr/caligula.json';
import slimani from './fr/parfum-fleurs-nuit.json';
import grammaire from './fr/grammaire.json';
import figures from './fr/figures-style.json';
import genres from './fr/genres-histoire.json';
import programmes from './fr/programmes.json';

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

const OEUVRES = 'Œuvres au programme';
const LANGUE = 'Langue et littérature';
const DIDACTIQUE = 'Didactique';

const frThemes: Theme[] = [
  {
    id: 'ronsard',
    section: OEUVRES,
    title: 'Ronsard, Second livre des Sonnets pour Hélène',
    questions: ronsard as Question[],
  },
  { id: 'phedre', section: OEUVRES, title: 'Racine, Phèdre', questions: phedre as Question[] },
  { id: 'manon', section: OEUVRES, title: 'Prévost, Manon Lescaut', questions: manon as Question[] },
  { id: 'spleen', section: OEUVRES, title: 'Baudelaire, Le Spleen de Paris', questions: spleen as Question[] },
  { id: 'caligula', section: OEUVRES, title: 'Camus, Caligula', questions: caligula as Question[] },
  {
    id: 'slimani',
    section: OEUVRES,
    title: 'Slimani, Le Parfum des fleurs la nuit',
    questions: slimani as Question[],
  },
  { id: 'grammaire', section: LANGUE, title: 'Grammaire et étude de la langue', questions: grammaire as Question[] },
  {
    id: 'figures',
    section: LANGUE,
    title: 'Procédés littéraires et figures de style',
    questions: figures as Question[],
  },
  {
    id: 'genres',
    section: LANGUE,
    title: 'Genres littéraires et histoire littéraire',
    questions: genres as Question[],
  },
  {
    id: 'programmes',
    section: DIDACTIQUE,
    title: 'Programmes officiels et attendus des élèves',
    questions: programmes as Question[],
  },
];

/** Registre des matières. */
export const SUBJECTS: Subject[] = [
  { id: 'hg', title: 'Histoire-Géographie', themes: hgThemes },
  { id: 'fr', title: 'Français', themes: frThemes },
];

export const ALL_THEMES: Theme[] = SUBJECTS.flatMap((s) => s.themes);
export const ALL_QUESTIONS: Question[] = ALL_THEMES.flatMap((t) => t.questions);
export const QUESTION_BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));
export const themeById = (id: string) => ALL_THEMES.find((t) => t.id === id);
export const subjectOfTheme = (id: string) => SUBJECTS.find((s) => s.themes.some((t) => t.id === id));
