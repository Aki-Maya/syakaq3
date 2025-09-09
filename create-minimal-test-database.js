// 最小限テスト用データベース - Vercelビルド確認用
// まず既存の高品質問題のみで動作確認

const fs = require('fs');

console.log('🔄 最小限テスト用データベース作成開始...');

// 確実に動作する最小限の高品質問題セット（手動作成）
const testQuestions = [
  {
    id: "GEO_PHY_001",
    subject: "geography",
    category: "physical",
    subcategory: "terrain",
    grade: 6,
    difficulty: "standard",
    tags: ["山地", "地形", "日本"],
    question: "日本で最も高い山はどれですか？",
    options: ["富士山", "北岳", "穂高岳", "槍ヶ岳"],
    correct: 0,
    explanation: "富士山は標高3,776mで日本最高峰です。",
    type: "multiple-choice",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_ANC_001", 
    subject: "history",
    category: "ancient",
    subcategory: "culture",
    grade: 6,
    difficulty: "basic",
    tags: ["縄文時代", "土器", "考古学"],
    question: "縄文土器の特徴として正しいものはどれですか？",
    options: ["表面に縄目の模様がある", "ろくろで作られている", "釉薬が塗られている", "金属で装飾されている"],
    correct: 0,
    explanation: "縄文土器は縄を転がして付けた縄目の模様が特徴的です。",
    type: "multiple-choice",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    version: 1,
    qualityScore: 9
  },
  {
    id: "CIV_POL_001",
    subject: "civics", 
    category: "politics",
    subcategory: "constitution",
    grade: 6,
    difficulty: "basic",
    tags: ["憲法", "基本的人権", "民主主義"],
    question: "日本国憲法の三大原則はどれですか？",
    options: ["国民主権・基本的人権の尊重・平和主義", "自由・平等・博愛", "立法・行政・司法", "教育・労働・社会保障"],
    correct: 0,
    explanation: "日本国憲法は国民主権、基本的人権の尊重、平和主義の三つを基本原則としています。",
    type: "multiple-choice",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    version: 1,
    qualityScore: 9
  },
  {
    id: "GEO_REG_001",
    subject: "geography",
    category: "regional",
    subcategory: "prefectures",
    grade: 6,
    difficulty: "basic",
    tags: ["都道府県", "関東", "首都"],
    question: "日本の首都はどこですか？",
    options: ["東京都", "大阪府", "京都府", "神奈川県"],
    correct: 0,
    explanation: "東京都が日本の首都であり、政治・経済の中心地です。",
    type: "multiple-choice",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_MOD_001",
    subject: "history",
    category: "modern",
    subcategory: "meiji",
    grade: 6,
    difficulty: "standard",
    tags: ["明治維新", "近代化", "開国"],
    question: "明治維新が起こったのはいつですか？",
    options: ["1868年", "1853年", "1867年", "1871年"],
    correct: 0,
    explanation: "1868年に明治維新が起こり、日本の近代化が始まりました。",
    type: "multiple-choice",
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    version: 1,
    qualityScore: 9
  }
];

console.log(`📊 テスト用問題数: ${testQuestions.length}問`);

// 科目別統計
const subjectStats = {
  geography: testQuestions.filter(q => q.subject === 'geography').length,
  history: testQuestions.filter(q => q.subject === 'history').length,
  civics: testQuestions.filter(q => q.subject === 'civics').length
};

console.log('📚 科目別分布:');
Object.entries(subjectStats).forEach(([subject, count]) => {
  console.log(`   ${subject}: ${count}問`);
});

// シンプルで確実なTypeScriptファイルを生成
const tsContent = `// ShakaQuest テスト用最小データベース - ${testQuestions.length}問
// Vercelビルド確認用
// Generated: ${new Date().toISOString()}

import { UnifiedQuestion } from './unified-types';

export const allUnifiedQuestions: UnifiedQuestion[] = [
${testQuestions.map(q => `  {
    id: "${q.id}",
    subject: "${q.subject}" as const,
    category: "${q.category}" as const,
    subcategory: "${q.subcategory}",
    grade: ${q.grade},
    difficulty: "${q.difficulty}" as const,
    tags: ${JSON.stringify(q.tags)},
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correct: ${q.correct},
    explanation: ${JSON.stringify(q.explanation)},
    type: "${q.type}" as const,
    lastUpdated: new Date("${q.lastUpdated}"),
    createdAt: new Date("${q.createdAt}"),
    version: ${q.version},
    qualityScore: ${q.qualityScore}
  }`).join(',\n')}
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
  totalQuestions: ${testQuestions.length},
  geography: ${subjectStats.geography},
  history: ${subjectStats.history},
  civics: ${subjectStats.civics},
  generatedAt: new Date("${new Date().toISOString()}")
};

export default allUnifiedQuestions;
`;

// ファイル保存
fs.writeFileSync('./src/data/questions-unified-complete.ts', tsContent);

console.log('✅ テスト用最小データベース作成完了！');
console.log(`📁 ファイル: ./src/data/questions-unified-complete.ts`);
console.log(`📊 問題数: ${testQuestions.length}問`);
console.log('🎯 Vercelテストビルド準備完了');