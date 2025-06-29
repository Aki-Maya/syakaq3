"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getQuestionsBySubjectAndCategory, 
  getRandomQuestionsMixed,
  calculateXPFromScore,
  type UnifiedQuestion 
} from '@/data/index';
import Link from 'next/link';

// クイズの状態を管理するための型定義
interface QuizState {
  questions: UnifiedQuestion[];
  currentIndex: number;
  selectedAnswer: number | null;
  answers: (number | null)[];
  showExplanation: boolean;
  isCompleted: boolean;
  startTime: number;
  timeRemaining: number;
}

// クイズのメインロジックとUIを担うコンポーネント
const QuizComponent = () => {
  // URLのクエリパラメータを取得するためのフック
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');

  // クイズ全体の状態を管理するState
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],          // 表示する問題のリスト
    currentIndex: 0,        // 現在の問題のインデックス
    selectedAnswer: null,   // ユーザーが選択した回答
    answers: [],            // 全問題の回答履歴
    showExplanation: false, // 解説を表示するかどうか
    isCompleted: false,     // クイズが完了したかどうか
    startTime: Date.now(),  // クイズ開始時刻
    timeRemaining: 30       // 問題ごとの残り時間
  });

  // 副作用フック: クイズの初期化処理。subjectやcategoryが変更されたときに実行される。
  useEffect(() => {
    let questions: UnifiedQuestion[] = [];

    // URLパラメータに応じて問題を取得
    if (subject && category) {
      questions = getQuestionsBySubjectAndCategory(subject as any, category);
    } else {
      questions = getRandomQuestionsMixed(10);
    }

    // 取得した問題をシャッフルし、5問に絞る
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);

    // Stateを更新してクイズを開始する
    setQuizState(prev => ({
      ...prev,
      questions: shuffled,
      answers: new Array(shuffled.length).fill(null)
    }));
  }, [subject, category]);

  // 副作用フック: 1秒ごとに残り時間を更新するタイマー処理
  useEffect(() => {
    // 時間が残っていて、まだ回答しておらず、クイズが完了していない場合のみタイマーを作動
    if (quizState.timeRemaining > 0 && !quizState.showExplanation && !quizState.isCompleted) {
      const timerId = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timerId); // コンポーネントの再描画時にタイマーをクリア
    } else if (quizState.timeRemaining === 0 && !quizState.showExplanation) {
      // 時間切れになった場合の処理を呼び出す
      handleTimeUp();
    }
  }, [quizState.timeRemaining, quizState.showExplanation, quizState.isCompleted]);

  // 時間切れになったときのハンドラ関数
  const handleTimeUp = () => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = null; // 時間切れはnullとして記録

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true // 解説を表示する
    }));
  };

  // ユーザーが選択肢をクリックしたときの回答処理
  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return; // 回答後は何もしない

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = answerIndex;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      answers: newAnswers,
      showExplanation: true // 回答と同時に解説を表示
    }));
  };

  // 「次の問題へ」または「結果を見る」ボタンが押されたときの処理
  const handleNextQuestion = () => {
    // まだ次の問題がある場合
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1, // 次の問題へ
        selectedAnswer: null,
        showExplanation: false, // 各種状態をリセット
        timeRemaining: 30
      }));
    } else {
      // 全ての問題が終わった場合、クイズを完了状態にする
      setQuizState(prev => ({ ...prev, isCompleted: true }));
    }
  };

  // 現在表示中の問題データを取得
  const currentQuestion = quizState.questions[quizState.currentIndex];
  // 進捗バーの割合を計算
  const progress = quizState.questions.length > 0 ? ((quizState.currentIndex + 1) / quizState.questions.length) * 100 : 0;
  // 正解数を計算
  const correctAnswers = quizState.answers.filter((answer, index) => 
    answer !== null && answer === quizState.questions[index]?.correct
  ).length;
  // 全問題数を取得
  const totalQuestions = quizState.questions.length;
  // 正答率を計算（0除算を回避）
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  // 獲得XPを計算
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);

  // --- レンダリング ---

  // 問題データが読み込まれていない場合はローディング画面を表示
  if (quizState.questions.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込み中...</p>
        </div>
      </div>
    );
  }

  // クイズが完了した場合は結果画面を表示
  if (quizState.isCompleted) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">クイズ完了！</h1>
            {/* 結果サマリー */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div className="bg-green-100 rounded-lg p-2">
                <div className="text-lg font-bold text-green-800">{correctAnswers}/{totalQuestions}</div>
                <div className="text-xs text-green-600">正解数</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-800">{accuracy}%</div>
                <div className="text-xs text-blue-600">正答率</div>
              </div>
              <div className="bg-purple-100 rounded-lg p-2">
                <div className="text-lg font-bold text-purple-800">+{earnedXP}</div>
                <div className="text-xs text-purple-600">獲得XP</div>
              </div>
              <div className="bg-yellow-100 rounded-lg p-2">
                <div className="text-lg font-bold text-yellow-800">
                  {Math.round((Date.now() - quizState.startTime) / 1000)}秒
                </div>
                <div className="text-xs text-yellow-600">時間</div>
              </div>
            </div>
            {/* 正答率に応じたフィードバックメッセージ */}
            <div className="my-4">
              {accuracy >= 80 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
                  素晴らしい！とても良い結果です！🌟
                </div>
              )}
              {accuracy >= 60 && accuracy < 80 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
                  良い結果です！もう少し頑張りましょう！💪
                </div>
              )}
              {accuracy < 60 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                  復習が必要かもしれません。頑張って続けましょう！📚
                </div>
              )}
            </div>
            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-500 text-white py-2.5 px-6 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                もう一度挑戦
              </button>
              <Link
                href="/"
                className="block w-full bg-gray-500 text-white py-2.5 px-6 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // クイズ進行中のメイン画面を表示
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full flex flex-col">
        {/* ヘッダーエリア: 科目、問題番号、残り時間 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-2xl">
                {currentQuestion?.subject === 'geography' ? '🗾' : 
                 currentQuestion?.subject === 'history' ? '📜' : '🏛️'}
              </span>
              <span className="ml-2 text-base font-bold">
                {currentQuestion?.subject === 'geography' ? '地理' : 
                 currentQuestion?.subject === 'history' ? '歴史' : '公民'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">{quizState.timeRemaining}秒</div>
              <div className="text-xs text-gray-600">残り時間</div>
            </div>
          </div>
          {/* 進捗バー */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div 
              className="bg-blue-500 rounded-full h-2.5 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-xs text-gray-600">
            問題 {quizState.currentIndex + 1} / {quizState.questions.length}
          </div>
        </div>
        {/* 問題カードエリア */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex flex-col">
          <div className="flex-shrink-0">
            <div className="flex items-center mb-2">
              <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                currentQuestion?.difficulty === 'easy' ? 'bg-green-500' :
                currentQuestion?.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {currentQuestion?.difficulty === 'easy' ? '初級' :
                 currentQuestion?.difficulty === 'medium' ? '中級' : '上級'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {currentQuestion?.question}
            </h2>
          </div>
          {/* 選択肢リスト */}
          <div className="space-y-2 mb-4">
            {currentQuestion?.options.map((option, index) => {
              // 回答状況に応じてボタンのスタイルを動的に変更
              let buttonClass = "w-full p-3 text-sm text-left border-2 rounded-lg transition-all duration-200 ";
              if (quizState.showExplanation) {
                if (index === currentQuestion.correct) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800"; // 正解の選択肢
                } else if (index === quizState.selectedAnswer) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800"; // 選んだ不正解の選択肢
                } else {
                  buttonClass += "bg-gray-100 border-gray-300 text-gray-600"; // その他の選択肢
                }
              } else {
                buttonClass += "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"; // 回答前のデフォルト
              }
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={quizState.showExplanation}
                  className={buttonClass}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
          {/* 解説エリア: 回答後に表示 */}
          {quizState.showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm flex-shrink-0">
              <h3 className="font-bold text-blue-800 mb-1">解説</h3>
              <p className="text-blue-700">{currentQuestion?.explanation}</p>
            </div>
          )}
          {/* アクションボタンエリア */}
          <div className="text-center flex-shrink-0">
            {quizState.showExplanation ? (
              // 回答後は「次の問題」または「結果を見る」ボタンを表示
              <button
                onClick={handleNextQuestion}
                className="bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-600 transition-colors"
              >
                {quizState.currentIndex < quizState.questions.length - 1 ? '次の問題' : '結果を見る'}
              </button>
            ) : (
              // 回答前は案内メッセージを表示
              <div className="text-gray-500 text-xs">
                選択肢をクリックして回答してください
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ページコンポーネント: クイズコンポーネントをSuspenseでラップする
const QuizPage = () => {
  return (
    // Suspenseは、内部のコンポーネントがデータを読み込んでいる間にフォールバックUIを表示する
    <Suspense fallback={
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <QuizComponent />
    </Suspense>
  );
};

export default QuizPage;
