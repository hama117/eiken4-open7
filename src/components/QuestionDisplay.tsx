import React, { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Question } from '../types';
import { generateExplanation } from '../utils/openai';

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  questionsAnswered: number;
  score: number;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  onNext,
  questionsAnswered,
  score,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleToken = useCallback((token: string) => {
    setExplanation(prev => prev + token);
  }, []);

  const handleAnswer = async () => {
    if (selectedAnswer === null || isAnswered) return;

    const isCorrect = selectedAnswer === question.correctAnswer - 1;
    setIsAnswered(true);
    onAnswer(isCorrect);
    setError(null);
    setIsLoading(true);
    setExplanation('');

    try {
      await generateExplanation(
        question.question,
        question.choices,
        question.correctAnswer,
        handleToken
      );
    } catch (error: any) {
      console.error('Failed to get explanation:', error);
      setError(error.message || '解説の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setExplanation('');
    setIsAnswered(false);
    setError(null);
    onNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">問題 {questionsAnswered + 1}/10</span>
              <span className="text-sm text-gray-600">スコア: {score}/10</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h2>
            <div className="space-y-3">
              {question.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => !isAnswered && setSelectedAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedAnswer === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  } ${
                    isAnswered
                      ? index === question.correctAnswer - 1
                        ? 'bg-green-50 border-green-500'
                        : selectedAnswer === index
                        ? 'bg-red-50 border-red-500'
                        : ''
                      : ''
                  }`}
                  disabled={isAnswered}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          {!isAnswered ? (
            <button
              onClick={handleAnswer}
              disabled={selectedAnswer === null}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
            >
              回答する
            </button>
          ) : (
            <div className="space-y-4">
              {error ? (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">解説</h3>
                  <p className="whitespace-pre-wrap min-h-[100px] text-gray-700">
                    {explanation || (isLoading && '解説を生成中...')}
                  </p>
                </div>
              )}
              <button
                onClick={handleNext}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {questionsAnswered === 9 ? '結果を見る' : '次の問題へ'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};