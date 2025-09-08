// 問題作成品質保証システム
// 新しい問題が追加される際に自動的に品質をチェック

class QuestionQualityValidator {
  constructor() {
    this.minimumQualityScore = 7.0;
    this.validationRules = this.initializeValidationRules();
  }

  initializeValidationRules() {
    return {
      // 1. 基本構造チェック
      basicStructure: {
        name: '基本構造チェック',
        validate: (question) => {
          const errors = [];
          
          if (!question.question || question.question.trim().length < 10) {
            errors.push('問題文が短すぎます（最低10文字必要）');
          }
          
          if (!question.options || question.options.length !== 4) {
            errors.push('選択肢は4つ必要です');
          }
          
          if (question.correct < 0 || question.correct >= 4) {
            errors.push('正解インデックスが無効です（0-3の範囲）');
          }
          
          if (!question.explanation || question.explanation.trim().length < 20) {
            errors.push('説明文が短すぎます（最低20文字必要）');
          }
          
          return errors;
        }
      },

      // 2. 自己参照チェック（A はどれですか？答え『A』パターン）
      selfReference: {
        name: '自己参照チェック',
        validate: (question) => {
          const errors = [];
          const questionText = question.question.toLowerCase().trim();
          const correctOption = question.options[question.correct].toLowerCase().trim();
          
          // 問題文に含まれる主要キーワードが正解選択肢にそのまま含まれているかチェック
          const questionKeywords = questionText.match(/[ぁ-んァ-ヶー一-龯]+/g) || [];
          
          for (const keyword of questionKeywords) {
            if (keyword.length > 2 && correctOption.includes(keyword)) {
              errors.push(`問題文のキーワード「${keyword}」が正解選択肢にそのまま含まれています`);
            }
          }
          
          // 完全一致チェック
          if (questionKeywords.some(keyword => keyword === correctOption)) {
            errors.push('問題文と正解選択肢が同一です（自己参照問題）');
          }
          
          return errors;
        }
      },

      // 3. 選択肢重複チェック
      duplicateOptions: {
        name: '選択肢重複チェック',
        validate: (question) => {
          const errors = [];
          const options = question.options.map(opt => opt.trim().toLowerCase());
          const uniqueOptions = [...new Set(options)];
          
          if (uniqueOptions.length !== options.length) {
            errors.push('選択肢に重複があります');
          }
          
          return errors;
        }
      },

      // 4. 選択肢論理性チェック
      optionLogic: {
        name: '選択肢論理性チェック',
        validate: (question) => {
          const errors = [];
          const questionText = question.question;
          
          // 人物について問うているのに時代や地名が選択肢にある場合
          if (questionText.includes('について') || questionText.includes('に関して')) {
            const hasTimeOrPlace = question.options.some(opt => 
              opt.includes('時代') || opt.includes('世紀') || 
              opt.includes('県') || opt.includes('地域') ||
              opt.includes('気候') || opt.includes('世')
            );
            
            if (hasTimeOrPlace && questionText.match(/[一-龯]+について/)) {
              const subject = questionText.match(/([一-龯]+)について/)[1];
              if (!question.options.some(opt => opt.includes(subject))) {
                errors.push('問題の主語と選択肢のカテゴリが一致していません');
              }
            }
          }
          
          // 選択肢が極端に短い（1-2文字）場合
          const shortOptions = question.options.filter(opt => opt.trim().length <= 2);
          if (shortOptions.length > 2) {
            errors.push('選択肢が短すぎます（3文字以上推奨）');
          }
          
          return errors;
        }
      },

      // 5. 教育的価値チェック
      educationalValue: {
        name: '教育的価値チェック',
        validate: (question) => {
          const errors = [];
          
          // 具体的な知識を問うているかチェック
          const hasSpecificQuery = question.question.includes('何') || 
                                  question.question.includes('どこ') || 
                                  question.question.includes('いつ') || 
                                  question.question.includes('誰') ||
                                  question.question.includes('どのような') ||
                                  question.question.includes('正しい') ||
                                  question.question.includes('適切');
          
          if (!hasSpecificQuery) {
            errors.push('具体的な知識を問う表現が不足しています');
          }
          
          // 説明文に教育的内容が含まれているかチェック
          const explanation = question.explanation;
          const hasEducationalContent = explanation.includes('ため') || 
                                      explanation.includes('による') || 
                                      explanation.includes('なぜなら') ||
                                      explanation.includes('重要') ||
                                      explanation.includes('特徴') ||
                                      explanation.length > 50;
          
          if (!hasEducationalContent) {
            errors.push('説明文に教育的内容が不足しています');
          }
          
          return errors;
        }
      },

      // 6. 科目適合性チェック
      subjectRelevance: {
        name: '科目適合性チェック',
        validate: (question) => {
          const errors = [];
          
          const subjectKeywords = {
            geography: ['地域', '気候', '工業', '農業', '都道府県', '山', '川', '平野', '盆地'],
            history: ['時代', '年', '戦', '政治', '文化', '天皇', '将軍', '幕府', '朝廷'],
            civics: ['憲法', '権利', '政府', '法律', '制度', '民主主義', '選挙', '国会', '裁判所']
          };
          
          const text = question.question + ' ' + question.explanation;
          let matchedSubjects = [];
          
          Object.entries(subjectKeywords).forEach(([subject, keywords]) => {
            if (keywords.some(keyword => text.includes(keyword))) {
              matchedSubjects.push(subject);
            }
          });
          
          if (matchedSubjects.length === 0) {
            errors.push('どの科目にも適合するキーワードが見つかりません');
          }
          
          if (question.subject && !matchedSubjects.includes(question.subject)) {
            errors.push(`指定された科目「${question.subject}」と内容が一致していません`);
          }
          
          return errors;
        }
      }
    };
  }

  // 問題の品質を検証
  validateQuestion(question) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      qualityScore: 10.0,
      details: {}
    };

    // 各ルールを適用
    Object.entries(this.validationRules).forEach(([ruleKey, rule]) => {
      const ruleErrors = rule.validate(question);
      
      result.details[ruleKey] = {
        name: rule.name,
        passed: ruleErrors.length === 0,
        errors: ruleErrors
      };
      
      if (ruleErrors.length > 0) {
        result.errors.push(...ruleErrors.map(error => `[${rule.name}] ${error}`));
        result.qualityScore -= ruleErrors.length * 1.5;
      }
    });

    // 品質スコアの調整
    result.qualityScore = Math.max(0, Math.min(10, result.qualityScore));
    result.isValid = result.qualityScore >= this.minimumQualityScore && result.errors.length === 0;

    return result;
  }

  // 複数問題の一括検証
  validateQuestions(questions) {
    console.log(`🔍 ${questions.length}問の品質検証を開始...`);
    
    const results = questions.map((question, index) => {
      const validation = this.validateQuestion(question);
      return {
        index: index,
        id: question.id || `question_${index}`,
        ...validation
      };
    });

    // 統計情報
    const validCount = results.filter(r => r.isValid).length;
    const invalidCount = results.length - validCount;
    const averageScore = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length;

    console.log('\n📊 品質検証結果:');
    console.log(`✅ 合格: ${validCount}問 (${(validCount/results.length*100).toFixed(1)}%)`);
    console.log(`❌ 不合格: ${invalidCount}問 (${(invalidCount/results.length*100).toFixed(1)}%)`);
    console.log(`📈 平均品質スコア: ${averageScore.toFixed(1)}/10`);

    // 不合格問題の詳細表示
    const failedQuestions = results.filter(r => !r.isValid);
    if (failedQuestions.length > 0) {
      console.log('\n❌ 品質基準に満たない問題:');
      failedQuestions.slice(0, 5).forEach(result => {
        console.log(`\n問題 ${result.id} (スコア: ${result.qualityScore.toFixed(1)})`);
        result.errors.forEach(error => console.log(`  - ${error}`));
      });

      if (failedQuestions.length > 5) {
        console.log(`\n... 他${failedQuestions.length - 5}問`);
      }
    }

    return {
      summary: {
        total: results.length,
        valid: validCount,
        invalid: invalidCount,
        averageScore: averageScore
      },
      results: results
    };
  }

  // 問題作成ガイドラインを生成
  generateCreationGuidelines() {
    return {
      title: '高品質問題作成ガイドライン',
      rules: [
        {
          category: '基本要件',
          items: [
            '問題文は10文字以上で、明確で理解しやすい日本語を使用する',
            '選択肢は必ず4つ設定し、それぞれ異なる内容にする',
            '説明文は20文字以上で、正解の根拠を明確に示す'
          ]
        },
        {
          category: '品質基準',
          items: [
            '「A はどれですか？答え『A』」のような自己参照は避ける',
            '問題文のキーワードをそのまま正解選択肢にしない',
            '選択肢は同じカテゴリの内容で統一する（人物なら人物、時代なら時代）',
            '誤答選択肢も現実的で紛らわしいものを選ぶ'
          ]
        },
        {
          category: '教育的価値',
          items: [
            '具体的な知識や理解を問う内容にする',
            '学習指導要領に沿った内容を扱う',
            '説明文で「なぜそうなるのか」の理由も示す',
            '学習者の思考力を育てる問題を心がける'
          ]
        },
        {
          category: '科目別注意点',
          items: [
            '地理: 地名、気候、産業など地理的要素を適切に組み合わせる',
            '歴史: 時代背景、人物、出来事の関連性を考慮する', 
            '公民: 制度や概念の正確な理解を問う内容にする'
          ]
        }
      ],
      examples: {
        good: {
          question: "縄文時代の特徴として正しいものはどれですか？",
          options: ["竪穴住居での定住生活", "稲作の開始", "青銅器の使用", "古墳の建設"],
          correct: 0,
          explanation: "縄文時代は竪穴住居での定住生活が特徴です。この時代は狩猟・採集が中心で、土器の発達が見られました。"
        },
        bad: {
          question: "縄文時代について正しいものはどれですか？",
          options: ["縄文時代", "室町時代", "江戸時代", "現代"],
          correct: 0,
          explanation: "縄文時代について学習しましょう。"
        }
      }
    };
  }
}

// 使用例
if (require.main === module) {
  const validator = new QuestionQualityValidator();
  
  // サンプル問題でテスト
  const sampleQuestions = [
    {
      id: "TEST_001",
      subject: "history",
      question: "縄文時代の特徴として正しいものはどれですか？",
      options: ["竪穴住居での定住生活", "稲作の開始", "青銅器の使用", "古墳の建設"],
      correct: 0,
      explanation: "縄文時代は竪穴住居での定住生活が特徴です。この時代は狩猟・採集が中心で、土器の発達が見られました。"
    },
    {
      id: "TEST_002", 
      subject: "history",
      question: "藤原不比等について正しいものはどれですか？",
      options: ["藤原不比等", "近世", "大久保利通", "室町時代"],
      correct: 0,
      explanation: "藤原不比等について詳しく学習しましょう。"
    }
  ];

  console.log('🔍 品質保証システムのテスト実行...\n');
  
  const validation = validator.validateQuestions(sampleQuestions);
  
  console.log('\n📋 問題作成ガイドライン:');
  const guidelines = validator.generateCreationGuidelines();
  console.log(`\n${guidelines.title}`);
  
  guidelines.rules.forEach(rule => {
    console.log(`\n📌 ${rule.category}:`);
    rule.items.forEach(item => console.log(`  • ${item}`));
  });
}

module.exports = QuestionQualityValidator;