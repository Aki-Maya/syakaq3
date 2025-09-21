const fs = require('fs');

console.log('🧹 地理問題ファイルの形式を整理中...');

const filePath = './src/data/geography-enhanced.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Fix formatting issues
content = content
  // Fix trailing comma issues
  .replace(/difficulty:\s*['"][^'"]*['"],?\s*,\s*type:/g, "difficulty: '$1',\ntype:")
  .replace(/difficulty:\s*['"]([^'"]*)['"]\s*,\s*type:/g, "difficulty: '$1',\ntype:")
  .replace(/difficulty:\s*['"]([^'"]*)['"]\s*type:/g, "difficulty: '$1',\ntype:")
  // Fix line breaks around commas
  .replace(/\n\s*,\s*\ntype:/g, ',\ntype:')
  // Ensure proper comma before type
  .replace(/difficulty:\s*['"]([^'"]*)['"]\s*\ntype:/g, "difficulty: '$1',\ntype:")
  // Clean up double newlines
  .replace(/\n\n+/g, '\n');

// Now let's properly add type property to questions that don't have it
const lines = content.split('\n');
const processedLines = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  
  // If this line contains "difficulty:" and is not followed by "type:", add it
  if (line.includes('difficulty:') && line.includes("'") || line.includes('"')) {
    processedLines.push(line.replace(/,$/, '') + ','); // Ensure comma
    
    // Check if next few lines contain "type:"
    let hasType = false;
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      if (lines[j].includes('type:')) {
        hasType = true;
        break;
      }
      if (lines[j].includes('id:')) {
        break; // Reached next question
      }
    }
    
    if (!hasType) {
      processedLines.push("type: 'multiple-choice' as const");
    }
  } else {
    processedLines.push(line);
  }
  
  i++;
}

content = processedLines.join('\n');

// Final cleanup
content = content
  .replace(/difficulty:\s*['"]([^'"]*)['"]\s*,\s*,/g, "difficulty: '$1',")
  .replace(/,\s*,/g, ',')
  .replace(/}\s*,\s*{/g, '},\n{');

fs.writeFileSync(filePath, content);

console.log('✅ 形式整理完了！');

// Count questions
const questionsWithType = (content.match(/type:\s*['"]multiple-choice['"](\s*as\s*const)?/g) || []).length;
const totalQuestions = (content.match(/{\s*id:\s*\d+/g) || []).length;

console.log(`📊 統計:`);
console.log(`   - 総問題数: ${totalQuestions}問`);
console.log(`   - type プロパティあり: ${questionsWithType}問`);