"use client";

import Link from 'next/link';
import { calculateXPFromScore } from '@/data/index';

interface QuizResultProps {
  correctAnswers: number;
  totalQuestions: number;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
  }>;
  userAnswers: (number | null)[];
  onRestart: () => void;
}

export const QuizResult = ({ 
  correctAnswers, 
  totalQuestions, 
  questions, 
  userAnswers, 
  onRestart 
}: QuizResultProps) => {
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const earnedCoins = correctAnswers * 10;

  const getResultMessage = () => {
    if (accuracy >= 90) return { emoji: '🏆', message: '素晴らしい！', color: 'text-yellow-600' };
    if (accuracy >= 80) return { emoji: '🎉', message: 'とても良い！', color: 'text-green-600' };
    if (accuracy >= 70) return { emoji: '👍', message: '良い！', color: 'text-blue-600' };
    if (accuracy >= 60) return { emoji: '😊', message: 'まあまあ！', color: 'text-purple-600' };
    return { emoji: '📚', message: '復習が必要かも', color: 'text-gray-600' };
  };

  const result = getResultMessage();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 結果サマリー */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
        <div className="text-6xl mb-4">{result.emoji}</div>
        <h2 className={`text-3xl font-bold mb-2 ${result.color}`}>{result.message}</h2>
        <div className="text-xl text-gray-600 mb-6">
          正解率: <span className="font-bold text-2xl">{accuracy}%</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-green-600 text-2xl font-bold">{correctAnswers}</div>
            <div className="text-green-700">正解数</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-600 text-2xl font-bold">+{earnedXP}</div>
            <div className="text-blue-700">獲得XP</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-yellow-600 text-2xl font-bold">+{earnedCoins}</div>
            <div className="text-yellow-700">獲得コイン</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
          >
            もう一度挑戦
          </button>
          <Link
            href="/"
            className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors text-center"
          >
            ホームに戻る
          </Link>
        </div>
      </div>

      {/* 問題別詳細結果 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📝 問題別詳細結果</h3>
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correct;
          
          return (
            <div key={index} className={`bg-white rounded-lg p-6 border-l-4 ${
              isCorrect ? 'border-green-500' : 'border-red-500'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-gray-800 flex-1">
                  問題 {index + 1}: {question.question}
                </h4>
                <div className={`text-2xl ml-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect ? '✅' : '❌'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => {
                  const isUserAnswer = userAnswer === optionIndex;
                  const isCorrectAnswer = optionIndex === question.correct;
                  
                  let className = "p-2 rounded border ";
                  if (isCorrectAnswer) {
                    className += "bg-green-100 border-green-500 text-green-800";
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    className += "bg-red-100 border-red-500 text-red-800";
                  } else {
                    className += "bg-gray-50 border-gray-300";
                  }
                  
                  return (
                    <div key={optionIndex} className={className}>
                      {optionIndex + 1}. {option}
                      {isCorrectAnswer && " ← 正解"}
                      {isUserAnswer && !isCorrectAnswer && " ← あなたの回答"}
                    </div>
                  );
                })}
              </div>
              
              {question.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
                  <p className="text-blue-800">
                    <strong>解説:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};