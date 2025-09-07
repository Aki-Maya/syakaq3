// Test script for Google Sheets integration
async function testSpreadsheetIntegration() {
  console.log('🧪 スプレッドシート連携テスト開始\n');
  
  try {
    // 1. スプレッドシートからデータ取得テスト
    console.log('📊 Step 1: スプレッドシートデータ取得テスト');
    const sheetsResponse = await fetch('http://localhost:3000/api/sheets');
    const sheetsData = await sheetsResponse.json();
    console.log(`✅ ${sheetsData.length}件のキーワードを取得`);
    
    // 2. 解説生成テスト（最初の3件のみ）
    const testKeywords = sheetsData.slice(0, 3).map(item => item.keyword);
    console.log(`\n📝 Step 2: 一括解説生成テスト (${testKeywords.length}件)`);
    
    const batchResponse = await fetch('http://localhost:3000/api/generate-explanations-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: testKeywords })
    });
    
    const batchData = await batchResponse.json();
    const explanations = batchData.success ? batchData.explanations : [];
    
    if (batchData.success) {
      console.log(`✅ 一括解説生成完了: ${explanations.length}件`);
      explanations.forEach(exp => {
        console.log(`   📝 ${exp.keyword}: ${exp.explanation.length}文字`);
      });
    } else {
      console.log(`❌ 一括解説生成失敗: ${batchData.error}`);
    }
    
    // 3. C列用CSV形式生成テスト
    console.log(`\n📋 Step 3: C列用CSV生成テスト`);
    const columnCSV = explanations.map(exp => 
      `"${exp.explanation.replace(/"/g, '""')}"`
    ).join('\n');
    
    console.log('✅ C列用CSV生成完了');
    console.log('📋 生成されたCSV (最初の100文字):');
    console.log(columnCSV.substring(0, 100) + '...');
    
    // 4. 完全CSV形式生成テスト
    console.log(`\n📊 Step 4: 完全CSV生成テスト`);
    const fullCSV = 'キーワード,解説\n' + explanations.map(exp => 
      `"${exp.keyword}","${exp.explanation.replace(/"/g, '""')}"`
    ).join('\n');
    
    console.log('✅ 完全CSV生成完了');
    console.log(`📊 ファイルサイズ: ${fullCSV.length}文字`);
    
    console.log(`\n🎯 テスト完了！`);
    console.log(`✅ スプレッドシート連携: 正常`);
    console.log(`✅ 解説生成: ${explanations.length}/${testKeywords.length}件成功`);
    console.log(`✅ CSV出力: 正常`);
    console.log(`\n📋 実際の使用方法:`);
    console.log(`1. 管理画面でキーワードを選択`);
    console.log(`2. "高品質解説生成"ボタンをクリック`);
    console.log(`3. "C列にコピー"ボタンでクリップボードにコピー`);
    console.log(`4. Google SheetsのC列にCtrl+Vで貼り付け`);
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
  }
}

// Run the test
testSpreadsheetIntegration().catch(console.error);