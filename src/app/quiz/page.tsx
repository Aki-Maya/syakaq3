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

const QuizComponent = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');

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

  // Initialize quiz
  useEffect(() => {
    let questions: UnifiedQuestion[] = [];

    if (subject && category) {
      questions = getQuestionsBySubjectAndCategory(subject as any, category);
    } else {
      questions = getRandomQuestionsMixed(10);
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);

    setQuizState(prev => ({
      ...prev,
      questions: shuffled,
      answers: new Array(shuffled.length).fill(null)
    }));
  }, [subject, category]);

  // Timer effect
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

  const handleTimeUp = () => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = null;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true
    }));
  };

  const handleAnswerSelect = (answerIndex: number) => {
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

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progress = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;

  const correctAnswers = quizState.answers.filter((answer, index) => 
    answer === quizState.questions[index]?.correct
  ).length;

  const totalQuestions = quizState.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const earnedXP = calculateXPFromScore(correctAnswers, totalQuestions, 'medium', true);

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

  if (quizState.isCompleted) {
    return (
      // 【修正】 min-h-screen -> h-screen, flexとitems-center/justify-centerを追加して中央配置
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* 【修正】 p-8 -> p-4 sm:p-6 に変更し、スマホでの余白を削減 */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            {/* 【修正】 text-6xl -> text-5xl, mb-4 -> mb-2 に変更 */}
            <div className="text-5xl mb-2">🎉</div>
            {/* 【修正】 text-3xl -> text-2xl, mb-4 -> mb-3 に変更 */}
            <h1 className="text-2xl font-bold text-gray-800 mb-3">クイズ完了！</h1>

            {/* 【修正】 grid-cols-2 -> grid-cols-4 にして横に並べ、gapとマージンを削減 */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              {/* 【修正】 p-4 -> p-2, font-sizeとテキストを調整 */}
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

            {/* 【修正】 mb-6 -> my-4, py-3 -> py-2 に変更 */}
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

            {/* 【修正】 space-y-4 -> space-y-3, py-3 -> py-2.5 に変更 */}
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
    // 【修正】 min-h-screen -> h-screen, flex-colを追加して子要素を縦に並べる
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 flex flex-col">
      {/* 【修正】 w-full, flex, flex-col, flex-grow を追加してレイアウトを制御 */}
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-grow">
        {/* 【修正】 p-6 -> p-4, mb-6 -> mb-2 に変更 */}
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

        {/* 【修正】 p-6 -> p-4, mb-6 -> mb-4, flex-growとflex-colを追加 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex-grow flex flex-col">
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
            {/* 【修正】 text-xl -> text-lg, mb-4 -> mb-2 に変更 */}
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {currentQuestion?.question}
            </h2>
          </div>

          {/* 【修正】 space-y-3 -> space-y-2, mb-6 -> mb-4, flex-growとoverflow-y-autoでコンテンツが多い場合に備える */}
          <div className="space-y-2 mb-4 flex-grow overflow-y-auto">
            {currentQuestion?.options.map((option, index) => {
              // 【修正】 p-4 -> p-3, text-left -> text-sm text-left に変更
              let buttonClass = "w-full p-3 text-sm text-left border-2 rounded-lg transition-all duration-200 ";

              if (quizState.showExplanation) {
                if (index === currentQuestion.correct) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800";
                } else if (index === quizState.selectedAnswer && index !== currentQuestion.correct) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                }
              } else {
                buttonClass += "bg-white border-gray-300 text-gray-800 hover:bg-gray-50";
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

          {quizState.showExplanation && (
            // 【修正】 p-4 -> p-3, mb-6 -> mb-4, text-sm に変更
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm flex-shrink-0">
              <h3 className="font-bold text-blue-800 mb-1">解説</h3>
              <p className="text-blue-700">{currentQuestion?.explanation}</p>
            </div>
          )}

          {/* 【修正】 ボタンサイズを調整 */}
          <div className="text-center flex-shrink-0">
            {quizState.showExplanation ? (
              <button
                onClick={handleNextQuestion}
                className="bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-600 transition-colors"
              >
                {quizState.currentIndex < quizState.questions.length - 1 ? '次の問題' : '結果を見る'}
              </button>
            ) : (
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
