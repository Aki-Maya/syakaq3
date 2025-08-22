"use client";

import { Subject } from '@/data/index';
import { UserStats } from '@/types';

interface SubjectCardProps {
  subject: Subject;
  userStats: UserStats;
  onClick: () => void;
}

export const SubjectCard = ({ subject, userStats, onClick }: SubjectCardProps) => {
  const subjectStats = userStats.subjectProgress[subject.id] || { answered: 0, correct: 0 };
  const accuracy = subjectStats.answered > 0
    ? Math.min(100, Math.round((subjectStats.correct / subjectStats.answered) * 100))
    : 0;
  const cappedAnswered = Math.min(subjectStats.answered, subject.totalQuestions);
  const progress = subject.totalQuestions > 0
    ? Math.round((cappedAnswered / subject.totalQuestions) * 100)
    : 0;
  const displayProgress = Math.min(100, progress);
  
  return (
    <div 
      className={`${subject.color} rounded-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{subject.icon}</div>
        <div className="text-right">
          <div className="text-sm opacity-90">進捗</div>
          <div className="text-xl font-bold">{progress}%</div>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
      <p className="text-sm opacity-90 mb-4 h-10">{subject.description}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>問題数</span>
          <span>{cappedAnswered}/{subject.totalQuestions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>正答率</span>
          <span>{accuracy}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300" 
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};