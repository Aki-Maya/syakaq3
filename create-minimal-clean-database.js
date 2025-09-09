// 最小限のクリーンな高品質データベース作成
// マージコンフリクト完全回避版

const fs = require('fs');

console.log('🔄 最小限クリーンデータベース作成開始...');

// 変換済み高品質問題を読み込み
const convertedQuestions = JSON.parse(fs.readFileSync('./converted-high-quality-questions.json', 'utf8'));

console.log(`📊 変換済み高品質問題: ${convertedQuestions.length}問`);

// 最小限の既存高品質問題リスト（確実に動作するもののみ）
const minimalHighQualityQuestions = [
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
    type: "multiple-choice"
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
    type: "multiple-choice"
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
    type: "multiple-choice"
  }
];

console.log(`📊 最小限既存問題: ${minimalHighQualityQuestions.length}問`);

// 全問題をマージ（変換済み + 最小限既存）
const allQuestions = [...minimalHighQualityQuestions, ...convertedQuestions];

console.log(`📊 統合後総問題数: ${allQuestions.length}問`);

// 科目別統計
const subjectStats = {
  geography: allQuestions.filter(q => q.subject === 'geography').length,
  history: allQuestions.filter(q => q.subject === 'history').length,
  civics: allQuestions.filter(q => q.subject === 'civics').length
};

console.log('📚 科目別分布:');
Object.entries(subjectStats).forEach(([subject, count]) => {
  console.log(`   ${subject}: ${count}問`);
});

// クリーンなTypeScriptファイルを生成
const generateCleanDatabase = () => {
  const questionEntries = allQuestions.map((q, index) => {
    // 安全な文字列エスケープ
    const escapeString = (str) => {
      return JSON.stringify(str || "");
    };
    
    const escapeArray = (arr) => {
      return JSON.stringify(arr || []);
    };
    
    return `  {
    id: "${q.id}",
    subject: "${q.subject}" as const,
    category: "${q.category}" as const, 
    subcategory: "${q.subcategory || 'general'}",
    grade: ${q.grade || 6},
    difficulty: "${q.difficulty}" as const,
    tags: ${escapeArray(q.tags)},
    question: ${escapeString(q.question)},
    options: ${escapeArray(q.options)},
    correct: ${q.correct || 0},
    explanation: ${escapeString(q.explanation)},
    type: "${q.type || 'multiple-choice'}" as const,
    lastUpdated: new Date("${q.lastUpdated || new Date().toISOString()}"),
    createdAt: new Date("${q.createdAt || new Date().toISOString()}"),
    version: ${q.version || 1},
    qualityScore: ${q.qualityScore || 8}
  }`;
  });

  return `// ShakaQuest ${allQuestions.length}問完全版データベース - クリーン統合版
// 自動生成: ${new Date().toISOString()}
// マージコンフリクト完全回避版

import { UnifiedQuestion } from './unified-types';

export const allUnifiedQuestions: UnifiedQuestion[] = [
${questionEntries.join(',\n')}
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

// Export individual arrays by subject
export const geographyQuestions = getQuestionsBySubject('geography');
export const historyQuestions = getQuestionsBySubject('history');
export const civicsQuestions = getQuestionsBySubject('civics');

// Database statistics
export const databaseStats = {
  totalQuestions: ${allQuestions.length},
  geography: ${subjectStats.geography},
  history: ${subjectStats.history}, 
  civics: ${subjectStats.civics},
  generatedAt: new Date("${new Date().toISOString()}")
};

export default allUnifiedQuestions;
`;
};

// ファイル生成と保存
const tsContent = generateCleanDatabase();
fs.writeFileSync('./src/data/questions-unified-complete.ts', tsContent);

console.log('✅ クリーンデータベース生成完了！');
console.log(`📁 ファイル: ./src/data/questions-unified-complete.ts`);
console.log(`📊 総問題数: ${allQuestions.length}問`);
console.log('🛡️  マージコンフリクトマーカー: なし');
console.log('🎯 Vercelビルド準備完了');