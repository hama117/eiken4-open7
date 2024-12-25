import React, { useState, useEffect } from 'react';
import { APIKeyInput } from './components/APIKeyInput';
import { FileUpload } from './components/FileUpload';
import { QuestionDisplay } from './components/QuestionDisplay';
import { Results } from './components/Results';
import { Header } from './components/Header';
import { Question, TestState } from './types';
import { getStoredApiKey } from './utils/storage';

function App() {
  const [apiKeySubmitted, setApiKeySubmitted] = useState(false);
  const [testState, setTestState] = useState<TestState | null>(null);

  useEffect(() => {
    const storedApiKey = getStoredApiKey();
    if (storedApiKey) {
      setApiKeySubmitted(true);
    }
  }, []);

  const handleQuestionsLoaded = (questions: Question[]) => {
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    setTestState({
      questions: shuffledQuestions,
      currentQuestionIndex: 0,
      score: 0,
      questionsAnswered: 0,
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!testState) return;
    setTestState({
      ...testState,
      score: isCorrect ? testState.score + 1 : testState.score,
    });
  };

  const handleNext = () => {
    if (!testState) return;
    setTestState({
      ...testState,
      currentQuestionIndex: testState.currentQuestionIndex + 1,
      questionsAnswered: testState.questionsAnswered + 1,
    });
  };

  const handleReset = () => {
    setApiKeySubmitted(false);
    setTestState(null);
  };

  const renderContent = () => {
    if (!apiKeySubmitted) {
      return <APIKeyInput onKeySubmit={() => setApiKeySubmitted(true)} />;
    }

    if (!testState) {
      return <FileUpload onQuestionsLoaded={handleQuestionsLoaded} />;
    }

    if (testState.questionsAnswered === 10) {
      return <Results score={testState.score} onRestart={handleReset} />;
    }

    return (
      <QuestionDisplay
        question={testState.questions[testState.currentQuestionIndex]}
        onAnswer={handleAnswer}
        onNext={handleNext}
        questionsAnswered={testState.questionsAnswered}
        score={testState.score}
      />
    );
  };

  return (
    <>
      <Header onReset={handleReset} />
      <main className="pt-16">
        {renderContent()}
      </main>
    </>
  );
}

export default App;