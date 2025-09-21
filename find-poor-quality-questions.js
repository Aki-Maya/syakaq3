const fs = require('fs');

console.log('🔍 品質の低い問題を特定中...\n');

// Check geography questions
console.log('🗾 地理問題の品質チェック:');
const geoContent = fs.readFileSync('./src/data/geography-enhanced.ts', 'utf-8');
const geoMatches = [...geoContent.matchAll(/\{\s*id:\s*(\d+)[^}]*question:\s*['"`]([^'"`]*?)['"`][^}]*explanation:\s*['"`]([^'"`]*?)['"`][^}]*\}/gs)];

console.log(`総問題数: ${geoMatches.length}問`);

// Check for short explanations (less than 50 characters)
const shortExplanations = [];
const vagueQuestions = [];

geoMatches.forEach(match => {
  const id = parseInt(match[1]);
  const question = match[2];
  const explanation = match[3];
  
  if (explanation.length < 50) {
    shortExplanations.push({id, question: question.substring(0, 50) + '...', explanation, length: explanation.length});
  }
  
  // Check for vague questions
  if (question.includes('について') && question.length < 30) {
    vagueQuestions.push({id, question, explanation});
  }
});

console.log(`⚠️  短すぎる解説 (50文字未満): ${shortExplanations.length}問`);
shortExplanations.slice(0, 5).forEach(q => {
  console.log(`  ID ${q.id}: "${q.explanation}" (${q.length}文字)`);
});

console.log(`⚠️  曖昧な問題文: ${vagueQuestions.length}問`);
vagueQuestions.slice(0, 3).forEach(q => {
  console.log(`  ID ${q.id}: "${q.question}"`);
});

// Check history
console.log('\n📜 歴史問題の品質チェック:');
const histContent = fs.readFileSync('./src/data/history.ts', 'utf-8');
const histMatches = [...histContent.matchAll(/\{\s*id:\s*(\d+)[^}]*question:\s*['"`]([^'"`]*?)['"`][^}]*explanation:\s*['"`]([^'"`]*?)['"`][^}]*\}/gs)];

console.log(`総問題数: ${histMatches.length}問`);

const histShortExplanations = [];
histMatches.forEach(match => {
  const id = parseInt(match[1]);
  const question = match[2];
  const explanation = match[3];
  
  if (explanation.length < 60) {
    histShortExplanations.push({id, question: question.substring(0, 50) + '...', explanation, length: explanation.length});
  }
});

console.log(`⚠️  短すぎる解説 (60文字未満): ${histShortExplanations.length}問`);
histShortExplanations.slice(0, 5).forEach(q => {
  console.log(`  ID ${q.id}: "${q.explanation}" (${q.length}文字)`);
});

// Check civics
console.log('\n🏛️ 公民問題の品質チェック:');
const civContent = fs.readFileSync('./src/data/civics.ts', 'utf-8');
const civMatches = [...civContent.matchAll(/\{\s*id:\s*(\d+)[^}]*question:\s*['"`]([^'"`]*?)['"`][^}]*explanation:\s*['"`]([^'"`]*?)['"`][^}]*\}/gs)];

console.log(`総問題数: ${civMatches.length}問`);

const civShortExplanations = [];
civMatches.forEach(match => {
  const id = parseInt(match[1]);
  const question = match[2];
  const explanation = match[3];
  
  if (explanation.length < 50) {
    civShortExplanations.push({id, question: question.substring(0, 50) + '...', explanation, length: explanation.length});
  }
});

console.log(`⚠️  短すぎる解説 (50文字未満): ${civShortExplanations.length}問`);
civShortExplanations.slice(0, 5).forEach(q => {
  console.log(`  ID ${q.id}: "${q.explanation}" (${q.length}文字)`);
});

console.log('\n📊 修正対象サマリー:');
console.log(`🗾 地理: ${shortExplanations.length + vagueQuestions.length}問要修正`);
console.log(`📜 歴史: ${histShortExplanations.length}問要修正`);
console.log(`🏛️ 公民: ${civShortExplanations.length}問要修正`);
console.log(`📈 総修正対象: ${shortExplanations.length + vagueQuestions.length + histShortExplanations.length + civShortExplanations.length}問`);