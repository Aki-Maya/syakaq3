// 445問完全版データベース作成（クリーンバージョン）

const fs = require('fs');

console.log('🔄 クリーンな445問データベース作成開始...');

// 変換済み問題を読み込み
const convertedQuestions = JSON.parse(fs.readFileSync('./converted-high-quality-questions.json', 'utf8'));

// 既存の高品質問題IDリスト
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

// 既存データベースから高品質問題を抽出
const questionsContent = fs.readFileSync('./src/data/questions-unified.ts', 'utf8');
const existingQuestions = [];

// 既存の問題ブロックを抽出（JSONパース可能な形式に変換）
const questionPattern = /{\s*"id":\s*"([^"]+)"[\s\S]*?}/g;
let match;
while ((match = questionPattern.exec(questionsContent)) !== null) {
  const questionBlock = match[0];
  try {
    // TypeScriptの部分をJavaScript形式に変換してパース
    const jsBlock = questionBlock
      .replace(/new Date\(("[^"]*")\)/g, '$1')
      .replace(/lastUpdated:/g, '"lastUpdated":')
      .replace(/createdAt:/g, '"createdAt":');
    
    const question = JSON.parse(jsBlock);
    if (HIGH_QUALITY_IDS.includes(question.id)) {
      existingQuestions.push(question);
    }
  } catch (e) {
    // Skip invalid blocks
    continue;
  }
}

console.log(`📊 既存高品質問題抽出: ${existingQuestions.length}問`);
console.log(`📊 変換済み問題: ${convertedQuestions.length}問`);

// すべての問題をマージ
const allQuestions = [...existingQuestions, ...convertedQuestions];

console.log(`📊 統合後総問題数: ${allQuestions.length}問`);

// TypeScriptファイルとして出力
const tsContent = `// ShakaQuest 445問完全版データベース - 高品質統合版
// Generated on ${new Date().toISOString()}
import { UnifiedQuestion } from './unified-types';

export const allUnifiedQuestions: UnifiedQuestion[] = [
${allQuestions.map(q => `  {
    id: "${q.id}",
    subject: "${q.subject}",
    category: "${q.category}",
    subcategory: "${q.subcategory || 'general'}",
    grade: ${q.grade || 6},
    difficulty: "${q.difficulty}",
    tags: ${JSON.stringify(q.tags || [])},
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correct: ${q.correct},
    explanation: ${JSON.stringify(q.explanation)},
    type: "${q.type}",
    lastUpdated: new Date("${q.lastUpdated || new Date().toISOString()}"),
    createdAt: new Date("${q.createdAt || new Date().toISOString()}"),
    version: ${q.version || 1},
    qualityScore: ${q.qualityScore || 8}
  }`).join(',\n')}
];

// Helper functions
export const getQuestionsBySubject = (subject: string) => {
  return allUnifiedQuestions.filter(q => q.subject === subject);
};

export const getQuestionsByCategory = (subject: string, category: string) => {
  return allUnifiedQuestions.filter(q => q.subject === subject && q.category === category);  
};

export const getQuestionsByTag = (tag: string) => {
  return allUnifiedQuestions.filter(q => q.tags && q.tags.includes(tag));
};

export const searchQuestions = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return allUnifiedQuestions.filter(q => 
    q.question.toLowerCase().includes(term) ||
    q.explanation.toLowerCase().includes(term) ||
    q.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

export const getHighQualityQuestions = (minScore = 7) => {
  return allUnifiedQuestions.filter(q => q.qualityScore >= minScore);
};

// Export individual question arrays by subject
export const geographyQuestions = getQuestionsBySubject('geography');
export const historyQuestions = getQuestionsBySubject('history');  
export const civicsQuestions = getQuestionsBySubject('civics');

// Statistics
export const stats = {
  total: allUnifiedQuestions.length,
  geography: geographyQuestions.length,
  history: historyQuestions.length,
  civics: civicsQuestions.length
};

export default allUnifiedQuestions;
`;

// ファイルに保存
fs.writeFileSync('./src/data/questions-unified-complete.ts', tsContent);

console.log('✅ クリーンなデータベース作成完了！');
console.log('📁 ファイル: ./src/data/questions-unified-complete.ts');
console.log(`📊 問題数確認: ${allQuestions.length}問`);

// 科目別分布
const subjectCounts = {
  geography: allQuestions.filter(q => q.subject === 'geography').length,
  history: allQuestions.filter(q => q.subject === 'history').length,  
  civics: allQuestions.filter(q => q.subject === 'civics').length
};

console.log('📚 科目別分布:');
Object.entries(subjectCounts).forEach(([subject, count]) => {
  console.log(`   ${subject}: ${count}問`);
});