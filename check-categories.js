// カテゴリー分類の適切性チェックスクリプト
const fs = require('fs');
const path = require('path');

function checkCategories() {
  console.log('🏷️  カテゴリー分類の適切性をチェックします...\n');
  
  const dataDir = path.join(__dirname, 'src', 'data');
  
  // 各科目の問題を抽出してカテゴリーをチェック
  console.log('📋 地理問題のカテゴリーチェック:');
  checkGeographyCategories(path.join(dataDir, 'geography-enhanced.ts'));
  
  console.log('\n📋 歴史問題のカテゴリーチェック:');
  checkHistoryCategories(path.join(dataDir, 'history.ts'));
  
  console.log('\n📋 公民問題のカテゴリーチェック:');
  checkCivicsCategories(path.join(dataDir, 'civics.ts'));
}

function extractProblems(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 問題オブジェクトを抽出
  const questionPattern = /{[\s\S]*?id:\s*(\d+)[\s\S]*?question:\s*['"]([^'"]+)['"][\s\S]*?category:\s*['"]([^'"]+)['"][\s\S]*?difficulty:\s*['"]([^'"]+)['"][\s\S]*?}/g;
  
  const problems = [];
  let match;
  
  while ((match = questionPattern.exec(content)) !== null) {
    const [, id, question, category, difficulty] = match;
    problems.push({
      id: parseInt(id),
      question,
      category,
      difficulty
    });
  }
  
  return problems;
}

function checkGeographyCategories(filePath) {
  const problems = extractProblems(filePath);
  
  // 地理の期待カテゴリー
  const validCategories = ['climate', 'industry', 'regions', 'prefecture'];
  const categoryCount = {};
  const categoryIssues = [];
  
  problems.forEach(problem => {
    // カテゴリーカウント
    categoryCount[problem.category] = (categoryCount[problem.category] || 0) + 1;
    
    // カテゴリー適切性チェック
    if (!validCategories.includes(problem.category)) {
      categoryIssues.push({
        id: problem.id,
        question: problem.question.substring(0, 50) + '...',
        category: problem.category,
        suggestion: suggestGeographyCategory(problem.question)
      });
    } else {
      // カテゴリー内容の適切性チェック
      const suggested = suggestGeographyCategory(problem.question);
      if (suggested !== problem.category) {
        categoryIssues.push({
          id: problem.id,
          question: problem.question.substring(0, 50) + '...',
          category: problem.category,
          suggestion: suggested,
          type: 'mismatch'
        });
      }
    }
  });
  
  console.log('  📊 カテゴリー分布:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`    ${category}: ${count}問`);
  });
  
  if (categoryIssues.length === 0) {
    console.log('  ✅ カテゴリー分類に問題なし');
  } else {
    console.log(`  ⚠️  ${categoryIssues.length}件のカテゴリー問題を発見:`);
    categoryIssues.slice(0, 5).forEach(issue => {
      console.log(`    ID ${issue.id}: "${issue.question}"`);
      console.log(`      現在: "${issue.category}" → 提案: "${issue.suggestion}"`);
    });
    if (categoryIssues.length > 5) {
      console.log(`    ... 他 ${categoryIssues.length - 5}件`);
    }
  }
}

function checkHistoryCategories(filePath) {
  const problems = extractProblems(filePath);
  
  // 歴史の期待カテゴリー（時代区分）
  const validCategories = ['primitive', 'ancient', 'medieval', 'early-modern', 'modern', 'contemporary'];
  const categoryCount = {};
  const categoryIssues = [];
  
  problems.forEach(problem => {
    categoryCount[problem.category] = (categoryCount[problem.category] || 0) + 1;
    
    if (!validCategories.includes(problem.category)) {
      categoryIssues.push({
        id: problem.id,
        question: problem.question.substring(0, 50) + '...',
        category: problem.category,
        suggestion: suggestHistoryCategory(problem.question)
      });
    }
  });
  
  console.log('  📊 時代区分別分布:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    const categoryNames = {
      'primitive': '原始',
      'ancient': '古代', 
      'medieval': '中世',
      'early-modern': '近世',
      'modern': '近代',
      'contemporary': '現代'
    };
    console.log(`    ${categoryNames[category] || category}: ${count}問`);
  });
  
  if (categoryIssues.length === 0) {
    console.log('  ✅ 時代区分に問題なし');
  } else {
    console.log(`  ⚠️  ${categoryIssues.length}件の時代区分問題を発見:`);
    categoryIssues.forEach(issue => {
      console.log(`    ID ${issue.id}: "${issue.question}"`);
      console.log(`      現在: "${issue.category}" → 提案: "${issue.suggestion}"`);
    });
  }
}

function checkCivicsCategories(filePath) {
  const problems = extractProblems(filePath);
  
  // 公民の期待カテゴリー
  const validCategories = ['politics', 'human-rights', 'economics', 'constitution', 'international'];
  const categoryCount = {};
  const categoryIssues = [];
  
  problems.forEach(problem => {
    categoryCount[problem.category] = (categoryCount[problem.category] || 0) + 1;
    
    if (!validCategories.includes(problem.category)) {
      categoryIssues.push({
        id: problem.id,
        question: problem.question.substring(0, 50) + '...',
        category: problem.category,
        suggestion: suggestCivicsCategory(problem.question)
      });
    }
  });
  
  console.log('  📊 分野別分布:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    const categoryNames = {
      'politics': '政治制度',
      'human-rights': '人権',
      'economics': '経済',
      'constitution': '憲法',
      'international': '国際関係'
    };
    console.log(`    ${categoryNames[category] || category}: ${count}問`);
  });
  
  if (categoryIssues.length === 0) {
    console.log('  ✅ 分野分類に問題なし');
  } else {
    console.log(`  ⚠️  ${categoryIssues.length}件の分野分類問題を発見:`);
    categoryIssues.forEach(issue => {
      console.log(`    ID ${issue.id}: "${issue.question}"`);
      console.log(`      現在: "${issue.category}" → 提案: "${issue.suggestion}"`);
    });
  }
}

// カテゴリー提案関数
function suggestGeographyCategory(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('気候') || lowerQuestion.includes('降水') || lowerQuestion.includes('台風') || lowerQuestion.includes('季節風')) {
    return 'climate';
  }
  if (lowerQuestion.includes('工業') || lowerQuestion.includes('産業') || lowerQuestion.includes('輸入') || lowerQuestion.includes('輸出') || lowerQuestion.includes('フード')) {
    return 'industry';
  }
  if (lowerQuestion.includes('県') || lowerQuestion.includes('市') || lowerQuestion.includes('都道府県')) {
    return 'prefecture';
  }
  if (lowerQuestion.includes('地方') || lowerQuestion.includes('地域') || lowerQuestion.includes('名園') || lowerQuestion.includes('郷土料理') || lowerQuestion.includes('工芸品')) {
    return 'regions';
  }
  
  return 'regions'; // デフォルト
}

function suggestHistoryCategory(question) {
  // 簡易的な時代判定（キーワードベース）
  if (question.includes('縄文') || question.includes('弥生') || question.includes('古墳')) {
    return 'primitive';
  }
  if (question.includes('飛鳥') || question.includes('奈良') || question.includes('平安')) {
    return 'ancient';
  }
  if (question.includes('鎌倉') || question.includes('室町') || question.includes('戦国')) {
    return 'medieval';
  }
  if (question.includes('江戸') || question.includes('徳川') || question.includes('幕末')) {
    return 'early-modern';
  }
  if (question.includes('明治') || question.includes('大正') || question.includes('昭和初期')) {
    return 'modern';
  }
  if (question.includes('戦後') || question.includes('現代')) {
    return 'contemporary';
  }
  
  return 'ancient'; // デフォルト
}

function suggestCivicsCategory(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('憲法') || lowerQuestion.includes('三大原則') || lowerQuestion.includes('人権')) {
    return 'human-rights';
  }
  if (lowerQuestion.includes('国会') || lowerQuestion.includes('内閣') || lowerQuestion.includes('裁判所') || lowerQuestion.includes('三権') || lowerQuestion.includes('選挙')) {
    return 'politics';
  }
  if (lowerQuestion.includes('税') || lowerQuestion.includes('経済') || lowerQuestion.includes('労働')) {
    return 'economics';
  }
  if (lowerQuestion.includes('国際') || lowerQuestion.includes('国連') || lowerQuestion.includes('世界')) {
    return 'international';
  }
  
  return 'politics'; // デフォルト
}

// 実行
if (require.main === module) {
  checkCategories();
  
  console.log('\n✅ カテゴリーチェック完了！');
}

module.exports = { checkCategories };