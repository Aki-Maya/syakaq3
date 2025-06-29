// Unified Data Index for ShakaQuest Complete Edition

// --- インポート ---
import { 
  geographyQuestions,
  getQuestionsByCategory as getGeographyByCategory
} from './geography-enhanced';

import {
  historyQuestions,
  getQuestionsByCategory as getHistoryByCategory
} from './history';

import {
  civicsQuestions,
  getQuestionsByCategory as getCivicsByCategory
} from './civics';


// --- 型定義 ---

// ★ 追加: 他のファイルで使う型をここでエクスポート
export type { GeographyQuestion, Prefecture, ClimateRegion, IndustrialRegion } from './geography-enhanced';
export type { HistoryQuestion, HistoricalEra } from './history';
export type { CivicsQuestion, ConstitutionPrinciple, GovernmentBranch } from './civics';


export interface QuestionBase {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UnifiedQuestion extends QuestionBase {
  subject: 'geography' | 'history' | 'civics';
  era?: string;
}

export interface SubjectCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: SubjectCategory[];
  totalQuestions: number;
}

// ★ 追加: アプリケーションで実際に使うUserProgressの型定義
export interface UserProgress {
  totalXP: number;
  totalCorrect: number;
  totalAnswered: number;
  currentStreak: number;
  longestStreak: number;
  subjectStats: {
    [key: string]: {
      correct: number;
      answered: number;
    };
  };
}

// ★ 修正: Levelの型定義を実際のロジックに合わせて変更
export interface Level {
  level: number;
  name: string;
  xpRequired: number; // minXP, maxXPから変更
  color: string;     // プログレスバーの色を追加
}


// --- データ定義 ---

export const subjects: Subject[] = [
  // ユーザーが提示した最新のカテゴリ構成を維持
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

// 動的に問題数を計算するロジック（変更なし）
subjects.forEach(subject => {
  let totalCountForSubject = 0;
  subject.categories.forEach(category => {
    let count = 0;
    switch (subject.id) {
      case 'geography': count = getGeographyByCategory(category.id).length; break;
      case 'history': count = getHistoryByCategory(category.id).length; break;
      case 'civics': count = getCivicsByCategory(category.id).length; break;
    }
    category.questionCount = count;
    totalCountForSubject += count;
  });
  subject.totalQuestions = totalCountForSubject;
});


// ★ 修正: levelsデータを新しいLevel型に合わせて修正
export const levels: Level[] = [
  { level: 1, name: '初心者', xpRequired: 0, color: 'bg-gray-400' },
  { level: 2, name: '見習い', xpRequired: 100, color: 'bg-green-400' },
  { level: 3, name: '学習者', xpRequired: 250, color: 'bg-blue-400' },
  { level: 4, name: '努力家', xpRequired: 500, color: 'bg-purple-400' },
  { level: 5, name: '研究生', xpRequired: 1000, color: 'bg-yellow-400' },
  { level: 6, name: '上級者', xpRequired: 2000, color: 'bg-orange-400' },
  { level: 7, name: '専門家', xpRequired: 4000, color: 'bg-red-400' },
  { level: 8, name: '博士', xpRequired: 8000, color: 'bg-pink-400' },
  { level: 9, name: '教授', xpRequired: 16000, color: 'bg-indigo-400' },
  { level: 10, name: '達人', xpRequired: 32000, color: 'bg-black' }
];


// --- 関数定義 ---

// ★ 追加: initializeUserProgress関数をここで定義・エクスポート
export const initializeUserProgress = (): UserProgress => {
  const initialStats: UserProgress = {
    totalXP: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    currentStreak: 0,
    longestStreak: 0,
    subjectStats: {}
  };
  subjects.forEach(subject => {
    initialStats.subjectStats[subject.id] = { correct: 0, answered: 0 };
  });
  return initialStats;
};

// ★ 追加: getLevelByXP (旧getPlayerLevel) をここで定義・エクスポート
export const getLevelByXP = (xp: number): Level => {
  let currentLevel: Level = levels[0];
  for (const level of levels) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
};

// ★ 追加: getNextLevel (旧getXPForNextLevel) をここで定義・エクスポート
export const getNextLevel = (currentLevelNumber: number): Level | null => {
  return levels.find(level => level.level === currentLevelNumber + 1) || null;
};


export const getAllQuestions = (): UnifiedQuestion[] => {
  // ... (この関数は変更なし)
};

export const getQuestionsBySubject = (subject: 'geography' | 'history' | 'civics'): UnifiedQuestion[] => {
  // ... (この関数は変更なし)
};

export const getQuestionsBySubjectAndCategory = (subject: 'geography' | 'history' | 'civics', category: string): UnifiedQuestion[] => {
  // ... (この関数は変更なし)
};

export const getRandomQuestionsMixed = (count: number = 10): UnifiedQuestion[] => {
  // ... (この関数は変更なし)
};

// ★ 修正: export default は削除し、すべて名前付きエクスポートに統一
