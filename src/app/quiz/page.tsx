"use client";

import { useState, useEffect } from 'react';
import { 
  subjects, 
  getPlayerLevel, 
  getXPForNextLevel, 
  type Subject,
  geographyQuestions,
  historyQuestions,
  civicsQuestions
} from '@/data/index';
import Link from 'next/link';

// 🆕 日付取得関数を追加
const getCurrentDate = () => {
  return new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 🆕 問題数を動的取得する関数
const getActualQuestionCount = (subjectId: string, categoryId: string) => {
  let questions = [];
  
  switch (subjectId) {
    case 'geography':
      questions = geographyQuestions.filter(q => q.category === categoryId);
      break;
    case 'history':
      questions = historyQuestions.filter(q => q.category === categoryId);
      break;
    case 'civics':
      questions = civicsQuestions.filter(q => q.category === categoryId);
      break;
    default:
      questions = [];
  }
  
  return questions.length;
};

// 🆕 分野別総問題数を取得する関数
const getTotalQuestionsBySubject = (subject: string) => {
  switch (subject) {
    case 'geography':
      return geographyQuestions.length;
    case 'history':
      return historyQuestions.length;
    case 'civics':
      return civicsQuestions.length;
    default:
      return 0;
  }
};

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

const ShakaQuestHome = () => {
  // 🔄 useState初期値を空に変更
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 450,
    coins: 180,
    streak: 7,
    totalAnswered: 45,
    correctAnswers: 38,
    subjectProgress: {
      geography: { answered: 18, correct: 15, lastStudied: '' },
      history: { answered: 15, correct: 12, lastStudied: '' },
      civics: { answered: 12, correct: 11, lastStudied: '' }
    }
  });

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 🆕 useEffect でlocalStorage対応を追加
  useEffect(() => {
    const savedStats = localStorage.getItem('shakaquest_userStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setUserStats(parsedStats);
      } catch (error) {
        console.error('Error parsing saved stats:', error);
        initializeStats();
      }
    } else {
      initializeStats();
    }
  }, []);

  // 🆕 初期化関数を追加
  const initializeStats = () => {
    const currentDate = getCurrentDate();
    const initialStats = {
      level: 1,
      xp: 450,
      coins: 180,
      streak: 7,
      totalAnswered: 45,
      correctAnswers: 38,
      subjectProgress: {
        geography: { answered: 18, correct: 15, lastStudied: currentDate },
        history: { answered: 15, correct: 12, lastStudied: currentDate },
        civics: { answered: 12, correct: 11, lastStudied: currentDate }
      }
    };
    setUserStats(initialStats);
    localStorage.setItem('shakaquest_userStats', JSON.stringify(initialStats));
  };

  // 🆕 学習日更新関数を追加
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

  const currentLevel = getPlayerLevel(userStats.xp);
  const xpForNext = getXPForNextLevel(userStats.xp);
  const progressPercent = ((userStats.xp - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100;

  // Subject Card Component
  const SubjectCard = ({ subject }: { subject: Subject }) => {
    // 🔄 実際の総問題数を動的取得
    const actualTotalQuestions = getTotalQuestionsBySubject(subject.id);
    const subjectStats = userStats.subjectProgress[subject.id];
    const accuracy = subjectStats ? Math.round((subjectStats.correct / subjectStats.answered) * 100) : 0;
    const progress = subjectStats ? Math.round((subjectStats.answered / actualTotalQuestions) * 100) : 0;

    return (
      <div 
        className={`${subject.color} rounded-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
        onClick={() => {
          setSelectedSubject(subject.id);
          updateLastStudied(subject.id);
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{subject.icon}</div>
          <div className="text-right">
            <div className="text-sm opacity-90">進捗</div>
            <div className="text-xl font-bold">{progress}%</div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
        <p className="text-sm opacity-90 mb-4">{subject.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>問題数</span>
            {/* 🔄 動的な総問題数を表示 */}
            <span>{subjectStats?.answered || 0}/{actualTotalQuestions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>正答率</span>
            <span>{accuracy}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Category Card Component
  const CategoryCard = ({ category, subjectId }: { category: any; subjectId: string }) => {
    // 🔄 実際の問題数を動的取得
    const actualCount = getActualQuestionCount(subjectId, category.id);

    return (
      <div 
        className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-blue-300"
        onClick={() => setSelectedCategory(category.id)}
      >
        <h4 className="font-bold text-lg mb-2">{category.name}</h4>
        <p className="text-gray-600 text-sm mb-3">{category.description}</p>
        <div className="flex justify-between items-center">
          {/* 🔄 動的な問題数を表示 */}
          <span className="text-sm text-gray-500">{actualCount}問</span>
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
  };

  // User Stats Card Component
  const UserStatsCard = () => (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{currentLevel.badge} レベル {currentLevel.level}</h2>
          <p className="opacity-90">{currentLevel.name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{userStats.xp.toLocaleString()}</div>
          <div className="text-sm opacity-90">XP</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>次のレベルまで</span>
          <span className="font-bold">{xpForNext.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
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
          <div className="text-2xl font-bold">{Math.round((userStats.correctAnswers / userStats.totalAnswered) * 100)}%</div>
          <div className="text-sm opacity-90">📊 正答率</div>
        </div>
      </div>
    </div>
  );

  // Daily Goal Card
  const DailyGoalCard = () => {
    const dailyGoal = 10;
    const today = getCurrentDate();
    
    const todayStudied = Object.values(userStats.subjectProgress).filter(
      stats => stats.lastStudied === today
    ).length;
    
    const todayAnswered = Math.min(todayStudied * 2, dailyGoal);
    const goalProgress = (todayAnswered / dailyGoal) * 100;

    return (
      <div className="bg-yellow-100 rounded-lg p-4 mb-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-yellow-800">📅 今日の目標</h3>
          <span className="text-yellow-600 text-sm">{todayAnswered}/{dailyGoal}問</span>
        </div>
        <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
          <div 
            className="bg-yellow-500 rounded-full h-2 transition-all duration-300" 
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <p className="text-yellow-700 text-sm">
          あと{Math.max(0, dailyGoal - todayAnswered)}問で今日の目標達成！
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ShakaQuest
          </h1>
          <p className="text-gray-600">中学受験社会学習アプリ</p>
        </div>

        {/* User Stats */}
        <UserStatsCard />

        {/* Daily Goal */}
        <DailyGoalCard />

        {/* Subject Selection or Category Selection */}
        {!selectedSubject ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              学習する分野を選択してください
            </h2>
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
                  subjectId={selectedSubject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Learning Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-lg mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 学習統計</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const stats = userStats.subjectProgress[subject.id];
              const accuracy = stats ? Math.round((stats.correct / stats.answered) * 100) : 0;

              return (
                <div key={subject.id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{subject.icon}</div>
                  <h4 className="font-bold text-gray-800">{subject.name}</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>回答数: {stats?.answered || 0}</div>
                    <div>正答率: {accuracy}%</div>
                    <div>最終学習: {stats?.lastStudied || '未学習'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Start Button */}
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
