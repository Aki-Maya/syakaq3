const fs = require('fs');

/**
 * 問題品質の現状分析ツール
 */
function analyzeQualityStatus() {
  console.log('📊 === 問題品質状況の詳細分析 ===\n');

  try {
    // 統一データベースを読み込み
    const content = fs.readFileSync('/home/user/webapp/src/data/questions-unified.ts', 'utf8');
    
    // 問題を抽出
    const questionMatches = content.match(/\{\s*"id":\s*"[^"]+",[\s\S]*?\}/g) || [];
    const totalQuestions = questionMatches.length;
    
    console.log(`📚 **統一データベース分析**`);
    console.log(`・総問題数: ${totalQuestions} 問\n`);
    
    // 品質スコア分析
    const qualityScores = [];
    const explanationLengths = [];
    const subjectsData = {
      geography: { count: 0, totalScore: 0, shortExplanations: 0 },
      history: { count: 0, totalScore: 0, shortExplanations: 0 },
      civics: { count: 0, totalScore: 0, shortExplanations: 0 }
    };
    
    questionMatches.forEach(questionText => {
      // 科目を抽出
      const subjectMatch = questionText.match(/"subject":\s*"([^"]+)"/);
      const subject = subjectMatch ? subjectMatch[1] : 'unknown';
      
      // 品質スコアを抽出
      const scoreMatch = questionText.match(/"qualityScore":\s*(\d+(?:\.\d+)?)/);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
      
      // 説明文の長さを抽出
      const explanationMatch = questionText.match(/"explanation":\s*"([^"]+)"/);
      const explanationLength = explanationMatch ? explanationMatch[1].length : 0;
      
      if (score > 0) qualityScores.push(score);
      if (explanationLength > 0) explanationLengths.push(explanationLength);
      
      if (subjectsData[subject]) {
        subjectsData[subject].count++;
        subjectsData[subject].totalScore += score;
        if (explanationLength < 50) {
          subjectsData[subject].shortExplanations++;
        }
      }
    });
    
    // 全体統計
    const averageQuality = qualityScores.length > 0 ? 
      (qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length) : 0;
    const averageExplanationLength = explanationLengths.length > 0 ?
      (explanationLengths.reduce((a, b) => a + b, 0) / explanationLengths.length) : 0;
    
    console.log(`⭐ **品質スコア分析**`);
    console.log(`・品質スコア付き問題: ${qualityScores.length}/${totalQuestions} 問 (${Math.round(qualityScores.length/totalQuestions*100)}%)`);
    console.log(`・平均品質スコア: ${averageQuality.toFixed(1)}/10`);
    console.log(`・品質分布:`);
    
    const scoreDistribution = {
      'excellent (8-10)': qualityScores.filter(s => s >= 8).length,
      'good (6-7)': qualityScores.filter(s => s >= 6 && s < 8).length,
      'fair (4-5)': qualityScores.filter(s => s >= 4 && s < 6).length,
      'poor (1-3)': qualityScores.filter(s => s >= 1 && s < 4).length,
      'no score (0)': totalQuestions - qualityScores.length
    };
    
    Object.entries(scoreDistribution).forEach(([range, count]) => {
      const percentage = Math.round(count / totalQuestions * 100);
      console.log(`  - ${range}: ${count} 問 (${percentage}%)`);
    });
    
    console.log(`\n📝 **説明文の質分析**`);
    console.log(`・平均説明文長: ${Math.round(averageExplanationLength)} 文字`);
    
    const lengthDistribution = {
      'very_detailed (150+)': explanationLengths.filter(l => l >= 150).length,
      'detailed (100-149)': explanationLengths.filter(l => l >= 100 && l < 150).length,
      'adequate (50-99)': explanationLengths.filter(l => l >= 50 && l < 100).length,
      'brief (30-49)': explanationLengths.filter(l => l >= 30 && l < 50).length,
      'too_short (<30)': explanationLengths.filter(l => l < 30).length
    };
    
    Object.entries(lengthDistribution).forEach(([range, count]) => {
      const percentage = Math.round(count / totalQuestions * 100);
      const status = count === 0 ? '' : range === 'too_short (<30)' ? '🔴' : 
                   range === 'brief (30-49)' ? '🟡' : '✅';
      console.log(`  - ${range}: ${count} 問 (${percentage}%) ${status}`);
    });
    
    console.log(`\n📚 **科目別品質状況**`);
    Object.entries(subjectsData).forEach(([subject, data]) => {
      const avgScore = data.count > 0 ? (data.totalScore / data.count) : 0;
      const shortPercentage = data.count > 0 ? Math.round(data.shortExplanations / data.count * 100) : 0;
      const subjectName = subject === 'geography' ? '🗺️ 地理' : 
                         subject === 'history' ? '🏺 歴史' : '🏛️ 公民';
      
      console.log(`${subjectName}:`);
      console.log(`  - 問題数: ${data.count} 問`);
      console.log(`  - 平均品質: ${avgScore.toFixed(1)}/10`);
      console.log(`  - 短い説明: ${data.shortExplanations} 問 (${shortPercentage}%) ${shortPercentage > 30 ? '🔴' : shortPercentage > 10 ? '🟡' : '✅'}`);
    });
    
    // 改善が必要な問題の特定
    console.log(`\n🔧 **改善が必要な問題の推定**`);
    
    const needsImprovement = {
      lowQuality: qualityScores.filter(s => s < 6).length,
      shortExplanations: explanationLengths.filter(l => l < 50).length,
      missingScores: totalQuestions - qualityScores.length
    };
    
    const totalNeedsWork = Math.max(needsImprovement.lowQuality, needsImprovement.shortExplanations);
    const improvementPercentage = Math.round(totalNeedsWork / totalQuestions * 100);
    
    console.log(`・品質スコア低い問題 (6未満): ${needsImprovement.lowQuality} 問`);
    console.log(`・説明文が短い問題 (<50文字): ${needsImprovement.shortExplanations} 問`);
    console.log(`・品質スコア未設定: ${needsImprovement.missingScores} 問`);
    console.log(`・**推定改善必要問題**: ${totalNeedsWork} 問 (${improvementPercentage}%)`);
    
    // 改善の進捗状況
    const highQualityCount = qualityScores.filter(s => s >= 7).length;
    const qualityProgressPercentage = Math.round(highQualityCount / totalQuestions * 100);
    
    console.log(`\n🎯 **品質向上の進捗**`);
    console.log(`・高品質問題 (7点以上): ${highQualityCount} 問 (${qualityProgressPercentage}%)`);
    console.log(`・品質向上完了度: ${qualityProgressPercentage}%`);
    
    if (qualityProgressPercentage < 50) {
      console.log(`・**状況**: 🔴 品質向上作業が必要 (50%未満)`);
    } else if (qualityProgressPercentage < 80) {
      console.log(`・**状況**: 🟡 改善進行中 (50-80%)`);  
    } else {
      console.log(`・**状況**: ✅ 高品質達成 (80%以上)`);
    }
    
    // 次のアクション提案
    console.log(`\n📋 **次のアクション提案**`);
    
    if (needsImprovement.shortExplanations > 50) {
      console.log(`1. 🔴 **優先**: 説明文強化ツールの実行 (${needsImprovement.shortExplanations}問の短い説明を改善)`);
    }
    
    if (needsImprovement.lowQuality > 30) {
      console.log(`2. 🟡 **重要**: 低品質問題のマニュアル確認 (${needsImprovement.lowQuality}問)`);
    }
    
    if (needsImprovement.missingScores > 0) {
      console.log(`3. 🟢 **推奨**: 品質スコア再計算 (${needsImprovement.missingScores}問)`);
    }
    
    console.log(`4. ✨ **改善**: AIを使った説明文品質向上の実行`);
    console.log(`5. 📊 **検証**: 改善後の品質測定とベンチマーク比較`);
    
  } catch (error) {
    console.error('❌ 分析エラー:', error.message);
  }
}

// 実行
if (require.main === module) {
  analyzeQualityStatus();
}

module.exports = analyzeQualityStatus;