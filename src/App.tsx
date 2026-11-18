import { useState } from 'react';
import type { AnswerRecord, Mode, PreparedQuestion, QuizConfig } from './types';
import { buildQuiz, prepare } from './lib/quiz';
import { recordSession } from './lib/storage';
import { Home } from './components/Home';
import { QuizRunner } from './components/QuizRunner';
import { Results } from './components/Results';
import { Stats } from './components/Stats';

type Screen =
  | { name: 'home' }
  | { name: 'stats' }
  | { name: 'quiz'; questions: PreparedQuestion[]; mode: Mode; runId: number }
  | { name: 'results'; records: AnswerRecord[]; mode: Mode };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  const startQuiz = (questions: PreparedQuestion[], mode: Mode) => {
    if (questions.length === 0) return;
    setScreen({ name: 'quiz', questions, mode, runId: Date.now() });
    window.scrollTo(0, 0);
  };

  const start = (cfg: QuizConfig) => startQuiz(buildQuiz(cfg), cfg.mode);

  return (
    <main className="app">
      {screen.name === 'home' && <Home onStart={start} onStats={() => setScreen({ name: 'stats' })} />}
      {screen.name === 'stats' && <Stats onBack={() => setScreen({ name: 'home' })} />}
      {screen.name === 'quiz' && (
        <QuizRunner
          key={screen.runId}
          questions={screen.questions}
          mode={screen.mode}
          onQuit={() => setScreen({ name: 'home' })}
          onFinish={(records) => {
            const themes = [...new Set(records.map((r) => r.pq.q.theme))];
            recordSession(screen.mode, records.filter((r) => r.correct).length, records.length, themes);
            setScreen({ name: 'results', records, mode: screen.mode });
            window.scrollTo(0, 0);
          }}
        />
      )}
      {screen.name === 'results' && (
        <Results
          records={screen.records}
          onHome={() => setScreen({ name: 'home' })}
          onRetryWrong={() =>
            startQuiz(
              screen.records.filter((r) => !r.correct).map((r) => prepare(r.pq.q)),
              'errors',
            )
          }
        />
      )}
    </main>
  );
}
