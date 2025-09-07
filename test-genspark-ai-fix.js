// Test script for GenSpark AI fix
async function testGenSparkAIFix() {
  console.log('🧪 GenSpark AI修正テスト開始\n');
  
  // 問題があった5件目以降のキーワードをテスト
  const problemKeywords = [
    '藤原定家',
    '利尻半島の特産品', 
    'トレーサビリティ',
    '二官八省',
    '禁中並公家諸法度'
  ];
  
  console.log('📝 問題のあったキーワードをGenSpark AIで再生成テスト:');
  
  for (const keyword of problemKeywords) {
    try {
      console.log(`\n🤖 ${keyword} - GenSpark AI解説生成開始...`);
      
      const response = await fetch('http://localhost:3000/api/generate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `中学受験の社会科分野「${keyword}」について、中学受験生が確実に覚えられて得点につながる実用的な解説を作成してください。

【必須要素】
1. 【基本説明】: 何か、いつか、どこかを明確に
2. 【背景・原因】: なぜそうなったのかの理由
3. 【覚え方】: 語呂合わせ、関連付け、イメージ記憶法
4. 【試験のポイント】: よく出る問題パターンと注意点
5. 【関連知識】: 一緒に覚えるべき関連事項

実際の受験で使える、記憶に残る解説を作成してください。`,
          keyword: keyword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ 生成成功! (${data.explanation.length}文字)`);
        
        if (data.isFallback) {
          console.log('⚠️  フォールバック解説が使用されました');
        } else {
          console.log('🎉 GenSpark AI解説が正常生成されました！');
        }
        
        // 品質チェック
        const hasMemoryTech = data.explanation.includes('覚え方') || data.explanation.includes('記憶') || data.explanation.includes('語呂');
        const hasExamInfo = data.explanation.includes('試験') || data.explanation.includes('出題');
        const hasStructure = data.explanation.includes('【') && data.explanation.includes('】');
        const hasDetails = data.explanation.length > 100;
        
        console.log(`   📊 品質チェック:`);
        console.log(`   - 記憶テクニック: ${hasMemoryTech ? '✅' : '❌'}`);
        console.log(`   - 試験情報: ${hasExamInfo ? '✅' : '❌'}`);  
        console.log(`   - 構造化: ${hasStructure ? '✅' : '❌'}`);
        console.log(`   - 詳細度: ${hasDetails ? '✅' : '❌'} (${data.explanation.length}文字)`);
        
        // 解説内容の最初の100文字を表示
        console.log(`   📝 解説プレビュー: "${data.explanation.substring(0, 100)}..."`);
        
        // 以前の問題（汎用的な解説）かどうかチェック
        const isGeneric = data.explanation.includes('社会分野の重要な学習項目です') || 
                         data.explanation.includes('総合的な社会科の知識として');
        
        if (isGeneric) {
          console.log('   ❌ まだ汎用的な解説が生成されています');
        } else {
          console.log('   ✅ 具体的で詳細な解説が生成されました！');
        }
        
      } else {
        console.log(`❌ 生成失敗: ${data.error}`);
      }
      
      // API制限対策
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ エラー: ${error.message}`);
    }
  }
  
  console.log('\n🎯 GenSpark AI修正テスト完了！');
}

// Run the test
testGenSparkAIFix().catch(console.error);