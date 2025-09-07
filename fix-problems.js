// 問題データの修正スクリプト
const fs = require('fs');
const path = require('path');

function fixProblemsData() {
  console.log('🔧 問題データの修正を開始します...\n');
  
  const dataDir = path.join(__dirname, 'src', 'data');
  
  // 各科目のファイルパス
  const files = [
    {
      path: path.join(dataDir, 'geography-enhanced.ts'),
      idStart: 1,
      idEnd: 100,
      subject: 'geography'
    },
    {
      path: path.join(dataDir, 'history.ts'),
      idStart: 101,
      idEnd: 200,
      subject: 'history'
    },
    {
      path: path.join(dataDir, 'civics.ts'),
      idStart: 201,
      idEnd: 300,
      subject: 'civics'
    }
  ];
  
  files.forEach(fileInfo => {
    console.log(`📝 修正中: ${fileInfo.subject} (ID範囲: ${fileInfo.idStart}-${fileInfo.idEnd})`);
    fixFileProblems(fileInfo);
  });
  
  console.log('\n✅ すべての修正が完了しました！');
}

function fixFileProblems(fileInfo) {
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  let modifiedContent = content;
  
  // 1. difficulty: 'normal' を 'medium' に修正
  modifiedContent = modifiedContent.replace(/difficulty:\s*'normal'/g, "difficulty: 'medium'");
  
  // 2. IDを適切な範囲に再割り当て
  let currentId = fileInfo.idStart;
  
  // 問題配列の部分を抽出して、IDを順番に振り直す
  const questionArrayMatch = modifiedContent.match(/(export const \w*Questions: \w*Question\[\] = \[)([\s\S]*?)(\n\];)/);
  
  if (questionArrayMatch) {
    let questionsSection = questionArrayMatch[2];
    
    // 各問題オブジェクトのIDを順番に更新
    questionsSection = questionsSection.replace(/id:\s*\d+/g, () => {
      return `id: ${currentId++}`;
    });
    
    // 元のコンテンツを置き換え
    modifiedContent = modifiedContent.replace(
      questionArrayMatch[0],
      questionArrayMatch[1] + questionsSection + questionArrayMatch[3]
    );
  }
  
  // 3. 不正なコメント行を修正
  modifiedContent = modifiedContent.replace(
    /id:\s*(\d+),\s*\/\/\s*既存のIDと重複しないように設定してください/g,
    'id: $1'
  );
  
  // 4. 選択肢配列の形式エラーを修正（簡易版）
  // この部分は手動確認が必要な箇所が多いため、ログ出力のみ
  const optionErrors = modifiedContent.match(/options:\s*\[[^\]]*?\n\s*\]/gs);
  if (optionErrors && optionErrors.length > 0) {
    console.log(`  ⚠️  ${fileInfo.subject}: 選択肢の形式確認が必要な箇所があります`);
  }
  
  // ファイルを保存
  fs.writeFileSync(fileInfo.path, modifiedContent, 'utf8');
  
  console.log(`  ✅ ${fileInfo.subject}: ID範囲 ${fileInfo.idStart}-${currentId - 1} に修正完了`);
}

// 実行
if (require.main === module) {
  fixProblemsData();
}

module.exports = { fixProblemsData };