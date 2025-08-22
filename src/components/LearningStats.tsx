"use client";

import { subjects } from '@/data/index';
import { UserStats } from '@/types';

interface LearningStatsProps {
  userStats: UserStats;
}

export const LearningStats = ({ userStats }: LearningStatsProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 学習統計</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const stats = userStats.subjectProgress[subject.id] || { 
            answered: 0, 
            correct: 0, 
            lastStudied: '未学習' 
          };
          const accuracy = stats.answered > 0 
            ? Math.min(100, Math.round((stats.correct / stats.answered) * 100)) 
            : 0;
          
          return (
            <div key={subject.id} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">{subject.icon}</div>
              <h4 className="font-bold text-gray-800">{subject.name}</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div>回答数: {stats.answered}</div>
                <div>正答率: {accuracy}%</div>
                <div className="truncate">最終学習: {stats.lastStudied || '未学習'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};