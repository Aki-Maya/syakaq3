"use client";

import { useState } from 'react';

// 問題データの型定義
interface QuestionFormData {
  subject: 'geography' | 'history' | 'civics';
  question: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 各科目のカテゴリー定義
const CATEGORIES = {
  geography: [
    { id: 'climate', name: '気候' },
    { id: 'industry', name: '産業' },
    { id: 'regions', name: '地方' },
    { id: 'prefecture', name: '都道府県' }
  ],
  history: [
    { id: 'primitive', name: '原始' },
    { id: 'ancient', name: '古代' },
    { id: 'medieval', name: '中世' },
    { id: 'early-modern', name: '近世' },
    { id: 'modern', name: '近代' },
    { id: 'contemporary', name: '現代' }
  ],
  civics: [
    { id: 'politics', name: '政治制度' },
    { id: 'human-rights', name: '人権' },
    { id: 'economics', name: '経済' },
    { id: 'constitution', name: '憲法' }
  ]
};

const QuestionCreationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<QuestionFormData>({
    subject: 'geography',
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    category: 'climate',
    difficulty: 'medium'
  });

  // フォームフィールドの更新
  const updateField = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 科目が変更された場合、カテゴリーをリセット
    if (field === 'subject') {
      setFormData(prev => ({
        ...prev,
        subject: value,
        category: CATEGORIES[value as keyof typeof CATEGORIES][0].id
      }));
    }
  };

  // 選択肢の更新
  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options] as [string, string, string, string];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  // フォームバリデーション
  const validateForm = (): string | null => {
    if (!formData.question.trim()) return '問題文を入力してください';
    
    for (let i = 0; i < 4; i++) {
      if (!formData.options[i].trim()) return `選択肢${i + 1}を入力してください`;
    }
    
    if (!formData.explanation.trim()) return '解説を入力してください';
    
    return null;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const errorMessage = validateForm();
    if (errorMessage) {
      setMessage({ type: 'error', text: errorMessage });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/add-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formData.subject,
          questionData: {
            question: formData.question,
            options: formData.options,
            correct: formData.correct,
            explanation: formData.explanation,
            category: formData.category,
            difficulty: formData.difficulty
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ 問題を追加しました！ (ID: ${result.id})` 
        });
        
        // フォームをリセット
        setFormData({
          subject: 'geography',
          question: '',
          options: ['', '', '', ''],
          correct: 0,
          explanation: '',
          category: 'climate',
          difficulty: 'medium'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: `❌ エラー: ${result.error}` 
        });
      }
    } catch (error) {
      console.error('問題追加エラー:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ サーバーエラーが発生しました' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームクリア
  const clearForm = () => {
    setFormData({
      subject: 'geography',
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
      category: 'climate',
      difficulty: 'medium'
    });
    setMessage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* メッセージ表示 */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* 科目選択 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">科目</label>
          <select
            value={formData.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="geography">地理</option>
            <option value="history">歴史</option>
            <option value="civics">公民</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
          <select
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES[formData.subject].map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
          <select
            value={formData.difficulty}
            onChange={(e) => updateField('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy (簡単)</option>
            <option value="medium">Medium (普通)</option>
            <option value="hard">Hard (難しい)</option>
          </select>
        </div>
      </div>

      {/* 問題文 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          問題文 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => updateField('question', e.target.value)}
          placeholder="問題文を入力してください..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 選択肢 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          選択肢 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={formData.correct === index}
                onChange={() => updateField('correct', index)}
                className="text-blue-500"
              />
              <span className="text-sm font-medium">{index + 1}.</span>
              <input
                type="text"
                value={formData.options[index]}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`選択肢${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          ラジオボタンで正解を選択してください （現在の正解: {formData.correct + 1}）
        </p>
      </div>

      {/* 解説 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          解説 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.explanation}
          onChange={(e) => updateField('explanation', e.target.value)}
          placeholder="問題の解説を入力してください..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? '追加中...' : '➕ 問題を追加'}
        </button>
        
        <button
          type="button"
          onClick={clearForm}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          🗑️ クリア
        </button>
      </div>
    </form>
  );
};

export default QuestionCreationForm;