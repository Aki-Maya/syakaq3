const fs = require('fs');

const filePath = './src/data/geography-enhanced.ts';

console.log('🔧 地理問題にtype プロパティを追加中...');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Add type property to all questions that don't have it
// Match question blocks and add type property before the closing brace
content = content.replace(
  /(\{\s*id:\s*\d+[^}]*difficulty:\s*['"][^'"]*['"][^}]*)(,?\s*\})/g,
  (match, questionContent, closingBrace) => {
    if (!questionContent.includes('type:')) {
      // Add type property with proper comma handling
      const hasCommaAtEnd = questionContent.trim().endsWith(',');
      const comma = hasCommaAtEnd ? '' : ',';
      return questionContent + comma + '\ntype: \'multiple-choice\' as const\n}';
    }
    return match;
  }
);

// Also handle cases where the structure might be different
content = content.replace(
  /(\{\s*id:\s*\d+[^}]*explanation:\s*['"][^'"]*['"][^}]*)(,?\s*\})/g,
  (match, questionContent, closingBrace) => {
    if (!questionContent.includes('type:')) {
      const hasCommaAtEnd = questionContent.trim().endsWith(',');
      const comma = hasCommaAtEnd ? '' : ',';
      return questionContent + comma + '\ntype: \'multiple-choice\' as const\n}';
    }
    return match;
  }
);

// Write the fixed file
fs.writeFileSync(filePath, content);

console.log('✅ type プロパティの追加が完了しました！');

// Verify by counting questions with type property
const questionsWithType = (content.match(/type:\s*['"]multiple-choice['"](\s*as\s*const)?/g) || []).length;
const totalQuestions = (content.match(/id:\s*\d+/g) || []).length;

console.log(`📊 統計:`);
console.log(`   - 総問題数: ${totalQuestions}問`);
console.log(`   - type プロパティあり: ${questionsWithType}問`);
console.log(`   - type プロパティなし: ${totalQuestions - questionsWithType}問`);