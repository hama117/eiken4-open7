import React from 'react';
import { Trophy } from 'lucide-react';

interface ResultsProps {
  score: number;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ score, onRestart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Trophy className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">テスト完了！</h2>
          <div className="mt-4">
            <p className="text-xl font-semibold">
              スコア: {score}/10
            </p>
            <p className="mt-2 text-gray-600">
              正答率: {(score / 10 * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={onRestart}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            もう一度挑戦する
          </button>
        </div>
      </div>
    </div>
  );
};