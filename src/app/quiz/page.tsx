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

// --- 型定義 ---
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

interface UserStats {
  xp: number;
  coins: number;
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  lastStudiedDate: string;
  subjectProgress: {
    [key: string]: {
      answered: number;
      correct: number;
      lastStudied: string;
    };
  };
}

// --- ヘルパー関数 ---
const getDates = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date: Date) => {
    return new Date(date.toLocaleDateString('en-US')).toLocaleDateString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  }
  
  return { today: formatDate(today), yesterday: formatDate(yesterday) };
};

// --- クイズコンポーネント ---
const QuizComponent = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');
  const countParam = searchParams.get('count');

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [], currentIndex: 0, selectedAnswer: null, answers: [],
    showExplanation: false, isCompleted: false, startTime: Date.now(), timeRemaining: 30
  });

  // クイズ初期化処理
  useEffect(() => {
    console.log("クイズ初期化開始:", { subject, category, countParam });
    let questions: UnifiedQuestion[] = [];
    const numberOfQuestions = countParam ? parseInt(countParam, 10) : 5;

    if (subject && category) {
      questions = getQuestionsBySubjectAndCategory(subject as any, category);
      console.log(`取得した問題数 (シャッフル前): ${questions.length}`);
    } else {
      questions = getRandomQuestionsMixed(numberOfQuestions);
      console.log(`取得したランダム問題数: ${questions.length}`);
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);
    console.log(`最終的な問題数: ${shuffled.length}`);

    setQuizState(prev => ({
      ...prev, questions: shuffled, answers: new Array(shuffled.length).fill(null)
    }));
  }, [subject, category, countParam]);

  // タイマー処理
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

  // ★★★ クイズ完了時の統計更新ロジック ★★★
  useEffect(() => {
    if (quizState.isCompleted && totalQuestions > 0) {
      const savedStatsJSON = localStorage.getItem('shakaquest_userStats');
      if (!savedStatsJSON) return;
      
      const userStats: UserStats = JSON.parse(savedStatsJSON);
      const { today, yesterday } = getDates();
      const lastStudied = userStats.lastStudiedDate || '';

      if (lastStudied !== today) {
        userStats.currentStreak = (lastStudied === yesterday) ? userStats.currentStreak + 1 : 1;
        userStats.longestStreak = Math.max(userStats.currentStreak, userStats.longestStreak);
        userStats.lastStudiedDate = today;
      }
      
      userStats.xp += earnedXP;
      userStats.coins = (userStats.coins || 0) + (correctAnswers * 10);
      userStats.totalAnswered += totalQuestions;
      userStats.correctAnswers += correctAnswers;
      
      const subjectId = subject || 'mixed';
      if (subject && userStats.subjectProgress[subjectId]) {
         const subjectProgress = userStats.subjectProgress[subjectId];
         userStats.subjectProgress[subjectId] = {
           answered: subjectProgress.answered + totalQuestions,
           correct: subjectProgress.correct + correctAnswers,
           lastStudied: today
         };
      }
      
      localStorage.setItem('shakaquest_userStats', JSON.stringify(userStats));
      console.log("更新された統計情報:", userStats);
    }
  }, [quizState.isCompleted]);

  const handleTimeUp = () => handleAnswerSelect(null);
  const handleAnswerSelect = (answerIndex: number | null) => {
    if (quizState.showExplanation) return;
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = answerIndex;
    setQuizState(prev => ({ ...prev, selectedAnswer: answerIndex, answers: newAnswers, showExplanation: true }));
  };
  const handleNextQuestion = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1, selectedAnswer: null, showExplanation: false, timeRemaining: 30 }));
    } else {
      setQuizState(prev => ({ ...prev, isCompleted: true }));
    }
  };

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progress = totalQuestions > 0 ? ((quizState.currentIndex + 1) / totalQuestions) * 100 : 0;
  const correctAnswers = quizState.answers.filter((answer, index) => answer !== null && answer === quizState.questions[index]?.correct).length;
  const totalQuestions = quizState.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);

  // --- レンダリング ---
  if (!currentQuestion) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を探しています...</p>
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
              <div className="bg-green-100 rounded-lg p-2"><div className="text-lg font-bold text-green-800">{correctAnswers}/{totalQuestions}</div><div className="text-xs text-green-600">正解数</div></div>
              <div className="bg-blue-100 rounded-lg p-2"><div className="text-lg font-bold text-blue-800">{accuracy}%</div><div className="text-xs text-blue-600">正答率</div></div>
              <div className="bg-purple-100 rounded-lg p-2"><div className="text-lg font-bold text-purple-800">+{earnedXP}</div><div className="text-xs text-purple-600">獲得XP</div></div>
              <div className="bg-yellow-100 rounded-lg p-2"><div className="text-lg font-bold text-yellow-800">{Math.round((Date.now() - quizState.startTime) / 1000)}秒</div><div className="text-xs text-yellow-600">時間</div></div>
            </div>
            <div className="my-4">
              {accuracy >= 80 && (<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">素晴らしい！とても良い結果です！🌟</div>)}
              {accuracy >= 60 && accuracy < 80 && (<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">良い結果です！もう少し頑張りましょう！💪</div>)}
              {accuracy < 60 && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">復習が必要かもしれません。頑張って続けましょう！📚</div>)}
            </div>
            <div className="space-y-3">
              <button onClick={() => window.location.reload()} className="w-full bg-blue-500 text-white py-2.5 px-6 rounded-lg font-bold hover:bg-blue-600 transition-colors">もう一度挑戦</button>
              <Link href="/" className="block w-full bg-gray-500 text-white py-2.5 px-6 rounded-lg font-bold hover:bg-gray-600 transition-colors">ホームに戻る</Link>
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
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-2xl">{currentQuestion?.subject === 'geography' ? '🗾' : currentQuestion?.subject === 'history' ? '📜' : '🏛️'}</span>
              <span className="ml-2 text-base font-bold">{currentQuestion?.subject === 'geography' ? '地理' : currentQuestion?.subject === 'history' ? '歴史' : '公民'}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">{quizState.timeRemaining}秒</div>
              <div className="text-xs text-gray-600">残り時間</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
            <div className="bg-blue-500 rounded-full h-2.5 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-center text-xs text-gray-600">問題 {quizState.currentIndex + 1} / {quizState.questions.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex flex-col">
          <div className="flex-shrink-0">
            <div className="flex items-center mb-2">
              <span className={`px-2 py-1 rounded text-xs font-bold text-white ${currentQuestion?.difficulty === 'easy' ? 'bg-green-500' : currentQuestion?.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {currentQuestion?.difficulty === 'easy' ? '初級' : currentQuestion?.difficulty === 'medium' ? '中級' : '上級'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">{currentQuestion?.question}</h2>
          </div>
          <div className="space-y-2 mb-4">
            {currentQuestion?.options.map((option, index) => {
              let buttonClass = "w-full p-3 text-sm text-left border-2 rounded-lg transition-all duration-200 ";
              if (quizState.showExplanation) {
                if (index === currentQuestion.correct) buttonClass += "bg-green-100 border-green-500 text-green-800";
                else if (index === quizState.selectedAnswer) buttonClass += "bg-red-100 border-red-500 text-red-800";
                else buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
              } else {
                buttonClass += "bg-white border-gray-300 text-gray-800 hover:bg-gray-50";
              }
              return (
                <button key={index} onClick={() => handleAnswerSelect(index)} disabled={quizState.showExplanation} className={buttonClass}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>{option}
                </button>
              );
            })}
          </div>
          {quizState.showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm flex-shrink-0">
              <h3 className="font-bold text-blue-800 mb-1">解説</h3>
              <p className="text-blue-700">{currentQuestion?.explanation}</p>
            </div>
          )}
          <div className="text-center flex-shrink-0">
            {quizState.showExplanation ? (
              <button onClick={handleNextQuestion} className="bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-600 transition-colors">
                {quizState.currentIndex < quizState.questions.length - 1 ? '次の問題' : '結果を見る'}
              </button>
            ) : (
              <div className="text-gray-500 text-xs">選択肢をクリックして回答してください</div>
            )}
          </div>
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
