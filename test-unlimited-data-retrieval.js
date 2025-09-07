#!/usr/bin/env node

/**
 * 無制限データ取得テスト
 * 101行制限を削除した後の動作確認
 */

const { SheetsService } = require('./src/lib/sheets.ts');

async function testUnlimitedDataRetrieval() {
  console.log('🧪 無制限データ取得テスト開始...\n');
  
  try {
    const sheetsService = new SheetsService();
    
    console.log('1️⃣ スプレッドシートからデータを取得中...');
    const startTime = Date.now();
    const questions = await sheetsService.fetchQuestionsData();
    const endTime = Date.now();
    
    console.log(`\n📊 取得結果:`);
    console.log(`   取得件数: ${questions.length} 件`);
    console.log(`   処理時間: ${endTime - startTime}ms`);
    
    if (questions.length === 0) {
      console.log('❌ データが取得できませんでした');
      console.log('   - スプレッドシートの共有設定を確認してください');
      console.log('   - URLが正しいか確認してください');
      return;
    }
    
    console.log(`\n🔍 データ詳細:`);
    console.log(`   最初のキーワード: "${questions[0]?.keyword}"`);
    console.log(`   最後のキーワード: "${questions[questions.length - 1]?.keyword}"`);
    
    // 101行を超えているかチェック
    if (questions.length > 101) {
      console.log(`\n🎉 SUCCESS: 101行制限を突破しました！`);
      console.log(`   合計取得数: ${questions.length} 件`);
      console.log(`   制限超過分: ${questions.length - 101} 件`);
    } else if (questions.length === 101) {
      console.log(`\n⚠️  WARNING: ちょうど101件です`);
      console.log(`   制限が残っている可能性があります`);
    } else {
      console.log(`\n✅ ${questions.length} 件のデータを正常取得`);
    }
    
    // サンプルデータを表示
    console.log(`\n📝 サンプルデータ (最初の5件):`);
    questions.slice(0, 5).forEach((q, i) => {
      console.log(`   ${i + 1}. ${q.keyword} (${q.subject})`);
    });
    
    if (questions.length > 96) {
      console.log(`\n📝 サンプルデータ (最後の5件):`);
      questions.slice(-5).forEach((q, i) => {
        const actualIndex = questions.length - 5 + i + 1;
        console.log(`   ${actualIndex}. ${q.keyword} (${q.subject})`);
      });
    }
    
  } catch (error) {
    console.error('❌ テスト失敗:', error);
  }
}

// テスト実行
testUnlimitedDataRetrieval();