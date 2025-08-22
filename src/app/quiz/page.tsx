"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getQuestionsBySubjectAndCategory, 
  getRandomQuestionsMixed,
  calculateXPFromScore,
  type UnifiedQuestion 
} from '@/data/index';
import { useUserStats } from '@/hooks/useUserStats';
import { QuizQuestion, QuizResult } from '@/components';

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

// --- クイズコンポーネント ---
const QuizComponent = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');
  const countParam = searchParams.get('count');
  
  // カスタムフックを使用した統計管理
  const { updateStats } = useUserStats();

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

  // 統計計算
  const correctAnswers = quizState.answers.filter((answer, index) => 
    answer !== null && answer === quizState.questions[index]?.correct
  ).length;
  const totalQuestions = quizState.questions.length;
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);
  
  // クイズ完了時の統計更新ロジック（リファクタリング済み）
  useEffect(() => {
    if (quizState.isCompleted && totalQuestions > 0) {
      const subjectId = subject || 'mixed';
      updateStats(totalQuestions, correctAnswers, earnedXP, subjectId);
      console.log("統計情報を更新しました:", { totalQuestions, correctAnswers, earnedXP, subjectId });
    }
  }, [quizState.isCompleted, totalQuestions, correctAnswers, earnedXP, subject, updateStats]);

  // イベントハンドラー
  const handleTimeUp = () => handleAnswerSelect(null);
  
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

  const handleRestart = () => {
    window.location.reload();
  };

  const currentQuestion = quizState.questions[quizState.currentIndex];

  // --- レンダリング ---
  if (!currentQuestion && !quizState.isCompleted) {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <QuizResult
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          questions={quizState.questions}
          userAnswers={quizState.answers}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <QuizQuestion
        question={currentQuestion}
        currentIndex={quizState.currentIndex}
        totalQuestions={totalQuestions}
        selectedAnswer={quizState.selectedAnswer}
        showExplanation={quizState.showExplanation}
        timeRemaining={quizState.timeRemaining}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNextQuestion}
      />
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