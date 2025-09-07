const fs = require('fs');

console.log('🔍 現在のファイル構成と分類問題を分析中...\n');

// 地理問題の分析
console.log('🗾 地理問題の分類分析:');
const geoContent = fs.readFileSync('./src/data/geography-enhanced.ts', 'utf-8');
const geoMatches = [...geoContent.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];

const geoCategories = {};
geoMatches.forEach(match => {
  const id = parseInt(match[1]);
  const category = match[2];
  if (!geoCategories[category]) geoCategories[category] = [];
  geoCategories[category].push(id);
});

console.log('地理カテゴリ:');
Object.entries(geoCategories).forEach(([cat, ids]) => {
  console.log(`  ${cat}: ${ids.length}問 (ID範囲: ${Math.min(...ids)}-${Math.max(...ids)})`);
});

// 歴史問題の分析
console.log('\n📜 歴史問題の分類分析:');
const histContent = fs.readFileSync('./src/data/history.ts', 'utf-8');
const histMatches = [...histContent.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];

const histCategories = {};
const histEras = {};
// era情報も抽出
const histEraMatches = [...histContent.matchAll(/\{\s*id:\s*(\d+)[^}]*era:\s*['"]([^'"]*)['"]/gs)];
histEraMatches.forEach(match => {
  const id = parseInt(match[1]);
  const era = match[2];
  histEras[id] = era;
});

histMatches.forEach(match => {
  const id = parseInt(match[1]);
  const category = match[2];
  if (!histCategories[category]) histCategories[category] = [];
  histCategories[category].push(id);
});

console.log('歴史カテゴリ:');
Object.entries(histCategories).forEach(([cat, ids]) => {
  console.log(`  ${cat}: ${ids.length}問 (ID範囲: ${Math.min(...ids)}-${Math.max(...ids)})`);
});

// 公民問題の分析
console.log('\n🏛️ 公民問題の分類分析:');
const civContent = fs.readFileSync('./src/data/civics.ts', 'utf-8');
const civMatches = [...civContent.matchAll(/\{\s*id:\s*(\d+)[^}]*category:\s*['"]([^'"]*)['"]/gs)];

const civCategories = {};
civMatches.forEach(match => {
  const id = parseInt(match[1]);
  const category = match[2];
  if (!civCategories[category]) civCategories[category] = [];
  civCategories[category].push(id);
});

console.log('公民カテゴリ:');
Object.entries(civCategories).forEach(([cat, ids]) => {
  console.log(`  ${cat}: ${ids.length}問 (ID範囲: ${Math.min(...ids)}-${Math.max(...ids)})`);
});

// 問題のある分類例を特定
console.log('\n⚠️ 分類上の問題点:');

// 地理に含まれているが他分野の可能性があるもの
console.log('\n1. 地理ファイルに含まれる疑問のある問題:');
const questionableGeo = geoMatches.filter(match => {
  const questionText = geoContent.substring(match.index, match.index + 200);
  return questionText.includes('フードマイレージ') || 
         questionText.includes('工業') || 
         questionText.includes('産業');
}).slice(0, 3);

questionableGeo.forEach(match => {
  const questionText = geoContent.substring(match.index, match.index + 100).replace(/\n/g, ' ');
  console.log(`  ID ${match[1]}: ${questionText.substring(0, 60)}...`);
});

// 歴史の年代分類の確認
console.log('\n2. 歴史問題の年代分類確認:');
const eraInfo = {
  'primitive': '〜約2400年前（旧石器・縄文・弥生）',
  'ancient': '約2400年前〜1185年（古墳・飛鳥・奈良・平安）',
  'medieval': '1185年〜1573年（鎌倉・南北朝・室町）',
  'early-modern': '1573年〜1867年（安土桃山・江戸）',
  'modern': '1868年〜1945年（明治・大正・昭和戦前）',
  'contemporary': '1945年〜現在（昭和戦後・平成・令和）'
};

Object.entries(histCategories).forEach(([cat, ids]) => {
  if (eraInfo[cat]) {
    console.log(`  ${cat}: ${eraInfo[cat]} → ${ids.length}問`);
  } else {
    console.log(`  ${cat}: 【年代不明・要分類見直し】 → ${ids.length}問`);
  }
});

console.log('\n📊 推奨される改善方向性:');
console.log('1. 統一ファイル vs 分離ファイル構成の検討');
console.log('2. 学習指導要領に基づいた正確な分類体系の構築'); 
console.log('3. ID番号体系の見直し（科目・分野・年代別の系統的番号付け）');
console.log('4. クロスカテゴリ問題の適切な分類方法の設計');