import React from 'react';
import { RotateCcw } from 'lucide-react';
import { removeApiKey } from '../utils/storage';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const handleReset = () => {
    if (window.confirm('本当にリセットしますか？\n進捗が失われます。')) {
      removeApiKey();
      onReset();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-lg font-semibold text-gray-900">英検4級 練習問題</h1>
          <button
            onClick={handleReset}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            リセット
          </button>
        </div>
      </div>
    </header>
  );
};