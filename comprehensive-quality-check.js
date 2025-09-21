// 包括的品質検査ツール - ShakaQuest問題データベース
// 教育的価値の低い問題を特定し、高品質問題のみを抽出

const fs = require('fs');

// 問題データを読み込み
const questionsContent = fs.readFileSync('./src/data/questions-unified.ts', 'utf8');

// データ抽出用の正規表現パターン
const questionPattern = /{\s*"id":\s*"([^"]+)",[\s\S]*?"question":\s*"([^"]+)",[\s\S]*?"options":\s*\[([\s\S]*?)\],[\s\S]*?"correct":\s*(\d+),[\s\S]*?"explanation":\s*"([^"]*)"[\s\S]*?}/g;

let questions = [];
let match;

// 質問データの抽出
while ((match = questionPattern.exec(questionsContent)) !== null) {
  try {
    const optionsStr = match[3];
    const optionsMatches = optionsStr.match(/"([^"]*)"/g);
    const options = optionsMatches ? optionsMatches.map(opt => opt.replace(/"/g, '')) : [];
    
    if (options.length >= 4) {
      questions.push({
        id: match[1],
        question: match[2],
        options: options,
        correct: parseInt(match[4]),
        explanation: match[5]
      });
    }
  } catch (error) {
    console.log(`Error parsing question ${match[1]}: ${error.message}`);
  }
}

console.log(`✅ 抽出された問題数: ${questions.length}`);

// 品質検査基準
const qualityChecks = {
  
  // 1. 「A はどれですか？答え『A』」パターン
  selfAnswerPattern: (q) => {
    const question = q.question.toLowerCase();
    const correctOption = q.options[q.correct].toLowerCase();
    
    // 問題文に含まれる主要キーワードが正解選択肢にそのまま含まれている
    const questionKeywords = question.match(/[ぁ-んァ-ヶー一-龯]+/g) || [];
    const hasDirectMatch = questionKeywords.some(keyword => 
      keyword.length > 2 && correctOption.includes(keyword.toLowerCase())
    );
    
    return hasDirectMatch;
  },
  
  // 2. 関係ない単語の組み合わせ
  irrelevantOptions: (q) => {
    const options = q.options;
    const categories = {
      people: ['天皇', '将軍', '大臣', '政治家', '武将', '貴族'],
      periods: ['時代', '世紀', '年代', '期間', '世', '代'],
      places: ['地域', '県', '市', '国', '大陸', '島'],
      concepts: ['主義', '制度', '法', '条約', '政策', '思想']
    };
    
    let categoryCounts = {};
    
    options.forEach(option => {
      Object.keys(categories).forEach(category => {
        if (categories[category].some(keyword => option.includes(keyword))) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
    });
    
    // 3つ以上の異なるカテゴリが混在している場合は問題
    return Object.keys(categoryCounts).length >= 3;
  },
  
  // 3. 選択肢が論理的でない
  illogicalOptions: (q) => {
    const question = q.question;
    const options = q.options;
    
    // 人物について聞いているのに時代や場所が選択肢にある
    if (question.includes('について') || question.includes('に関して')) {
      const hasTimeOrPlace = options.some(opt => 
        opt.includes('時代') || opt.includes('世紀') || opt.includes('県') || 
        opt.includes('地域') || opt.includes('気候') || opt.includes('世')
      );
      return hasTimeOrPlace;
    }
    
    return false;
  },
  
  // 4. 説明が不十分
  poorExplanation: (q) => {
    const explanation = q.explanation;
    return explanation.length < 20 || 
           explanation.includes('について詳しく学習しましょう') ||
           explanation.includes('重要なポイントです') ||
           !explanation.includes('。');
  },
  
  // 5. 教育的価値のテスト
  educationalValue: (q) => {
    const question = q.question;
    const options = q.options;
    
    // 具体的な知識を問う問題かチェック
    const hasSpecificContent = question.includes('何') || 
                              question.includes('どこ') || 
                              question.includes('いつ') || 
                              question.includes('誰') ||
                              question.includes('どのような');
    
    // 選択肢が同じカテゴリの具体的な内容か
    const allOptionsSpecific = options.every(opt => opt.length > 1 && opt.length < 15);
    
    return hasSpecificContent && allOptionsSpecific;
  }
};

// 品質検査実行
let lowQualityQuestions = [];
let highQualityQuestions = [];

questions.forEach(q => {
  let qualityIssues = [];
  
  if (qualityChecks.selfAnswerPattern(q)) {
    qualityIssues.push('自己答えパターン（問題文の単語がそのまま答え）');
  }
  
  if (qualityChecks.irrelevantOptions(q)) {
    qualityIssues.push('関係ない単語の組み合わせ');
  }
  
  if (qualityChecks.illogicalOptions(q)) {
    qualityIssues.push('選択肢が論理的でない');
  }
  
  if (qualityChecks.poorExplanation(q)) {
    qualityIssues.push('説明が不十分');
  }
  
  if (!qualityChecks.educationalValue(q)) {
    qualityIssues.push('教育的価値が低い');
  }
  
  if (qualityIssues.length > 0) {
    lowQualityQuestions.push({
      ...q,
      issues: qualityIssues
    });
  } else {
    highQualityQuestions.push(q);
  }
});

// 結果レポート
console.log('\n🔍 品質検査結果');
console.log('='.repeat(50));
console.log(`📊 総問題数: ${questions.length}`);
console.log(`❌ 低品質問題: ${lowQualityQuestions.length} (${(lowQualityQuestions.length/questions.length*100).toFixed(1)}%)`);
console.log(`✅ 高品質問題: ${highQualityQuestions.length} (${(highQualityQuestions.length/questions.length*100).toFixed(1)}%)`);

console.log('\n🚨 低品質問題の例 (最初の10問):');
lowQualityQuestions.slice(0, 10).forEach((q, index) => {
  console.log(`\n${index + 1}. ID: ${q.id}`);
  console.log(`   問題: ${q.question}`);
  console.log(`   選択肢: [${q.options.join(', ')}]`);
  console.log(`   正解: ${q.options[q.correct]}`);
  console.log(`   問題点: ${q.issues.join(', ')}`);
});

console.log('\n✨ 高品質問題の例 (最初の5問):');
highQualityQuestions.slice(0, 5).forEach((q, index) => {
  console.log(`\n${index + 1}. ID: ${q.id}`);
  console.log(`   問題: ${q.question}`);
  console.log(`   選択肢: [${q.options.join(', ')}]`);
  console.log(`   正解: ${q.options[q.correct]}`);
});

// 最悪の問題を特定
const worstQuestions = lowQualityQuestions.filter(q => q.issues.length >= 3);
console.log(`\n💀 最悪品質問題: ${worstQuestions.length}問`);

if (worstQuestions.length > 0) {
  console.log('\n最悪品質問題の例:');
  worstQuestions.slice(0, 5).forEach((q, index) => {
    console.log(`\n${index + 1}. ID: ${q.id}`);
    console.log(`   問題: ${q.question}`);
    console.log(`   選択肢: [${q.options.join(', ')}]`);
    console.log(`   問題点数: ${q.issues.length}`);
    console.log(`   問題点: ${q.issues.join(', ')}`);
  });
}

// 科目別品質分析
const subjectAnalysis = {};
['civics', 'geography', 'history'].forEach(subject => {
  const subjectQuestions = questions.filter(q => q.id.toLowerCase().includes(subject.substring(0, 3)));
  const subjectLowQuality = lowQualityQuestions.filter(q => q.id.toLowerCase().includes(subject.substring(0, 3)));
  
  subjectAnalysis[subject] = {
    total: subjectQuestions.length,
    lowQuality: subjectLowQuality.length,
    percentage: subjectQuestions.length > 0 ? (subjectLowQuality.length / subjectQuestions.length * 100).toFixed(1) : 0
  };
});

console.log('\n📚 科目別品質分析:');
Object.entries(subjectAnalysis).forEach(([subject, data]) => {
  console.log(`${subject}: ${data.lowQuality}/${data.total} (${data.percentage}%) が低品質`);
});

// 高品質問題のみのデータベースを保存
const highQualityIds = highQualityQuestions.map(q => q.id);
console.log(`\n💾 高品質問題ID (${highQualityIds.length}問) を保存中...`);

fs.writeFileSync('./high-quality-question-ids.json', JSON.stringify(highQualityIds, null, 2));
fs.writeFileSync('./low-quality-analysis.json', JSON.stringify(lowQualityQuestions, null, 2));

console.log('✅ 分析完了！高品質問題IDと詳細分析を保存しました。');