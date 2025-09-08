const fs = require('fs');

/**
 * ShakaQuest Enhanced Migration Tool
 * レガシー形式から統一形式への高品質移行ツール
 */
class EnhancedMigrationTool {
  constructor() {
    this.migratedCount = 0;
    this.errorCount = 0;
    this.qualityImprovements = 0;
    
    // カテゴリマッピング強化
    this.categoryMappings = {
      // Geography categories
      'physical': 'physical',
      'climate': 'physical', 
      'landforms': 'physical',
      'human': 'human',
      'industry': 'human',
      'population': 'human',
      'agriculture': 'human',
      'transportation': 'human',
      'regional': 'regional',
      'regions': 'regional',
      'prefecture': 'regional',
      'prefectures': 'regional',
      'international': 'regional',
      
      // History categories  
      'ancient': 'ancient',
      'medieval': 'medieval',
      'early-modern': 'early-modern',
      'modern': 'modern',
      'contemporary': 'contemporary',
      
      // Civics categories
      'constitution': 'constitution',
      'politics': 'politics', 
      'economics': 'economics',
      'human-rights': 'constitution', // 人権は憲法に統合
      'environment': 'environment',
      'general': 'politics' // 一般は政治に統合
    };
    
    // 説明文強化パターン
    this.explanationEnhancers = [
      {
        pattern: /^(.{1,50})\。?$/,
        replacement: (match, text) => {
          if (text.length < 30) {
            return `${text}について詳しく学習しましょう。中学社会科での重要なポイントです。`;
          }
          return text + '。';
        }
      },
      {
        pattern: /について$/,
        replacement: (match) => match + '詳しく解説します。'
      }
    ];
  }

  /**
   * 難易度を統一形式に変換
   */
  convertDifficulty(legacyDifficulty) {
    const mapping = {
      'easy': 'basic',
      'medium': 'standard', 
      'hard': 'advanced'
    };
    return mapping[legacyDifficulty] || 'standard';
  }

  /**
   * カテゴリを統一形式に変換・改良
   */
  convertCategory(subject, legacyCategory, questionText) {
    // 質問内容からカテゴリを自動推定
    if (subject === 'geography') {
      if (questionText.includes('気候') || questionText.includes('温度') || questionText.includes('降水')) {
        return 'physical';
      }
      if (questionText.includes('工業') || questionText.includes('農業') || questionText.includes('産業')) {
        return 'human';
      }
      if (questionText.includes('県') || questionText.includes('都道府県') || questionText.includes('地方')) {
        return 'regional';
      }
    }
    
    return this.categoryMappings[legacyCategory] || legacyCategory;
  }

  /**
   * サブカテゴリを自動生成
   */
  generateSubcategory(subject, category, questionText) {
    if (subject === 'geography') {
      if (category === 'physical') {
        if (questionText.includes('気候') || questionText.includes('梅雨')) return 'climate';
        if (questionText.includes('山') || questionText.includes('川') || questionText.includes('地形')) return 'landforms';
        if (questionText.includes('災害') || questionText.includes('地震')) return 'disasters';
      }
      if (category === 'human') {
        if (questionText.includes('人口')) return 'population';
        if (questionText.includes('農業') || questionText.includes('稲作')) return 'agriculture';
        if (questionText.includes('工業') || questionText.includes('産業')) return 'industry';
        if (questionText.includes('交通') || questionText.includes('鉄道')) return 'transportation';
      }
      if (category === 'regional') {
        if (questionText.includes('県') || questionText.includes('都道府県')) return 'prefectures';
        if (questionText.includes('地方') || questionText.includes('地域')) return 'regions';
        if (questionText.includes('国') || questionText.includes('世界')) return 'international';
      }
    }
    
    if (subject === 'civics') {
      if (questionText.includes('憲法') || questionText.includes('人権')) return 'constitution';
      if (questionText.includes('環境') || questionText.includes('地球')) return 'sustainability';
      if (questionText.includes('経済') || questionText.includes('市場')) return 'market';
    }
    
    return undefined; // 自動判定できない場合
  }

  /**
   * 説明文の品質向上
   */
  enhanceExplanation(explanation, questionText, subject) {
    let enhanced = explanation;
    
    // 短すぎる説明を拡張
    if (enhanced.length < 50) {
      this.qualityImprovements++;
      enhanced = `${enhanced} この問題は中学${subject === 'geography' ? '地理' : subject === 'history' ? '歴史' : '公民'}の重要なポイントです。`;
    }
    
    // 文末処理
    if (!enhanced.endsWith('。')) {
      enhanced += '。';
    }
    
    // 説明強化パターンを適用
    this.explanationEnhancers.forEach(enhancer => {
      if (enhancer.pattern.test(enhanced)) {
        enhanced = enhanced.replace(enhancer.pattern, enhancer.replacement);
      }
    });
    
    return enhanced;
  }

  /**
   * 品質スコアを計算
   */
  calculateQualityScore(question) {
    let score = 5; // ベーススコア
    
    // 説明文の長さ
    if (question.explanation.length > 100) score += 2;
    else if (question.explanation.length > 50) score += 1;
    
    // 質問文の質
    if (question.question.length > 30) score += 1;
    if (question.question.includes('？') || question.question.includes('ですか')) score += 1;
    
    // 選択肢の質
    if (question.options.length === 4) score += 1;
    if (question.options.every(opt => opt.length > 2)) score += 1;
    
    return Math.min(score, 10);
  }

  /**
   * 統一IDを生成
   */
  generateUnifiedId(subject, category, index) {
    const subjectCodes = {
      'geography': 'GEO',
      'history': 'HIS', 
      'civics': 'CIV'
    };
    
    const categoryCodes = {
      // Geography
      'physical': 'PHY',
      'human': 'HUM', 
      'regional': 'REG',
      
      // History
      'ancient': 'ANC',
      'medieval': 'MED',
      'early-modern': 'EAR',
      'modern': 'MOD',
      'contemporary': 'CON',
      
      // Civics
      'constitution': 'CON',
      'politics': 'POL',
      'economics': 'ECO',
      'environment': 'ENV'
    };
    
    const subjectCode = subjectCodes[subject] || 'GEN';
    const categoryCode = categoryCodes[category] || 'GEN';
    const paddedIndex = String(index + 1).padStart(3, '0');
    
    return `${subjectCode}_${categoryCode}_${paddedIndex}`;
  }

  /**
   * レガシー質問を統一形式に変換
   */
  convertQuestion(legacyQ, subject, index) {
    try {
      const category = this.convertCategory(subject, legacyQ.category, legacyQ.question);
      const subcategory = this.generateSubcategory(subject, category, legacyQ.question);
      const difficulty = this.convertDifficulty(legacyQ.difficulty);
      const enhancedExplanation = this.enhanceExplanation(legacyQ.explanation, legacyQ.question, subject);
      
      const unifiedQuestion = {
        id: this.generateUnifiedId(subject, category, index),
        subject: subject,
        category: category,
        ...(subcategory && { subcategory: subcategory }),
        ...(legacyQ.era && { era: { name: legacyQ.era, period: this.getEraPeriod(legacyQ.era) } }),
        grade: this.determineGrade(legacyQ.difficulty, legacyQ.question),
        difficulty: difficulty,
        tags: this.generateTags(subject, category, legacyQ.question),
        question: legacyQ.question,
        options: legacyQ.options,
        correct: legacyQ.correct,
        explanation: enhancedExplanation,
        type: legacyQ.type || 'multiple-choice',
        lastUpdated: new Date(),
        createdAt: new Date(),
        version: 1
      };
      
      unifiedQuestion.qualityScore = this.calculateQualityScore(unifiedQuestion);
      
      this.migratedCount++;
      return unifiedQuestion;
      
    } catch (error) {
      console.error(`Error converting question ${index}:`, error);
      this.errorCount++;
      return null;
    }
  }

  /**
   * 時代情報を取得
   */
  getEraPeriod(eraName) {
    const periods = {
      'ancient': '〜1185年',
      'medieval': '1185-1573年',
      'early-modern': '1573-1867年', 
      'modern': '1868-1945年',
      'contemporary': '1945年〜'
    };
    return periods[eraName] || '';
  }

  /**
   * 学年を推定
   */
  determineGrade(difficulty, questionText) {
    if (difficulty === 'easy' || difficulty === 'basic') return 4;
    if (difficulty === 'medium' || difficulty === 'standard') return 5;
    return 6;
  }

  /**
   * タグを自動生成
   */
  generateTags(subject, category, questionText) {
    const tags = [subject, category];
    
    // キーワードベースのタグ追加
    const keywordMappings = {
      '日本': 'japan',
      '世界': 'world', 
      '歴史': 'history',
      '地理': 'geography',
      '政治': 'politics',
      '経済': 'economics',
      '環境': 'environment',
      '文化': 'culture',
      '戦争': 'war',
      '平和': 'peace'
    };
    
    Object.entries(keywordMappings).forEach(([keyword, tag]) => {
      if (questionText.includes(keyword) && !tags.includes(tag)) {
        tags.push(tag);
      }
    });
    
    return tags;
  }

  /**
   * バッチ移行実行
   */
  async migrateBatch(subject, startIndex = 0, batchSize = 50) {
    console.log(`\n🔄 ${subject} 移行開始 (${startIndex} 番目から ${batchSize} 問)`);
    
    try {
      // レガシーファイルを読み込み
      const filename = subject === 'geography' ? 'geography-enhanced.ts' : `${subject}.ts`;
      const content = fs.readFileSync(`/home/user/webapp/src/data/${filename}`, 'utf8');
      
      // 質問配列を抽出
      const questionsMatch = content.match(/export const \w+Questions[\s\S]*?=[\s\S]*?\[([\s\S]*?)\];/);
      if (!questionsMatch) {
        throw new Error(`${subject} の質問配列が見つかりません`);
      }
      
      // JavaScript として評価して質問オブジェクトを取得
      const questionsArrayContent = questionsMatch[1];
      const questionsArray = eval(`[${questionsArrayContent}]`);
      
      const endIndex = Math.min(startIndex + batchSize, questionsArray.length);
      const batch = questionsArray.slice(startIndex, endIndex);
      
      console.log(`📊 処理対象: ${batch.length} 問`);
      
      // バッチ変換
      const convertedQuestions = [];
      batch.forEach((legacyQ, index) => {
        const converted = this.convertQuestion(legacyQ, subject, startIndex + index);
        if (converted) {
          convertedQuestions.push(converted);
        }
      });
      
      console.log(`✅ 変換完了: ${convertedQuestions.length} 問`);
      console.log(`🔧 品質改善: ${this.qualityImprovements} 箇所`);
      
      return {
        questions: convertedQuestions,
        processed: batch.length,
        hasMore: endIndex < questionsArray.length,
        nextIndex: endIndex
      };
      
    } catch (error) {
      console.error(`❌ ${subject} 移行エラー:`, error.message);
      return { questions: [], processed: 0, hasMore: false, nextIndex: startIndex };
    }
  }

  /**
   * 統計情報を出力
   */
  printStats() {
    console.log(`\n📈 **移行統計**`);
    console.log(`・移行完了: ${this.migratedCount} 問`);
    console.log(`・品質改善: ${this.qualityImprovements} 箇所`);
    console.log(`・エラー: ${this.errorCount} 件`);
    console.log(`・成功率: ${((this.migratedCount / (this.migratedCount + this.errorCount)) * 100).toFixed(1)}%`);
  }
}

// ツールをエクスポート
module.exports = EnhancedMigrationTool;

// スタンドアロン実行時
if (require.main === module) {
  const tool = new EnhancedMigrationTool();
  console.log('🚀 Enhanced Migration Tool - Ready for batch processing!');
  tool.printStats();
}