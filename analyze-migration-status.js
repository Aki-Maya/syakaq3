const fs = require('fs');

console.log('=== ShakaQuest 質問データ移行状況分析 ===\n');

// 統一データベースを読み込み
const unifiedContent = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
const unifiedMatches = unifiedContent.match(/\{[\s\S]*?\}/g) || [];
const unifiedCount = unifiedMatches.length;

console.log(`📊 統一データベース (questions-unified.ts): ${unifiedCount} 問`);

// レガシーファイルを分析
const legacyFiles = [
  'geography-enhanced.ts',
  'history.ts', 
  'civics.ts'
];

let totalLegacyCount = 0;
const subjectCounts = {};

legacyFiles.forEach(filename => {
  try {
    const content = fs.readFileSync(`/home/user/webapp/src/data/${filename}`, 'utf8');
    
    // 質問オブジェクトの数を数える（export const [subject]Questions の配列内）
    const questionsArrayMatch = content.match(/export const \w+Questions[\s\S]*?=[\s\S]*?\[([\s\S]*?)\];/);
    if (questionsArrayMatch) {
      const questionsContent = questionsArrayMatch[1];
      const questionMatches = questionsContent.match(/\{\s*id:/g) || [];
      const count = questionMatches.length;
      
      const subject = filename.replace('-enhanced.ts', '').replace('.ts', '');
      subjectCounts[subject] = count;
      totalLegacyCount += count;
      
      console.log(`📚 ${subject}: ${count} 問 (${filename})`);
    }
  } catch (error) {
    console.log(`⚠️ ${filename} の読み込みエラー:`, error.message);
  }
});

console.log(`\n📋 **移行状況サマリー**`);
console.log(`・統一DB: ${unifiedCount} 問`);
console.log(`・レガシー: ${totalLegacyCount} 問`);
console.log(`・合計: ${unifiedCount + totalLegacyCount} 問`);
console.log(`・移行残り: ${totalLegacyCount} 問`);

// 移行優先順位を提案
console.log(`\n🎯 **移行優先順位の提案**`);
const sortedSubjects = Object.entries(subjectCounts)
  .sort(([,a], [,b]) => b - a);

sortedSubjects.forEach(([subject, count], index) => {
  const priority = index === 0 ? '🔴 High' : index === 1 ? '🟡 Medium' : '🟢 Low';
  console.log(`${index + 1}. ${subject}: ${count} 問 ${priority}`);
});

console.log(`\n📈 **移行効率分析**`);
console.log(`・推定作業時間: ${Math.ceil(totalLegacyCount / 20)} 分 (1問/6秒)`);
console.log(`・バッチサイズ推奨: 50問単位`);
console.log(`・バッチ数: ${Math.ceil(totalLegacyCount / 50)} バッチ`);

// 品質向上機会の特定
console.log(`\n🔍 **品質向上の機会**`);
console.log(`・説明文の充実化が期待される問題数: ~${Math.floor(totalLegacyCount * 0.3)} 問`);
console.log(`・カテゴリ再分類が必要な問題数: ~${Math.floor(totalLegacyCount * 0.1)} 問`);
console.log(`・難易度調整が必要な問題数: ~${Math.floor(totalLegacyCount * 0.15)} 問`);