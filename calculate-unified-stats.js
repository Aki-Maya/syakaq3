const fs = require('fs');

// 統一データベースから統計情報を計算するスクリプト
console.log('📊 統一データベースの統計情報を計算中...\n');

// unified-types.tsから型情報を読み取り（文字列処理）
const typesContent = fs.readFileSync('./src/data/unified-types.ts', 'utf-8');

// questions-unified.tsの内容を読み取り
const unifiedContent = fs.readFileSync('./src/data/questions-unified.ts', 'utf-8');

// unifiedQuestionsの配列部分を抽出（簡易的なパース）
const questionsArrayMatch = unifiedContent.match(/export const unifiedQuestions[\s\S]*?= (\[[\s\S]*?\]);/);

if (!questionsArrayMatch) {
  console.error('統一データベースの解析に失敗しました');
  process.exit(1);
}

// 統計情報を計算
const stats = {
  total: 0,
  bySubject: {},
  byCategory: {},
  bySubjectCategory: {}
};

// 正規表現で各問題のsubjectとcategoryを抽出
const questionPattern = /"subject":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"/g;

let match;
while ((match = questionPattern.exec(questionsArrayMatch[1])) !== null) {
  const [, subject, category] = match;
  
  stats.total++;
  
  // 科目別カウント
  stats.bySubject[subject] = (stats.bySubject[subject] || 0) + 1;
  
  // カテゴリ別カウント
  stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  
  // 科目-カテゴリ別カウント
  const key = `${subject}-${category}`;
  stats.bySubjectCategory[key] = (stats.bySubjectCategory[key] || 0) + 1;
}

console.log('✅ 統計情報計算完了\n');

console.log('📈 科目別統計:');
Object.entries(stats.bySubject).forEach(([subject, count]) => {
  console.log(`   ${subject}: ${count}問`);
});

console.log('\n📈 カテゴリ別統計:');
Object.entries(stats.byCategory).forEach(([category, count]) => {
  console.log(`   ${category}: ${count}問`);
});

console.log('\n📈 科目-カテゴリ別統計:');
Object.entries(stats.bySubjectCategory).forEach(([key, count]) => {
  console.log(`   ${key}: ${count}問`);
});

console.log(`\n🎯 合計: ${stats.total}問\n`);

// マッピング辞書を生成
const categoryMapping = {
  geography: {
    physical: stats.bySubjectCategory['geography-physical'] || 0,
    human: stats.bySubjectCategory['geography-human'] || 0,
    regional: stats.bySubjectCategory['geography-regional'] || 0
  },
  history: {
    ancient: stats.bySubjectCategory['history-ancient'] || 0,
    medieval: stats.bySubjectCategory['history-medieval'] || 0,
    'early-modern': stats.bySubjectCategory['history-early-modern'] || 0,
    modern: stats.bySubjectCategory['history-modern'] || 0,
    contemporary: stats.bySubjectCategory['history-contemporary'] || 0
  },
  civics: {
    constitution: stats.bySubjectCategory['civics-constitution'] || 0,
    politics: stats.bySubjectCategory['civics-politics'] || 0,
    economics: stats.bySubjectCategory['civics-economics'] || 0,
    environment: stats.bySubjectCategory['civics-environment'] || 0
  }
};

console.log('🔄 カテゴリマッピング生成完了:');
console.log(JSON.stringify(categoryMapping, null, 2));

// 結果をJSONファイルとして保存
fs.writeFileSync('./unified-stats.json', JSON.stringify({
  ...stats,
  categoryMapping
}, null, 2));

console.log('\n💾 統計情報を unified-stats.json に保存しました');