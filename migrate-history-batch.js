const fs = require('fs');
const EnhancedMigrationTool = require('./enhanced-migration-tool.js');

/**
 * 歴史問題の一括移行実行スクリプト
 */
async function migrateHistoryQuestions() {
  console.log('🏺 === 歴史問題移行開始 ===\n');
  
  const tool = new EnhancedMigrationTool();
  const subject = 'history';
  const batchSize = 50; // 50問ずつ処理
  
  let allConvertedQuestions = [];
  let currentIndex = 0;
  let hasMore = true;
  let batchNumber = 1;
  
  // 既存の統一データベースを読み込み
  let existingContent = '';
  try {
    existingContent = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    console.log('📖 既存の統一データベースを読み込み完了');
  } catch (error) {
    console.log('⚠️ 統一データベースの読み込みエラー:', error.message);
  }
  
  // バッチ処理ループ
  while (hasMore) {
    console.log(`\n📦 === バッチ ${batchNumber} 処理中 ===`);
    
    const result = await tool.migrateBatch(subject, currentIndex, batchSize);
    
    if (result.questions.length > 0) {
      allConvertedQuestions = allConvertedQuestions.concat(result.questions);
      console.log(`✨ バッチ ${batchNumber} 完了: ${result.questions.length} 問追加`);
    }
    
    hasMore = result.hasMore;
    currentIndex = result.nextIndex;
    batchNumber++;
    
    // 無限ループ防止
    if (batchNumber > 10) {
      console.log('⚠️ 安全のため処理を停止しました');
      break;
    }
  }
  
  console.log(`\n🎉 歴史問題移行完了!`);
  console.log(`📊 移行済み問題数: ${allConvertedQuestions.length} 問`);
  
  // 統計情報
  tool.printStats();
  
  // 統一データベースに追加
  if (allConvertedQuestions.length > 0) {
    await appendToUnifiedDatabase(allConvertedQuestions);
  }
  
  return allConvertedQuestions;
}

/**
 * 統一データベースに新しい問題を追加
 */
async function appendToUnifiedDatabase(newQuestions) {
  try {
    console.log(`\n💾 統一データベースに ${newQuestions.length} 問を追加中...`);
    
    // 既存ファイルを読み込み
    let content = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    
    // 既存の問題配列の終端を見つける
    const lastBraceIndex = content.lastIndexOf('];');
    if (lastBraceIndex === -1) {
      throw new Error('統一データベースの配列終端が見つかりません');
    }
    
    // 新しい問題をTypeScript形式で生成
    let newQuestionsCode = '';
    newQuestions.forEach((q, index) => {
      newQuestionsCode += `  {\n`;
      newQuestionsCode += `    "id": "${q.id}",\n`;
      newQuestionsCode += `    "subject": "${q.subject}",\n`;
      newQuestionsCode += `    "category": "${q.category}",\n`;
      if (q.subcategory) {
        newQuestionsCode += `    "subcategory": "${q.subcategory}",\n`;
      }
      if (q.era) {
        newQuestionsCode += `    "era": {\n`;
        newQuestionsCode += `      "name": "${q.era.name}",\n`;
        newQuestionsCode += `      "period": "${q.era.period}"\n`;
        newQuestionsCode += `    },\n`;
      }
      newQuestionsCode += `    "grade": ${q.grade},\n`;
      newQuestionsCode += `    "difficulty": "${q.difficulty}",\n`;
      newQuestionsCode += `    "tags": [${q.tags.map(t => `"${t}"`).join(', ')}],\n`;
      newQuestionsCode += `    "question": ${JSON.stringify(q.question)},\n`;
      newQuestionsCode += `    "options": [${q.options.map(opt => JSON.stringify(opt)).join(', ')}],\n`;
      newQuestionsCode += `    "correct": ${q.correct},\n`;
      newQuestionsCode += `    "explanation": ${JSON.stringify(q.explanation)},\n`;
      newQuestionsCode += `    "type": "${q.type}",\n`;
      newQuestionsCode += `    "lastUpdated": new Date("${q.lastUpdated.toISOString()}"),\n`;
      newQuestionsCode += `    "createdAt": new Date("${q.createdAt.toISOString()}"),\n`;
      newQuestionsCode += `    "version": ${q.version}`;
      if (q.qualityScore !== undefined) {
        newQuestionsCode += `,\n    "qualityScore": ${q.qualityScore}`;
      }
      newQuestionsCode += `\n  }`;
      
      if (index < newQuestions.length - 1) {
        newQuestionsCode += ',';
      }
      newQuestionsCode += '\n';
    });
    
    // 既存コンテンツの最後の問題の後に追加
    const beforeLastBrace = content.substring(0, lastBraceIndex);
    const afterLastBrace = content.substring(lastBraceIndex);
    
    // 既存の最後の問題にカンマを追加（必要な場合）
    let modifiedBefore = beforeLastBrace;
    if (!beforeLastBrace.trim().endsWith(',')) {
      modifiedBefore = beforeLastBrace.replace(/(\n\s*})(\s*)$/, '$1,$2');
    }
    
    const newContent = modifiedBefore + '\n' + newQuestionsCode + afterLastBrace;
    
    // ファイルに書き込み
    fs.writeFileSync('/home/user/webapp/src/data/questions-unified.ts', newContent, 'utf8');
    
    console.log('✅ 統一データベースへの追加完了!');
    
  } catch (error) {
    console.error('❌ 統一データベースへの追加エラー:', error.message);
    
    // バックアップファイルとして保存
    const backupContent = `// 歴史問題移行バックアップ - ${new Date().toISOString()}\n` + 
                         `export const historyMigrationBackup = [\n${JSON.stringify(newQuestions, null, 2)}\n];`;
    fs.writeFileSync('/home/user/webapp/history-migration-backup.js', backupContent, 'utf8');
    console.log('💾 バックアップファイルを作成しました: history-migration-backup.js');
  }
}

// 実行
if (require.main === module) {
  migrateHistoryQuestions().catch(console.error);
}

module.exports = migrateHistoryQuestions;