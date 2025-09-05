"use client";

import { useState, useEffect } from 'react';

interface ShuffleIndicatorProps {
  originalOptions: string[];
  shuffledOptions: string[];
  originalCorrect: number;
  shuffledCorrect: number;
  questionId: string;
}

export const ShuffleIndicator = ({ 
  originalOptions, 
  shuffledOptions, 
  originalCorrect, 
  shuffledCorrect,
  questionId 
}: ShuffleIndicatorProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // シャッフルが実際に発生したかチェック
  const isShuffled = originalOptions.some((option, index) => option !== shuffledOptions[index]);

  if (!isShuffled) {
    return null; // シャッフルされていない場合は表示しない
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded-r">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">🎲</div>
          <span className="text-blue-700 font-medium text-sm">
            選択肢をランダムシャッフルしました
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-500 hover:text-blue-700 text-sm underline"
        >
          {showDetails ? '詳細を隠す' : '詳細を見る'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-3 text-xs text-blue-600 space-y-2">
          <div>
            <strong>正解の移動:</strong> {originalCorrect + 1}番 → {shuffledCorrect + 1}番
            <span className="ml-2 text-blue-500">
              ({originalOptions[originalCorrect].substring(0, 10)}...)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div>
              <div className="font-semibold text-gray-700">元の順序:</div>
              <ol className="list-decimal list-inside space-y-1">
                {originalOptions.map((option, index) => (
                  <li 
                    key={`orig-${index}`}
                    className={`text-xs ${index === originalCorrect ? 'font-bold text-green-600' : 'text-gray-600'}`}
                  >
                    {option.substring(0, 20)}...
                    {index === originalCorrect && ' ✓'}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <div className="font-semibold text-gray-700">シャッフル後:</div>
              <ol className="list-decimal list-inside space-y-1">
                {shuffledOptions.map((option, index) => (
                  <li 
                    key={`shuf-${index}`}
                    className={`text-xs ${index === shuffledCorrect ? 'font-bold text-green-600' : 'text-gray-600'}`}
                  >
                    {option.substring(0, 20)}...
                    {index === shuffledCorrect && ' ✓'}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};