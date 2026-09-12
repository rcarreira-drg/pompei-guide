/**
 * Quiz de preparación. Modo "TODOS" (40 preguntas) o por capítulo (5 preguntas).
 * Preguntas barajadas, una a una, con corrección inmediata y explicación.
 * Guarda la mejor puntuación por modo en localStorage.
 */
import { useMemo, useState } from 'react';
import { QUIZ, type QuizQuestion } from '@/content/quiz';

const CHAPTERS: { id: QuizQuestion['chapter']; label: string }[] = [
  { id: 'origenes', label: 'ORÍGENES' },
  { id: 'roma', label: 'ROMA' },
  { id: 'ciudad', label: 'CIUDAD' },
  { id: 'vida', label: 'VIDA' },
  { id: 'arte', label: 'ARTE' },
  { id: 'erupcion', label: 'ERUPCIÓN' },
  { id: 'redescubrimiento', label: 'REDESCUBRIMIENTO' },
  { id: 'mirar', label: 'MIRAR' },
];

type Mode = 'todos' | QuizQuestion['chapter'];

const STORAGE_KEY = 'pompei-guide:quiz';

interface BestScores {
  [mode: string]: { score: number; total: number; date: string };
}

function loadBest(): BestScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BestScores) : {};
  } catch {
    return {};
  }
}

function saveBest(scores: BestScores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    /* ignore */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function questionsFor(mode: Mode): QuizQuestion[] {
  const pool = mode === 'todos' ? QUIZ : QUIZ.filter((q) => q.chapter === mode);
  return shuffle(pool);
}

function resultMessage(pct: number): string {
  if (pct >= 90) return 'DIGNO DE FIORELLI';
  if (pct >= 60) return 'BUEN CIUDADANO DE POMPEI';
  return 'VUELVE A LEER EL CAPÍTULO…';
}

export default function Quiz() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [failedChapters, setFailedChapters] = useState<Set<string>>(new Set());
  const [best, setBest] = useState<BestScores>(() => loadBest());

  const chapterCounts = useMemo(() => {
    const map = new Map<string, number>();
    QUIZ.forEach((q) => map.set(q.chapter, (map.get(q.chapter) ?? 0) + 1));
    return map;
  }, []);

  function start(m: Mode) {
    setMode(m);
    setQuestions(questionsFor(m));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFailedChapters(new Set());
  }

  function answer(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const q = questions[index];
    if (i === q.answer) {
      setCorrectCount((c) => c + 1);
    } else {
      setFailedChapters((prev) => {
        const next = new Set(prev);
        next.add(q.chapter);
        return next;
      });
    }
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      // fin: guardar mejor puntuación
      if (mode) {
        const prevBest = best[mode];
        const total = questions.length;
        if (!prevBest || correctCount / total > prevBest.score / prevBest.total) {
          const updated = { ...best, [mode]: { score: correctCount, total, date: new Date().toISOString() } };
          setBest(updated);
          saveBest(updated);
        }
      }
      setIndex((i) => i + 1); // fuerza pantalla de resultado (index === questions.length)
    }
  }

  function repeat() {
    if (mode) start(mode);
  }

  function backToModes() {
    setMode(null);
    setQuestions([]);
  }

  // ---- Selector de modo ----
  if (!mode) {
    return (
      <div className="quiz">
        <p className="mono quiz-instructions">ELIGE UN MODO PARA EMPEZAR</p>
        <div className="quiz-mode-grid">
          <button type="button" className="btn btn-primary quiz-mode-btn quiz-mode-all" onClick={() => start('todos')}>
            TODOS ({QUIZ.length})
            {best.todos && (
              <span className="quiz-mode-best mono">
                MEJOR: {best.todos.score}/{best.todos.total}
              </span>
            )}
          </button>
          <div className="quiz-mode-chips">
            {CHAPTERS.map((c) => (
              <button key={c.id} type="button" className="btn quiz-mode-btn" onClick={() => start(c.id)}>
                {c.label} ({chapterCounts.get(c.id) ?? 0})
                {best[c.id] && (
                  <span className="quiz-mode-best mono">
                    MEJOR: {best[c.id].score}/{best[c.id].total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Pantalla de resultado ----
  if (index >= questions.length) {
    const total = questions.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    const failedList = CHAPTERS.filter((c) => failedChapters.has(c.id));
    return (
      <div className="quiz quiz-result box">
        <p className="kicker">RESULTADO</p>
        <p className="quiz-score">
          {correctCount}/{total}
        </p>
        <p className="quiz-pct mono">{pct}%</p>
        <h3 className="quiz-message">{resultMessage(pct)}</h3>

        {failedList.length > 0 && (
          <div className="quiz-failed">
            <p className="mono quiz-failed-title">REPASA ESTOS CAPÍTULOS:</p>
            <ul className="quiz-failed-list">
              {failedList.map((c) => (
                <li key={c.id}>
                  <a className="btn btn-sm" href={`#/preparar/${c.id}`}>
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="quiz-result-actions">
          <button type="button" className="btn btn-primary btn-block" onClick={repeat}>
            REPETIR
          </button>
          <button type="button" className="btn btn-block" onClick={backToModes}>
            CAMBIAR DE MODO
          </button>
        </div>
      </div>
    );
  }

  // ---- Pregunta activa ----
  const q = questions[index];
  return (
    <div className="quiz">
      <div className="quiz-progress mono">
        PREGUNTA {index + 1}/{questions.length}
      </div>
      <div className="quiz-card box">
        <p className="quiz-question">{q.q}</p>
        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (selected !== null) {
              if (i === q.answer) cls += ' quiz-option--correct';
              else if (i === selected) cls += ' quiz-option--incorrect';
              else cls += ' quiz-option--disabled';
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={() => answer(i)}
                disabled={selected !== null}
                aria-pressed={selected === i}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className={`callout quiz-explain ${selected === q.answer ? 'callout--tip' : 'callout--warn'}`}>
            <p>{q.explain}</p>
          </div>
        )}
        {selected !== null && (
          <button type="button" className="btn btn-primary btn-block quiz-next" onClick={next}>
            SIGUIENTE
          </button>
        )}
      </div>
    </div>
  );
}
