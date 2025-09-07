#!/usr/bin/env node

/**
 * Google Sheetsアクセステスト
 * 修正後のfetchロジックをテスト
 */

const https = require('https');

async function testSheetsAccess() {
  console.log('🧪 Google Sheetsアクセステスト開始...\n');
  
  const sheetId = '1gI0WuQn5N0jqRAs04Y4gyZ6OI6AoGEB2WkoCDskI7Zw';
  const gid = '134040064';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  
  console.log(`📋 URL: ${csvUrl}`);
  
  try {
    console.log('1️⃣ 改良版fetching実行中...');
    
    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/csv,text/plain,*/*'
      },
      redirect: 'follow'
    });
    
    console.log(`📊 レスポンス情報:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(response.headers));
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log(`📥 取得したCSVサイズ: ${csvText.length} 文字`);
    
    // HTMLが返されていないかチェック
    if (csvText.includes('<HTML>') || csvText.includes('<html>')) {
      console.warn('🚨 HTMLが返されました - スプレッドシートのアクセス権限を確認してください');
      console.log('取得内容の先頭200文字:', csvText.substring(0, 200));
      return false;
    }
    
    // CSV解析
    const lines = csvText.split('\n');
    console.log(`\n📊 CSV解析結果:`);
    console.log(`   総行数: ${lines.length}`);
    console.log(`   先頭3行の内容:`);
    lines.slice(0, 3).forEach((line, i) => {
      console.log(`     ${i + 1}: "${line}"`);
    });
    
    // キーワード抽出をテスト
    let keywordCount = 0;
    const keywords = [];
    
    for (let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
      const columns = parseCSVLine(lines[rowIndex]);
      const keyword = columns[1]?.trim().replace(/\r/g, '');
      
      if (keyword && keyword !== '' && keyword !== 'キーワード' && keyword.length > 1) {
        keywordCount++;
        keywords.push(keyword);
        
        // 最初の5個と最後の5個をサンプル保存
        if (keywordCount <= 5 || keywordCount > Math.max(0, keywordCount - 5)) {
          // 後で表示用
        }
      }
    }
    
    console.log(`\n✅ キーワード抽出結果:`);
    console.log(`   有効なキーワード数: ${keywordCount}`);
    
    if (keywordCount > 0) {
      console.log(`   最初のキーワード: "${keywords[0]}"`);
      console.log(`   最後のキーワード: "${keywords[keywords.length - 1]}"`);
      
      if (keywordCount > 101) {
        console.log(`🎉 101行制限を突破！ 合計 ${keywordCount} 件`);
      } else if (keywordCount === 101) {
        console.log(`⚠️  ちょうど101件 - 制限の可能性あり`);
      }
    }
    
    return keywordCount > 0;
    
  } catch (error) {
    console.error('❌ テスト失敗:', error);
    return false;
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

// テスト実行
testSheetsAccess().then(success => {
  if (success) {
    console.log('\n🎉 テスト成功: データ取得できました');
  } else {
    console.log('\n❌ テスト失敗: データ取得できませんでした');
  }
});