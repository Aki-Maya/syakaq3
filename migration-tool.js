const fs = require('fs');

console.log('🔄 データ移行ツール: 既存データを新しい統一型に変換中...\n');

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
    'ancient': { category: 'ancient', subcategory: 'heian' },  // デフォルトで平安時代
    'medieval': { category: 'medieval', subcategory: 'kamakura' },
    'early-modern': { category: 'early-modern', subcategory: 'edo' },
    'modern': { category: 'modern', subcategory: 'meiji' },
    'contemporary': { category: 'contemporary', subcategory: 'showa-postwar' },
    'primitive': { category: 'ancient', subcategory: 'jomon' },
    'general': { category: 'modern', subcategory: 'meiji' }  // generalは近代に分類
  },
  civics: {
    'constitution': { category: 'constitution', subcategory: 'basic-principles' },
    'politics': { category: 'politics', subcategory: 'three-powers' },
    'human-rights': { category: 'constitution', subcategory: 'human-rights' },
    'economics': { category: 'economics', subcategory: 'market-economy' },
    'general': { category: 'politics', subcategory: 'three-powers' }  // generalは政治に分類
  }
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
  'edo': { start: 1603, end: 1867, label: '1603-1867年', description: '江戸時代：鎖国、参勤交代' },
  'meiji': { start: 1868, end: 1912, label: '1868-1912年', description: '明治時代：文明開化、近代化' },
  'showa-postwar': { start: 1945, end: 1989, label: '1945-1989年', description: '戦後復興、高度経済成長' }
};

// 問題抽出関数
function extractQuestions(content, subject) {
  const questions = [];
  
  // 問題のマッチングパターン（より柔軟に）
  const questionPattern = /\{\s*id:\s*(\d+)[^}]*?question:\s*['"`]([^'"`]*?)['"`][^}]*?options:\s*\[[^\]]*?\][^}]*?correct:\s*(\d+)[^}]*?explanation:\s*['"`]([^'"`]*?)['"`][^}]*?category:\s*['"`]([^'"`]*?)['"`][^}]*?difficulty:\s*['"`]([^'"`]*?)['"`][^}]*?\}/gs;
  
  let match;
  while ((match = questionPattern.exec(content)) !== null) {
    const [, id, question, correct, explanation, category, difficulty] = match;
    
    // optionsを別途抽出
    const optionsMatch = content.substring(match.index, match.index + match[0].length)
      .match(/options:\s*\[(.*?)\]/s);
    
    let options = [];
    if (optionsMatch) {
      const optionsText = optionsMatch[1];
      const optionMatches = [...optionsText.matchAll(/['"`]([^'"`]*?)['"`]/g)];
      options = optionMatches.map(m => m[1]);
    }
    
    if (options.length === 4) {  // 有効な問題のみ
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
  
  return questions;
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
console.log('📊 既存データ抽出中...');

const geoQuestions = extractQuestions(geoContent, 'geography');
const histQuestions = extractQuestions(histContent, 'history');
const civQuestions = extractQuestions(civContent, 'civics');

console.log(`✅ 抽出完了:`);
console.log(`   地理: ${geoQuestions.length}問`);
console.log(`   歴史: ${histQuestions.length}問`);  
console.log(`   公民: ${civQuestions.length}問`);
console.log(`   合計: ${geoQuestions.length + histQuestions.length + civQuestions.length}問`);

// 統一データ構造に変換
console.log('\n🔄 新しい統一形式に変換中...');

const unifiedQuestions = [];

// 各科目のデータを変換
[
  { questions: geoQuestions, subject: 'geography' },
  { questions: histQuestions, subject: 'history' },
  { questions: civQuestions, subject: 'civics' }
].forEach(({ questions, subject }) => {
  
  questions.forEach((q, index) => {
    const mapping = CATEGORY_MAPPING[subject][q.originalCategory];
    if (!mapping) {
      console.warn(`⚠️  Unknown category: ${q.originalCategory} in ${subject}`);
      return;
    }
    
    const newId = generateNewId(subject, mapping.category, index);
    const tags = generateTags(q.question, q.explanation, subject, mapping.category, mapping.subcategory);
    
    const unifiedQuestion = {
      id: newId,
      subject: subject,
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
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      version: 1,
      qualityScore: q.explanation.length >= 100 ? 8 : 6,
      // 歴史問題のera情報追加
      ...(subject === 'history' && mapping.subcategory && ERA_INFO[mapping.subcategory] && {
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

Object.entries(stats).forEach(([key, count]) => {
  console.log(`   ${key}: ${count}問`);
});

// 新しい統一ファイルを生成
const outputContent = `// Unified Questions Database for ShakaQuest
// 統一問題データベース - 自動生成ファイル
// Generated: ${new Date().toISOString()}

import { UnifiedQuestion } from './unified-types';

export const unifiedQuestions: UnifiedQuestion[] = ${JSON.stringify(unifiedQuestions, null, 2)};

// 科目別問題取得
export const getQuestionsBySubject = (subject: string) => 
  unifiedQuestions.filter(q => q.subject === subject);

// カテゴリ別問題取得  
export const getQuestionsByCategory = (subject: string, category: string) =>
  unifiedQuestions.filter(q => q.subject === subject && q.category === category);

// タグ検索
export const getQuestionsByTag = (tag: string) =>
  unifiedQuestions.filter(q => q.tags.includes(tag));

// 横断検索
export const searchQuestions = (keyword: string) =>
  unifiedQuestions.filter(q => 
    q.question.includes(keyword) || 
    q.explanation.includes(keyword) || 
    q.tags.some(tag => tag.includes(keyword))
  );

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
console.log('   - バージョン管理対応');