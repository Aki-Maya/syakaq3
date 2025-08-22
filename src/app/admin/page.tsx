"use client";

import { useState, useEffect } from 'react';
import { SheetsService, SheetQuestion } from '@/lib/sheets';
import { GeminiService, GeneratedQuestion } from '@/lib/gemini';

const AdminDashboard = () => {
  const [sheetQuestions, setSheetQuestions] = useState<SheetQuestion[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [geminiApiKey, setGeminiApiKey] = useState('');

  const sheetsService = new SheetsService();
  const geminiService = new GeminiService(geminiApiKey);

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

  // 選択した問題をGeminiで生成
  const generateQuestions = async () => {
    if (!geminiApiKey) {
      alert('Gemini APIキーを入力してください');
      return;
    }

    const selectedData = sheetQuestions.filter(q => selectedQuestions.has(q.id));
    if (selectedData.length === 0) {
      alert('問題を選択してください');
      return;
    }

    setIsLoading(true);
    try {
      // 開発中はモック使用、本格運用時は実APIに切り替え
      const results: GeneratedQuestion[] = [];
      for (const data of selectedData) {
        const question = await geminiService.generateMockQuestion(data);
        results.push(question);
      }
      
      setGeneratedQuestions(prev => [...prev, ...results]);
      alert(`${results.length}問の生成が完了しました`);
    } catch (error) {
      console.error('問題生成エラー:', error);
      alert('問題生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 問題をアプリに追加
  const addToApp = (question: GeneratedQuestion) => {
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
},`;

    // クリップボードにコピー
    navigator.clipboard.writeText(questionCode).then(() => {
      alert('問題コードをクリップボードにコピーしました！\nデータファイルに貼り付けてください。');
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

        {/* APIキー設定 */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔑 Gemini API設定</h2>
          <div className="flex gap-4">
            <input
              type="password"
              placeholder="Gemini APIキーを入力"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => alert('APIキーが設定されました')}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              設定
            </button>
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
              🤖 選択した問題を生成 ({selectedQuestions.size}件)
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

        {/* 生成された問題 */}
        {generatedQuestions.length > 0 && (
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