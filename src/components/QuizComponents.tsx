// 拡張版クイズコンポーネント - 全科目対応
'use client';

import React, { useState, useEffect } from 'react';
import { 
  // ... (データ取得用の関数や型定義をインポート)
  getAllQuestions, 
  getQuestionsBySubject, 
  getRandomMixedQuestions,
  UnifiedQuestion,
  calculateXPForCorrectAnswer,
  UserProgress,
  initializeUserProgress
} from '../data/index';

/**
 * クイズコンポーネントが受け取るプロパティの型定義
 */
interface EnhancedQuizProps {
  subject: string; // クイズの科目 (例: 'history', 'all')
  category?: string; // 科目内のカテゴリ (例: '江戸時代', 'mixed')
  onFinish: (results: QuizResults) => void; // クイズ終了時に結果を親に渡すコールバック
  onBack: () => void; //「戻る」ボタンが押されたときのコールバック
}

/**
 * クイズ結果の型定義
 */
interface QuizResults {
  totalQuestions: number; // 全問題数
  correctAnswers: number; // 正解数
  totalTime: number; // クイズ全体の所要時間
  earnedXP: number; // 獲得したXP
  answers: QuizAnswer[]; // 全ての回答履歴
}

/**
 * 個々の回答履歴の型定義
 */
interface QuizAnswer {
  question: UnifiedQuestion; // 対象の問題
  userAnswer: number; // ユーザーが選んだ選択肢のインデックス
  isCorrect: boolean; // 正解だったか
  timeSpent: number; // この問題にかけた時間 (ミリ秒)
}

/**
 * 高機能なクイズコンポーネント
 * @param {EnhancedQuizProps} props - subject, category, onFinish, onBack
 */
export default function EnhancedQuiz({ subject, category, onFinish, onBack }: EnhancedQuizProps) {
  // --- State定義 ---
  const [questions, setQuestions] = useState<UnifiedQuestion[]>([]); // クイズの問題リスト
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 現在の問題のインデックス
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // ユーザーが選択した回答
  const [answers, setAnswers] = useState<QuizAnswer[]>([]); // 回答の履歴を保持
  const [timeRemaining, setTimeRemaining] = useState(30); // 問題ごとの残り時間 (秒)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now()); // 現在の問題を開始した時刻
  const [showExplanation, setShowExplanation] = useState(false); // 解説を表示するかどうかのフラグ
  const [quizStartTime] = useState(Date.now()); // クイズ全体の開始時刻
  const [isAnswered, setIsAnswered] = useState(false); // 現在の問題に回答済みかどうかのフラグ

  /**
   * 副作用フック: 科目やカテゴリが変更されたら問題を取得・設定する
   */
  useEffect(() => {
    let fetchedQuestions: UnifiedQuestion[] = [];

    // 'mixed'カテゴリの場合は科目横断でランダムな問題を取得
    if (category === 'mixed') {
      fetchedQuestions = getRandomMixedQuestions(10);
    // 'all'科目の場合は全科目からランダムな問題を取得
    } else if (subject === 'all') {
      fetchedQuestions = getRandomMixedQuestions(15);
    // それ以外の特定科目の場合
    } else {
      const subjectQuestions = getQuestionsBySubject(subject as any);
      // カテゴリが指定されていれば、さらに絞り込む
      if (category && category !== 'all') {
        fetchedQuestions = subjectQuestions.filter(q => q.category === category);
      } else {
        fetchedQuestions = subjectQuestions;
      }
      // 問題をシャッフルして、最大5問に制限
      fetchedQuestions = fetchedQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    }

    setQuestions(fetchedQuestions);
    setQuestionStartTime(Date.now()); // 最初の問題の開始時刻を設定
  }, [subject, category]);

  /**
   * 副作用フック: 1秒ごとにタイマーを更新する
   */
  useEffect(() => {
    // 時間が残っていて、まだ回答していない場合のみタイマーを作動
    if (timeRemaining > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      // コンポーネントがアンマウントされるか、依存変数が変わった時にタイマーをクリア
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isAnswered) {
      // 時間切れになったら、不正解として回答処理を呼び出す (-1はユーザー選択外を示す)
      handleAnswer(-1);
    }
  }, [timeRemaining, isAnswered]);

  /**
   * ユーザーが選択肢を選んだときの回答処理
   * @param {number} answerIndex - ユーザーが選んだ選択肢のインデックス
   */
  const handleAnswer = (answerIndex: number) => {
    // 既に回答済みの場合は何もしない (二重回答防止)
    if (isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = answerIndex === currentQuestion.correct;

    // 今回の回答データをオブジェクトとして作成
    const newAnswer: QuizAnswer = {
      question: currentQuestion,
      userAnswer: answerIndex,
      isCorrect,
      timeSpent
    };

    // Stateを更新してUIに反映
    setSelectedAnswer(answerIndex);
    setAnswers([...answers, newAnswer]); // 回答履歴に追加
    setIsAnswered(true); // 回答済みにする
    setShowExplanation(true); // 解説を表示する
  };

  /**
   * 「次の問題へ」または「結果を見る」ボタンが押されたときの処理
   */
  const handleNext = () => {
    // まだ次の問題がある場合
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // 次の問題のために各種Stateをリセット
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsAnswered(false);
      setTimeRemaining(30);
      setQuestionStartTime(Date.now());
    } else {
      // 全ての問題が終了した場合
      const totalTime = Date.now() - quizStartTime;
      const correctCount = answers.filter(a => a.isCorrect).length;
      
      // 獲得XPを計算。正解した問題の難易度と回答時間ボーナスでXPを加算
      const earnedXP = answers.reduce((total, answer) => {
        if (answer.isCorrect) {
          const timeBonus = answer.timeSpent < 3000; // 3秒以内の回答でボーナス
          return total + calculateXPForCorrectAnswer(answer.question.difficulty, timeBonus);
        }
        return total;
      }, 0);

      // 最終的な結果オブジェクトを作成
      const results: QuizResults = {
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        totalTime,
        earnedXP,
        answers: [...answers]
      };

      // onFinishコールバックを呼び出し、親コンポーネントに結果を渡す
      onFinish(results);
    }
  };

  // --- レンダリング ---

  // 問題データがまだ読み込まれていない場合はローディング画面を表示
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込み中...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">

        {/* ヘッダー: 戻るボタン、タイトル、タイマー */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← 戻る
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentQuestion.subject === 'geography' && '🗾 地理'}
              {currentQuestion.subject === 'history' && '📜 歴史'}
              {currentQuestion.subject === 'civics' && '🏛️ 公民'}
              クイズ
            </h1>
            <p className="text-gray-600">
              問題 {currentQuestionIndex + 1} / {questions.length}
            </p>
          </div>
          <div className="text-right">
            {/* 残り時間が5秒以下になったら文字を赤くする */}
            <div className={`text-2xl font-bold ${timeRemaining <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
              ⏰ {timeRemaining}s
            </div>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* 問題エリア */}
        <div className="bg-white rounded-lg p-8 shadow-lg">

          {/* 問題文と難易度タグ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                currentQuestion.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty === 'basic' ? '基本' :
                 currentQuestion.difficulty === 'intermediate' ? '標準' : '応用'}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {currentQuestion.subject === 'geography' ? '地理' :
                 currentQuestion.subject === 'history' ? '歴史' : '公民'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* 選択肢リスト */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all hover:shadow-md ";
              
              // 回答後は正解・不正解に応じてスタイルを変更
              if (showExplanation) {
                if (index === currentQuestion.correct) {
                  // 正解の選択肢
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (index === selectedAnswer) {
                  // ユーザーが選んだ間違った選択肢
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  // その他の選択肢
                  buttonClass += "border-gray-300 bg-gray-50 text-gray-600";
                }
              // 回答前は、選択中のスタイルを適用
              } else {
                if (selectedAnswer === index) {
                  // ユーザーが選択中の選択肢 (このコードでは回答と同時に解説表示されるため、このスタイルは一瞬しか見えない)
                  buttonClass += "border-blue-500 bg-blue-50 text-blue-800";
                } else {
                  // 未選択の選択肢
                  buttonClass += "border-gray-300 hover:border-blue-300 text-gray-700";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation} // 回答後はボタンを無効化
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                    {/* 正解・不正解のフィードバックアイコンを表示 */}
                    {showExplanation && index === currentQuestion.correct && (
                      <span className="ml-auto text-green-600">✓ 正解</span>
                    )}
                    {showExplanation && index === selectedAnswer && index !== currentQuestion.correct && (
                      <span className="ml-auto text-red-600">✗ 不正解</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 解説エリア: 回答後に表示 */}
          {showExplanation && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">📝 解説</h3>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* 次へボタン: 回答後に表示 */}
          {showExplanation && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {/* 最後の問題かどうかでボタンのテキストを変更 */}
                {currentQuestionIndex + 1 < questions.length ? '次の問題 →' : '結果を見る 🎯'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
