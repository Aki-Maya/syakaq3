// 問題データの重複・ファクトチェック・カテゴリー検証スクリプト
const fs = require('fs');
const path = require('path');

// TypeScriptファイルを読み込むために、evalを使って動的に実行
function loadDataFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // TypeScriptからJavaScriptに変換する簡単な処理
  const jsContent = content
    .replace(/export interface.*?\{[\s\S]*?\}/gm, '') // インターフェース削除
    .replace(/export\s+/g, '')  // export削除
    .replace(/:\s*\w+\[\]/g, '')  // 型注釈削除
    .replace(/:\s*\w+/g, '')     // 型注釈削除
    .replace(/\btype\s+\w+\s*=.*?;/gm, '') // type削除
    .replace(/import\s+\{[\s\S]*?\}\s+from\s+['"].*?['"];?/gm, ''); // import削除
  
  // evalでオブジェクトを取得
  try {
    const module = { exports: {} };
    eval(jsContent);
    return module.exports || eval(`(${jsContent})`);
  } catch (e) {
    console.log('Error loading file:', filePath, e.message);
    return null;
  }
}

// 各ファイルから問題データを抽出
function extractQuestionsFromFile(filePath, arrayName) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 配列の開始を見つける
  const arrayStart = content.indexOf(`export const ${arrayName}`);
  if (arrayStart === -1) {
    console.log(`${arrayName} not found in ${filePath}`);
    return [];
  }
  
  // 配列の中身を抽出（単純な方法）
  const lines = content.split('\n');
  const questions = [];
  let inArray = false;
  let currentQuestion = null;
  let braceCount = 0;
  
  for (const line of lines) {
    if (line.includes(`export const ${arrayName}`) || inArray) {
      inArray = true;
      
      if (line.trim().startsWith('{') && !line.includes('//')) {
        currentQuestion = {};
        braceCount = 1;
      } else if (currentQuestion && line.includes(':')) {
        const match = line.match(/(\w+):\s*(.+?),?\s*$/);
        if (match) {
          let [, key, value] = match;
          value = value.replace(/,$/, '').trim();
          
          // 値を適切に変換
          if (value.startsWith('[') && value.endsWith(']')) {
            // 配列
            value = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
          } else if (value.startsWith('"') || value.startsWith("'")) {
            // 文字列
            value = value.slice(1, -1);
          } else if (!isNaN(value)) {
            // 数値
            value = parseInt(value);
          }
          
          currentQuestion[key] = value;
        }
      }
      
      if (line.includes('}') && currentQuestion) {
        braceCount--;
        if (braceCount === 0) {
          if (currentQuestion.id !== undefined) {
            questions.push(currentQuestion);
          }
          currentQuestion = null;
        }
      }
      
      if (line.includes('];')) {
        break;
      }
    }
  }
  
  return questions;
}

// メイン関数
function analyzeProblems() {
  console.log('🔍 問題データ分析を開始します...\n');
  
  const dataDir = path.join(__dirname, 'src', 'data');
  
  // 各科目の問題データを読み込み
  const geographyQuestions = extractQuestionsFromFile(
    path.join(dataDir, 'geography-enhanced.ts'), 'geographyQuestions'
  );
  const historyQuestions = extractQuestionsFromFile(
    path.join(dataDir, 'history.ts'), 'historyQuestions'
  );
  const civicsQuestions = extractQuestionsFromFile(
    path.join(dataDir, 'civics.ts'), 'civicsQuestions'
  );
  
  console.log(`📊 問題数統計:`);
  console.log(`地理: ${geographyQuestions.length}問`);
  console.log(`歴史: ${historyQuestions.length}問`);
  console.log(`公民: ${civicsQuestions.length}問`);
  console.log(`合計: ${geographyQuestions.length + historyQuestions.length + civicsQuestions.length}問\n`);
  
  // すべての問題をまとめる
  const allQuestions = [
    ...geographyQuestions.map(q => ({ ...q, subject: 'geography' })),
    ...historyQuestions.map(q => ({ ...q, subject: 'history' })),
    ...civicsQuestions.map(q => ({ ...q, subject: 'civics' }))
  ];
  
  console.log('1️⃣ ID重複チェック');
  checkDuplicateIds(allQuestions);
  
  console.log('\n2️⃣ 問題文重複チェック');
  checkDuplicateQuestions(allQuestions);
  
  console.log('\n3️⃣ 回答インデックス妥当性チェック');
  checkAnswerValidation(allQuestions);
  
  console.log('\n4️⃣ 基本データ形式チェック');
  checkDataFormat(allQuestions);
  
  return {
    geography: geographyQuestions,
    history: historyQuestions,
    civics: civicsQuestions,
    all: allQuestions
  };
}

// ID重複チェック
function checkDuplicateIds(questions) {
  const idMap = new Map();
  const duplicates = [];
  
  questions.forEach(q => {
    if (idMap.has(q.id)) {
      duplicates.push({
        id: q.id,
        questions: [idMap.get(q.id), q]
      });
    } else {
      idMap.set(q.id, q);
    }
  });
  
  if (duplicates.length === 0) {
    console.log('✅ ID重複なし');
  } else {
    console.log(`❌ ${duplicates.length}件のID重複を発見:`);
    duplicates.forEach(dup => {
      console.log(`  ID ${dup.id}: "${dup.questions[0].question}" vs "${dup.questions[1].question}"`);
    });
  }
}

// 問題文重複チェック
function checkDuplicateQuestions(questions) {
  const questionMap = new Map();
  const duplicates = [];
  
  questions.forEach(q => {
    const cleanQuestion = q.question.trim().toLowerCase();
    if (questionMap.has(cleanQuestion)) {
      duplicates.push({
        question: cleanQuestion,
        ids: [questionMap.get(cleanQuestion).id, q.id],
        subjects: [questionMap.get(cleanQuestion).subject, q.subject]
      });
    } else {
      questionMap.set(cleanQuestion, q);
    }
  });
  
  if (duplicates.length === 0) {
    console.log('✅ 問題文重複なし');
  } else {
    console.log(`❌ ${duplicates.length}件の問題文重複を発見:`);
    duplicates.forEach(dup => {
      console.log(`  "${dup.question}" (ID: ${dup.ids.join(', ')}, 科目: ${dup.subjects.join(', ')})`);
    });
  }
}

// 回答インデックス妥当性チェック
function checkAnswerValidation(questions) {
  const invalidAnswers = [];
  
  questions.forEach(q => {
    if (!Array.isArray(q.options) || q.options.length === 0) {
      invalidAnswers.push({ id: q.id, issue: '選択肢が配列でない、または空', question: q.question });
    } else if (q.correct < 0 || q.correct >= q.options.length) {
      invalidAnswers.push({ 
        id: q.id, 
        issue: `正解インデックス(${q.correct})が選択肢数(${q.options.length})の範囲外`,
        question: q.question
      });
    }
  });
  
  if (invalidAnswers.length === 0) {
    console.log('✅ 回答インデックス妥当性チェック完了');
  } else {
    console.log(`❌ ${invalidAnswers.length}件の回答エラーを発見:`);
    invalidAnswers.forEach(err => {
      console.log(`  ID ${err.id}: ${err.issue} - "${err.question}"`);
    });
  }
}

// データ形式チェック
function checkDataFormat(questions) {
  const formatErrors = [];
  
  questions.forEach(q => {
    // 必須フィールドチェック
    const required = ['id', 'question', 'options', 'correct', 'explanation', 'category', 'difficulty'];
    required.forEach(field => {
      if (q[field] === undefined || q[field] === null) {
        formatErrors.push({ id: q.id, field, issue: '必須フィールドが未定義' });
      }
    });
    
    // 難易度チェック
    if (q.difficulty && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
      formatErrors.push({ id: q.id, field: 'difficulty', issue: `無効な難易度: ${q.difficulty}` });
    }
    
    // 問題文の長さチェック
    if (q.question && q.question.length > 200) {
      formatErrors.push({ id: q.id, field: 'question', issue: `問題文が長すぎます(${q.question.length}文字)` });
    }
    
    // 解説の長さチェック
    if (q.explanation && q.explanation.length > 500) {
      formatErrors.push({ id: q.id, field: 'explanation', issue: `解説が長すぎます(${q.explanation.length}文字)` });
    }
  });
  
  if (formatErrors.length === 0) {
    console.log('✅ データ形式チェック完了');
  } else {
    console.log(`❌ ${formatErrors.length}件の形式エラーを発見:`);
    formatErrors.slice(0, 10).forEach(err => {
      console.log(`  ID ${err.id} [${err.field}]: ${err.issue}`);
    });
    if (formatErrors.length > 10) {
      console.log(`  ... 他 ${formatErrors.length - 10}件`);
    }
  }
}

// 実行
if (require.main === module) {
  analyzeProblems();
}

module.exports = { analyzeProblems };