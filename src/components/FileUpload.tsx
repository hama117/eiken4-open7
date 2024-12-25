import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { Question } from '../types';

interface FileUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onQuestionsLoaded }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const questions: Question[] = results.data
          .filter((row: any[]) => row.length === 6)
          .map((row: any[]) => ({
            question: row[0],
            choices: [row[1], row[2], row[3], row[4]],
            correctAnswer: parseInt(row[5], 10),
          }));
        onQuestionsLoaded(questions);
      },
      header: false,
      skipEmptyLines: true,
    });
  }, [onQuestionsLoaded]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            問題ファイルをアップロード
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            CSVファイルを選択してください
          </p>
        </div>
        <div className="mt-8">
          <label
            htmlFor="file-upload"
            className="cursor-pointer relative w-full flex justify-center py-2 px-4 border-2 border-dashed border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span>ファイルを選択</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>
    </div>
  );
};