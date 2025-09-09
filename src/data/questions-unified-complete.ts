// ShakaQuest テスト用最小データベース - 5問
// Vercelビルド確認用
// Generated: 2025-09-09T07:51:20.521Z

import { UnifiedQuestion } from './unified-types';

export const allUnifiedQuestions: UnifiedQuestion[] = [
  {
    id: "GEO_PHY_001",
    subject: "geography" as const,
    category: "physical" as const,
    subcategory: "terrain",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["山地","地形","日本"],
    question: "日本で最も高い山はどれですか？",
    options: ["富士山","北岳","穂高岳","槍ヶ岳"],
    correct: 0,
    explanation: "富士山は標高3,776mで日本最高峰です。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-09T07:51:20.517Z"),
    createdAt: new Date("2025-09-09T07:51:20.520Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_ANC_001",
    subject: "history" as const,
    category: "ancient" as const,
    subcategory: "culture",
    grade: 6,
    difficulty: "basic" as const,
    tags: ["縄文時代","土器","考古学"],
    question: "縄文土器の特徴として正しいものはどれですか？",
    options: ["表面に縄目の模様がある","ろくろで作られている","釉薬が塗られている","金属で装飾されている"],
    correct: 0,
    explanation: "縄文土器は縄を転がして付けた縄目の模様が特徴的です。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-09T07:51:20.520Z"),
    createdAt: new Date("2025-09-09T07:51:20.520Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "CIV_POL_001",
    subject: "civics" as const,
    category: "politics" as const,
    subcategory: "constitution",
    grade: 6,
    difficulty: "basic" as const,
    tags: ["憲法","基本的人権","民主主義"],
    question: "日本国憲法の三大原則はどれですか？",
    options: ["国民主権・基本的人権の尊重・平和主義","自由・平等・博愛","立法・行政・司法","教育・労働・社会保障"],
    correct: 0,
    explanation: "日本国憲法は国民主権、基本的人権の尊重、平和主義の三つを基本原則としています。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-09T07:51:20.520Z"),
    createdAt: new Date("2025-09-09T07:51:20.520Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "GEO_REG_001",
    subject: "geography" as const,
    category: "regional" as const,
    subcategory: "prefectures",
    grade: 6,
    difficulty: "basic" as const,
    tags: ["都道府県","関東","首都"],
    question: "日本の首都はどこですか？",
    options: ["東京都","大阪府","京都府","神奈川県"],
    correct: 0,
    explanation: "東京都が日本の首都であり、政治・経済の中心地です。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-09T07:51:20.520Z"),
    createdAt: new Date("2025-09-09T07:51:20.520Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_MOD_001",
    subject: "history" as const,
    category: "modern" as const,
    subcategory: "meiji",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["明治維新","近代化","開国"],
    question: "明治維新が起こったのはいつですか？",
    options: ["1868年","1853年","1867年","1871年"],
    correct: 0,
    explanation: "1868年に明治維新が起こり、日本の近代化が始まりました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-09T07:51:20.520Z"),
    createdAt: new Date("2025-09-09T07:51:20.520Z"),
    version: 1,
    qualityScore: 9
  }
];

// Helper functions
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

// Export by subject
export const geographyQuestions = getQuestionsBySubject('geography');
export const historyQuestions = getQuestionsBySubject('history');
export const civicsQuestions = getQuestionsBySubject('civics');

// Statistics
export const databaseStats = {
  totalQuestions: 5,
  geography: 2,
  history: 2,
  civics: 1,
  generatedAt: new Date("2025-09-09T07:51:20.521Z")
};

export default allUnifiedQuestions;
