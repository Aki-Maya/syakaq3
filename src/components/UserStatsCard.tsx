"use client";

import { UserStats } from '@/types';
import { getPlayerLevel, getXPForNextLevel } from '@/data/index';

interface UserStatsCardProps {
  userStats: UserStats;
}

export const UserStatsCard = ({ userStats }: UserStatsCardProps) => {
  const currentLevelData = getPlayerLevel(userStats.xp);
  const xpForNextData = getXPForNextLevel(userStats.xp);
  const progressPercent = (currentLevelData.maxXP > currentLevelData.minXP)
    ? ((userStats.xp - currentLevelData.minXP) / (currentLevelData.maxXP - currentLevelData.minXP)) * 100
    : 0;
  const displayProgressPercent = Math.min(100, progressPercent);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{currentLevelData.badge} レベル {currentLevelData.level}</h2>
          <p className="opacity-90">{currentLevelData.name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{userStats.xp.toLocaleString()}</div>
          <div className="text-sm opacity-90">XP</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>次のレベルまで</span>
          <span className="font-bold">{xpForNextData.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500" 
            style={{ width: `${displayProgressPercent}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white border-opacity-20">
        <div className="text-center">
          <div className="text-2xl font-bold">{userStats.streak}</div>
          <div className="text-sm opacity-90">🔥 連続日数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{userStats.coins}</div>
          <div className="text-sm opacity-90">💰 コイン</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">
            {userStats.totalAnswered > 0 
              ? Math.round((userStats.correctAnswers / userStats.totalAnswered) * 100) 
              : 0}%
          </div>
          <div className="text-sm opacity-90">📊 正答率</div>
        </div>
      </div>
    </div>
  );
};