// Test script for high-quality explanation generation
async function testHighQualityExplanations() {
  console.log('🧪 高品質解説生成テスト開始\n');
  
  try {
    // スプレッドシートからキーワードを取得
    console.log('📊 Step 1: キーワード取得');
    const sheetsResponse = await fetch('http://localhost:3000/api/sheets');
    const keywords = await sheetsResponse.json();
    console.log(`✅ ${keywords.length}件のキーワードを取得`);
    
    // 最初の3件で高品質解説生成をテスト
    const testKeywords = keywords.slice(0, 3).map(k => k.keyword);
    console.log(`\n📝 Step 2: 高品質解説生成テスト`);
    console.log(`対象キーワード: ${testKeywords.join(', ')}`);
    
    const explanations = [];
    for (const keyword of testKeywords) {
      try {
        const response = await fetch('http://localhost:3000/api/generate-explanation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: '中学受験生が確実に覚えられる実用的な解説を作成してください',
            keyword: keyword
          })
        });
        
        const data = await response.json();
        if (data.success) {
          explanations.push({
            keyword: keyword,
            explanation: data.explanation
          });
          
          console.log(`\n✅ ${keyword}:`);
          console.log(`📝 解説: ${data.explanation}`);
          console.log(`📊 文字数: ${data.explanation.length}`);
          
          // 品質チェック
          const hasMemoryTech = data.explanation.includes('覚え方') || data.explanation.includes('記憶');
          const hasExamInfo = data.explanation.includes('試験') || data.explanation.includes('出題');
          const hasStructure = data.explanation.includes('【') && data.explanation.includes('】');
          
          console.log(`   ✅ 記憶テクニック: ${hasMemoryTech ? 'あり' : 'なし'}`);
          console.log(`   ✅ 試験情報: ${hasExamInfo ? 'あり' : 'なし'}`);
          console.log(`   ✅ 構造化: ${hasStructure ? 'あり' : 'なし'}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(`❌ ${keyword}: エラー - ${error.message}`);
      }
    }
    
    // C列用CSV生成テスト
    console.log(`\n📋 Step 3: C列用CSV生成テスト`);
    const columnCSV = explanations.map(exp => 
      `"${exp.explanation.replace(/"/g, '""')}"`
    ).join('\n');
    
    console.log('✅ C列用CSV生成完了');
    console.log('📋 使用方法:');
    console.log('1. 以下のCSVデータをコピー');
    console.log('2. Google SheetsのC1セルを選択');
    console.log('3. Ctrl+Vで貼り付け');
    console.log('\n--- C列用CSVデータ ---');
    console.log(columnCSV);
    console.log('--- データ終了 ---\n');
    
    console.log('🎯 テスト完了！');
    console.log(`✅ 高品質解説生成: ${explanations.length}/${testKeywords.length}件成功`);
    console.log('✅ スプレッドシート直接反映: 準備完了');
    
  } catch (error) {
    console.error('❌ テストエラー:', error);
  }
}

// Run the test
testHighQualityExplanations().catch(console.error);