// Debug script to check spreadsheet structure changes
async function debugSpreadsheetStructure() {
  console.log('🔍 スプレッドシート構造デバッグ\n');
  
  const sheetId = '1gI0WuQn5N0jqRAs04Y4gyZ6OI6AoGEB2WkoCDskI7Zw';
  const gid = '134040064';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  
  try {
    console.log('📊 CSV URL:', csvUrl);
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    console.log(`📋 総行数: ${lines.length}\n`);
    
    // 最初の5行を詳細表示
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      console.log(`${i + 1}行目: "${lines[i]}"`);
      
      // CSV解析
      const columns = parseCSVLine(lines[i]);
      console.log(`   列数: ${columns.length}`);
      console.log(`   各列: [${columns.map((col, idx) => `${idx}:"${col}"`).join(', ')}]`);
      console.log('');
    }
    
    // キーワード抽出テスト
    console.log('🔍 キーワード抽出テスト:');
    const keywords = extractKeywordsFromCSV(csvText);
    console.log(`抽出されたキーワード数: ${keywords.length}`);
    keywords.slice(0, 10).forEach((keyword, idx) => {
      console.log(`  ${idx + 1}. ${keyword}`);
    });
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function extractKeywordsFromCSV(csvText) {
  const lines = csvText.split('\n');
  const keywords = [];
  
  // 複数行をチェック
  for (let rowIndex = 0; rowIndex < Math.min(lines.length, 5); rowIndex++) {
    const columns = parseCSVLine(lines[rowIndex]);
    
    // B列から始まって（column index 1）キーワードを抽出
    for (let col = 1; col < columns.length; col++) {
      const keyword = columns[col]?.trim();
      
      if (keyword && keyword !== '' && keyword.length > 1) {
        // 重複チェック
        if (!keywords.includes(keyword)) {
          keywords.push(keyword);
        }
      }
    }
  }
  
  return keywords;
}

// Run the debug
debugSpreadsheetStructure().catch(console.error);