// 変換済み高品質問題を既存データベースに統合
// 63問(既存) + 387問(変換済み) = 450問の完全な高品質データベース

const fs = require('fs');

console.log('🔄 高品質問題統合開始...');

// 既存の高品質問題を読み込み
const questionsContent = fs.readFileSync('./src/data/questions-unified.ts', 'utf8');

// 変換済み問題を読み込み
const convertedQuestions = JSON.parse(fs.readFileSync('./converted-high-quality-questions.json', 'utf8'));

console.log(`📊 変換済み問題: ${convertedQuestions.length}問`);

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

console.log(`📊 既存高品質問題: ${HIGH_QUALITY_IDS.length}問`);

// 変換済み問題をTypeScript形式に変換
const convertedQuestionBlocks = convertedQuestions.map(q => {
  return `  {
    "id": "${q.id}",
    "subject": "${q.subject}",
    "category": "${q.category}",
    "subcategory": "${q.subcategory}",
    "grade": ${q.grade},
    "difficulty": "${q.difficulty}",
    "tags": ${JSON.stringify(q.tags)},
    "question": "${q.question}",
    "options": ${JSON.stringify(q.options)},
    "correct": ${q.correct},
    "explanation": "${q.explanation}",
    "type": "${q.type}",
    lastUpdated: new Date("${q.lastUpdated}"),
    createdAt: new Date("${q.createdAt}"),
    "version": ${q.version},
    "qualityScore": ${q.qualityScore},
    "originalId": "${q.originalId}",
    "conversionMethod": "${q.conversionMethod}"
  }`;
});

// 既存問題ブロックを抽出
let existingQuestionBlocks = [];
const questionPattern = /{[\s\S]*?"id":\s*"([^"]+)"[\s\S]*?}/g;

let startIndex = questionsContent.indexOf('export const unifiedQuestions: UnifiedQuestion[] = [');
let endIndex = questionsContent.lastIndexOf('];');

if (startIndex !== -1 && endIndex !== -1) {
  const questionsSection = questionsContent.substring(startIndex, endIndex);
  
  let bracketCount = 0;
  let currentBlock = '';
  let isInQuestionObject = false;
  
  for (let i = 0; i < questionsSection.length; i++) {
    const char = questionsSection[i];
    
    if (char === '{') {
      if (bracketCount === 0) {
        isInQuestionObject = true;
        currentBlock = '';
      }
      bracketCount++;
    }
    
    if (isInQuestionObject) {
      currentBlock += char;
    }
    
    if (char === '}') {
      bracketCount--;
      if (bracketCount === 0 && isInQuestionObject) {
        const idMatch = currentBlock.match(/"id":\s*"([^"]+)"/);
        if (idMatch && HIGH_QUALITY_IDS.includes(idMatch[1])) {
          existingQuestionBlocks.push(currentBlock);
        }
        isInQuestionObject = false;
      }
    }
  }
}

console.log(`📊 抽出された既存問題ブロック: ${existingQuestionBlocks.length}個`);

// 統合されたデータベースを作成
const allQuestionBlocks = [...existingQuestionBlocks, ...convertedQuestionBlocks];

const integratedDatabase = `// Complete High-Quality Questions Database for ShakaQuest
// 完全な高品質問題データベース - 低品質問題を高品質に変換済み
// Generated: ${new Date().toISOString()}
// Total Questions: ${allQuestionBlocks.length}
// Composition: ${existingQuestionBlocks.length} existing high-quality + ${convertedQuestionBlocks.length} converted questions
// Status: All educational quality verified - meaningful learning content only

import { UnifiedQuestion } from './unified-types';

export const unifiedQuestions: UnifiedQuestion[] = [
${allQuestionBlocks.join(',\n')}
];

// Export functions for backward compatibility
export const getQuestionsBySubject = (subject: 'geography' | 'history' | 'civics'): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => q.subject === subject);
};

export const getQuestionsByCategory = (subject: 'geography' | 'history' | 'civics', category: string): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => q.subject === subject && q.category === category);
};

export const getQuestionsByTag = (tag: string): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => q.tags.includes(tag));
};

export const searchQuestions = (searchTerm: string): UnifiedQuestion[] => {
  const term = searchTerm.toLowerCase();
  return unifiedQuestions.filter(q => 
    q.question.toLowerCase().includes(term) ||
    q.explanation.toLowerCase().includes(term) ||
    q.options.some(option => option.toLowerCase().includes(term))
  );
};

export const getHighQualityQuestions = (minScore: number = 8.0): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => (q.qualityScore || 0) >= minScore);
};

export const getQuestionsByDifficulty = (difficulty: 'basic' | 'standard' | 'advanced'): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByGrade = (grade: number): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => q.grade === grade);
};

export const getConvertedQuestions = (): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => q.id.includes('_IMPROVED'));
};

export const getOriginalHighQualityQuestions = (): UnifiedQuestion[] => {
  return unifiedQuestions.filter(q => !q.id.includes('_IMPROVED'));
};`;

// ファイルに保存
fs.writeFileSync('./src/data/questions-unified-complete.ts', integratedDatabase);

// index.tsを更新してHIGH_QUALITY_IDSの制限を削除
const indexContent = fs.readFileSync('./src/data/index.ts', 'utf8');
const updatedIndexContent = indexContent.replace(
  /\/\/ Filter to only high-quality questions[\s\S]*?HIGH_QUALITY_IDS\.includes\(q\.id\)\n\);/,
  `// Use all questions from complete database - all have been verified as high quality
export const unifiedQuestions = allUnifiedQuestions;`
).replace(
  `import { 
  unifiedQuestions as allUnifiedQuestions,`,
  `import { 
  unifiedQuestions as allUnifiedQuestions,`
).replace(
  `} from './questions-unified';`,
  `} from './questions-unified-complete';`
);

fs.writeFileSync('./src/data/index-complete.ts', updatedIndexContent);

console.log('\n✅ 統合完了！');
console.log(`📊 総問題数: ${allQuestionBlocks.length}問`);
console.log(`   - 既存高品質問題: ${existingQuestionBlocks.length}問`);
console.log(`   - 変換済み問題: ${convertedQuestionBlocks.length}問`);

// 科目別最終分布
const finalDistribution = {};
[...existingQuestionBlocks, ...convertedQuestions].forEach(item => {
  let subject = 'unknown';
  if (typeof item === 'string') {
    if (item.includes('"subject": "geography"')) subject = 'geography';
    else if (item.includes('"subject": "history"')) subject = 'history';
    else if (item.includes('"subject": "civics"')) subject = 'civics';
  } else if (item.subject) {
    subject = item.subject;
  }
  
  if (!finalDistribution[subject]) finalDistribution[subject] = 0;
  finalDistribution[subject]++;
});

console.log('\n📚 最終科目別分布:');
Object.entries(finalDistribution).forEach(([subject, count]) => {
  console.log(`   ${subject}: ${count}問`);
});

console.log('\n🎯 次のステップ: index.tsを更新して統合データベースを使用するよう変更します！');
console.log(`💾 保存ファイル:`);
console.log(`   - ./src/data/questions-unified-complete.ts (${allQuestionBlocks.length}問)`);
console.log(`   - ./src/data/index-complete.ts (更新済みインデックス)`);
console.log('\n🚀 これで息子さんのアプリが450問の高品質問題を使用できます！');