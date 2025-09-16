"use client";

import { useState, useEffect } from 'react';

// レガシー問題型（APIから返される形式）
interface LegacyQuestion {
  id: number | string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

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
  questions: LegacyQuestion[];
  stats: QuestionStats;
  error?: string;
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<LegacyQuestion[]>([]);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<LegacyQuestion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // 一括削除用の状態
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<number | string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

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

  // 一括削除機能
  const bulkDeleteQuestions = async () => {
    if (selectedQuestionIds.size === 0) {
      alert('削除する問題を選択してください');
      return;
    }

    const selectedQuestions = questions.filter(q => selectedQuestionIds.has(q.id));
    const confirmMessage = `選択された${selectedQuestionIds.size}問を削除しますか？\n\n削除される問題:\n${selectedQuestions.slice(0, 5).map(q => `• ${q.question.substring(0, 40)}...`).join('\n')}${selectedQuestions.length > 5 ? `\n...他${selectedQuestions.length - 5}問` : ''}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setBulkDeleting(true);
    try {
      const response = await fetch('/api/bulk-delete-questions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds: Array.from(selectedQuestionIds) })
      });

      const data = await response.json();

      if (data.success) {
        alert(`${data.deletedCount}問を削除しました\n残り問題数: ${data.remainingCount}件`);
        setSelectedQuestionIds(new Set());
        fetchQuestions(currentPage, selectedSubject, selectedCategory);
      } else {
        throw new Error(data.error || '一括削除に失敗しました');
      }
    } catch (error) {
      console.error('一括削除エラー:', error);
      alert('問題の一括削除に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    } finally {
      setBulkDeleting(false);
    }
  };

  // チェックボックスの選択/解除
  const toggleQuestionSelection = (questionId: number | string) => {
    const newSelection = new Set(selectedQuestionIds);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestionIds(newSelection);
  };

  // 全選択/全解除
  const toggleSelectAll = () => {
    if (selectedQuestionIds.size === questions.length) {
      setSelectedQuestionIds(new Set());
    } else {
      setSelectedQuestionIds(new Set(questions.map(q => q.id)));
    }
  };

  // 単一問題削除（従来機能は無効化）
  const deleteQuestion = async (questionId: number) => {
    alert('単一削除機能は無効化されています。チェックボックスで選択して一括削除をご利用ください。');
  };

  // 問題を編集
  const saveEditedQuestion = async (updatedQuestion: LegacyQuestion) => {
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
    setSelectedQuestionIds(new Set()); // 選択状態をクリア
    fetchQuestions(1, newSubject, newCategory);
  };

  // ページ変更時の処理
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedQuestionIds(new Set()); // 選択状態をクリア
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
          <p className="text-gray-600">既存の問題を閲覧できます</p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              📋 <strong>お知らせ:</strong> 新しいデータ構造への移行中のため、現在は閲覧機能のみ利用可能です。<br/>
              編集・削除機能は次回のアップデートで復活予定です。
            </p>
          </div>
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

        {/* フィルタ & 一括操作 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 フィルタ & 一括操作</h3>
          
          {/* フィルタ行 */}
          <div className="flex gap-4 mb-4">
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

          {/* 一括操作行 */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {selectedQuestionIds.size === questions.length ? '全解除' : '全選択'}
            </button>
            <span className="text-sm text-gray-600">
              {selectedQuestionIds.size}問選択中
            </span>
            {selectedQuestionIds.size > 0 && (
              <button
                onClick={bulkDeleteQuestions}
                disabled={bulkDeleting}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {bulkDeleting ? '削除中...' : `🗑️ 選択した${selectedQuestionIds.size}問を削除`}
              </button>
            )}
          </div>
        </div>

        {/* 編集フォーム - 一時的に無効化 */}
        {editingQuestion && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✏️ 問題編集</h3>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">📝 新しいデータ構造への移行中のため、編集機能は一時的に利用できません</p>
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                閉じる
              </button>
            </div>
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
                <div key={question.id} className={`border rounded-lg p-4 transition-colors ${
                  selectedQuestionIds.has(question.id) ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {/* チェックボックス */}
                      <input
                        type="checkbox"
                        checked={selectedQuestionIds.has(question.id)}
                        onChange={() => toggleQuestionSelection(question.id)}
                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
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
                        disabled
                        className="px-3 py-1 bg-gray-300 text-gray-500 text-sm rounded cursor-not-allowed"
                        title="チェックボックスで選択して一括削除をご利用ください"
                      >
                        ✏️ 編集
                      </button>
                      <button
                        disabled
                        className="px-3 py-1 bg-gray-300 text-gray-500 text-sm rounded cursor-not-allowed"
                        title="チェックボックスで選択して一括削除をご利用ください"
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
  question: LegacyQuestion;
  onSave: (question: LegacyQuestion) => void;
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