const fs = require('fs');

/**
 * 移行された歴史問題を統一データベースに統合
 */
async function integrateHistoryQuestions() {
  console.log('🔄 歴史問題を統一データベースに統合中...\n');
  
  try {
    // 1. バックアップファイルを探す
    const files = fs.readdirSync('/home/user/webapp');
    const backupFile = files.find(file => 
      file.startsWith('history-unified-backup-') && file.endsWith('.json')
    );
    
    if (!backupFile) {
      throw new Error('歴史問題のバックアップファイルが見つかりません');
    }
    
    console.log(`📖 バックアップファイル読み込み: ${backupFile}`);
    
    // 2. 移行された歴史問題を読み込み
    const historyQuestions = JSON.parse(
      fs.readFileSync(`/home/user/webapp/${backupFile}`, 'utf8')
    );
    
    console.log(`✅ ${historyQuestions.length} 問の歴史問題を読み込み完了`);
    
    // 3. 既存の統一データベースを読み込み
    let unifiedContent = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    
    // 4. 新しい問題をTypeScript形式に変換
    console.log('\n🔧 TypeScript形式に変換中...');
    let newQuestionsCode = '';
    
    historyQuestions.forEach((q, index) => {
      newQuestionsCode += `  {\n`;
      newQuestionsCode += `    "id": "${q.id}",\n`;
      newQuestionsCode += `    "subject": "${q.subject}",\n`;
      newQuestionsCode += `    "category": "${q.category}",\n`;
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
      newQuestionsCode += `    "lastUpdated": new Date("${q.lastUpdated}"),\n`;
      newQuestionsCode += `    "createdAt": new Date("${q.createdAt}"),\n`;
      newQuestionsCode += `    "version": ${q.version}`;
      if (q.qualityScore !== undefined) {
        newQuestionsCode += `,\n    "qualityScore": ${q.qualityScore}`;
      }
      newQuestionsCode += `\n  }`;
      
      if (index < historyQuestions.length - 1) {
        newQuestionsCode += ',\n';
      }
    });
    
    // 5. 統一データベースの配列終端を見つけて新問題を追加
    const lastBraceIndex = unifiedContent.lastIndexOf('];');
    if (lastBraceIndex === -1) {
      throw new Error('統一データベースの配列終端が見つかりません');
    }
    
    const beforeLastBrace = unifiedContent.substring(0, lastBraceIndex);
    const afterLastBrace = unifiedContent.substring(lastBraceIndex);
    
    // 既存の最後の問題にカンマを追加
    let modifiedBefore = beforeLastBrace;
    if (!beforeLastBrace.trim().endsWith(',')) {
      modifiedBefore = beforeLastBrace.replace(/(\n\s*})(\s*)$/, '$1,$2');
    }
    
    // 新しいコンテンツを作成
    const newContent = modifiedBefore + ',\n' + newQuestionsCode + '\n' + afterLastBrace;
    
    // 6. ファイルに書き込み
    fs.writeFileSync('/home/user/webapp/src/data/questions-unified.ts', newContent, 'utf8');
    
    console.log('✅ 統一データベースへの統合完了!');
    console.log(`📊 追加された問題数: ${historyQuestions.length} 問`);
    
    // 7. 統計情報を更新
    updateStatistics();
    
  } catch (error) {
    console.error('❌ 統合エラー:', error.message);
  }
}

/**
 * 統計情報を更新
 */
function updateStatistics() {
  try {
    const content = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    const questionMatches = content.match(/\{\s*"id":/g) || [];
    const totalCount = questionMatches.length;
    
    console.log(`\n📈 **更新された統計**`);
    console.log(`・統一データベース総問題数: ${totalCount} 問`);
    console.log(`・歴史問題追加による増加: +92 問`);
    console.log(`・新しい総合計: ${totalCount} 問`);
    
  } catch (error) {
    console.error('統計更新エラー:', error.message);
  }
}

// 実行
if (require.main === module) {
  integrateHistoryQuestions();
}

module.exports = integrateHistoryQuestions;