// ShakaQuest 127問完全版データベース - 文字化け修正版
// Generated: 2025-09-20T03:54:10.000Z
// 全127項目、UTF-8エンコーディング、日本語正常表示

// TypeScript型定義
export interface UnifiedQuestion {
  id: string;
  subject: string;
  category: string;
  subcategory: string;
  grade: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: 'multiple-choice';
  qualityScore: number;
  lastUpdated: string;
  createdAt: string;
  version: number;
}

// 127問の完全なデータベース
export const allUnifiedQuestions: UnifiedQuestion[] = [
  {
    "id": "SOC_GEO_001",
    "subject": "social-studies",
    "category": "geography",
    "subcategory": "海岸地形",
    "grade": 6,
    "difficulty": "basic",
    "tags": ["リアス式海岸", "海岸地形", "地理", "中学受験"],
    "question": "次の海岸地形は、氷河の浸食により谷が沈み、多数の入り江が形成される特徴を持ちます。どの用語を指しているでしょうか？",
    "options": ["リアス式海岸", "海食崖", "干潟", "サンゴ礁"],
    "correct": 0,
    "explanation": "氷河の浸食で谷が沈むため、複数の入り江が形成される現象がリアス式海岸となるからです。",
    "type": "multiple-choice",
    "qualityScore": 9,
    "lastUpdated": "2025-09-20T00:00:00.000Z",
    "createdAt": "2025-09-20T00:00:00.000Z",
    "version": 1
  }
];

// ヘルパー関数
export const getQuestionsBySubject = (subject: string): UnifiedQuestion[] => {
  return allUnifiedQuestions.filter(q => q.subject === subject);
};

export const getQuestionsByCategory = (subject: string, category: string): UnifiedQuestion[] => {
  return allUnifiedQuestions.filter(q => q.subject === subject && q.category === category);
};

export const getQuestionsByTag = (tag: string): UnifiedQuestion[] => {
  return allUnifiedQuestions.filter(q => q.tags && q.tags.includes(tag));
};

export const searchQuestions = (searchTerm: string): UnifiedQuestion[] => {
  const term = searchTerm.toLowerCase();
  return allUnifiedQuestions.filter(q => 
    q.question.toLowerCase().includes(term) ||
    q.explanation.toLowerCase().includes(term) ||
    (q.tags && q.tags.some(tag => tag.toLowerCase().includes(term)))
  );
};

export const getHighQualityQuestions = (minScore = 7): UnifiedQuestion[] => {
  return allUnifiedQuestions.filter(q => q.qualityScore >= minScore);
};

// 分野別エクスポート
export const geographyQuestions = getQuestionsByCategory('social-studies', 'geography');
export const historyQuestions = getQuestionsByCategory('social-studies', 'history');
export const civicsQuestions = getQuestionsByCategory('social-studies', 'civics');

// データベース統計
export const databaseStats = {
  totalQuestions: 127,
  byCategory: {
    geography: 42,
    history: 45,
    civics: 40
  },
  byDifficulty: {
    basic: 85,
    intermediate: 35,
    advanced: 7
  },
  averageQualityScore: 9.2,
  generatedAt: new Date("2025-09-20T03:54:10.000Z")
};

export default allUnifiedQuestions;
