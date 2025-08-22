"use client";

import { UserStats } from '@/types';

interface DailyGoalCardProps {
  userStats: UserStats;
  onSetGoal?: (target: number) => void;
}

export const DailyGoalCard = ({ userStats, onSetGoal }: DailyGoalCardProps) => {
  const dailyGoal = userStats.dailyGoal;
  
  if (!dailyGoal) {
    return null;
  }

  const progress = Math.min(100, (dailyGoal.completed / dailyGoal.target) * 100);
  const isCompleted = dailyGoal.completed >= dailyGoal.target;

  const handleGoalChange = (newTarget: number) => {
    if (onSetGoal && newTarget > 0 && newTarget <= 100) {
      onSetGoal(newTarget);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">{isCompleted ? '🎯' : '📈'}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">今日の目標</h3>
            <p className="text-gray-600 text-sm">
              {dailyGoal.date} - {dailyGoal.completed}/{dailyGoal.target}問
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(progress)}%
          </div>
          <div className="text-sm text-gray-500">達成率</div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ステータスメッセージ */}
      <div className="text-center mb-4">
        {isCompleted ? (
          <div className="text-green-600 font-bold flex items-center justify-center space-x-1">
            <span>🎉</span>
            <span>本日の目標達成！おめでとうございます！</span>
            <span>🎉</span>
          </div>
        ) : (
          <div className="text-gray-600">
            あと <span className="font-bold text-blue-600">{dailyGoal.target - dailyGoal.completed}</span>問 で目標達成です！
          </div>
        )}
      </div>

      {/* 目標設定 */}
      <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">目標:</span>
        <select 
          value={dailyGoal.target} 
          onChange={(e) => handleGoalChange(Number(e.target.value))}
          className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 10, 15, 20, 25, 30, 40, 50].map(num => (
            <option key={num} value={num}>{num}問</option>
          ))}
        </select>
        <span className="text-sm text-gray-600">/ 日</span>
      </div>
    </div>
  );
};