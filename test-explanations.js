// Test script to verify enhanced explanation quality
const testKeywords = [
  'リアス式海岸',
  '藤原不比等', 
  '壇ノ浦の戦い',
  '松江の気候',
  '卑弥呼',
  '憲法改正の手続き',
  // Test generic explanations
  '平安時代',
  '火山地形',
  '議会制民主主義'
];

async function testExplanationGeneration() {
  console.log('🧪 解説生成品質テスト開始\n');
  
  for (const keyword of testKeywords) {
    try {
      const response = await fetch('http://localhost:3000/api/generate-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `中学受験生が確実に覚えられる実用的な解説を作成してください`,
          keyword: keyword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`📝 ${keyword}:`);
        console.log(`${data.explanation}`);
        
        // Quality checks
        const hasMemoryTechnique = data.explanation.includes('覚え方') || data.explanation.includes('記憶');
        const hasExamPattern = data.explanation.includes('試験') || data.explanation.includes('出題');
        const hasContext = data.explanation.includes('【') && data.explanation.includes('】');
        const lengthOK = data.explanation.length >= 150 && data.explanation.length <= 500;
        
        console.log(`   ✅ 記憶テクニック: ${hasMemoryTechnique ? '含まれている' : '不足'}`);
        console.log(`   ✅ 試験パターン: ${hasExamPattern ? '含まれている' : '不足'}`);
        console.log(`   ✅ 構造化表記: ${hasContext ? 'あり' : 'なし'}`);
        console.log(`   ✅ 文字数: ${data.explanation.length}文字 ${lengthOK ? '(適切)' : '(要調整)'}`);
        console.log('─'.repeat(80));
        
      } else {
        console.log(`❌ ${keyword}: ${data.error}`);
      }
      
      // API rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`❌ ${keyword} テストエラー:`, error);
    }
  }
  
  console.log('\n🎯 解説生成品質テスト完了');
}

// Run the test
testExplanationGeneration().catch(console.error);