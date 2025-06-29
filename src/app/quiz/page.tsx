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

// ユーザー統計データの型定義（連続日数計算用にlastStudiedDateを追加）
interface UserStats {
  xp: number;
  coins: number;
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  lastStudiedDate: string; // YYYY/MM/DD形式の日付
  subjectProgress: {
    [key: string]: {
      answered: number;
      correct: number;
      lastStudied: string;
    };
  };
}


// --- ヘルパー関数 ---

// 今日と昨日の日付を 'YYYY/MM/DD' 形式で取得する
const getDates = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date: Date) => {
    return new Date(date.toLocaleDateString('en-US')).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  return {
    today: formatDate(today),
    yesterday: formatDate(yesterday)
  };
};


// --- クイズコンポーネント ---

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

  // クイズ初期化処理
  useEffect(() => {
    let questions: UnifiedQuestion[] = [];
    const numberOfQuestions = countParam ? parseInt(countParam, 10) : 5;

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
  const progress = quizState.questions.length > 0 ? ((quizState.currentIndex + 1) / quizState.questions.length) * 100 : 0;
  const correctAnswers = quizState.answers.filter((answer, index) => answer !== null && answer === quizState.questions[index]?.correct).length;
  const totalQuestions = quizState.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);

  // ★★★ ここが重要 ★★★
  // 副作用フック: クイズ完了時にユーザー統計（連続日数を含む）を更新する
  useEffect(() => {
    if (quizState.isCompleted && totalQuestions > 0) {
      const savedStatsJSON = localStorage.getItem('shakaquest_userStats');
      if (!savedStatsJSON) return;
      
      const userStats: UserStats = JSON.parse(savedStatsJSON);
      
      // --- 連続日数カウンターのロジック ---
      const { today, yesterday } = getDates();
      const lastStudied = userStats.lastStudiedDate || '';

      // 今日まだ学習していない場合のみ、連続日数を更新
      if (lastStudied !== today) {
        if (lastStudied === yesterday) {
          // 昨日学習していたら、連続日数を+1
          userStats.currentStreak += 1;
        } else {
          // 連続が途切れていたら、1にリセット
          userStats.currentStreak = 1;
        }

        // 最長記録を更新
        if (userStats.currentStreak > userStats.longestStreak) {
          userStats.longestStreak = userStats.currentStreak;
        }
        
        // 最終学習日を今日に更新
        userStats.lastStudiedDate = today;
      }
      // --- 連続日数ロジックここまで ---

      // XPとコイン、回答数を加算
      userStats.xp += earnedXP;
      userStats.coins = (userStats.coins || 0) + (correctAnswers * 10);
      userStats.totalAnswered += totalQuestions;
      userStats.correctAnswers += correctAnswers;
      
      // 科目別の進捗も更新
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
      console.log("更新された統計情報（連続日数含む）:", userStats);
    }
  }, [quizState.isCompleted]);

  // --- レンダリング ---
  if (!currentQuestion) {
    // ローディング表示
  }

  if (quizState.isCompleted) {
    // 結果表示
  }

  return (
    // クイズ画面表示
  );
};

// ページコンポーネント
const QuizPage = () => {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込み中...</p>
        </div>
      </div>
    }>
      <QuizComponent />
    </Suspense>
  );
};

export default QuizPage;
