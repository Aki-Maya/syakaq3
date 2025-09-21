const fs = require('fs');

console.log('🔧 地理問題配列を完全に再構築中...');

const filePath = './src/data/geography-enhanced.ts';
const content = fs.readFileSync(filePath, 'utf-8');

// Find the array boundaries
const arrayStartIndex = content.indexOf('export const geographyQuestions: GeographyQuestion[] = [');
const arrayEndIndex = content.indexOf('];', arrayStartIndex) + 2;

if (arrayStartIndex === -1 || arrayEndIndex === -1) {
  console.error('❌ 配列の境界が見つかりませんでした');
  process.exit(1);
}

const beforeArray = content.substring(0, arrayStartIndex);
const arrayContent = content.substring(arrayStartIndex, arrayEndIndex);
const afterArray = content.substring(arrayEndIndex);

console.log('📝 配列の境界を特定しました');

// Extract all question objects from the array content
const questionMatches = [...arrayContent.matchAll(/{\s*id:\s*(\d+)[^}]*}/gs)];
console.log(`🔍 発見された問題候補: ${questionMatches.length}個`);

// Extract more carefully by parsing the structure
const questions = [];
let currentQuestion = null;
let inQuestion = false;
let braceCount = 0;
let lines = arrayContent.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.includes('export const geographyQuestions') || line === '];') {
    continue;
  }
  
  if (line.startsWith('{') && line.includes('id:')) {
    // Start of a question object
    currentQuestion = { lines: [], startLine: i };
    inQuestion = true;
    braceCount = 1;
    currentQuestion.lines.push(lines[i]);
  } else if (inQuestion) {
    currentQuestion.lines.push(lines[i]);
    
    // Count braces to determine end
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    if (braceCount === 0) {
      // End of question object
      questions.push(currentQuestion);
      currentQuestion = null;
      inQuestion = false;
    }
  }
}

console.log(`📊 抽出された問題数: ${questions.length}問`);

// Parse each question to extract data
const parsedQuestions = [];

for (const questionObj of questions) {
  const questionText = questionObj.lines.join('\n');
  
  // Extract ID
  const idMatch = questionText.match(/id:\s*(\d+)/);
  if (!idMatch) continue;
  
  // Extract question content
  const questionMatch = questionText.match(/question:\s*['"`]([^'"`]*?)['"`]/s);
  const optionsMatch = questionText.match(/options:\s*\[(.*?)\]/s);
  const correctMatch = questionText.match(/correct:\s*(\d+)/);
  const explanationMatch = questionText.match(/explanation:\s*['"`]([^'"`]*?)['"`]/s);
  const categoryMatch = questionText.match(/category:\s*['"`]([^'"`]*?)['"`]/);
  const difficultyMatch = questionText.match(/difficulty:\s*['"`]([^'"`]*?)['"`]/);
  
  if (questionMatch && optionsMatch && correctMatch && explanationMatch && categoryMatch && difficultyMatch) {
    // Parse options array
    const optionsText = optionsMatch[1];
    const options = [];
    const optionMatches = [...optionsText.matchAll(/['"`]([^'"`]*?)['"`]/g)];
    for (const match of optionMatches) {
      options.push(match[1]);
    }
    
    if (options.length >= 2) {
      parsedQuestions.push({
        id: parseInt(idMatch[1]),
        question: questionMatch[1],
        options: options,
        correct: parseInt(correctMatch[1]),
        explanation: explanationMatch[1],
        category: categoryMatch[1],
        difficulty: difficultyMatch[1],
        type: 'multiple-choice'
      });
    }
  }
}

console.log(`✅ パースされた有効な問題数: ${parsedQuestions.length}問`);

// Sort by ID and renumber sequentially
parsedQuestions.sort((a, b) => a.id - b.id);
for (let i = 0; i < parsedQuestions.length; i++) {
  parsedQuestions[i].id = i + 1;
}

console.log(`🔢 ID を 1-${parsedQuestions.length} に再番号付けしました`);

// Generate the new array content
const newArrayContent = `export const geographyQuestions: GeographyQuestion[] = [
${parsedQuestions.map(q => `  {
    id: ${q.id},
    question: '${q.question}',
    options: [${q.options.map(opt => `'${opt}'`).join(', ')}],
    correct: ${q.correct},
    explanation: '${q.explanation}',
    category: '${q.category}',
    difficulty: '${q.difficulty}' as const,
    type: '${q.type}' as const
  }`).join(',\n')}
];`;

// Reconstruct the file
const newContent = beforeArray + newArrayContent + afterArray;

// Write the file
fs.writeFileSync(filePath, newContent);

console.log('🎉 地理問題配列の再構築が完了しました！');
console.log(`📊 最終統計:`);
console.log(`   - 問題数: ${parsedQuestions.length}問`);
console.log(`   - カテゴリ分布:`);

const categoryCount = {};
parsedQuestions.forEach(q => {
  categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
});

Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`     - ${category}: ${count}問`);
});