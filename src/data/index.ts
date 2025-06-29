// Unified Data Index for ShakaQuest Complete Edition
import { 
  prefectures, 
  climateRegions, 
  industrialRegions, 
  geographyQuestions,
  getQuestionsByCategory as getGeographyByCategory,
  getQuestionsByDifficulty as getGeographyByDifficulty,
  getRandomQuestions as getRandomGeography,
  type GeographyQuestion,
  type Prefecture,
  type ClimateRegion,
  type IndustrialRegion
} from './geography-enhanced';
import {
  historicalEras,
  historyQuestions,
  getQuestionsByEra,
  getQuestionsByCategory as getHistoryByCategory,
  getQuestionsByDifficulty as getHistoryByDifficulty,
  getRandomQuestions as getRandomHistory,
  getEras,
  type HistoryQuestion,
  type HistoricalEra
} from './history';
import {
  constitutionPrinciples,
  governmentBranches,
  civicsQuestions,
  getQuestionsByCategory as getCivicsByCategory,
  getQuestionsByDifficulty as getCivicsByDifficulty,
  getRandomQuestions as getRandomCivics,
  type CivicsQuestion,
  type ConstitutionPrinciple,
  type GovernmentBranch
} from './civics';

// Re-export all data
export {
  prefectures,
  climateRegions,
  industrialRegions,
  geographyQuestions,
  historicalEras,
  historyQuestions,
  constitutionPrinciples,
  governmentBranches,
  civicsQuestions
};

// Re-export types
export type {
  Prefecture,
  ClimateRegion,
  IndustrialRegion,
  GeographyQuestion,
  HistoricalEra,
  HistoryQuestion,
  ConstitutionPrinciple,
  GovernmentBranch,
  CivicsQuestion
};

// Base question interface for unified handling
export interface QuestionBase {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'map-select';
}

// Unified question type with subject information
export interface UnifiedQuestion extends QuestionBase {
  subject: 'geography' | 'history' | 'civics';
  era?: string; // Only for history questions
}

// Subject information interface
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: SubjectCategory[];
  totalQuestions: number;
}

export interface SubjectCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

// Subject definitions
// まず、questionCountとtotalQuestionsを初期値0で定義します。
export const subjects: Subject[] = [
  {
    id: 'geography',
    name: '地理',
    description: '日本の都道府県、気候、産業を学習',
    icon: '🗾',
    color: 'bg-green-500',
    categories: [
      { id: 'climate', name: '気候', description: '日本の気候区分', questionCount: 0 },
      { id: 'industry', name: '産業', description: '日本の産業', questionCount: 0 },
      { id: 'regions', name: '地方', description: '各地方の特色', questionCount: 0 }
    ],
    totalQuestions: 0
  },
  {
    id: 'history',
    name: '歴史',
    description: '旧石器時代から現代まで日本の歴史',
    icon: '📜',
    color: 'bg-blue-500',
    categories: [
      { id: 'primitive', name: '原始', description: '〜約2400年前', questionCount: 0 },
      { id: 'ancient', name: '古代', description: '約2400年前〜1185年', questionCount: 0 },
      { id: 'medieval', name: '中世', description: '1185年〜1573年', questionCount: 0 },
      { id: 'early-modern', name: '近世', description: '1573年〜1867年', questionCount: 0 },
      { id: 'modern', name: '近代', description: '1868年〜1945年', questionCount: 0 },
      { id: 'contemporary', name: '現代', description: '1945年〜現在', questionCount: 0 }
    ],
    totalQuestions: 0
  },
  {
    id: 'civics',
    name: '公民',
    description: '憲法、政治、国際関係を学習',
    icon: '🏛️',
    color: 'bg-purple-500',
    categories: [
      { id: 'constitution', name: '憲法', description: '日本国憲法の三大原則', questionCount: 0 },
      { id: 'government', name: '政治制度', description: '三権分立と国会・内閣・裁判所', questionCount: 0 },
      { id: 'human-rights', name: '人権', description: '基本的人権と新しい人権', questionCount: 0 },
      { id: 'local-government', name: '地方自治', description: '地方公共団体の仕組み', questionCount: 0 },
      { id: 'international', name: '国際関係', description: '国際連合と世界平和', questionCount: 0 },
      { id: 'elections', name: '選挙', description: '選挙制度と参政権', questionCount: 0 },
      { id: 'economics', name: '経済', description: '税制と経済の仕組み', questionCount: 0 },
      { id: 'labor', name: '労働', description: '労働者の権利', questionCount: 0 }
    ],
    totalQuestions: 0
  }
];

// ★★★ ここからが動的に問題数を計算するロジックです ★★★
// subjects配列をループして、各カテゴリの問題数を計算し、questionCountを更新します。
subjects.forEach(subject => {
  let totalCountForSubject = 0;
  subject.categories.forEach(category => {
    let count = 0;
    // 科目IDに応じて、適切な問題取得関数を呼び出します。
    switch (subject.id) {
      case 'geography':
        count = getGeographyByCategory(category.id).length;
        break;
      case 'history':
        count = getHistoryByCategory(category.id).length;
        break;
      case 'civics':
        count = getCivicsByCategory(category.id).length;
        break;
    }
    // 計算した問題数をカテゴリに設定します。
    category.questionCount = count;
    // 科目ごとの合計問題数に加算します。
    totalCountForSubject += count;
  });
  // 科目の合計問題数を更新します。
  subject.totalQuestions = totalCountForSubject;
});

// Badge system
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const badges: Badge[] = [
  { id: 'geography-starter', name: '地理入門', description: '地理の問題を5問正解', icon: '🌱', condition: 'geography_correct_5', rarity: 'common' },
  { id: 'geography-expert', name: '地理博士', description: '地理の問題を20問正解', icon: '🗺️', condition: 'geography_correct_20', rarity: 'rare' },
  { id: 'history-starter', name: '歴史入門', description: '歴史の問題を5問正解', icon: '📖', condition: 'history_correct_5', rarity: 'common' },
  { id: 'history-expert', name: '歴史博士', description: '歴史の問題を20問正解', icon: '👑', condition: 'history_correct_20', rarity: 'rare' },
  { id: 'civics-starter', name: '公民入門', description: '公民の問題を5問正解', icon: '🏛️', condition: 'civics_correct_5', rarity: 'common' },
  { id: 'civics-expert', name: '公民博士', description: '公民の問題を20問正解', icon: '⚖️', condition: 'civics_correct_20', rarity: 'rare' },
  { id: 'perfectionist', name: '完璧主義者', description: '10問連続で正解', icon: '💯', condition: 'streak_10', rarity: 'epic' },
  { id: 'speed-demon', name: 'スピードマスター', description: '問題を5秒以内に10回正解', icon: '⚡', condition: 'speed_correct_10', rarity: 'epic' },
  { id: 'all-rounder', name: 'オールラウンダー', description: '全分野で10問ずつ正解', icon: '🌟', condition: 'all_subjects_10', rarity: 'legendary' },
  { id: 'scholar', name: '学者', description: '総問題数の80%を正解', icon: '🎓', condition: 'total_correct_80_percent', rarity: 'legendary' },
  { id: 'daily-learner', name: '毎日学習', description: '7日連続でアプリを使用', icon: '📅', condition: 'daily_streak_7', rarity: 'rare' },
  { id: 'early-bird', name: '早起き学習', description: '朝6時前に学習を開始', icon: '🌅', condition: 'early_morning_study', rarity: 'common' }
];

// Level system
export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  rewards: string[];
  badge?: string;
}

export const levels: Level[] = [
  { level: 1, name: '初心者', minXP: 0, maxXP: 99, rewards: ['基本バッジ解放'], badge: '🔰' },
  { level: 2, name: '見習い', minXP: 100, maxXP: 249, rewards: ['新しい問題形式解放'], badge: '📚' },
  { level: 3, name: '学習者', minXP: 250, maxXP: 499, rewards: ['ヒント機能解放'], badge: '💡' },
  { level: 4, name: '努力家', minXP: 500, maxXP: 999, rewards: ['カスタムクイズ作成'], badge: '💪' },
  { level: 5, name: '研究生', minXP: 1000, maxXP: 1999, rewards: ['詳細統計表示'], badge: '🔍' },
  { level: 6, name: '上級者', minXP: 2000, maxXP: 3999, rewards: ['友達対戦機能'], badge: '🏆' },
  { level: 7, name: '専門家', minXP: 4000, maxXP: 7999, rewards: ['特別テーマ解放'], badge: '🎯' },
  { level: 8, name: '博士候補', minXP: 8000, maxXP: 15999, rewards: ['プレミアム問題'], badge: '🎓' },
  { level: 9, name: '博士', minXP: 16000, maxXP: 31999, rewards: ['オリジナル問題投稿'], badge: '👨‍🎓' },
  { level: 10, name: '教授', minXP: 32000, maxXP: 63999, rewards: ['教える機能解放'], badge: '👨‍🏫' },
  { level: 11, name: '達人', minXP: 64000, maxXP: 999999, rewards: ['全機能完全解放'], badge: '🧙‍♂️' }
];

// Utility functions for unified question handling
export const getAllQuestions = (): UnifiedQuestion[] => {
  const geoQuestions: UnifiedQuestion[] = geographyQuestions.map(q => ({ ...q, subject: 'geography' as const }));
  const histQuestions: UnifiedQuestion[] = historyQuestions.map(q => ({ ...q, subject: 'history' as const }));
  const civQuestions: UnifiedQuestion[] = civicsQuestions.map(q => ({ ...q, subject: 'civics' as const }));
  return [...geoQuestions, ...histQuestions, ...civQuestions];
};

export const getQuestionsBySubject = (subject: 'geography' | 'history' | 'civics'): UnifiedQuestion[] => {
  switch (subject) {
    case 'geography':
      return geographyQuestions.map(q => ({ ...q, subject: 'geography' as const }));
    case 'history':
      return historyQuestions.map(q => ({ ...q, subject: 'history' as const }));
    case 'civics':
      return civicsQuestions.map(q => ({ ...q, subject: 'civics' as const }));
    default:
      return [];
  }
};

export const getQuestionsBySubjectAndCategory = (subject: 'geography' | 'history' | 'civics', category: string): UnifiedQuestion[] => {
  switch (subject) {
    case 'geography':
      return getGeographyByCategory(category).map(q => ({ ...q, subject: 'geography' as const }));
    case 'history':
      return getHistoryByCategory(category).map(q => ({ ...q, subject: 'history' as const }));
    case 'civics':
      return getCivicsByCategory(category).map(q => ({ ...q, subject: 'civics' as const }));
    default:
      return [];
  }
};

export const getRandomQuestionsMixed = (count: number = 10): UnifiedQuestion[] => {
  const allQuestions = getAllQuestions();
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): UnifiedQuestion[] => {
  const geoQuestions = getGeographyByDifficulty(difficulty).map(q => ({ ...q, subject: 'geography' as const }));
  const histQuestions = getHistoryByDifficulty(difficulty).map(q => ({ ...q, subject: 'history' as const }));
  const civQuestions = getCivicsByDifficulty(difficulty).map(q => ({ ...q, subject: 'civics' as const }));
  return [...geoQuestions, ...histQuestions, ...civQuestions];
};

// Level and progress utility functions
export const getPlayerLevel = (xp: number): Level => {
  return levels.find(level => xp >= level.minXP && xp <= level.maxXP) || levels[0];
};

export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = getPlayerLevel(currentXP);
  const nextLevel = levels.find(level => level.level === currentLevel.level + 1);
  return nextLevel ? nextLevel.minXP - currentXP : 0;
};

export const calculateXPFromScore = (correct: number, total: number, difficulty: 'easy' | 'medium' | 'hard', timeBonus: boolean = false): number => {
  const baseXP = correct * 10;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
  const accuracyBonus = (correct / total) >= 0.8 ? baseXP * 0.2 : 0;
  const speedBonus = timeBonus ? baseXP * 0.1 : 0;
  return Math.floor(baseXP * difficultyMultiplier + accuracyBonus + speedBonus);
};

// Subject statistics
export const getSubjectStats = () => {
  return {
    totalQuestions: getAllQuestions().length,
    subjectBreakdown: {
      geography: geographyQuestions.length,
      history: historyQuestions.length,
      civics: civicsQuestions.length
    },
    difficultyBreakdown: {
      easy: getQuestionsByDifficulty('easy').length,
      medium: getQuestionsByDifficulty('medium').length,
      hard: getQuestionsByDifficulty('hard').length
    }
  };
};

export default {
  subjects,
  badges,
  levels,
  getAllQuestions,
  getQuestionsBySubject,
  getQuestionsBySubjectAndCategory,
  getRandomQuestionsMixed,
  getQuestionsByDifficulty,
  getPlayerLevel,
  getXPForNextLevel,
  calculateXPFromScore,
  getSubjectStats
};
