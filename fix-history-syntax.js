const fs = require('fs');

console.log('🔧 歴史ファイルの構文修正中...');

try {
  // ファイルを読み込み
  let content = fs.readFileSync('/home/user/webapp/src/data/history.ts', 'utf8');
  
  console.log('📖 ファイル読み込み完了');
  
  // 問題のあるパターンを修正
  // explanation の後にカンマがない場合を修正
  content = content.replace(
    /(explanation: '[^']*'),(\s*type: 'multiple-choice')(\s*era: '\w+')/g,
    '$1,$2,$3'
  );
  
  // type と era の間にカンマがない場合を修正
  content = content.replace(
    /(type: 'multiple-choice')(\s*era: '\w+')/g,
    '$1,$2'
  );
  
  // explanation の後にコンマがなく、直接 type が来る場合を修正
  content = content.replace(
    /(explanation: '[^']*')(\s*type: 'multiple-choice')/g,
    '$1,$2'
  );
  
  // 他のプロパティの後にコンマがなく era が来る場合を修正
  content = content.replace(
    /(difficulty: '\w+')(\s*explanation: '[^']*')(\s*type: 'multiple-choice')(\s*era: '\w+')/g,
    '$1,$2,$3,$4'
  );
  
  // より一般的なパターン: プロパティの後に改行があってコンマがない場合
  content = content.replace(
    /('[^']*'|"[^"]*"|\w+:\s*\w+|\w+:\s*'[^']*'|\w+:\s*"[^"]*")(\s+)(\w+:)/g,
    '$1,$2$3'
  );
  
  // ファイルに書き戻し
  fs.writeFileSync('/home/user/webapp/src/data/history.ts', content, 'utf8');
  
  console.log('✅ 構文修正完了');
  
} catch (error) {
  console.error('❌ 構文修正エラー:', error.message);
}