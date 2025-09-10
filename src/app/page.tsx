"use client";

import { useState } from 'react';
import { subjects } from '@/data/index';
import { useUserStats } from '@/hooks/useUserStats';
import { UserStatsCard, DailyGoalCard, SubjectCard, CategoryCard, LearningStats } from '@/components';
import Link from 'next/link';

// メインページコンポーネント
const ShakaQuestHome = () => {
  // --- カスタムフックを使用した状態管理 ---
  const { userStats, updateLastStudied, setDailyGoalTarget } = useUserStats();
  
  // --- UI状態管理 ---
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // --- イベントハンドラー ---
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };

  const handleStudyStart = (subjectId: string) => {
    updateLastStudied(subjectId);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  // --- メインレンダリング ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ShakaQuest2</h1>
          <p className="text-gray-600">中学受験学習アプリ - 125問厳選版</p>
          <div className="text-xs text-gray-500 mt-1">v3.1.0 - サンプル問題完全除去！</div>
        </div>

        {/* ユーザー統計カード */}
        <UserStatsCard userStats={userStats} />
        
        {/* 今日の目標カード */}
        <DailyGoalCard 
          userStats={userStats} 
          onSetGoal={setDailyGoalTarget}
        />

        {/* メインコンテンツ */}
        {!selectedSubject ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              学習する分野を選択してください
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {subjects.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  userStats={userStats}
                  onClick={() => handleSubjectSelect(subject.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={handleBackToSubjects}
                className="mr-4 text-blue-500 hover:text-blue-700 transition-colors"
              >
                ← 戻る
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {subjects.find(s => s.id === selectedSubject)?.name} - カテゴリ選択
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.find(s => s.id === selectedSubject)?.categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  subjectId={selectedSubject!}
                  onStudyStart={() => handleStudyStart(selectedSubject!)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 学習統計 */}
        <LearningStats userStats={userStats} />

        {/* ランダムクイズボタン */}
        <div className="text-center mt-8">
          <Link 
            href="/quiz"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => {
              // ランダムクイズの場合、全科目の最終学習日を更新
              subjects.forEach(subject => updateLastStudied(subject.id));
            }}
          >
            🚀 ランダムクイズを開始
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShakaQuestHome;