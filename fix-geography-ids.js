const fs = require('fs');

console.log('🔧 地理問題のID連番修正を開始...');

const filePath = 'src/data/geography-enhanced.ts';
const content = fs.readFileSync(filePath, 'utf-8');

// geographyQuestions配列の開始と終了を見つける
const arrayStartText = 'export const geographyQuestions: GeographyQuestion[] = [';
const arrayStart = content.indexOf(arrayStartText);
const arrayStartBracket = content.indexOf('[', arrayStart);
const arrayEnd = content.indexOf('];', arrayStartBracket);

if (arrayStart === -1 || arrayEnd === -1) {
  console.error('❌ geographyQuestions配列が見つかりません');
  process.exit(1);
}

// 配列の前後の部分を保存
const beforeArray = content.substring(0, arrayStartBracket + 1);
const afterArray = content.substring(arrayEnd);

// 配列内容を取得
const arrayContent = content.substring(arrayStartBracket + 1, arrayEnd);

// 問題オブジェクトを正規表現で抽出
const questionObjects = [];
const questionPattern = /\{[^}]*id:\s*(\d+)[^}]*\}/gs;
let match;
let currentObject = '';
let braceCount = 0;
let inObject = false;

// より精密な問題オブジェクト抽出
const lines = arrayContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line === '{' || (line.includes('{') && !line.includes('}'))) {
    inObject = true;
    currentObject = line + '\n';
    braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
  } else if (inObject) {
    currentObject += line + '\n';
    braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    
    if (braceCount <= 0 || line.includes('}')) {
      inObject = false;
      // 問題オブジェクトが完了
      if (currentObject.includes('question:') && currentObject.includes('id:')) {
        questionObjects.push(currentObject.trim());
      }
      currentObject = '';
      braceCount = 0;
    }
  }
}

console.log(`📊 抽出された問題数: ${questionObjects.length}`);

// 各問題にシーケンシャルなIDを割り当て
const fixedQuestions = questionObjects.map((questionStr, index) => {
  const newId = index + 1;
  // IDを置換
  const fixedQuestion = questionStr.replace(/id:\s*\d+/, `id: ${newId}`);
  return fixedQuestion;
});

// 新しい配列内容を構築
const newArrayContent = fixedQuestions.join(',\n  ');

// ファイルを再構築
const newContent = beforeArray + '\n  ' + newArrayContent + '\n' + afterArray;

// ファイルに書き戻し
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log(`✅ 地理問題のID修正完了`);
console.log(`📊 修正後の問題数: ${fixedQuestions.length}`);
console.log(`🔢 ID範囲: 1 - ${fixedQuestions.length}`);
