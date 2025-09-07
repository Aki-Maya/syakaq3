"use client";

import { useState } from 'react';
import { GeneratedQuestion } from '@/lib/genspark-ai';

interface QuestionEditorProps {
  question: GeneratedQuestion;
  onSave: (updatedQuestion: GeneratedQuestion) => void;
  onCancel: () => void;
}

export const QuestionEditor = ({ question, onSave, onCancel }: QuestionEditorProps) => {
  const [editedQuestion, setEditedQuestion] = useState<GeneratedQuestion>({ ...question });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleQuestionChange = (newQuestionText: string) => {
    setEditedQuestion(prev => ({ ...prev, question: newQuestionText }));
  };

  const handleOptionChange = (index: number, newText: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = newText;
    setEditedQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    if (editedQuestion.options.length < 6) { // 最大6択まで
      setEditedQuestion(prev => ({ 
        ...prev, 
        options: [...prev.options, '新しい選択肢'] 
      }));
    }
  };

  const handleRemoveOption = (index: number) => {
    if (editedQuestion.options.length > 2) { // 最低2択は維持
      const newOptions = editedQuestion.options.filter((_, i) => i !== index);
      let newCorrect = editedQuestion.correct;
      
      // 正解インデックスの調整
      if (index < editedQuestion.correct) {
        newCorrect = editedQuestion.correct - 1;
      } else if (index === editedQuestion.correct && index === newOptions.length) {
        newCorrect = newOptions.length - 1;
      }
      
      setEditedQuestion(prev => ({ 
        ...prev, 
        options: newOptions,
        correct: newCorrect
      }));
    }
  };

  const handleCorrectAnswerChange = (newCorrectIndex: number) => {
    setEditedQuestion(prev => ({ ...prev, correct: newCorrectIndex }));
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setEditedQuestion(prev => ({ ...prev, difficulty: newDifficulty }));
  };

  const handleExplanationChange = (newExplanation: string) => {
    setEditedQuestion(prev => ({ ...prev, explanation: newExplanation }));
  };

  const handleSave = () => {
    onSave(editedQuestion);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isPreviewMode) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">問題プレビュー</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewMode(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              編集に戻る
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              保存
            </button>
          </div>
        </div>

        {/* プレビュー表示 */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(editedQuestion.difficulty)}`}>
              {editedQuestion.difficulty.toUpperCase()}
            </span>
            <span className="text-sm text-gray-600">{editedQuestion.subject}</span>
          </div>
          
          <h4 className="font-bold text-lg mb-4">{editedQuestion.question}</h4>
          
          <div className="space-y-2 mb-4">
            {editedQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  index === editedQuestion.correct 
                    ? 'bg-green-100 border-green-500 text-green-800' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <span className="font-bold">{index + 1}.</span> {option}
                {index === editedQuestion.correct && (
                  <span className="ml-2 text-green-600 font-bold">✓ 正解</span>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <h5 className="font-bold text-blue-800 mb-2">💡 解説</h5>
            <p className="text-blue-700">{editedQuestion.explanation}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">問題編集</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreviewMode(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            プレビュー
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            保存
          </button>
        </div>
      </div>

      {/* 難易度設定 */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">難易度</label>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyChange(difficulty as any)}
              className={`px-4 py-2 rounded-lg border font-bold ${
                editedQuestion.difficulty === difficulty 
                  ? getDifficultyColor(difficulty)
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {difficulty.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 問題文編集 */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">問題文</label>
        <textarea
          value={editedQuestion.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="問題文を入力してください..."
        />
      </div>

      {/* 選択肢編集 */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">選択肢</label>
        <div className="space-y-3">
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={index === editedQuestion.correct}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="mr-2"
                />
                <span className="text-sm font-bold text-gray-600 w-8">
                  {index + 1}.
                </span>
              </div>
              
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`選択肢 ${index + 1}`}
              />
              
              {editedQuestion.options.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  削除
                </button>
              )}
            </div>
          ))}
          
          {editedQuestion.options.length < 6 && (
            <button
              onClick={handleAddOption}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
            >
              + 選択肢を追加
            </button>
          )}
        </div>
      </div>

      {/* 解説編集 */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">解説</label>
        <textarea
          value={editedQuestion.explanation}
          onChange={(e) => handleExplanationChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="解説を入力してください..."
        />
      </div>

      {/* 元の情報表示 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold text-gray-700 mb-2">元の情報</h4>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">キーワード:</span> {editedQuestion.source.keyword}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">元の説明:</span> {editedQuestion.source.explanation}
        </p>
      </div>
    </div>
  );
};