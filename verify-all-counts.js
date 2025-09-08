const fs = require('fs');

console.log('📊 全科目の問題数検証中...\n');

// Geography
console.log('🗾 地理問題:');
const geoContent = fs.readFileSync('./src/data/geography-enhanced.ts', 'utf-8');
const geoMatches = [...geoContent.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];
const geoCategories = ['climate', 'industry', 'regions', 'prefecture', 'landforms', 'agriculture'];
const geoCounts = {};
geoMatches.forEach(match => {
  const category = match[2];
  geoCounts[category] = (geoCounts[category] || 0) + 1;
});
let geoTotal = geoCategories.reduce((sum, cat) => sum + (geoCounts[cat] || 0), 0);
console.log(`  総問題数: ${geoMatches.length}問 -> カウント対象: ${geoTotal}問`);

// History
console.log('\n📜 歴史問題:');
const histContent = fs.readFileSync('./src/data/history.ts', 'utf-8');
const histMatches = [...histContent.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];
const histCategories = ['primitive', 'ancient', 'medieval', 'early-modern', 'modern', 'contemporary', 'general'];
const histCounts = {};
histMatches.forEach(match => {
  const category = match[2];
  histCounts[category] = (histCounts[category] || 0) + 1;
});
let histTotal = histCategories.reduce((sum, cat) => sum + (histCounts[cat] || 0), 0);
console.log(`  総問題数: ${histMatches.length}問 -> カウント対象: ${histTotal}問`);

// Civics
console.log('\n🏛️ 公民問題:');
const civContent = fs.readFileSync('./src/data/civics.ts', 'utf-8');
const civMatches = [...civContent.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];
const civCategories = ['politics', 'human-rights', 'economics', 'constitution', 'general'];
const civCounts = {};
civMatches.forEach(match => {
  const category = match[2];
  civCounts[category] = (civCounts[category] || 0) + 1;
});
let civTotal = civCategories.reduce((sum, cat) => sum + (civCounts[cat] || 0), 0);
console.log(`  総問題数: ${civMatches.length}問 -> カウント対象: ${civTotal}問`);

console.log('\n✨ 修正結果サマリー:');
console.log(`🗾 地理: ${geoTotal}問 (修正前: 64問 -> ${geoTotal - 64}問増加)`);
console.log(`📜 歴史: ${histTotal}問 (修正前: 73問 -> ${histTotal - 73}問増加)`);
console.log(`🏛️ 公民: ${civTotal}問 (修正前: 32問 -> ${civTotal - 32}問増加)`);
console.log(`📈 総合計: ${geoTotal + histTotal + civTotal}問`);

// Show category details
console.log('\n📋 詳細カテゴリ別問題数:');
console.log('地理:');
geoCategories.forEach(cat => {
  console.log(`  ${cat}: ${geoCounts[cat] || 0}問`);
});
console.log('歴史:');
histCategories.forEach(cat => {
  console.log(`  ${cat}: ${histCounts[cat] || 0}問`);
});
console.log('公民:');
civCategories.forEach(cat => {
  console.log(`  ${cat}: ${civCounts[cat] || 0}問`);
});