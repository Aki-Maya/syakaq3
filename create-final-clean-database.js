// 最終クリーンデータベース作成 - サンプル問題除去版
// 高品質な問題のみを使用

const fs = require('fs');

console.log('🔄 最終クリーンデータベース作成開始...');

// 変換済み問題を読み込み
const convertedQuestions = JSON.parse(fs.readFileSync('./converted-high-quality-questions.json', 'utf8'));

// サンプル問題をフィルター除去
const realQuestions = convertedQuestions.filter(q => {
  // サンプル問題の特徴で除外
  const isGenericSample = q.options.some(option => 
    option.includes('適切な選択肢') || 
    option === 'A' || option === 'B' || option === 'C' || option === 'D' ||
    option.includes('選択肢A') || option.includes('選択肢B')
  );
  
  const isGenericQuestion = q.question.includes('次の') && q.question.includes('正しいものはどれですか？') && 
                           q.explanation.includes('この問題は') && q.explanation.includes('基本的な概念について');
  
  return !isGenericSample && !isGenericQuestion;
});

console.log(`📊 元データ: ${convertedQuestions.length}問`);
console.log(`📊 サンプル問題除去後: ${realQuestions.length}問`);
console.log(`🗑️ 除去されたサンプル問題: ${convertedQuestions.length - realQuestions.length}問`);

// 基本高品質問題（確実に動作するもの）
const coreHighQualityQuestions = [
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
    explanation: "富士山は標高3,776mで日本最高峰です。静岡県と山梨県にまたがる独立峰で、日本の象徴的な山として親しまれています。",
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
    explanation: "縄文土器は縄を転がして付けた縄目の模様が特徴的で、この模様から「縄文」という名前が付きました。",
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
  }
];

console.log(`📊 基本問題: ${coreHighQualityQuestions.length}問`);

// 全問題をマージ（基本 + フィルター済み実際問題）
const allCleanQuestions = [...coreHighQualityQuestions, ...realQuestions];

console.log(`📊 最終統合問題数: ${allCleanQuestions.length}問`);

// 科目別統計
const subjectStats = {
  geography: allCleanQuestions.filter(q => q.subject === 'geography').length,
  history: allCleanQuestions.filter(q => q.subject === 'history').length,
  civics: allCleanQuestions.filter(q => q.subject === 'civics').length
};

console.log('📚 科目別分布:');
Object.entries(subjectStats).forEach(([subject, count]) => {
  console.log(`   ${subject}: ${count}問`);
});

// カテゴリ別統計も表示
const categoryStats = {
  geography: {
    physical: allCleanQuestions.filter(q => q.subject === 'geography' && q.category === 'physical').length,
    human: allCleanQuestions.filter(q => q.subject === 'geography' && q.category === 'human').length,
    regional: allCleanQuestions.filter(q => q.subject === 'geography' && q.category === 'regional').length
  },
  history: {
    ancient: allCleanQuestions.filter(q => q.subject === 'history' && q.category === 'ancient').length,
    medieval: allCleanQuestions.filter(q => q.subject === 'history' && q.category === 'medieval').length,
    'early-modern': allCleanQuestions.filter(q => q.subject === 'history' && q.category === 'early-modern').length,
    modern: allCleanQuestions.filter(q => q.subject === 'history' && q.category === 'modern').length,
    contemporary: allCleanQuestions.filter(q => q.subject === 'history' && q.category === 'contemporary').length
  },
  civics: {
    constitution: allCleanQuestions.filter(q => q.subject === 'civics' && q.category === 'constitution').length,
    politics: allCleanQuestions.filter(q => q.subject === 'civics' && q.category === 'politics').length,
    economics: allCleanQuestions.filter(q => q.subject === 'civics' && q.category === 'economics').length,
    environment: allCleanQuestions.filter(q => q.subject === 'civics' && q.category === 'environment').length
  }
};

console.log('\n📊 カテゴリー別詳細:');
Object.entries(categoryStats).forEach(([subject, categories]) => {
  console.log(`${subject}:`);
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}問`);
  });
});

// クリーンなTypeScriptファイルを生成
const tsContent = `// ShakaQuest ${allCleanQuestions.length}問完全版データベース - サンプル問題除去版
// Generated: ${new Date().toISOString()}
// サンプル問題完全除去、高品質問題のみ

import { UnifiedQuestion } from './unified-types';

export const allUnifiedQuestions: UnifiedQuestion[] = [
${allCleanQuestions.map(q => `  {
    id: "${q.id}",
    subject: "${q.subject}" as const,
    category: "${q.category}" as const,
    subcategory: "${q.subcategory || 'general'}",
    grade: ${q.grade || 6},
    difficulty: "${q.difficulty}" as const,
    tags: ${JSON.stringify(q.tags || [])},
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correct: ${q.correct || 0},
    explanation: ${JSON.stringify(q.explanation)},
    type: "${q.type || 'multiple-choice'}" as const,
    lastUpdated: new Date("${q.lastUpdated || new Date().toISOString()}"),
    createdAt: new Date("${q.createdAt || new Date().toISOString()}"),
    version: ${q.version || 1},
    qualityScore: ${q.qualityScore || 8}
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

// Database statistics
export const databaseStats = {
  totalQuestions: ${allCleanQuestions.length},
  geography: ${subjectStats.geography},
  history: ${subjectStats.history},
  civics: ${subjectStats.civics},
  categoryDetails: ${JSON.stringify(categoryStats, null, 2)},
  generatedAt: new Date("${new Date().toISOString()}")
};

export default allUnifiedQuestions;
`;

// ファイル保存
fs.writeFileSync('./src/data/questions-unified-complete.ts', tsContent);

console.log('\n✅ 最終クリーンデータベース作成完了！');
console.log(`📁 ファイル: ./src/data/questions-unified-complete.ts`);
console.log(`📊 問題数: ${allCleanQuestions.length}問`);
console.log('🛡️  サンプル問題: 完全除去済み');
console.log('🎯 本番デプロイ準備完了');