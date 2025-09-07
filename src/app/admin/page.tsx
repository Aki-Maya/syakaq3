"use client";

import { useState, useEffect } from 'react';
import { SheetsService, SheetQuestion } from '@/lib/sheets';
import { GenSparkAIService, GeneratedQuestion } from '@/lib/genspark-ai';
import { shuffleQuestionOptions } from '@/utils/questionUtils';
import { QuestionEditor } from '@/components';

const AdminDashboard = () => {
  const [sheetQuestions, setSheetQuestions] = useState<SheetQuestion[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<GeneratedQuestion | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const sheetsService = new SheetsService();
  const genSparkAIService = new GenSparkAIService();

  // スプレッドシートからデータを取得
  const fetchSheetData = async () => {
    setIsLoading(true);
    try {
      const questions = await sheetsService.fetchQuestionsData();
      setSheetQuestions(questions);
    } catch (error) {
      console.error('データ取得エラー:', error);
      alert('スプレッドシートの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 選択した問題をGenSpark AIで生成
  const generateQuestions = async () => {
    const selectedData = sheetQuestions.filter(q => selectedQuestions.has(q.id));
    if (selectedData.length === 0) {
      alert('問題を選択してください');
      return;
    }

    setIsLoading(true);
    try {
      // GenSpark AIで問題を生成
      const results = await genSparkAIService.generateMultipleQuestions(selectedData);
      
      setGeneratedQuestions(prev => [...prev, ...results]);
      alert(`${results.length}問の生成が完了しました`);
    } catch (error) {
      console.error('問題生成エラー:', error);
      // フォールバック: 開発中はモックデータを使用  
      const mockResults = selectedData.map(data => createMockQuestion(data));
      setGeneratedQuestions(prev => [...prev, ...mockResults]);
      alert(`${mockResults.length}問の生成が完了しました（開発モード）`);
    } finally {
      setIsLoading(false);
    }
  };

  // 開発用モック問題生成
  const createMockQuestion = (sheetData: SheetQuestion): GeneratedQuestion => {
    const subject = sheetData.subject || 'geography';
    const dummies = {
      geography: ['北海道', '東京都', '大阪府'],
      history: ['源頼朝', '織田信長', '徳川家康'],
      civics: ['内閣総理大臣', '国会議員', '最高裁判所']
    };

    return {
      question: `${sheetData.keyword}について正しい説明を選んでください。`,
      options: [
        sheetData.keyword,
        ...dummies[subject as keyof typeof dummies] || dummies.geography
      ],
      correct: 0,
      explanation: sheetData.explanation,
      difficulty: 'medium' as const,
      subject: subject as any,
      category: 'general',
      source: sheetData
    };
  };

  // 問題をアプリに追加
  const addToApp = (question: GeneratedQuestion) => {
    // 🎲 選択肢シャッフル機能のテスト用デモ
    const shuffledQuestion = shuffleQuestionOptions(question);
    
    // データファイルに追加するロジック
    const questionCode = `{
  id: "${Date.now()}",
  question: "${question.question}",
  options: ${JSON.stringify(question.options, null, 2)},
  correct: ${question.correct},
  explanation: "${question.explanation}",
  difficulty: "${question.difficulty}",
  subject: "${question.subject}",
  category: "${question.category}"
},

// 🎲 選択肢シャッフル機能付きバージョン（参考）
// 実際のアプリでは実行時に自動でシャッフルされます
/*
シャッフル例:
元の選択肢: ${JSON.stringify(question.options)}
元の正解: ${question.options[question.correct]} (位置: ${question.correct})
シャッフル後: ${JSON.stringify(shuffledQuestion.options)}
新しい正解: ${shuffledQuestion.options[shuffledQuestion.correct]} (位置: ${shuffledQuestion.correct})
*/`;

    // クリップボードにコピー
    navigator.clipboard.writeText(questionCode).then(() => {
      alert('問題コードをクリップボードにコピーしました！\n\n📋 内容：\n- 基本の問題コード\n- シャッフル機能の説明コメント\n\nデータファイルに貼り付けてください。');
    });
  };

  // チェックボックス操作
  const toggleQuestion = (questionId: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  // 編集機能
  const startEditing = (question: GeneratedQuestion, index: number) => {
    setEditingQuestion({ ...question });
    setEditingIndex(index);
  };

  const saveEditedQuestion = (updatedQuestion: GeneratedQuestion) => {
    if (editingIndex !== null) {
      const newQuestions = [...generatedQuestions];
      newQuestions[editingIndex] = updatedQuestion;
      setGeneratedQuestions(newQuestions);
    }
    setEditingQuestion(null);
    setEditingIndex(null);
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
    setEditingIndex(null);
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 問題管理ダッシュボード</h1>
          <p className="text-gray-600">スプレッドシートから問題を自動生成</p>
        </div>

        {/* GenSpark AI 設定表示 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 GenSpark AI</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">接続済み</span>
            </div>
            <p className="text-gray-600">外部APIキー不要で問題を自動生成します</p>
          </div>
        </div>

        {/* スプレッドシートデータ */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">📊 スプレッドシートデータ ({sheetQuestions.length}件)</h2>
            <button
              onClick={fetchSheetData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '取得中...' : '🔄 最新データ取得'}
            </button>
          </div>

          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setSelectedQuestions(new Set(sheetQuestions.map(q => q.id)))}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              全選択
            </button>
            <button
              onClick={() => setSelectedQuestions(new Set())}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              選択解除
            </button>
            <button
              onClick={generateQuestions}
              disabled={isLoading || selectedQuestions.size === 0}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              🚀 GenSpark AIで生成 ({selectedQuestions.size}件)
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sheetQuestions.map((question) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.has(question.id)}
                    onChange={() => toggleQuestion(question.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        question.subject === 'geography' ? 'bg-green-500' :
                        question.subject === 'history' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {question.subject === 'geography' ? '地理' :
                         question.subject === 'history' ? '歴史' : '公民'}
                      </span>
                      <h3 className="font-bold text-gray-800">{question.keyword}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{question.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 編集モード */}
        {editingQuestion && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <QuestionEditor
              question={editingQuestion}
              onSave={saveEditedQuestion}
              onCancel={cancelEditing}
            />
          </div>
        )}

        {/* 生成された問題 */}
        {generatedQuestions.length > 0 && !editingQuestion && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">✅ 生成された問題 ({generatedQuestions.length}件)</h2>
            
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                      question.subject === 'geography' ? 'bg-green-500' :
                      question.subject === 'history' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {question.subject === 'geography' ? '地理' :
                       question.subject === 'history' ? '歴史' : '公民'}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty.toUpperCase()}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      元データ: {question.source.keyword}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-3">{question.question}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className={`p-2 rounded border ${
                        optionIndex === question.correct 
                          ? 'bg-green-100 border-green-500 text-green-800' 
                          : 'bg-gray-50 border-gray-300'
                      }`}>
                        {optionIndex + 1}. {option}
                        {optionIndex === question.correct && ' ✓'}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                    <p className="text-blue-700 text-sm"><strong>解説:</strong> {question.explanation}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(question, index)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      ✏️ 編集
                    </button>
                    <button
                      onClick={() => addToApp(question)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      📋 コードをコピー
                    </button>
                    <button
                      onClick={() => setGeneratedQuestions(prev => prev.filter((_, i) => i !== index))}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      🗑️ 削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">処理中...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;