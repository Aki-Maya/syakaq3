// Test geography question counting
const { geographyQuestions, getQuestionsByCategory } = require('./src/data/geography-enhanced.ts');

console.log('🔍 地理問題数チェック中...');

// Import is not working in Node.js for TS files, let me try a different approach
const fs = require('fs');

// Create a temporary JS file to test
const jsContent = `
const fs = require('fs');
const content = fs.readFileSync('./src/data/geography-enhanced.ts', 'utf-8');

// Extract questions manually
const questionMatches = [...content.matchAll(/\\{[^}]*id:\\s*(\\d+)[^}]*category:\\s*['\\"]([^'\\"]*)['\\"][^}]*\\}/gs)];

console.log('📊 地理問題統計:');
console.log(\`総問題数: \${questionMatches.length}問\`);

const categoryCount = {};
questionMatches.forEach(match => {
  const category = match[2];
  categoryCount[category] = (categoryCount[category] || 0) + 1;
});

console.log('\\n📋 カテゴリ別問題数:');
Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
  console.log(\`  \${category}: \${count}問\`);
});

console.log('\\n🏷️  期待されているカテゴリ:');
const expectedCategories = ['climate', 'industry', 'regions'];
expectedCategories.forEach(category => {
  const count = categoryCount[category] || 0;
  console.log(\`  \${category}: \${count}問\`);
});

const totalExpected = expectedCategories.reduce((sum, cat) => sum + (categoryCount[cat] || 0), 0);
console.log(\`\\n📈 期待されるカテゴリの合計: \${totalExpected}問\`);
console.log(\`📉 期待されないカテゴリの合計: \${questionMatches.length - totalExpected}問\`);
`;

fs.writeFileSync('./temp-check.js', jsContent);
require('./temp-check.js');
fs.unlinkSync('./temp-check.js');