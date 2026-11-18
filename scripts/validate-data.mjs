// Vérifie la cohérence des banques de questions : node scripts/validate-data.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const dirs = readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory());

const ids = new Set();
let errors = 0;
const fail = (file, id, msg) => {
  errors++;
  console.error(`✗ ${file} [${id}] ${msg}`);
};

for (const d of dirs) {
  for (const f of readdirSync(join(root, d.name)).filter((x) => x.endsWith('.json'))) {
    const file = `${d.name}/${f}`;
    let data;
    try {
      data = JSON.parse(readFileSync(join(root, d.name, f), 'utf8'));
    } catch (e) {
      fail(file, '-', `JSON invalide : ${e.message}`);
      continue;
    }
    const count = { mcq: 0, truefalse: 0, definition: 0, chronology: 0 };
    const answerPos = [0, 0, 0, 0];
    const themes = new Set();
    for (const q of data) {
      const id = q.id ?? '?';
      if (!q.id) fail(file, id, 'id manquant');
      if (ids.has(q.id)) fail(file, id, 'id dupliqué');
      ids.add(q.id);
      themes.add(q.theme);
      if (![1, 2, 3].includes(q.difficulty)) fail(file, id, 'difficulty invalide');
      if (!q.explanation?.trim()) fail(file, id, 'explication vide');
      if (!(q.type in count)) {
        fail(file, id, `type inconnu ${q.type}`);
        continue;
      }
      count[q.type]++;
      if (q.type === 'mcq' || q.type === 'definition') {
        const text = q.type === 'mcq' ? q.prompt : q.definition;
        if (!text?.trim()) fail(file, id, 'énoncé vide');
        if (!Array.isArray(q.choices) || q.choices.length !== 4) fail(file, id, '4 choix attendus');
        else if (new Set(q.choices).size !== 4) fail(file, id, 'choix dupliqués');
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.choices?.length ?? 0))
          fail(file, id, 'answer hors bornes');
        else answerPos[q.answer]++;
      }
      if (q.type === 'truefalse') {
        if (!q.statement?.trim()) fail(file, id, 'affirmation vide');
        if (typeof q.answer !== 'boolean') fail(file, id, 'answer booléen attendu');
      }
      if (q.type === 'chronology') {
        if (!q.prompt?.trim()) fail(file, id, 'énoncé vide');
        if (!Array.isArray(q.events) || q.events.length < 3) fail(file, id, '≥ 3 événements attendus');
        else {
          const years = q.events.map((e) => e.year);
          if (years.some((y) => !Number.isInteger(y))) fail(file, id, 'année non entière');
          if (new Set(years).size !== years.length) fail(file, id, 'années non distinctes');
        }
      }
    }
    if (themes.size !== 1) fail(file, '-', `thème incohérent : ${[...themes].join(', ')}`);
    console.log(
      `${file} : ${data.length} questions — ${Object.entries(count).map(([k, v]) => `${k} ${v}`).join(', ')} — position bonne réponse ${answerPos.join('/')}`,
    );
  }
}

if (errors) {
  console.error(`\n${errors} erreur(s).`);
  process.exit(1);
}
console.log('\n✓ Données valides.');
