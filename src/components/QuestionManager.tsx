"use client";

import { useState, useEffect } from 'react';
import { UnifiedQuestion } from '@/data/questions-unified-complete';

interface QuestionStats {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  subjectCounts: {
    geography: number;
    history: number;
    civics: number;
  };
  difficultyCounts: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface ApiResponse {
  success: boolean;
  questions: UnifiedQuestion[];
  stats: QuestionStats;
  error?: string;
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<UnifiedQuestion[]>([]);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<UnifiedQuestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 問題一覧を取得
  const fetchQuestions = async (page = 1, subject = 'all', category = 'all') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        subject,
        category
      });

      const response = await fetch(`/api/get-questions?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setQuestions(data.questions);
        setStats(data.stats);
      } else {
        throw new Error(data.error || '問題の取得に失敗しました');
      }
    } catch (error) {
      console.error('問題取得エラー:', error);
      alert('問題の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 問題を削除
  const deleteQuestion = async (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    if (!confirm(`以下の問題を削除しますか？\n\n"${question.question}"`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/delete-question', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      });

      const data = await response.json();

      if (data.success) {
        alert(`問題を削除しました\n残り問題数: ${data.remainingCount}件`);
        fetchQuestions(currentPage, selectedSubject, selectedCategory);
      } else {
        throw new Error(data.error || '削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('問題の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 問題を編集
  const saveEditedQuestion = async (updatedQuestion: UnifiedQuestion) => {
    setLoading(true);
    try {
      const response = await fetch('/api/edit-question', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: updatedQuestion.id,
          updatedQuestion
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('問題を更新しました');
        setEditingQuestion(null);
        fetchQuestions(currentPage, selectedSubject, selectedCategory);
      } else {
        throw new Error(data.error || '更新に失敗しました');
      }
    } catch (error) {
      console.error('更新エラー:', error);
      alert('問題の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // フィルタ変更時の処理
  const handleFilterChange = (newSubject: string, newCategory: string) => {
    setSelectedSubject(newSubject);
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    fetchQuestions(1, newSubject, newCategory);
  };

  // ページ変更時の処理
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchQuestions(newPage, selectedSubject, selectedCategory);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const getSubjectName = (subject: string) => {
    switch (subject) {
      case 'geography': return '地理';
      case 'history': return '歴史';
      case 'civics': return '公民';
      default: return subject;
    }
  };

  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '易';
      case 'medium': return '中';
      case 'hard': return '難';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🗂️ 問題管理システム</h1>
          <p className="text-gray-600">既存の問題を編集・削除できます</p>
        </div>

        {/* 統計情報 */}
        {stats && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 問題統計</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">総問題数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.subjectCounts.geography}</div>
                <div className="text-sm text-gray-600">地理</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.subjectCounts.history}</div>
                <div className="text-sm text-gray-600">歴史</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.subjectCounts.civics}</div>
                <div className="text-sm text-gray-600">公民</div>
              </div>
            </div>
          </div>
        )}

        {/* フィルタ */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 フィルタ</h3>
          <div className="flex gap-4">
            <select 
              value={selectedSubject}
              onChange={(e) => handleFilterChange(e.target.value, selectedCategory)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">全科目</option>
              <option value="geography">地理</option>
              <option value="history">歴史</option>
              <option value="civics">公民</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange(selectedSubject, e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">全カテゴリ</option>
              <option value="general">一般</option>
              <option value="basic">基礎</option>
              <option value="advanced">発展</option>
            </select>
            <button
              onClick={() => fetchQuestions(currentPage, selectedSubject, selectedCategory)}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              🔄 更新
            </button>
          </div>
        </div>

        {/* 編集フォーム */}
        {editingQuestion && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✏️ 問題編集</h3>
            <QuestionEditForm
              question={editingQuestion}
              onSave={saveEditedQuestion}
              onCancel={() => setEditingQuestion(null)}
            />
          </div>
        )}

        {/* 問題一覧 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">📝 問題一覧</h3>
            {stats && (
              <span className="text-sm text-gray-600">
                {stats.total}件中 {((currentPage - 1) * stats.limit) + 1}-{Math.min(currentPage * stats.limit, stats.total)}件目
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        question.subject === 'geography' ? 'bg-green-500' :
                        question.subject === 'history' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {getSubjectName(question.subject)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getDifficultyName(question.difficulty)}
                      </span>
                      <span className="text-sm text-gray-500">ID: {question.id}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                      >
                        ✏️ 編集
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        🗑️ 削除
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-800 mb-3">{question.question}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {question.options.map((option, index) => (
                      <div key={index} className={`p-2 rounded border text-sm ${
                        index === question.correct 
                          ? 'bg-green-100 border-green-500 text-green-800 font-bold' 
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        {index + 1}. {option}
                        {index === question.correct && ' ✓'}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                    <p className="text-blue-700 text-sm">
                      <strong>解説:</strong> {question.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ページネーション */}
          {stats && stats.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                前
              </button>
              <span className="px-4 py-1 text-sm text-gray-600">
                {currentPage} / {stats.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === stats.totalPages}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                次
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 問題編集フォームコンポーネント
interface QuestionEditFormProps {
  question: UnifiedQuestion;
  onSave: (question: UnifiedQuestion) => void;
  onCancel: () => void;
}

function QuestionEditForm({ question, onSave, onCancel }: QuestionEditFormProps) {
  const [formData, setFormData] = useState(question);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">問題文</label>
        <textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">選択肢</label>
        {formData.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium w-8">{index + 1}.</span>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="radio"
              name="correct"
              checked={formData.correct === index}
              onChange={() => setFormData({ ...formData, correct: index })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">正解</span>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">解説</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">科目</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="geography">地理</option>
            <option value="history">歴史</option>
            <option value="civics">公民</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">難易度</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="easy">易</option>
            <option value="medium">中</option>
            <option value="hard">難</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">カテゴリ</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="general">一般</option>
            <option value="basic">基礎</option>
            <option value="advanced">発展</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          💾 保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ❌ キャンセル
        </button>
      </div>
    </form>
  );
}