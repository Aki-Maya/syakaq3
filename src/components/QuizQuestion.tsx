"use client";

interface QuizQuestionProps {
  question: {
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
  };
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  timeRemaining: number;
  onAnswerSelect: (answerIndex: number) => void;
  onNext: () => void;
}

export const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  timeRemaining,
  onAnswerSelect,
  onNext
}: QuizQuestionProps) => {
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* プログレス表示 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            問題 {currentIndex + 1} / {totalQuestions}
          </span>
          <span className={`text-sm font-bold ${
            timeRemaining <= 10 ? 'text-red-600' : 'text-gray-600'
          }`}>
            ⏱️ {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 問題 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {question.question}
        </h2>

        {/* 選択肢 */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
            
            if (showExplanation) {
              if (index === question.correct) {
                buttonClass += "bg-green-100 border-green-500 text-green-800";
              } else if (index === selectedAnswer && index !== question.correct) {
                buttonClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
              }
            } else {
              if (index === selectedAnswer) {
                buttonClass += "bg-blue-100 border-blue-500 text-blue-800";
              } else {
                buttonClass += "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700";
              }
            }

            return (
              <button
                key={index}
                onClick={() => !showExplanation && onAnswerSelect(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <span className="font-bold">{index + 1}.</span> {option}
                {showExplanation && index === question.correct && (
                  <span className="ml-2 text-green-600">✓ 正解</span>
                )}
                {showExplanation && index === selectedAnswer && index !== question.correct && (
                  <span className="ml-2 text-red-600">✗ あなたの回答</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 解説表示 */}
        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r">
            <h3 className="font-bold text-blue-800 mb-2">💡 解説</h3>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}

        {/* 次へボタン */}
        {showExplanation && (
          <div className="mt-6 text-center">
            <button
              onClick={onNext}
              className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors font-bold"
            >
              {currentIndex < totalQuestions - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};