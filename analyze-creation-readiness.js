#!/usr/bin/env node

const fs = require('fs');

class CreationReadinessAnalyzer {
  constructor() {
    this.currentQuestions = {};
    this.qualityBenchmarks = {};
    this.gaps = {};
    this.recommendations = {};
  }

  analyzeCurrentState() {
    console.log('📊 === 問題作成準備状況の分析 ===\n');
    
    const filePath = '/home/user/webapp/src/data/questions-unified.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 現在の問題数を分析
    this.analyzeQuestionCounts(fileContent);
    
    // 品質基準を分析
    this.analyzeQualityBenchmarks(fileContent);
    
    // カテゴリ分布を分析
    this.analyzeCategoryDistribution(fileContent);
    
    // 難易度分布を分析  
    this.analyzeDifficultyDistribution(fileContent);
    
    // 作成推奨事項を生成
    this.generateCreationRecommendations();
    
    this.printAnalysisReport();
    
    return {
      currentQuestions: this.currentQuestions,
      qualityBenchmarks: this.qualityBenchmarks,
      gaps: this.gaps,
      recommendations: this.recommendations
    };
  }

  analyzeQuestionCounts(fileContent) {
    const questionRegex = /{\s*"id":\s*"([A-Z]+)_[^"]+"/g;
    let match;
    
    this.currentQuestions = {
      geography: 0,
      history: 0,
      civics: 0,
      total: 0
    };
    
    while ((match = questionRegex.exec(fileContent)) !== null) {
      const subject = this.getSubjectFromPrefix(match[1]);
      if (subject) {
        this.currentQuestions[subject]++;
        this.currentQuestions.total++;
      }
    }
  }

  getSubjectFromPrefix(prefix) {
    switch (prefix) {
      case 'GEO': return 'geography';
      case 'HIS': return 'history';
      case 'CIV': return 'civics';
      default: return null;
    }
  }

  analyzeQualityBenchmarks(fileContent) {
    const questionRegex = /{\s*"id":\s*"([A-Z]+)_[^"]+",[\s\S]*?"qualityScore":\s*(\d+(?:\.\d+)?)[\s\S]*?"explanation":\s*"([^"]*)"[\s\S]*?}/g;
    let match;
    
    const qualityData = {
      geography: { scores: [], explanationLengths: [] },
      history: { scores: [], explanationLengths: [] },
      civics: { scores: [], explanationLengths: [] }
    };
    
    while ((match = questionRegex.exec(fileContent)) !== null) {
      const subject = this.getSubjectFromPrefix(match[1]);
      const score = parseFloat(match[2]);
      const explanationLength = match[3].length;
      
      if (subject && !isNaN(score)) {
        qualityData[subject].scores.push(score);
        qualityData[subject].explanationLengths.push(explanationLength);
      }
    }
    
    // 各科目の品質基準を計算
    Object.keys(qualityData).forEach(subject => {
      const scores = qualityData[subject].scores;
      const lengths = qualityData[subject].explanationLengths;
      
      if (scores.length > 0) {
        this.qualityBenchmarks[subject] = {
          averageScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
          minTargetScore: Math.max(6.0, scores.reduce((a, b) => a + b, 0) / scores.length),
          averageExplanationLength: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length),
          targetExplanationRange: [60, 120],
          highQualityCount: scores.filter(s => s >= 7).length,
          totalWithScores: scores.length
        };
      }
    });
  }

  analyzeCategoryDistribution(fileContent) {
    const categoryRegex = /"category":\s*"([^"]+)"/g;
    let match;
    
    const categoryCount = {};
    
    while ((match = categoryRegex.exec(fileContent)) !== null) {
      const category = match[1];
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
    
    this.categoryDistribution = categoryCount;
  }

  analyzeDifficultyDistribution(fileContent) {
    const difficultyRegex = /"difficulty":\s*"([^"]+)"/g;
    let match;
    
    const difficultyCount = {};
    
    while ((match = difficultyRegex.exec(fileContent)) !== match) {
      const difficulty = match[1];
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
    }
    
    this.difficultyDistribution = difficultyCount;
  }

  generateCreationRecommendations() {
    const targetCounts = {
      geography: 150, // 現在114問 → +36問
      history: 200,   // 現在138問 → +62問  
      civics: 100     // 現在66問 → +34問
    };
    
    // 各科目の不足数を計算
    Object.keys(targetCounts).forEach(subject => {
      const current = this.currentQuestions[subject];
      const target = targetCounts[subject];
      const needed = Math.max(0, target - current);
      
      this.gaps[subject] = {
        current: current,
        target: target,
        needed: needed,
        priority: needed > 50 ? 'high' : needed > 30 ? 'medium' : 'low'
      };
    });
    
    // 作成推奨事項
    this.recommendations = {
      priorityOrder: this.calculatePriorityOrder(),
      qualityTargets: this.calculateQualityTargets(),
      creationStrategy: this.generateCreationStrategy(),
      toolRequirements: this.generateToolRequirements()
    };
  }

  calculatePriorityOrder() {
    const priorities = Object.entries(this.gaps)
      .map(([subject, gap]) => ({
        subject,
        needed: gap.needed,
        priority: gap.priority,
        qualityBenchmark: this.qualityBenchmarks[subject]?.averageScore || 0
      }))
      .sort((a, b) => {
        // 不足数と現在の品質を考慮して優先順位を決定
        const scoreA = (a.needed * 0.6) + (a.qualityBenchmark * 0.4);
        const scoreB = (b.needed * 0.6) + (b.qualityBenchmark * 0.4);
        return scoreB - scoreA;
      });
      
    return priorities;
  }

  calculateQualityTargets() {
    const targets = {};
    
    Object.keys(this.qualityBenchmarks).forEach(subject => {
      const benchmark = this.qualityBenchmarks[subject];
      targets[subject] = {
        minQualityScore: Math.max(6.5, parseFloat(benchmark.averageScore)),
        targetExplanationLength: benchmark.averageExplanationLength,
        targetRange: benchmark.targetExplanationRange,
        shouldExceedCurrent: true
      };
    });
    
    return targets;
  }

  generateCreationStrategy() {
    return {
      batchSize: 20, // 一度に作成する問題数
      qualityFirst: true, // 品質優先アプローチ
      diversifyCategories: true, // カテゴリの多様化
      balanceDifficulty: true, // 難易度バランス
      iterativeImprovement: true // 反復改善
    };
  }

  generateToolRequirements() {
    return {
      questionGenerator: '高品質問題生成ツール',
      qualityValidator: '品質自動検証システム',
      categoryBalancer: 'カテゴリバランス調整機能',
      difficultyAnalyzer: '難易度適正判定機能',
      batchProcessor: 'バッチ処理システム'
    };
  }

  printAnalysisReport() {
    console.log('📊 **現在の問題数状況**:');
    console.log(`・地理: ${this.currentQuestions.geography}問`);
    console.log(`・歴史: ${this.currentQuestions.history}問`);  
    console.log(`・公民: ${this.currentQuestions.civics}問`);
    console.log(`・合計: ${this.currentQuestions.total}問\n`);
    
    console.log('⭐ **品質基準達成状況**:');
    Object.entries(this.qualityBenchmarks).forEach(([subject, benchmark]) => {
      const subjectName = subject === 'geography' ? '地理' : subject === 'history' ? '歴史' : '公民';
      console.log(`${subjectName}: 平均${benchmark.averageScore}点 (高品質${benchmark.highQualityCount}/${benchmark.totalWithScores}問)`);
    });
    console.log();
    
    console.log('🎯 **作成が必要な問題数**:');
    Object.entries(this.gaps).forEach(([subject, gap]) => {
      const subjectName = subject === 'geography' ? '地理' : subject === 'history' ? '歴史' : '公民';
      const priorityEmoji = gap.priority === 'high' ? '🔴' : gap.priority === 'medium' ? '🟡' : '🟢';
      console.log(`${priorityEmoji} ${subjectName}: ${gap.needed}問必要 (${gap.current}→${gap.target})`);
    });
    console.log();
    
    console.log('📋 **推奨作成順序**:');
    this.recommendations.priorityOrder.forEach((item, index) => {
      const subjectName = item.subject === 'geography' ? '地理' : item.subject === 'history' ? '歴史' : '公民';
      console.log(`${index + 1}. ${subjectName} (${item.needed}問, 現品質${item.qualityBenchmark}点)`);
    });
    console.log();
    
    console.log('🎯 **品質目標**:');
    Object.entries(this.recommendations.qualityTargets).forEach(([subject, target]) => {
      const subjectName = subject === 'geography' ? '地理' : subject === 'history' ? '歴史' : '公民';
      console.log(`${subjectName}: ${target.minQualityScore}点以上, ${target.targetRange[0]}-${target.targetRange[1]}文字`);
    });
    console.log();
    
    console.log('🛠️ **必要なツール**:');
    Object.entries(this.recommendations.toolRequirements).forEach(([key, tool]) => {
      console.log(`・${tool}`);
    });
    console.log();
    
    console.log('📈 **作成戦略**:');
    const strategy = this.recommendations.creationStrategy;
    console.log(`・バッチサイズ: ${strategy.batchSize}問/回`);
    console.log(`・品質優先: ${strategy.qualityFirst ? 'はい' : 'いいえ'}`);
    console.log(`・カテゴリ多様化: ${strategy.diversifyCategories ? 'はい' : 'いいえ'}`);
    console.log(`・難易度バランス: ${strategy.balanceDifficulty ? 'はい' : 'いいえ'}`);
    console.log(`・反復改善: ${strategy.iterativeImprovement ? 'はい' : 'いいえ'}`);
    
    console.log('\n🎉 問題作成の準備が整いました！');
    console.log('📚 既存の高品質基準を維持しながら新問題を作成できます。');
  }
}

// 実行
const analyzer = new CreationReadinessAnalyzer();
analyzer.analyzeCurrentState();