// 選択肢配列の検証スクリプト（より正確）
const fs = require('fs');
const path = require('path');

function verifyOptionsStructure() {
  console.log('🔍 選択肢配列の詳細検証を開始します...\n');
  
  const dataDir = path.join(__dirname, 'src', 'data');
  
  // 各ファイルを検証
  const files = [
    { path: path.join(dataDir, 'geography-enhanced.ts'), name: 'Geography' },
    { path: path.join(dataDir, 'history.ts'), name: 'History' },
    { path: path.join(dataDir, 'civics.ts'), name: 'Civics' }
  ];
  
  files.forEach(file => {
    console.log(`📋 ${file.name} ファイルを検証中...`);
    verifyFileOptions(file.path, file.name);
  });
}

function verifyFileOptions(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 正規表現を使って問題オブジェクトを抽出
  const questionPattern = /{[\s\S]*?id:\s*(\d+)[\s\S]*?question:\s*['"]([^'"]+)['"][\s\S]*?options:\s*(\[[\s\S]*?\])[\s\S]*?correct:\s*(\d+)[\s\S]*?}/g;
  
  let match;
  let problemCount = 0;
  let validCount = 0;
  
  while ((match = questionPattern.exec(content)) !== null) {
    const [, id, question, optionsStr, correctIndex] = match;
    problemCount++;
    
    try {
      // optionsを評価してJavaScript配列として解析
      const options = eval(optionsStr);
      
      if (Array.isArray(options) && options.length > 0) {
        const correct = parseInt(correctIndex);
        
        if (correct >= 0 && correct < options.length) {
          validCount++;
          console.log(`  ✅ ID ${id}: ${options.length}個の選択肢、正解インデックス ${correct}`);
        } else {
          console.log(`  ❌ ID ${id}: 正解インデックス ${correct} が選択肢数 ${options.length} の範囲外`);
          console.log(`     問題: "${question}"`);
        }
      } else {
        console.log(`  ❌ ID ${id}: 選択肢が配列でない、または空`);
        console.log(`     問題: "${question}"`);
        console.log(`     選択肢データ: ${optionsStr.substring(0, 100)}...`);
      }
    } catch (e) {
      console.log(`  ❌ ID ${id}: 選択肢の解析エラー - ${e.message}`);
      console.log(`     問題: "${question}"`);
      console.log(`     選択肢データ: ${optionsStr.substring(0, 100)}...`);
    }
  }
  
  console.log(`  📊 ${fileName}: ${validCount}/${problemCount} 問題が有効\n`);
}

// 実行
if (require.main === module) {
  verifyOptionsStructure();
}

module.exports = { verifyOptionsStructure };