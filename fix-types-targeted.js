const fs = require('fs');

const filePath = './src/data/geography-enhanced.ts';

console.log('🔧 地理問題を個別に修正中...');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Find the geography questions array section
const arrayStart = content.indexOf('export const geographyQuestions: GeographyQuestion[] = [');
const arrayEnd = content.indexOf('];', arrayStart);

if (arrayStart === -1 || arrayEnd === -1) {
  console.error('❌ geographyQuestions 配列が見つかりませんでした');
  process.exit(1);
}

const beforeArray = content.substring(0, arrayStart);
const arrayContent = content.substring(arrayStart, arrayEnd + 2);
const afterArray = content.substring(arrayEnd + 2);

console.log('📝 配列の範囲を特定しました');

// Split into individual questions and process each one
const lines = arrayContent.split('\n');
let inQuestion = false;
let questionLines = [];
let processedLines = [];
let questionsFixed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('export const geographyQuestions') || line.trim() === '];') {
    processedLines.push(line);
    continue;
  }
  
  if (line.trim().startsWith('{')) {
    // Start of a new question
    if (questionLines.length > 0) {
      // Process previous question
      const processedQuestion = processQuestion(questionLines);
      processedLines.push(...processedQuestion);
      if (processedQuestion.some(l => l.includes('type:')) && 
          !questionLines.some(l => l.includes('type:'))) {
        questionsFixed++;
      }
    }
    questionLines = [line];
    inQuestion = true;
  } else if (line.trim().startsWith('}')) {
    // End of question
    questionLines.push(line);
    const processedQuestion = processQuestion(questionLines);
    processedLines.push(...processedQuestion);
    if (processedQuestion.some(l => l.includes('type:')) && 
        !questionLines.some(l => l.includes('type:'))) {
      questionsFixed++;
    }
    questionLines = [];
    inQuestion = false;
  } else if (inQuestion) {
    questionLines.push(line);
  } else {
    processedLines.push(line);
  }
}

function processQuestion(questionLines) {
  const hasType = questionLines.some(line => line.includes('type:'));
  if (hasType) {
    return questionLines;
  }
  
  // Find the closing brace and add type property before it
  const result = [...questionLines];
  const closingBraceIndex = result.findIndex(line => line.trim().startsWith('}'));
  
  if (closingBraceIndex !== -1) {
    // Check if the line before closing brace ends with comma
    const beforeClosingIndex = closingBraceIndex - 1;
    if (beforeClosingIndex >= 0) {
      let beforeClosingLine = result[beforeClosingIndex];
      if (!beforeClosingLine.trim().endsWith(',')) {
        result[beforeClosingIndex] = beforeClosingLine + ',';
      }
    }
    
    // Insert type property before closing brace
    result.splice(closingBraceIndex, 0, "type: 'multiple-choice' as const");
  }
  
  return result;
}

// Reconstruct the content
const newContent = beforeArray + processedLines.join('\n') + afterArray;

// Write the fixed file
fs.writeFileSync(filePath, newContent);

console.log(`✅ 修正完了: ${questionsFixed} 問題に type プロパティを追加しました`);

// Verify
const finalContent = fs.readFileSync(filePath, 'utf-8');
const questionsWithType = (finalContent.match(/type:\s*['"]multiple-choice['"](\s*as\s*const)?/g) || []).length;
const totalQuestions = (finalContent.match(/{\s*id:\s*\d+/g) || []).length;

console.log(`📊 最終統計:`);
console.log(`   - 総問題数: ${totalQuestions}問`);
console.log(`   - type プロパティあり: ${questionsWithType}問`);
console.log(`   - 修正が必要な問題: ${totalQuestions - questionsWithType}問`);