const fs = require('fs');
const path = require('path');

const filePath = './src/data/geography-enhanced.ts';

console.log('🔧 地理問題ファイルの構文エラーを修正中...');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

console.log(`📄 ファイルサイズ: ${content.length} 文字`);

// Fix 1: Correct the array declaration
console.log('🛠️  配列定義を修正中...');
content = content.replace(
  'export const geographyQuestions: GeographyQuestion[',
  'export const geographyQuestions: GeographyQuestion[] = ['
);

// Fix 2: Remove double commas
console.log('🛠️  ダブルカンマを修正中...');
const doubleCommaCount = (content.match(/},,/g) || []).length;
console.log(`📝 発見されたダブルカンマ: ${doubleCommaCount}個`);

content = content.replace(/},\s*,/g, '},');

// Fix 3: Check for missing type property and add if necessary
console.log('🛠️  type プロパティを確認中...');
const questions = content.split(/{\s*id:/);
let fixedCount = 0;

for (let i = 1; i < questions.length; i++) {
  if (!questions[i].includes('type:')) {
    // Add type property before the closing brace
    questions[i] = questions[i].replace(/}$/, "type: 'multiple-choice' as const\n}");
    fixedCount++;
  }
}

if (fixedCount > 0) {
  content = questions.join('{\nid:');
  console.log(`📝 type プロパティを ${fixedCount} 個の問題に追加しました`);
}

// Count final questions
const questionCount = (content.match(/id:\s*\d+/g) || []).length;
console.log(`📊 最終問題数: ${questionCount}問`);

// Write the fixed file
fs.writeFileSync(filePath, content);

console.log('✅ 構文エラーの修正が完了しました！');
console.log(`📊 修正内容:`);
console.log(`   - 配列定義の修正: 1箇所`);
console.log(`   - ダブルカンマの削除: ${doubleCommaCount}箇所`);
console.log(`   - type プロパティの追加: ${fixedCount}箇所`);
console.log(`   - 最終問題数: ${questionCount}問`);