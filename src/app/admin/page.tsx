"use client";

import { useState, useEffect } from 'react';
import { SheetsService, SheetQuestion } from '@/lib/sheets';
import { GenSparkAIService, GeneratedQuestion } from '@/lib/genspark-ai';
import { ExplanationGenerator, GeneratedExplanation } from '@/lib/explanation-generator';
import { shuffleQuestionOptions } from '@/utils/questionUtils';
import { QuestionEditor } from '@/components';
import QuestionCreationForm from '@/components/QuestionCreationForm';

const AdminDashboard = () => {
  const [sheetQuestions, setSheetQuestions] = useState<SheetQuestion[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [generatedExplanations, setGeneratedExplanations] = useState<GeneratedExplanation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [editingQuestion, setEditingQuestion] = useState<GeneratedQuestion | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  console.log('🔍 コンポーネント再レンダリング - sheetQuestions.length:', sheetQuestions.length);
  const sheetsService = new SheetsService();
  const genSparkAIService = new GenSparkAIService();
  const explanationGenerator = new ExplanationGenerator();

  // スプレッドシートからデータを取得
  const fetchSheetData = async () => {
    setIsLoading(true);
    try {
      // サーバーサイドAPIエンドポイント経由でデータを取得
      const response = await fetch('/api/fetch-sheets');
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ 管理画面: ${result.count}件のキーワードを取得しました`);
        console.log('📝 受信データサンプル:', result.data.slice(0, 3));
        console.log('🔧 setSheetQuestions実行前 - 現在の長さ:', sheetQuestions.length);
        setSheetQuestions(result.data);
        console.log('📊 setSheetQuestions実行後 - 新しいデータ長さ:', result.data.length);
        
        // 状態更新の確認用（非同期なので次のレンダリングで反映）
        setTimeout(() => {
          console.log('⏱️ タイムアウト後の状態確認:', sheetQuestions.length);
        }, 100);
      } else {
        throw new Error(result.error || 'データ取得に失敗しました');
      }
    } catch (error) {
      console.error('❌ 管理画面: データ取得エラー:', error);
      alert(`スプレッドシートの取得に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
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



  // CSV形式で解説データを出力（C列専用）
  const exportExplanationsForCColumn = () => {
    if (generatedExplanations.length === 0) {
      alert('まず解説を生成してください');
      return;
    }

    // C列専用：解説のみを改行区切りで出力
    const columnData = sheetsService.generateCSVForColumn(generatedExplanations);
    
    // クリップボードにコピー
    navigator.clipboard.writeText(columnData).then(() => {
      alert(`C列用データをクリップボードにコピーしました！\n\n📋 Google Sheetsでの使用方法：\n1. スプレッドシートを開く\n2. C1セル（または該当する最初のセル）を選択\n3. Ctrl+V で貼り付け\n\n✨ ${generatedExplanations.length}件の高品質解説が正確に配置されます！`);
    });
  };

  // 完全なCSVファイルをダウンロード
  const exportExplanationsAsFullCSV = () => {
    if (generatedExplanations.length === 0) {
      alert('まず解説を生成してください');
      return;
    }

    const fullCSV = sheetsService.generateFullCSV(generatedExplanations);

    // CSVファイルとしてダウンロード
    const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shakaquest_explanations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('完全なCSVファイルをダウンロードしました！\n\n📁 バックアップや分析用としてご活用ください。');
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

  // 解説生成機能
  const generateExplanations = async () => {
    const selectedData = sheetQuestions.filter(q => selectedQuestions.has(q.id));
    if (selectedData.length === 0) {
      alert('解説を生成するキーワードを選択してください');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`📝 ${selectedData.length}件のキーワードの解説生成を開始`);
      
      const keywords = selectedData.map(q => q.keyword);
      const explanations = await explanationGenerator.generateMultipleExplanations(keywords);
      
      setGeneratedExplanations(prev => [...prev, ...explanations]);
      
      // CSV形式での出力準備
      const csvData = sheetsService.createExplanationCSV(
        explanations.map(e => ({ keyword: e.keyword, explanation: e.explanation }))
      );
      
      // CSVをクリップボードにコピー
      navigator.clipboard.writeText(csvData).then(() => {
        alert(`✅ ${explanations.length}件の解説生成が完了しました！\n\nCSVデータがクリップボードにコピーされました。\nスプレッドシートのC列に貼り付けてください。`);
      }).catch(() => {
        console.log('📋 生成されたCSVデータ:\n', csvData);
        alert(`✅ ${explanations.length}件の解説生成が完了しました！\n\nコンソールログでCSVデータを確認してください。`);
      });
      
    } catch (error) {
      console.error('❌ 解説生成エラー:', error);
      alert(`解説生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setIsLoading(false);
    }
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
            <button
              onClick={generateExplanations}
              disabled={isLoading || selectedQuestions.size === 0}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              📝 高品質解説生成 ({selectedQuestions.size}件)
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

        {/* 生成された解説 */}
        {generatedExplanations.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">✨ 高品質解説 ({generatedExplanations.length}件)</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportExplanationsForCColumn}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
                >
                  📋 C列にコピー
                </button>
                <button
                  onClick={exportExplanationsAsFullCSV}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📊 CSV出力
                </button>
                <button
                  onClick={() => setGeneratedExplanations([])}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🗑️ クリア
                </button>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="text-green-700 text-sm">
                <strong>📋 スプレッドシート直接反映:</strong> 
                「C列にコピー」ボタンで解説データを一発コピー → Google SheetsのC列に Ctrl+V で貼り付け完了！
                記憶テクニック・試験パターン・構造化表記が含まれた学習特化型解説が正確に配置されます。
              </p>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedExplanations.map((explanation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                      explanation.subject === 'geography' ? 'bg-green-500' :
                      explanation.subject === 'history' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {explanation.subject === 'geography' ? '地理' :
                       explanation.subject === 'history' ? '歴史' : '公民'}
                    </span>
                    <h3 className="font-bold text-gray-800">{explanation.keyword}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      explanation.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      explanation.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {explanation.difficulty === 'easy' ? '易' :
                       explanation.difficulty === 'medium' ? '中' : '難'}
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-3">
                    <p className="text-gray-800 leading-relaxed">{explanation.explanation}</p>
                  </div>
                  
                  {explanation.tags && explanation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {explanation.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const csvLine = `"${explanation.keyword}","${explanation.explanation.replace(/"/g, '""')}"`;
                        navigator.clipboard.writeText(csvLine).then(() => {
                          alert('この解説をクリップボードにコピーしました！');
                        });
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      📋 コピー
                    </button>
                    <button
                      onClick={() => setGeneratedExplanations(prev => prev.filter((_, i) => i !== index))}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      🗑️ 削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新規問題作成フォーム */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">➕ 新規問題作成</h2>
          <QuestionCreationForm />
        </div>

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