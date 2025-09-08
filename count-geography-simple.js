const fs = require('fs');

console.log('🔍 地理問題数を直接チェック中...');

const content = fs.readFileSync('./src/data/geography-enhanced.ts', 'utf-8');

// Extract questions with categories
const questionMatches = [...content.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];

console.log(`📊 総問題数: ${questionMatches.length}問`);

const categoryCount = {};
questionMatches.forEach(match => {
  const category = match[2];
  categoryCount[category] = (categoryCount[category] || 0) + 1;
});

console.log('\n📋 カテゴリ別問題数:');
Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
  console.log(`  ${category}: ${count}問`);
});

console.log('\n🏷️  期待されているカテゴリ (src/data/index.tsで定義):');
const expectedCategories = ['climate', 'industry', 'regions', 'prefecture', 'landforms', 'agriculture'];
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