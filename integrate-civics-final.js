const fs = require('fs');

/**
 * 公民問題を統一データベースに統合 - 最終統合
 */
async function integrateCivicsFinal() {
  console.log('🏛️ 公民問題を統一データベースに統合中 - 最終統合...\n');
  
  try {
    // 1. 公民バックアップファイルを探す
    const files = fs.readdirSync('/home/user/webapp');
    const backupFile = files.find(file => 
      file.startsWith('civics-unified-backup-') && file.endsWith('.json')
    );
    
    if (!backupFile) {
      throw new Error('公民問題のバックアップファイルが見つかりません');
    }
    
    console.log(`📖 バックアップファイル読み込み: ${backupFile}`);
    
    // 2. 移行された公民問題を読み込み
    const civicsQuestions = JSON.parse(
      fs.readFileSync(`/home/user/webapp/${backupFile}`, 'utf8')
    );
    
    console.log(`✅ ${civicsQuestions.length} 問の公民問題を読み込み完了`);
    
    // 3. 既存の統一データベースを読み込み
    let unifiedContent = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    
    // 4. 新しい問題をTypeScript形式に変換
    console.log('\n🔧 TypeScript形式に変換中...');
    let newQuestionsCode = '';
    
    civicsQuestions.forEach((q, index) => {
      newQuestionsCode += `  {\n`;
      newQuestionsCode += `    "id": "${q.id}",\n`;
      newQuestionsCode += `    "subject": "${q.subject}",\n`;
      newQuestionsCode += `    "category": "${q.category}",\n`;
      if (q.subcategory) {
        newQuestionsCode += `    "subcategory": "${q.subcategory}",\n`;
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
      
      if (index < civicsQuestions.length - 1) {
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
    console.log(`📊 追加された問題数: ${civicsQuestions.length} 問`);
    
    // 7. 最終統計情報を表示
    displayFinalStatistics();
    
  } catch (error) {
    console.error('❌ 統合エラー:', error.message);
  }
}

/**
 * 最終統計情報を表示
 */
function displayFinalStatistics() {
  try {
    const content = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    const questionMatches = content.match(/\{\s*"id":/g) || [];
    const totalCount = questionMatches.length;
    
    // 科目別カウント
    const subjectCounts = {
      geography: (content.match(/"subject":\s*"geography"/g) || []).length,
      history: (content.match(/"subject":\s*"history"/g) || []).length,
      civics: (content.match(/"subject":\s*"civics"/g) || []).length
    };
    
    console.log(`\n🎉 **移行完了！最終統計**`);
    console.log(`========================================`);
    console.log(`📊 統一データベース総問題数: ${totalCount} 問`);
    console.log(`\n📚 **科目別内訳**`);
    console.log(`・🗺️ 地理: ${subjectCounts.geography} 問`);
    console.log(`・🏺 歴史: ${subjectCounts.history} 問`);
    console.log(`・🏛️ 公民: ${subjectCounts.civics} 問`);
    
    // 移行成果の計算
    const originalCounts = {
      geography: 72,
      history: 92, 
      civics: 47
    };
    
    const totalOriginal = Object.values(originalCounts).reduce((a, b) => a + b, 0);
    const migrated = Object.values(subjectCounts).reduce((a, b) => a + b, 0) - 128; // 元々統一DBにあった分を除く
    
    console.log(`\n📈 **移行成果**`);
    console.log(`・移行対象: ${totalOriginal} 問`);
    console.log(`・移行完了: ${migrated} 問`);
    console.log(`・移行率: ${Math.round((migrated / totalOriginal) * 100)}%`);
    
    // 品質向上情報
    const qualityScoreMatches = content.match(/"qualityScore":\s*(\d+)/g) || [];
    const averageQuality = qualityScoreMatches.length > 0 ? 
      qualityScoreMatches.reduce((sum, match) => sum + parseInt(match.match(/\d+/)[0]), 0) / qualityScoreMatches.length : 0;
    
    console.log(`\n⭐ **品質情報**`);
    console.log(`・品質スコア付き問題: ${qualityScoreMatches.length} 問`);
    console.log(`・平均品質スコア: ${averageQuality.toFixed(1)}/10`);
    
    console.log(`\n✨ **統一データベース完成！**`);
    console.log(`中学社会科 ${totalCount} 問の包括的問題データベースが完成しました。`);
    console.log(`========================================`);
    
  } catch (error) {
    console.error('統計表示エラー:', error.message);
  }
}

// 実行
if (require.main === module) {
  integrateCivicsFinal();
}

module.exports = integrateCivicsFinal;