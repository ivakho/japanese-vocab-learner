import { useEffect, useState } from 'react';
import { Icon } from './components/Icon';
import { LibraryPage } from './pages/LibraryPage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';
import { useWordSets } from './hooks/useWordSets';
import { useQuiz } from './hooks/useQuiz';
import type { ParseResult, WordSet } from './types/vocabulary';
import type { QuizState } from './types/quiz';

function App() {
  const { wordSets, addWordSet, deleteWordSet } = useWordSets();
  const [activeSet, setActiveSet] = useState<WordSet | null>(null);
  const [view, setView] = useState<'library' | 'quiz' | 'result'>('library');
  const [result, setResult] = useState<{ correct: number; incorrect: number } | null>(null);
  const quiz = useQuiz(activeSet);

  const handleImported = (parsed: ParseResult) => addWordSet(parsed);

  const startQuiz = (wordSet: WordSet) => {
    setActiveSet(wordSet);
    setResult(null);
    setView('quiz');
  };

  useEffect(() => {
    if (view === 'quiz' && activeSet && quiz.state.currentQuestion === null) {
      quiz.startQuiz();
    }
  }, [view, activeSet, quiz.state.currentQuestion, quiz.startQuiz]);

  const handleExitQuiz = () => {
    quiz.resetQuiz();
    setView('library');
  };

  const handleComplete = (finalState: QuizState) => {
    setResult({ correct: finalState.correctAnswers, incorrect: finalState.incorrectAnswers });
    setView('result');
  };

  const handleReplay = () => {
    quiz.startQuiz();
    setView('quiz');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand" role="button" tabIndex={0} onClick={handleExitQuiz} onKeyDown={(event) => { if (event.key === 'Enter') handleExitQuiz(); }}>
          <div className="brand-mark"><Icon name="book" size={18} /></div>
          <div><strong>Lingua Cards</strong><span>Japanese vocabulary</span></div>
        </div>
        <div className="header-note">Local-first · No account needed</div>
      </header>

      {view === 'library' && (
        <LibraryPage wordSets={wordSets} onImported={handleImported} onStart={startQuiz} onDelete={deleteWordSet} />
      )}

      {view === 'quiz' && activeSet && quiz.state.currentQuestion && (
        <QuizPage
          wordSet={activeSet}
          state={quiz.state}
          onAnswer={quiz.submitAnswer}
          onContinue={quiz.continueQuiz}
          onExit={handleExitQuiz}
          onComplete={handleComplete}
        />
      )}

      {view === 'result' && activeSet && result && (
        <ResultPage
          wordSet={activeSet}
          correct={result.correct}
          incorrect={result.incorrect}
          onReplay={handleReplay}
          onBack={handleExitQuiz}
        />
      )}

      <footer className="app-footer">Your vocabulary stays in this browser.</footer>
    </div>
  );
}

export default App;
