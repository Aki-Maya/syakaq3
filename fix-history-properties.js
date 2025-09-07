const fs = require('fs');

// カテゴリから時代をマッピングする関数
function mapCategoryToEra(category) {
  const mapping = {
    'ancient': 'ancient',
    'medieval': 'medieval', 
    'early-modern': 'early-modern',
    'modern': 'modern',
    'contemporary': 'contemporary',
    'primitive': 'ancient' // 原始は古代に含める
  };
  return mapping[category] || 'modern'; // デフォルトは近世・現代
}

// history.ts ファイルを読み込む
let content = fs.readFileSync('/home/user/webapp/src/data/history.ts', 'utf8');

// 質問オブジェクトのパターンにマッチし、typeとeraプロパティを追加
content = content.replace(
  /(\{\s*\n\s*id: \d+,[\s\S]*?category: ['"]([^'"]+)['"],[\s\S]*?explanation: ['"][^'"]*['"])\s*\n(\s*)\}/g,
  (match, questionPart, category, indent) => {
    const era = mapCategoryToEra(category);
    return `${questionPart},\n${indent}type: 'multiple-choice',\n${indent}era: '${era}'\n${indent}}`;
  }
);

// ファイルを書き戻す
fs.writeFileSync('/home/user/webapp/src/data/history.ts', content, 'utf8');

console.log('History questions fixed: added type and era properties');