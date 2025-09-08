const fs = require('fs');

console.log('🔄 データ移行ツール（TypeScript修正版）: 既存データを新しい統一型に変換中...\n');

// 既存データの読み込み
const geoContent = fs.readFileSync('./src/data/geography-enhanced.ts', 'utf-8');
const histContent = fs.readFileSync('./src/data/history.ts', 'utf-8');
const civContent = fs.readFileSync('./src/data/civics.ts', 'utf-8');

// 新しいカテゴリマッピング定義
const CATEGORY_MAPPING = {
  geography: {
    'industry': { category: 'human', subcategory: 'industry' },
    'regions': { category: 'regional', subcategory: 'regions' },
    'prefecture': { category: 'regional', subcategory: 'prefectures' },
    'climate': { category: 'physical', subcategory: 'climate' },
    'landforms': { category: 'physical', subcategory: 'landforms' },
    'agriculture': { category: 'human', subcategory: 'agriculture' }
  },
  history: {
    'ancient': { category: 'ancient', subcategory: 'heian' },
    'medieval': { category: 'medieval', subcategory: 'kamakura' },
    'early-modern': { category: 'early-modern', subcategory: 'edo' },
    'modern': { category: 'modern', subcategory: 'meiji' },
    'contemporary': { category: 'contemporary', subcategory: 'showa-postwar' },
    'primitive': { category: 'ancient', subcategory: 'jomon' },
    'general': { category: 'modern', subcategory: 'meiji' }
  },
  civics: {
    'constitution': { category: 'constitution', subcategory: 'basic-principles' },
    'politics': { category: 'politics', subcategory: 'three-powers' },
    'human-rights': { category: 'constitution', subcategory: 'human-rights' },
    'economics': { category: 'economics', subcategory: 'market-economy' },
    'general': { category: 'politics', subcategory: 'three-powers' }
  }
};

// 環境問題を公民に移動するマッピング
const ENVIRONMENT_MAPPING = {
  'フードマイレージ': { subject: 'civics', category: 'environment', subcategory: 'sustainability' }
};

// 難易度マッピング
const DIFFICULTY_MAPPING = {
  'easy': 'basic',
  'medium': 'standard', 
  'hard': 'advanced'
};

// 年代情報マッピング（歴史問題用）
const ERA_INFO = {
  'jomon': { start: -14000, end: -300, label: '紀元前14000-300年頃', description: '縄文時代：狩猟採集、土器製作' },
  'yayoi': { start: -300, end: 300, label: '紀元前300-300年頃', description: '弥生時代：稲作開始、金属器' },
  'kofun': { start: 300, end: 710, label: '300-710年', description: '古墳時代：大和政権、前方後円墳' },
  'nara': { start: 710, end: 794, label: '710-794年', description: '奈良時代：律令政治、大仏建立' },
  'heian': { start: 794, end: 1185, label: '794-1185年', description: '平安時代：摂関政治、国風文化' },
  'kamakura': { start: 1185, end: 1333, label: '1185-1333年', description: '鎌倉時代：武家政権、元寇' },
  'muromachi': { start: 1336, end: 1573, label: '1336-1573年', description: '室町時代：下克上、応仁の乱' },
  'azuchi-momoyama': { start: 1573, end: 1603, label: '1573-1603年', description: '安土桃山時代：天下統一' },
  'edo': { start: 1603, end: 1867, label: '1603-1867年', description: '江戸時代：鎖国、参勤交代' },
  'meiji': { start: 1868, end: 1912, label: '1868-1912年', description: '明治時代：文明開化、近代化' },
  'taisho': { start: 1912, end: 1926, label: '1912-1926年', description: '大正時代：大正デモクラシー' },
  'showa-prewar': { start: 1926, end: 1945, label: '1926-1945年', description: '昭和前期：戦争の時代' },
  'showa-postwar': { start: 1945, end: 1989, label: '1945-1989年', description: '戦後復興、高度経済成長' }
};

// 改良された問題抽出関数
function extractQuestionsImproved(content, subject) {
  const questions = [];
  
  // より柔軟な抽出パターン
  const patterns = [
    // パターン1: 標準形式
    /\{\s*id:\s*(\d+),\s*question:\s*['"`]([^'"`]*?)['"`],\s*options:\s*\[([^\]]*?)\],\s*correct:\s*(\d+),[\s\S]*?explanation:\s*['"`]([^'"`]*?)['"`][\s\S]*?category:\s*['"`]([^'"`]*?)['"`],[\s\S]*?difficulty:\s*['"`]([^'"`]*?)['"`][\s\S]*?\}/g,
    
    // パターン2: プロパティ順序が違う場合
    /\{\s*id:\s*(\d+)[\s\S]*?question:\s*['"`]([^'"`]*?)['"`][\s\S]*?options:\s*\[([^\]]*?)\][\s\S]*?correct:\s*(\d+)[\s\S]*?category:\s*['"`]([^'"`]*?)['"`][\s\S]*?difficulty:\s*['"`]([^'"`]*?)['"`][\s\S]*?explanation:\s*['"`]([^'"`]*?)['"`][\s\S]*?\}/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let [, id, question, optionsText, correct, explanation, category, difficulty] = match;
      
      // パターン2の場合、順序を調整
      if (match.length === 9) {
        [, id, question, optionsText, correct, category, difficulty, explanation] = match;
      }
      
      // オプションを解析
      const optionMatches = [...optionsText.matchAll(/['"`]([^'"`]*?)['"`]/g)];
      const options = optionMatches.map(m => m[1]);
      
      if (options.length >= 3) {  // 最低3つの選択肢があれば有効
        questions.push({
          originalId: parseInt(id),
          question: question.trim(),
          options,
          correct: parseInt(correct),
          explanation: explanation.trim(),
          category: category.trim(),
          difficulty: difficulty.trim(),
          subject
        });
      }
    }
  }
  
  return questions;
}

console.log('📊 既存データ抽出中（改良版）...');
const geoQuestions = extractQuestionsImproved(geoContent, 'geography');
const histQuestions = extractQuestionsImproved(histContent, 'history');
const civQuestions = extractQuestionsImproved(civContent, 'civics');

console.log(`✅ 抽出完了:`);
console.log(`   地理: ${geoQuestions.length}問`);
console.log(`   歴史: ${histQuestions.length}問`);
console.log(`   公民: ${civQuestions.length}問`);
console.log(`   合計: ${geoQuestions.length + histQuestions.length + civQuestions.length}問\n`);

// 統一形式への変換
console.log('🔄 新しい統一形式に変換中...');
const allQuestions = [...geoQuestions, ...histQuestions, ...civQuestions];

function convertToUnified(questions) {
  const converted = [];
  let idCounters = {
    'GEO_PHY': 0, 'GEO_HUM': 0, 'GEO_REG': 0,
    'HIS_ANC': 0, 'HIS_MED': 0, 'HIS_EMO': 0, 'HIS_MOD': 0, 'HIS_CON': 0,
    'CIV_CON': 0, 'CIV_POL': 0, 'CIV_ECO': 0, 'CIV_ENV': 0
  };
  
  for (const q of questions) {
    try {
      // 環境問題の特別処理
      if (q.question.includes('フードマイレージ') || 
          q.question.includes('環境負荷') || 
          q.question.includes('持続可能')) {
        
        const envId = ++idCounters['CIV_ENV'];
        
        converted.push({
          id: `CIV_ENV_${envId.toString().padStart(3, '0')}`,
          subject: 'civics',
          category: 'environment',
          subcategory: 'sustainability',
          grade: 6,
          difficulty: DIFFICULTY_MAPPING[q.difficulty] || 'standard',
          tags: ['civics', 'environment', 'sustainability'],
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
          type: 'multiple-choice',
          lastUpdated: new Date(),
          createdAt: new Date(),
          version: 1,
          qualityScore: Math.min(10, Math.max(1, Math.floor(q.explanation.length / 20)))
        });
        continue;
      }
      
      // 通常の分類処理
      const mapping = CATEGORY_MAPPING[q.subject]?.[q.category];
      if (!mapping) {
        console.error(`⚠️  Unknown category: ${q.category} in ${q.subject}`);
        continue;
      }
      
      // ID プレフィックス生成
      let prefix;
      if (q.subject === 'geography') {
        if (mapping.category === 'physical') prefix = 'GEO_PHY';
        else if (mapping.category === 'human') prefix = 'GEO_HUM'; 
        else if (mapping.category === 'regional') prefix = 'GEO_REG';
      } else if (q.subject === 'history') {
        if (mapping.category === 'ancient') prefix = 'HIS_ANC';
        else if (mapping.category === 'medieval') prefix = 'HIS_MED';
        else if (mapping.category === 'early-modern') prefix = 'HIS_EMO';
        else if (mapping.category === 'modern') prefix = 'HIS_MOD';
        else if (mapping.category === 'contemporary') prefix = 'HIS_CON';
      } else if (q.subject === 'civics') {
        if (mapping.category === 'constitution') prefix = 'CIV_CON';
        else if (mapping.category === 'politics') prefix = 'CIV_POL';
        else if (mapping.category === 'economics') prefix = 'CIV_ECO';
      }
      
      if (!prefix) continue;
      
      const newId = ++idCounters[prefix];
      
      const unifiedQuestion = {
        id: `${prefix}_${newId.toString().padStart(3, '0')}`,
        subject: q.subject,
        category: mapping.category,
        subcategory: mapping.subcategory,
        grade: 6,
        difficulty: DIFFICULTY_MAPPING[q.difficulty] || 'standard',
        tags: [q.subject, mapping.category, mapping.subcategory].filter(Boolean),
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
        type: 'multiple-choice',
        lastUpdated: new Date(),
        createdAt: new Date(),
        version: 1,
        qualityScore: Math.min(10, Math.max(1, Math.floor(q.explanation.length / 20)))
      };
      
      // 歴史問題の年代情報追加
      if (q.subject === 'history' && mapping.subcategory && ERA_INFO[mapping.subcategory]) {
        unifiedQuestion.era = ERA_INFO[mapping.subcategory];
      }
      
      converted.push(unifiedQuestion);
      
    } catch (error) {
      console.error(`Error processing question ${q.originalId}: ${error.message}`);
    }
  }
  
  return converted;
}

const unifiedQuestions = convertToUnified(allQuestions);

console.log(`✅ 変換完了: ${unifiedQuestions.length}問`);

// 統計情報表示
console.log('\n📈 変換後の分類統計:');
const stats = {};
unifiedQuestions.forEach(q => {
  const key = `${q.subject}-${q.category}`;
  stats[key] = (stats[key] || 0) + 1;
});

Object.entries(stats).sort().forEach(([key, count]) => {
  console.log(`   ${key}: ${count}問`);
});

// 環境問題の移動統計
const environmentQuestions = unifiedQuestions.filter(q => q.category === 'environment');
console.log(`\n🌱 環境問題の移動: ${environmentQuestions.length}問を公民に移動`);

// TypeScriptファイル生成（Date オブジェクト対応）
function generateTypeScriptFile(questions) {
  // Date オブジェクトを正しい形式で生成
  const questionsWithDateConstructors = questions.map(q => {
    return {
      ...q,
      lastUpdated: `new Date("${q.lastUpdated.toISOString()}")`,
      createdAt: `new Date("${q.createdAt.toISOString()}")`
    };
  });
  
  // JSON.stringify で基本構造を生成
  let content = JSON.stringify(questionsWithDateConstructors, null, 2);
  
  // Date コンストラクタの引用符を削除
  content = content.replace(/"new Date\(\\\"([^"]+)\\\"\)"/g, 'new Date("$1")');
  
  return `// Unified Questions Database for ShakaQuest
// 統一問題データベース - 自動生成ファイル  
// Generated: ${new Date().toISOString()}
// Total Questions: ${questions.length}

import { UnifiedQuestion } from './unified-types';

export const unifiedQuestions: UnifiedQuestion[] = ${content};

// 科目別問題取得
export const getQuestionsBySubject = (subject: string) => 
  unifiedQuestions.filter(q => q.subject === subject);

// カテゴリ別問題取得  
export const getQuestionsByCategory = (subject: string, category: string) =>
  unifiedQuestions.filter(q => q.subject === subject && q.category === category);

// タグ検索
export const getQuestionsByTag = (tag: string) =>
  unifiedQuestions.filter(q => q.tags.includes(tag));

// 横断検索（環境問題など）
export const searchQuestions = (keyword: string) =>
  unifiedQuestions.filter(q => 
    q.question.includes(keyword) || 
    q.explanation.includes(keyword) || 
    q.tags.some(tag => tag.includes(keyword))
  );

// 品質でフィルタ
export const getHighQualityQuestions = (minScore: number = 7) =>
  unifiedQuestions.filter(q => q.qualityScore >= minScore);

export default unifiedQuestions;
`;
}

// ファイルに保存
const outputContent = generateTypeScriptFile(unifiedQuestions);
fs.writeFileSync('./src/data/questions-unified.ts', outputContent);

console.log('\n🎉 移行完了！');
console.log('📁 出力ファイル: ./src/data/questions-unified.ts');
console.log(`📊 最終結果: ${unifiedQuestions.length}問を統一形式で管理`);
console.log('\n✨ 新しい機能:');
console.log('   - 統一ID体系 (GEO_PHY_001, HIS_ANC_045, etc.)');
console.log('   - 正確な学術分類');  
console.log('   - 横断検索可能なタグシステム');
console.log('   - 品質スコア付き');
console.log('   - 環境問題の適切な分類（公民）');
console.log('   - 歴史問題の年代情報付き');
console.log('   - バージョン管理対応');
console.log('   - TypeScript Date オブジェクト対応');