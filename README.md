# Révisions CAPLP interne – Lettres / Histoire-Géographie (session 2027)

SPA de quiz (Vite + React + TypeScript), sans backend. La progression est stockée dans le navigateur (`localStorage`).

## Lancer

```bash
nvm use 22          # Node ≥ 18 requis
npm install
npm run dev         # http://localhost:5173
npm run build       # build statique dans dist/ (déployable tel quel : Netlify, GitHub Pages…)
npm run validate-data
```

## Contenu

Programme 2027 – Histoire-Géographie, 50 questions par thème :

| Fichier | Thème |
|---|---|
| `src/data/hg/expansion-monde-connu.json` | L'expansion du monde connu (XVe-XVIIIe s.) |
| `src/data/hg/empire-colonial-afrique.json` | L'Empire colonial français en Afrique (1884-1962) |
| `src/data/hg/environnements.json` | Environnements : approches géographiques |
| `src/data/hg/pacifique.json` | Le Pacifique |

Formats : QCM, Vrai/Faux, Notions (définition → notion), Chronologie (remettre dans l'ordre).
Modes : Entraînement, Révision des erreurs (une question est « maîtrisée » après 2 bonnes réponses consécutives), Examen blanc (20 questions, correction à la fin).

## Ajouter des questions / une matière

- Ajouter des questions : compléter le JSON du thème (schéma dans `src/types.ts`, ids uniques), puis `npm run validate-data`.
- Ajouter une matière (ex. Lettres) : créer `src/data/lettres/*.json` et l'enregistrer dans `SUBJECTS` (`src/data/subjects.ts`).
