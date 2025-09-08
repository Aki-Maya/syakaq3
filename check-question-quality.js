#!/usr/bin/env node

const fs = require('fs');

class QuestionQualityChecker {
  constructor() {
    this.suspiciousPatterns = [
      /^A[はを。]?$/,
      /^B[はを。]?$/,
      /^C[はを。]?$/,
      /^D[はを。]?$/,
      /^1[はを。]?$/,
      /^2[はを。]?$/,
      /^3[はを。]?$/,
      /^4[はを。]?$/,
      /Aはどれですか/,
      /Bはどれですか/,
      /どれですか？?$/,
      /選択肢[ABCD1234]?$/, 
      /答え[はを「」ABCD1234]/,
    ];
    
    this.lowQualityIndicators = [
      /^.{1,10}$/,  // 極端に短い問題文
      /^選択肢/,    // 選択肢で始まる
      /^答え/,      // 答えで始まる
      /[ABCD][はを。]/,  // A は、B を、など
    ];
    
    this.problemQuestions = [];
    this.subjectStats = {
      geography: { total: 0, problematic: 0 },
      history: { total: 0, problematic: 0 },
      civics: { total: 0, problematic: 0 }
    };
  }

  analyzeQuestions() {
    console.log('🔍 問題の品質チェックを開始します...\n');
    
    const filePath = '/home/user/webapp/src/data/questions-unified.ts';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 問題を抽出
    const questionRegex = /{\s*"id":\s*"([^"]+)",[\s\S]*?"question":\s*"([^"]*?)"[\s\S]*?"options":\s*\[([^\]]*?)\][\s\S]*?}/g;
    let match;
    
    while ((match = questionRegex.exec(fileContent)) !== null) {
      const [fullMatch, id, questionText, optionsText] = match;
      
      // 科目判定
      const subject = this.getSubjectFromId(id);
      this.subjectStats[subject].total++;
      
      // 選択肢の解析
      const options = this.parseOptions(optionsText);
      
      // 品質チェック
      const issues = this.checkQuestionQuality(id, questionText, options);
      
      if (issues.length > 0) {
        this.subjectStats[subject].problematic++;
        this.problemQuestions.push({
          id,
          subject,
          question: questionText,
          options: options.slice(0, 4), // 最初の4つだけ表示
          issues
        });
      }
    }
    
    this.printResults();
  }

  getSubjectFromId(id) {
    if (id.startsWith('GEO_')) return 'geography';
    if (id.startsWith('HIS_')) return 'history';
    if (id.startsWith('CIV_')) return 'civics';
    return 'unknown';
  }

  parseOptions(optionsText) {
    // JSON配列風のテキストから選択肢を抽出
    const options = [];
    const matches = optionsText.match(/"([^"]*)"/g);
    if (matches) {
      matches.forEach(match => {
        const option = match.replace(/"/g, '');
        if (option.trim()) {
          options.push(option.trim());
        }
      });
    }
    return options;
  }

  checkQuestionQuality(id, questionText, options) {
    const issues = [];
    
    // 1. 問題文のチェック
    this.suspiciousPatterns.forEach(pattern => {
      if (pattern.test(questionText)) {
        issues.push(`問題文が疑わしい: "${questionText}"`);
      }
    });
    
    this.lowQualityIndicators.forEach(pattern => {
      if (pattern.test(questionText)) {
        issues.push(`低品質の可能性: "${questionText}"`);
      }
    });
    
    // 2. 選択肢のチェック
    const suspiciousOptions = options.filter(option => {
      return this.suspiciousPatterns.some(pattern => pattern.test(option)) ||
             this.lowQualityIndicators.some(pattern => pattern.test(option));
    });
    
    if (suspiciousOptions.length > 0) {
      issues.push(`疑わしい選択肢: ${suspiciousOptions.join(', ')}`);
    }
    
    // 3. 選択肢が単純すぎるかチェック
    const simpleOptions = options.filter(option => 
      /^[ABCD1234]$/.test(option) || 
      /^[あいうえ]$/.test(option) ||
      option.length < 3
    );
    
    if (simpleOptions.length > 0) {
      issues.push(`単純すぎる選択肢: ${simpleOptions.join(', ')}`);
    }
    
    // 4. 重複チェック
    const duplicateOptions = options.filter((option, index) => 
      options.indexOf(option) !== index
    );
    
    if (duplicateOptions.length > 0) {
      issues.push(`重複選択肢: ${duplicateOptions.join(', ')}`);
    }
    
    return issues;
  }

  printResults() {
    console.log('📊 === 問題品質チェック結果 ===\n');
    
    // 統計サマリー
    console.log('📈 **科目別統計**:');
    Object.entries(this.subjectStats).forEach(([subject, stats]) => {
      const subjectName = subject === 'geography' ? '地理' : 
                         subject === 'history' ? '歴史' : '公民';
      const problemRate = ((stats.problematic / stats.total) * 100).toFixed(1);
      const status = stats.problematic === 0 ? '✅' : 
                     stats.problematic < 3 ? '⚠️' : '🔴';
      
      console.log(`${status} ${subjectName}: ${stats.problematic}/${stats.total}問に問題 (${problemRate}%)`);
    });
    
    console.log('\n🔍 **問題のある問題一覧**:\n');
    
    if (this.problemQuestions.length === 0) {
      console.log('🎉 問題は見つかりませんでした！すべて正常です。');
      return;
    }
    
    // 科目別に問題を表示
    ['geography', 'history', 'civics'].forEach(subject => {
      const subjectName = subject === 'geography' ? '地理' : 
                         subject === 'history' ? '歴史' : '公民';
      const subjectProblems = this.problemQuestions.filter(p => p.subject === subject);
      
      if (subjectProblems.length > 0) {
        console.log(`\n🔴 **${subjectName}の問題**:`);
        subjectProblems.forEach((problem, index) => {
          console.log(`\n${index + 1}. ID: ${problem.id}`);
          console.log(`   問題: "${problem.question}"`);
          console.log(`   選択肢: ${problem.options.map((opt, i) => `${i+1}.${opt}`).join(' / ')}`);
          console.log(`   問題点: ${problem.issues.join('; ')}`);
        });
      }
    });
    
    // 修正提案
    console.log('\n💡 **修正提案**:');
    if (this.problemQuestions.length > 0) {
      console.log('1. 上記の問題のある問題を特定して手動修正');
      console.log('2. 自動修正ツールで一括処理');
      console.log('3. 問題を削除して新しい問題に置き換え');
    }
    
    console.log(`\n📊 **総合評価**: ${this.problemQuestions.length}/${Object.values(this.subjectStats).reduce((sum, stats) => sum + stats.total, 0)}問に問題があります`);
  }

  // 修正ツール用のメソッド
  generateFixSuggestions() {
    return this.problemQuestions.map(problem => ({
      id: problem.id,
      currentQuestion: problem.question,
      currentOptions: problem.options,
      suggestedFix: this.generateBetterQuestion(problem.subject, problem.question),
      issues: problem.issues
    }));
  }

  generateBetterQuestion(subject, originalQuestion) {
    const templates = {
      geography: [
        'の特徴として最も適切なものはどれですか。',
        'について正しく説明したものはどれですか。', 
        'に関する記述で適切なものを選びなさい。'
      ],
      history: [
        'の背景や意義として最も適切なものはどれですか。',
        'について正しく説明したものはどれですか。',
        'に関する記述で正しいものを選びなさい。'
      ],
      civics: [
        'の内容として最も適切なものはどれですか。',
        'について正しく説明したものはどれですか。',
        'に関する記述で適切なものを選びなさい。'
      ]
    };
    
    const subjectTemplates = templates[subject] || templates.civics;
    const template = subjectTemplates[0];
    
    return `適切な問題文${template}`;
  }
}

// 実行
const checker = new QuestionQualityChecker();
checker.analyzeQuestions();