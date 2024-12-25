import React, { useState, useEffect } from 'react';
import { KeyRound, AlertCircle } from 'lucide-react';
import { validateApiKey } from '../utils/openai';
import { getStoredApiKey, storeApiKey } from '../utils/storage';

interface APIKeyInputProps {
  onKeySubmit: () => void;
}

export const APIKeyInput: React.FC<APIKeyInputProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const isValid = await validateApiKey(apiKey);
      if (isValid) {
        storeApiKey(apiKey);
        onKeySubmit();
      } else {
        setError('APIキーが無効です。正しいAPIキーを入力してください。');
      }
    } catch (err) {
      setError('APIキーの検証中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            OpenAI APIキーを入力
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            英語問題の解説生成に使用します
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="apiKey" className="sr-only">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? '検証中...' : '開始'}
          </button>
        </form>
      </div>
    </div>
  );
};