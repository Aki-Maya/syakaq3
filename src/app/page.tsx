"use client";

import { useState, useEffect } from 'react';
import { subjects, getPlayerLevel, getXPForNextLevel, type Subject, type SubjectCategory } from '@/data/index';
import Link from 'next/link';

// 日付取得関数
const getCurrentDate = () => {
  return new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// ユーザー統計情報の型定義
interface UserStats {
  level: number;
  xp: number;
  coins: number;
  streak: number;
  totalAnswered: number;
  correctAnswers: number;
  subjectProgress: {
    [key: string]: {
      answered: number;
      correct: number;
      lastStudied: string;
    };
  };
}

// メインページコンポーネント
const ShakaQuestHome = () => {
  // --- State定義 ---
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1, xp: 0, coins: 0, streak: 0, totalAnswered: 0, correctAnswers: 0,
    subjectProgress: {}
  });
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- 副作用フック ---
  useEffect(() => {
    const savedStats = localStorage.getItem('shakaquest_userStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        // 古いデータ構造との互換性のためのチェック
        if (!parsedStats.subjectProgress) {
          parsedStats.subjectProgress = {};
        }
        setUserStats(parsedStats);
      } catch (error) {
        console.error('Error parsing saved stats:', error);
        initializeStats();
      }
    } else {
      initializeStats();
    }
  }, []);

  // --- データ処理・計算 ---
  const initializeStats = () => {
    const initialStats: UserStats = {
      level: 1, xp: 0, coins: 0, streak: 0, totalAnswered: 0, correctAnswers: 0,
      subjectProgress: {}
    };
    subjects.forEach(subject => {
      initialStats.subjectProgress[subject.id] = { answered: 0, correct: 0, lastStudied: '' };
    });
    setUserStats(initialStats);
    localStorage.setItem('shakaquest_userStats', JSON.stringify(initialStats));
  };

  const updateLastStudied = (subjectId: string) => {
    setUserStats(prev => {
      const updated = {
        ...prev,
        subjectProgress: {
          ...prev.subjectProgress,
          [subjectId]: {
            ...prev.subjectProgress[subjectId],
            lastStudied: getCurrentDate()
          }
        }
      };
      localStorage.setItem('shakaquest_userStats', JSON.stringify(updated));
      return updated;
    });
  };
  
  // (updateStats関数はクイズページ側で実装される想定のため、ここでは一旦省略)

  const currentLevelData = getPlayerLevel(userStats.xp);
  const xpForNextData = getXPForNextLevel(userStats.xp);
  const progressPercent = (currentLevelData.maxXP > currentLevelData.minXP)
    ? ((userStats.xp - currentLevelData.minXP) / (currentLevelData.maxXP - currentLevelData.minXP)) * 100
    : 0;
  const displayProgressPercent = Math.min(100, progressPercent);

  // --- サブコンポーネント定義 ---

  const SubjectCard = ({ subject }: { subject: Subject }) => {
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
        onClick={() => setSelectedSubject(subject.id)}
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
  
  const CategoryCard = ({ category, subjectId }: { category: SubjectCategory; subjectId: string }) => (
    <div 
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-blue-300"
      onClick={() => setSelectedCategory(category.id)}
    >
      <h4 className="font-bold text-lg text-gray-800 mb-2">{category.name}</h4>
      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{category.questionCount}問</span>
        <Link 
          href={`/quiz?subject=${subjectId}&category=${category.id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors"
          onClick={() => updateLastStudied(subjectId)}
        >
          開始
        </Link>
      </div>
    </div>
  );

  const DailyGoalCard = () => { /* ... (変更なし) ... */ };
  
  const UserStatsCard = () => (
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
          <div className="text-2xl font-bold">{userStats.totalAnswered > 0 ? Math.round((userStats.correctAnswers / userStats.totalAnswered) * 100) : 0}%</div>
          <div className="text-sm opacity-90">📊 正答率</div>
        </div>
      </div>
    </div>
  );
  
  // --- メインレンダリング ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ShakaQuest2</h1>
          <p className="text-gray-600">中学受験学習アプリ</p>
        </div>
        <UserStatsCard />
        <DailyGoalCard />
        {!selectedSubject ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">学習する分野を選択してください</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setSelectedSubject(null)}
                className="mr-4 text-blue-500 hover:text-blue-700"
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
                />
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 学習統計</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const stats = userStats.subjectProgress[subject.id] || { answered: 0, correct: 0, lastStudied: '未学習' };
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
                    <div>最終学習: {stats.lastStudied}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link 
            href="/quiz"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚀 ランダムクイズを開始
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShakaQuestHome;
