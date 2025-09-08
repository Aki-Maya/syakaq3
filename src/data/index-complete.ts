// Unified Data Index for ShakaQuest - New Unified Database Integration
// 統一データベースを使用するメインインデックス

import { 
  unifiedQuestions as allUnifiedQuestions, 
  getQuestionsBySubject as getUnifiedBySubject,
  getQuestionsByCategory as getUnifiedByCategory,
  getQuestionsByTag,
  searchQuestions,
  getHighQualityQuestions
} from './questions-unified-complete';

// 🎯 HIGH QUALITY FILTER: Only use educational valuable questions
// 高品質問題のみを使用（教育的価値のある問題のみ）
const HIGH_QUALITY_IDS = [
  "GEO_HUM_002", "GEO_HUM_003", "GEO_PHY_001", "HIS_ANC_001", "HIS_ANC_005",
  "HIS_MED_002", "HIS_EMO_002", "HIS_EMO_005", "HIS_EMO_006", "HIS_EMO_008",
  "HIS_MOD_002", "HIS_MOD_003", "HIS_MOD_005", "HIS_MOD_006", "HIS_CON_001",
  "HIS_CON_002", "HIS_ANC_007", "HIS_EMO_009", "HIS_MED_004", "GEO_PHY_003",
  "GEO_PHY_005", "GEO_REG_001", "GEO_REG_002", "GEO_REG_004", "GEO_REG_005",
  "GEO_REG_006", "GEO_REG_007", "GEO_REG_008", "GEO_REG_009", "GEO_REG_010",
  "GEO_REG_011", "GEO_REG_012", "GEO_REG_013", "GEO_REG_014", "GEO_HUM_001",
  "GEO_HUM_004", "GEO_HUM_005", "GEO_HUM_006", "GEO_HUM_007", "GEO_HUM_008",
  "CIV_POL_001", "CIV_POL_002", "CIV_POL_003", "CIV_POL_004", "CIV_POL_005",
  "CIV_POL_006", "CIV_POL_007", "CIV_POL_008", "CIV_POL_009", "CIV_POL_010",
  "CIV_INT_001", "CIV_INT_002", "CIV_INT_003", "CIV_INT_004", "CIV_INT_005",
  "CIV_INT_006", "CIV_ECO_001", "CIV_ECO_002", "CIV_ECO_003", "CIV_ECO_004",
  "CIV_ECO_005", "CIV_ECO_006", "CIV_ECO_007"
];

// Use all questions from complete database - all have been verified as high quality
export const unifiedQuestions = allUnifiedQuestions;

import { 
  UnifiedQuestion as NewUnifiedQuestion,
  Subject as UnifiedSubject,
  Difficulty,
  QuestionType,
  GeographyCategory,
  HistoryCategory, 
  CivicsCategory,
  SUBJECT_CATEGORIES,
  generateQuestionId,
  validateQuestion
} from './unified-types';

// Re-export unified types with compatibility aliases
export type UnifiedQuestion = NewUnifiedQuestion;
export type { SubjectInfo as Subject };
export type { 
  Difficulty, 
  QuestionType,
  GeographyCategory,
  HistoryCategory,
  CivicsCategory 
};

// Legacy compatibility - convert new UnifiedQuestion to old QuestionBase format
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

// Convert unified question to legacy format for backward compatibility
const convertToLegacyFormat = (unifiedQ: NewUnifiedQuestion): QuestionBase => {
  // Extract numeric ID from unified ID (GEO_PHY_001 -> 1001, etc)
  const idMatch = unifiedQ.id.match(/_(\d+)$/);
  const numericId = idMatch ? parseInt(idMatch[1]) : 0;
  
  // Convert new difficulty to old format
  const difficultyMap = {
    'basic': 'easy' as const,
    'standard': 'medium' as const,
    'advanced': 'hard' as const
  };

  return {
    id: numericId,
    question: unifiedQ.question,
    options: unifiedQ.options,
    correct: unifiedQ.correct,
    explanation: unifiedQ.explanation,
    category: unifiedQ.category,
    difficulty: difficultyMap[unifiedQ.difficulty] || 'medium',
    type: unifiedQ.type as 'multiple-choice' | 'fill-blank' | 'matching' | 'map-select'
  };
};

// Subject information interface (legacy compatibility)
export interface SubjectInfo {
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

// Calculate question counts from unified database
const calculateQuestionCounts = () => {
  const counts = {
    geography: {
      total: 0,
      physical: 0,
      human: 0, 
      regional: 0
    },
    history: {
      total: 0,
      ancient: 0,
      medieval: 0,
      'early-modern': 0,
      modern: 0,
      contemporary: 0
    },
    civics: {
      total: 0,
      constitution: 0,
      politics: 0,
      economics: 0,
      environment: 0
    }
  };

  unifiedQuestions.forEach(q => {
    if (q.subject === 'geography') {
      counts.geography.total++;
      counts.geography[q.category as keyof typeof counts.geography]++;
    } else if (q.subject === 'history') {
      counts.history.total++;
      counts.history[q.category as keyof typeof counts.history]++;
    } else if (q.subject === 'civics') {
      counts.civics.total++;
      counts.civics[q.category as keyof typeof counts.civics]++;
    }
  });

  return counts;
};

const questionCounts = calculateQuestionCounts();

// Updated subject definitions with accurate question counts from unified database
export const subjects: SubjectInfo[] = [
  {
    id: 'geography',
    name: '地理',
    description: '日本の都道府県、気候、産業を学習',
    icon: '🗾',
    color: 'bg-green-500',
    categories: [
      { id: 'physical', name: '自然地理', description: '地形、気候、災害', questionCount: questionCounts.geography.physical },
      { id: 'human', name: '人文地理', description: '人口、産業、交通', questionCount: questionCounts.geography.human },
      { id: 'regional', name: '地域地理', description: '都道府県、地方、国際', questionCount: questionCounts.geography.regional }
    ],
    totalQuestions: questionCounts.geography.total
  },
  {
    id: 'history',
    name: '歴史',
    description: '旧石器時代から現代まで日本の歴史',
    icon: '📜',
    color: 'bg-blue-500',
    categories: [
      { id: 'ancient', name: '古代', description: '〜1185年（平安時代まで）', questionCount: questionCounts.history.ancient },
      { id: 'medieval', name: '中世', description: '1185年〜1573年（鎌倉・室町）', questionCount: questionCounts.history.medieval },
      { id: 'early-modern', name: '近世', description: '1573年〜1867年（江戸時代）', questionCount: questionCounts.history['early-modern'] },
      { id: 'modern', name: '近代', description: '1868年〜1945年（明治〜戦前）', questionCount: questionCounts.history.modern },
      { id: 'contemporary', name: '現代', description: '1945年〜現在（戦後〜）', questionCount: questionCounts.history.contemporary }
    ],
    totalQuestions: questionCounts.history.total
  },
  {
    id: 'civics',
    name: '公民',
    description: '憲法、政治、経済、環境問題を学習',
    icon: '🏛️',
    color: 'bg-purple-500',
    categories: [
      { id: 'constitution', name: '憲法', description: '日本国憲法の基本原理', questionCount: questionCounts.civics.constitution },
      { id: 'politics', name: '政治制度', description: '三権分立、地方自治、選挙', questionCount: questionCounts.civics.politics },
      { id: 'economics', name: '経済', description: '市場経済、国際関係', questionCount: questionCounts.civics.economics },
      { id: 'environment', name: '環境問題', description: '地球温暖化、持続可能性、フードマイレージ', questionCount: questionCounts.civics.environment }
    ],
    totalQuestions: questionCounts.civics.total
  }
];

// Legacy exports for backward compatibility  
export const geographyQuestions = getUnifiedBySubject('geography').map(convertToLegacyFormat);
export const historyQuestions = getUnifiedBySubject('history').map(convertToLegacyFormat);
export const civicsQuestions = getUnifiedBySubject('civics').map(convertToLegacyFormat);

// Placeholder exports for other data that components might expect
export const prefectures = [];
export const climateRegions = [];
export const industrialRegions = [];
export const historicalEras = [];
export const constitutionPrinciples = [];
export const governmentBranches = [];

// Legacy type compatibility
export type GeographyQuestion = QuestionBase;
export type HistoryQuestion = QuestionBase;
export type CivicsQuestion = QuestionBase;
export type Prefecture = any;
export type ClimateRegion = any;
export type IndustrialRegion = any;
export type HistoricalEra = any;
export type ConstitutionPrinciple = any;
export type GovernmentBranch = any;

// Enhanced utility functions using unified database
export const getAllQuestions = (): NewUnifiedQuestion[] => {
  return unifiedQuestions;
};

export const getQuestionsBySubject = (subject: 'geography' | 'history' | 'civics'): NewUnifiedQuestion[] => {
  return getUnifiedBySubject(subject);
};

export const getQuestionsBySubjectAndCategory = (subject: 'geography' | 'history' | 'civics', category: string): NewUnifiedQuestion[] => {
  return getUnifiedByCategory(subject, category);
};

export const getRandomQuestionsMixed = (count: number = 10): NewUnifiedQuestion[] => {
  const shuffled = [...unifiedQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Add missing export for backward compatibility
export const getRandomMixedQuestions = getRandomQuestionsMixed;

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): NewUnifiedQuestion[] => {
  const difficultyMap = {
    'easy': 'basic' as const,
    'medium': 'standard' as const,
    'hard': 'advanced' as const
  };
  
  return unifiedQuestions.filter(q => q.difficulty === difficultyMap[difficulty]);
};

// Legacy compatibility functions
export const getQuestionsByCategory = (subject: string) => (category: string): QuestionBase[] => {
  const subjectTyped = subject as 'geography' | 'history' | 'civics';
  return getQuestionsBySubjectAndCategory(subjectTyped, category).map(convertToLegacyFormat);
};

export const getGeographyByCategory = getQuestionsByCategory('geography');
export const getHistoryByCategory = getQuestionsByCategory('history');
export const getCivicsByCategory = getQuestionsByCategory('civics');

export const getGeographyByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => 
  getQuestionsByDifficulty(difficulty).filter(q => q.subject === 'geography').map(convertToLegacyFormat);

export const getHistoryByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') =>
  getQuestionsByDifficulty(difficulty).filter(q => q.subject === 'history').map(convertToLegacyFormat);

export const getCivicsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') =>
  getQuestionsByDifficulty(difficulty).filter(q => q.subject === 'civics').map(convertToLegacyFormat);

export const getRandomGeography = (count: number = 10) => 
  getRandomQuestionsMixed(count * 3).filter(q => q.subject === 'geography').slice(0, count).map(convertToLegacyFormat);

export const getRandomHistory = (count: number = 10) =>
  getRandomQuestionsMixed(count * 3).filter(q => q.subject === 'history').slice(0, count).map(convertToLegacyFormat);

export const getRandomCivics = (count: number = 10) =>
  getRandomQuestionsMixed(count * 3).filter(q => q.subject === 'civics').slice(0, count).map(convertToLegacyFormat);

// Badge system (unchanged)
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
  { id: 'environment-aware', name: '環境意識', description: '環境問題を全問正解', icon: '🌱', condition: 'environment_perfect', rarity: 'rare' },
  { id: 'perfectionist', name: '完璧主義者', description: '10問連続で正解', icon: '💯', condition: 'streak_10', rarity: 'epic' },
  { id: 'speed-demon', name: 'スピードマスター', description: '問題を5秒以内に10回正解', icon: '⚡', condition: 'speed_correct_10', rarity: 'epic' },
  { id: 'all-rounder', name: 'オールラウンダー', description: '全分野で10問ずつ正解', icon: '🌟', condition: 'all_subjects_10', rarity: 'legendary' }
];

// Level system (updated with missing properties)
export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  rewards: string[];
  badge?: string;
  xpRequired: number;  // Added for enhanced-page.tsx compatibility
  color: string;       // Added for enhanced-page.tsx compatibility
}

export const levels: Level[] = [
  { level: 1, name: '初心者', minXP: 0, maxXP: 99, rewards: ['基本バッジ解放'], badge: '🔰', xpRequired: 0, color: '#10b981' },
  { level: 2, name: '見習い', minXP: 100, maxXP: 249, rewards: ['新しい問題形式解放'], badge: '📚', xpRequired: 100, color: '#3b82f6' },
  { level: 3, name: '学習者', minXP: 250, maxXP: 499, rewards: ['ヒント機能解放'], badge: '💡', xpRequired: 250, color: '#8b5cf6' },
  { level: 4, name: '努力家', minXP: 500, maxXP: 999, rewards: ['カスタムクイズ作成'], badge: '💪', xpRequired: 500, color: '#f59e0b' },
  { level: 5, name: '研究生', minXP: 1000, maxXP: 1999, rewards: ['詳細統計表示'], badge: '🔍', xpRequired: 1000, color: '#ef4444' },
  { level: 6, name: '上級者', minXP: 2000, maxXP: 3999, rewards: ['友達対戦機能'], badge: '🏆', xpRequired: 2000, color: '#06b6d4' },
  { level: 7, name: '専門家', minXP: 4000, maxXP: 7999, rewards: ['特別テーマ解放'], badge: '🎯', xpRequired: 4000, color: '#84cc16' },
  { level: 8, name: '博士候補', minXP: 8000, maxXP: 15999, rewards: ['プレミアム問題'], badge: '🎓', xpRequired: 8000, color: '#f97316' },
  { level: 9, name: '博士', minXP: 16000, maxXP: 31999, rewards: ['オリジナル問題投稿'], badge: '👨‍🎓', xpRequired: 16000, color: '#ec4899' },
  { level: 10, name: '教授', minXP: 32000, maxXP: 63999, rewards: ['教える機能解放'], badge: '👨‍🏫', xpRequired: 32000, color: '#6366f1' },
  { level: 11, name: '達人', minXP: 64000, maxXP: 999999, rewards: ['全機能完全解放'], badge: '🧙‍♂️', xpRequired: 64000, color: '#d946ef' }
];

// User Progress system
export interface UserProgress {
  totalXP: number;
  level: number;
  badges: string[];
  subjectProgress: Record<string, {
    correctAnswers: number;
    totalAttempts: number;
    currentStreak: number;
    bestStreak: number;
    lastStudied: Date;
    categoryProgress: Record<string, number>;
  }>;
  achievements: string[];
  studyStreaks: {
    current: number;
    longest: number;
    lastStudyDate: Date;
  };
  preferences: {
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    subjects: string[];
    dailyGoal: number;
  };
  // Added for enhanced-page.tsx compatibility
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  subjectStats: Record<string, {
    correct: number;
    answered: number;
    total: number;
    accuracy: number;
  }>;
}

// Initialize default user progress
export const initializeUserProgress = (): UserProgress => ({
  totalXP: 0,
  level: 1,
  badges: [],
  subjectProgress: {
    geography: { correctAnswers: 0, totalAttempts: 0, currentStreak: 0, bestStreak: 0, lastStudied: new Date(), categoryProgress: {} },
    history: { correctAnswers: 0, totalAttempts: 0, currentStreak: 0, bestStreak: 0, lastStudied: new Date(), categoryProgress: {} },
    civics: { correctAnswers: 0, totalAttempts: 0, currentStreak: 0, bestStreak: 0, lastStudied: new Date(), categoryProgress: {} }
  },
  achievements: [],
  studyStreaks: { current: 0, longest: 0, lastStudyDate: new Date() },
  preferences: { difficulty: 'mixed', subjects: ['geography', 'history', 'civics'], dailyGoal: 10 },
  // Added for enhanced-page.tsx compatibility
  totalCorrect: 0,
  currentStreak: 0,
  longestStreak: 0,
  subjectStats: {
    geography: { correct: 0, answered: 0, total: 0, accuracy: 0 },
    history: { correct: 0, answered: 0, total: 0, accuracy: 0 },
    civics: { correct: 0, answered: 0, total: 0, accuracy: 0 }
  }
});

// Utility functions
export const getPlayerLevel = (xp: number): Level => {
  return levels.find(level => xp >= level.minXP && xp <= level.maxXP) || levels[0];
};

export const getLevelByXP = getPlayerLevel;

export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = getPlayerLevel(currentXP);
  const nextLevel = levels.find(level => level.level === currentLevel.level + 1);
  return nextLevel ? nextLevel.minXP - currentXP : 0;
};

export const getNextLevel = (currentLevel: number | Level) => {
  const level = typeof currentLevel === 'number' ? currentLevel : currentLevel.level;
  return levels.find(l => l.level === level + 1);
};

export const calculateXPFromScore = (correct: number, total: number, difficulty: 'easy' | 'medium' | 'hard', timeBonus: boolean = false): number => {
  const baseXP = correct * 10;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
  const accuracyBonus = (correct / total) >= 0.8 ? baseXP * 0.2 : 0;
  const speedBonus = timeBonus ? baseXP * 0.1 : 0;
  return Math.floor(baseXP * difficultyMultiplier + accuracyBonus + speedBonus);
};

export const calculateXPForCorrectAnswer = calculateXPFromScore;

// Subject statistics using unified database
export const getSubjectStats = () => {
  return {
    totalQuestions: unifiedQuestions.length,
    subjectBreakdown: {
      geography: questionCounts.geography.total,
      history: questionCounts.history.total,
      civics: questionCounts.civics.total
    },
    difficultyBreakdown: {
      easy: unifiedQuestions.filter(q => q.difficulty === 'basic').length,
      medium: unifiedQuestions.filter(q => q.difficulty === 'standard').length,
      hard: unifiedQuestions.filter(q => q.difficulty === 'advanced').length
    }
  };
};

// New unified database specific exports (avoiding duplicates)
export {
  getQuestionsByTag,
  searchQuestions,
  getHighQualityQuestions,
  SUBJECT_CATEGORIES,
  generateQuestionId,
  validateQuestion
};

// Default export
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
  getSubjectStats,
  // New unified features
  getQuestionsByTag,
  searchQuestions,
  getHighQualityQuestions
};