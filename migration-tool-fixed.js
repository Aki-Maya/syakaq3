const fs = require('fs');

console.log('🔄 データ移行ツール（修正版）: 既存データを新しい統一型に変換中...\n');

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
          originalCategory: category,
          originalDifficulty: difficulty,
          subject
        });
      }
    }
  }
  
  // 重複除去（IDベース）
  const uniqueQuestions = [];
  const seenIds = new Set();
  questions.forEach(q => {
    if (!seenIds.has(q.originalId)) {
      seenIds.add(q.originalId);
      uniqueQuestions.push(q);
    }
  });
  
  return uniqueQuestions;
}

// 環境問題の判定
function isEnvironmentQuestion(question, explanation) {
  const envKeywords = ['フードマイレージ', '環境', '地球温暖化', 'co2', '持続可能', 'リサイクル', '再生可能', 'エネルギー'];
  const text = (question + ' ' + explanation).toLowerCase();
  return envKeywords.some(keyword => text.includes(keyword));
}

// 新しいIDを生成
function generateNewId(subject, category, index) {
  const subjectCode = subject.toUpperCase().slice(0, 3);
  const categoryCode = category.toUpperCase().slice(0, 3);
  const numberCode = (index + 1).toString().padStart(3, '0');
  return `${subjectCode}_${categoryCode}_${numberCode}`;
}

// タグ生成（問題内容から推測）
function generateTags(question, explanation, subject, category, subcategory) {
  const tags = [subject, category];
  
  if (subcategory) tags.push(subcategory);
  
  const text = (question + ' ' + explanation).toLowerCase();
  
  // 共通キーワードベースのタグ
  const tagKeywords = {
    'environment': ['環境', '地球温暖化', 'co2', '持続可能', 'フードマイレージ'],
    'economy': ['経済', '貿易', '輸出', '輸入', '産業'],
    'culture': ['文化', '芸術', '文学', '宗教', '祭り'],
    'politics': ['政治', '政府', '選挙', '法律', '制度'],
    'war': ['戦争', '軍事', '戦い', '合戦', '侵攻'],
    'technology': ['技術', '発明', '科学', '工業', '機械']
  };
  
  Object.entries(tagKeywords).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  return [...new Set(tags)]; // 重複除去
}

// データ変換実行
console.log('📊 既存データ抽出中（改良版）...');

const geoQuestions = extractQuestionsImproved(geoContent, 'geography');
const histQuestions = extractQuestionsImproved(histContent, 'history');  
const civQuestions = extractQuestionsImproved(civContent, 'civics');

console.log(`✅ 抽出完了:`);
console.log(`   地理: ${geoQuestions.length}問`);
console.log(`   歴史: ${histQuestions.length}問`);  
console.log(`   公民: ${civQuestions.length}問`);
console.log(`   合計: ${geoQuestions.length + histQuestions.length + civQuestions.length}問`);

// 統一データ構造に変換
console.log('\n🔄 新しい統一形式に変換中...');

const unifiedQuestions = [];
let idCounters = {
  'geography-physical': 0,
  'geography-human': 0,
  'geography-regional': 0,
  'history-ancient': 0,
  'history-medieval': 0,
  'history-early-modern': 0,
  'history-modern': 0,
  'history-contemporary': 0,
  'civics-constitution': 0,
  'civics-politics': 0,
  'civics-economics': 0,
  'civics-environment': 0
};

// 各科目のデータを変換
[
  { questions: geoQuestions, subject: 'geography' },
  { questions: histQuestions, subject: 'history' },
  { questions: civQuestions, subject: 'civics' }
].forEach(({ questions, subject }) => {
  
  questions.forEach((q) => {
    // 環境問題のチェック
    let finalSubject = subject;
    let mapping = CATEGORY_MAPPING[subject][q.originalCategory];
    
    if (isEnvironmentQuestion(q.question, q.explanation)) {
      finalSubject = 'civics';
      mapping = { category: 'environment', subcategory: 'sustainability' };
    }
    
    if (!mapping) {
      console.warn(`⚠️  Unknown category: ${q.originalCategory} in ${subject}`);
      return;
    }
    
    const counterKey = `${finalSubject}-${mapping.category}`;
    const newId = generateNewId(finalSubject, mapping.category, idCounters[counterKey]);
    idCounters[counterKey]++;
    
    const tags = generateTags(q.question, q.explanation, finalSubject, mapping.category, mapping.subcategory);
    
    const unifiedQuestion = {
      id: newId,
      subject: finalSubject,
      category: mapping.category,
      subcategory: mapping.subcategory,
      grade: 6, // デフォルト6年生
      difficulty: DIFFICULTY_MAPPING[q.originalDifficulty] || 'standard',
      tags: tags,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      type: 'multiple-choice',
      lastUpdated: new Date(),
      createdAt: new Date(),
      version: 1,
      qualityScore: q.explanation.length >= 100 ? 8 : 6,
      // 歴史問題のera情報追加
      ...(finalSubject === 'history' && mapping.subcategory && ERA_INFO[mapping.subcategory] && {
        era: ERA_INFO[mapping.subcategory]
      })
    };
    
    unifiedQuestions.push(unifiedQuestion);
  });
});

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

// 新しい統一ファイルを生成
const outputContent = `// Unified Questions Database for ShakaQuest
// 統一問題データベース - 自動生成ファイル  
// Generated: ${new Date().toISOString()}
// Total Questions: ${unifiedQuestions.length}

import { UnifiedQuestion } from './unified-types';

export const unifiedQuestions: UnifiedQuestion[] = ${JSON.stringify(unifiedQuestions, (key, value) => {
  if (value instanceof Date) {
    return \`new Date('\${value.toISOString()}')\`;
  }
  return value;
}, 2).replace(/"new Date\\('([^']+)'\\)"/g, 'new Date(\'$1\')')};

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

// 結果をファイルに保存
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