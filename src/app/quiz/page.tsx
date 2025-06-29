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
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');
  const countParam = searchParams.get('count');

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    answers: [],
    showExplanation: false,
    isCompleted: false,
    startTime: Date.now(),
    timeRemaining: 30
  });

  // 副作用フック: クイズの初期化処理
  useEffect(() => {
    let questions: UnifiedQuestion[] = [];
    const numberOfQuestions = countParam ? parseInt(countParam, 10) : 5; // URLパラメータから問題数を取得、なければ5問

    if (subject && category) {
      questions = getQuestionsBySubjectAndCategory(subject as any, category);
    } else {
      questions = getRandomQuestionsMixed(numberOfQuestions);
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);

    setQuizState(prev => ({
      ...prev,
      questions: shuffled,
      answers: new Array(shuffled.length).fill(null)
    }));
  }, [subject, category, countParam]);

  // 副作用フック: タイマー処理
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.showExplanation && !quizState.isCompleted) {
      const timerId = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (quizState.timeRemaining === 0 && !quizState.showExplanation) {
      handleTimeUp();
    }
  }, [quizState.timeRemaining, quizState.showExplanation, quizState.isCompleted]);

  // 時間切れの処理
  const handleTimeUp = () => {
    handleAnswerSelect(null); // 時間切れは未選択(null)として扱う
  };

  // 回答選択の処理
  const handleAnswerSelect = (answerIndex: number | null) => {
    if (quizState.showExplanation) return;

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = answerIndex;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      answers: newAnswers,
      showExplanation: true
    }));
  };

  // 次の問題へ進む処理
  const handleNextQuestion = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedAnswer: null,
        showExplanation: false,
        timeRemaining: 30
      }));
    } else {
      setQuizState(prev => ({ ...prev, isCompleted: true }));
    }
  };

  // --- 計算用変数 ---
  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progress = quizState.questions.length > 0 ? ((quizState.currentIndex + 1) / quizState.questions.length) * 100 : 0;
  const correctAnswers = quizState.answers.filter((answer, index) => 
    answer !== null && answer === quizState.questions[index]?.correct
  ).length;
  const totalQuestions = quizState.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);

  // ★★★ ここからが重要 ★★★
  // 副作用フック: クイズ完了時にユーザー統計を更新する
  useEffect(() => {
    if (quizState.isCompleted && totalQuestions > 0) {
      console.log("クイズ完了。統計の更新処理を開始します。");

      // 1. localStorageから既存のユーザー統計を読み込む
      const savedStatsJSON = localStorage.getItem('shakaquest_userStats');
      if (!savedStatsJSON) {
        console.error("ユーザー統計データが見つかりません。");
        return; 
      }
      
      const userStats = JSON.parse(savedStatsJSON);

      // 2. 今回のクイズ結果を使って統計を更新
      const subjectId = subject || 'mixed'; 

      userStats.xp += earnedXP;
      // ★ 修正: 正解数に応じてコインを加算！
      userStats.coins = (userStats.coins || 0) + (correctAnswers * 10);
      userStats.totalAnswered += totalQuestions;
      userStats.correctAnswers += correctAnswers;
      
      // 科目別の進捗も更新 ('mixed'の場合は更新しない)
      if (subject && userStats.subjectProgress[subjectId]) {
         const subjectProgress = userStats.subjectProgress[subjectId];
         userStats.subjectProgress[subjectId] = {
           answered: subjectProgress.answered + totalQuestions,
           correct: subjectProgress.correct + correctAnswers,
           lastStudied: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit'})
         };
      }
      
      // 3. 更新した統計をlocalStorageに再保存
      localStorage.setItem('shakaquest_userStats', JSON.stringify(userStats));
      console.log("更新された統計情報:", userStats);
    }
    // isCompletedがtrueになった時に一度だけ実行されるように依存配列を設定
  }, [quizState.isCompleted]);


  // --- レンダリング ---
  if (!currentQuestion) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (quizState.isCompleted) {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">クイズ完了！</h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
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
            <div className="my-4">
              {accuracy >= 80 && (<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">素晴らしい！とても良い結果です！🌟</div>)}
              {accuracy >= 60 && accuracy < 80 && (<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">良い結果です！もう少し頑張りましょう！💪</div>)}
              {accuracy < 60 && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">復習が必要かもしれません。頑張って続けましょう！📚</div>)}
            </div>
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

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full flex flex-col">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-2">
          {/* ... (ヘッダー表示) ... */}
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex flex-col">
          {/* ... (問題表示) ... */}
        </div>
      </div>
    </div>
  );
};


// ページコンポーネント
const QuizPage = () => {
  return (
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
