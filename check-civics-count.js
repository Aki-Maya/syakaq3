const fs = require('fs');

console.log('🏛️ 公民問題数をチェック中...');

const content = fs.readFileSync('./src/data/civics.ts', 'utf-8');

// Extract questions with categories
const questionMatches = [...content.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];

console.log(`📊 公民総問題数: ${questionMatches.length}問`);

const categoryCount = {};
questionMatches.forEach(match => {
  const category = match[2];
  categoryCount[category] = (categoryCount[category] || 0) + 1;
});

console.log('\n📋 公民カテゴリ別問題数:');
Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
  console.log(`  ${category}: ${count}問`);
});

console.log('\n🏷️  期待されているカテゴリ (src/data/index.tsで定義):');
const expectedCategories = ['politics', 'human-rights', 'economics'];
let totalExpected = 0;
expectedCategories.forEach(category => {
  const count = categoryCount[category] || 0;
  console.log(`  ${category}: ${count}問`);
  totalExpected += count;
});

console.log(`\n📈 期待されるカテゴリの合計: ${totalExpected}問`);
console.log(`📉 期待されないカテゴリの合計: ${questionMatches.length - totalExpected}問`);

// Check which categories are missing from expected list
const unexpectedCategories = Object.keys(categoryCount).filter(cat => !expectedCategories.includes(cat));
if (unexpectedCategories.length > 0) {
  console.log('\n⚠️  期待されていないカテゴリ:');
  unexpectedCategories.forEach(cat => {
    console.log(`  ${cat}: ${categoryCount[cat]}問`);
  });
}

// Check if civics.ts file exists
try {
  const stats = fs.statSync('./src/data/civics.ts');
  console.log(`\n📁 civics.ts ファイルサイズ: ${stats.size} bytes`);
} catch (error) {
  console.log('\n❌ civics.ts ファイルが見つかりません');
}