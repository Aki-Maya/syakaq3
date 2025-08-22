// GenSpark AI連携ライブラリ
import { SheetQuestion } from './sheets';

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: 'geography' | 'history' | 'civics';
  category: string;
  source: SheetQuestion;
}

export class GenSparkAIService {
  /**
   * スプレッドシートのデータから問題を生成
   */
  async generateQuestionFromSheet(sheetData: SheetQuestion): Promise<GeneratedQuestion> {
    const prompt = this.createQuestionPrompt(sheetData);
    
    try {
      // GenSpark AIで問題を生成
      const generatedContent = await this.generateWithGenSparkAI(prompt);
      
      // 生成結果をパースして構造化
      const questionData = this.parseGeneratedContent(generatedContent, sheetData);
      
      return {
        ...questionData,
        source: sheetData
      };
    } catch (error) {
      console.error('GenSpark AI問題生成エラー:', error);
      // エラー時はフォールバック問題を生成
      return this.createFallbackQuestion(sheetData);
    }
  }

  /**
   * 複数の問題を一括生成
   */
  async generateMultipleQuestions(sheetDataList: SheetQuestion[]): Promise<GeneratedQuestion[]> {
    const results: GeneratedQuestion[] = [];
    
    for (const sheetData of sheetDataList) {
      try {
        const question = await this.generateQuestionFromSheet(sheetData);
        results.push(question);
        
        // 生成間隔を調整（必要に応じて）
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`問題生成エラー (${sheetData.keyword}):`, error);
        // エラーが発生した場合もフォールバック問題を追加
        results.push(this.createFallbackQuestion(sheetData));
      }
    }
    
    return results;
  }

  /**
   * GenSpark AIによる問題生成プロンプト作成
   */
  private createQuestionPrompt(sheetData: SheetQuestion): string {
    const subjectName = this.getSubjectName(sheetData.subject);
    
    return `中学受験の${subjectName}分野の4択問題を作成してください。

【問題の元となる情報】
キーワード/答え: ${sheetData.keyword}
詳細解説: ${sheetData.explanation}

【要件】
1. 中学受験レベルに適した難易度
2. 4つの選択肢（1つが正解、3つがもっともらしい間違い）
3. 間違い選択肢は実在するものや関連性のあるものを使用
4. 問題文は明確で分かりやすく
5. 解説は提供された情報をベースに教育的な内容で

問題を生成してください。`;
  }

  /**
   * GenSpark AIで実際に問題を生成
   */
  private async generateWithGenSparkAI(prompt: string): Promise<string> {
    // この部分でGenSpark AIのAPIを呼び出し
    // 実装方法はGenSparkの仕様に応じて調整
    
    // 暫定的な実装例（実際のAPIエンドポイントに合わせて修正）
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: 'genspark-ai',
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error(`API呼び出しエラー: ${response.status}`);
      }
      
      const result = await response.json();
      return result.generated_text || result.content || '';
    } catch (error) {
      console.error('GenSpark AI API呼び出しエラー:', error);
      throw error;
    }
  }

  /**
   * 生成されたコンテンツを解析して構造化データに変換
   */
  private parseGeneratedContent(content: string, sheetData: SheetQuestion): Omit<GeneratedQuestion, 'source'> {
    // AI生成テキストから問題、選択肢、解説を抽出
    // パターンマッチングや自然言語処理でパース
    
    try {
      // 問題文を抽出（例：「問題：」または「Q:」の後）
      const questionMatch = content.match(/(?:問題[：:]|Q[：:])\s*(.+?)(?=\n|選択肢|A[：:]|1[：.])/s);
      const question = questionMatch ? questionMatch[1].trim() : `${sheetData.keyword}について正しいものを選んでください。`;

      // 選択肢を抽出
      const options = this.extractOptions(content, sheetData);
      
      // 正解番号を判定
      const correct = this.determineCorrectAnswer(content, options, sheetData);
      
      // 解説を抽出または生成
      const explanation = this.extractExplanation(content, sheetData);

      return {
        question,
        options,
        correct,
        explanation,
        difficulty: 'medium' as const,
        subject: (sheetData.subject as any) || 'geography',
        category: this.detectCategory(sheetData)
      };
    } catch (error) {
      console.error('コンテンツパースエラー:', error);
      throw error;
    }
  }

  /**
   * 選択肢を抽出
   */
  private extractOptions(content: string, sheetData: SheetQuestion): string[] {
    // 選択肢パターンを検索
    const optionPatterns = [
      /[1-4][：.](.+?)(?=\n[1-4][：.]|\n\n|$)/g,
      /[A-D][：.](.+?)(?=\n[A-D][：.]|\n\n|$)/g,
      /(?:①|②|③|④)(.+?)(?=(?:①|②|③|④)|\n\n|$)/g
    ];

    for (const pattern of optionPatterns) {
      const matches = Array.from(content.matchAll(pattern));
      if (matches.length >= 3) {
        const options = matches.slice(0, 4).map(match => match[1].trim());
        
        // 正解がキーワードと一致するかチェック
        const hasCorrectAnswer = options.some(option => 
          option.includes(sheetData.keyword) || sheetData.keyword.includes(option)
        );
        
        if (hasCorrectAnswer) {
          return this.ensureFourOptions(options, sheetData);
        }
      }
    }

    // パターンマッチングに失敗した場合、デフォルト選択肢を生成
    return this.generateDefaultOptions(sheetData);
  }

  /**
   * 正解番号を判定
   */
  private determineCorrectAnswer(content: string, options: string[], sheetData: SheetQuestion): number {
    // 各選択肢がキーワードと一致するかチェック
    for (let i = 0; i < options.length; i++) {
      const option = options[i].toLowerCase();
      const keyword = sheetData.keyword.toLowerCase();
      
      if (option.includes(keyword) || keyword.includes(option)) {
        return i;
      }
    }
    
    // 明確な一致がない場合、最初の選択肢を正解とする
    return 0;
  }

  /**
   * 解説を抽出
   */
  private extractExplanation(content: string, sheetData: SheetQuestion): string {
    // 解説パターンを検索
    const explanationPatterns = [
      /(?:解説[：:]|説明[：:]|答え[：:])\s*(.+?)$/s,
      /(?:正解は|答えは)\s*(.+?)$/s
    ];

    for (const pattern of explanationPatterns) {
      const match = content.match(pattern);
      if (match && match[1].trim().length > 20) {
        return match[1].trim();
      }
    }

    // 解説が見つからない場合、元の解説を使用
    return sheetData.explanation;
  }

  /**
   * 4つの選択肢を確保
   */
  private ensureFourOptions(options: string[], sheetData: SheetQuestion): string[] {
    const result = [...options];
    
    // 不足分を補完
    while (result.length < 4) {
      result.push(this.generateDummyOption(sheetData.subject, result.length));
    }
    
    return result.slice(0, 4);
  }

  /**
   * デフォルト選択肢を生成
   */
  private generateDefaultOptions(sheetData: SheetQuestion): string[] {
    const correctAnswer = sheetData.keyword;
    
    // 科目に応じたダミー選択肢を生成
    const dummyOptions = this.generateSubjectSpecificDummies(sheetData.subject);
    
    return [
      correctAnswer,
      ...dummyOptions.slice(0, 3)
    ];
  }

  /**
   * 科目別のダミー選択肢生成
   */
  private generateSubjectSpecificDummies(subject?: string): string[] {
    const dummies = {
      geography: ['北海道', '東京都', '大阪府', '沖縄県', '愛知県', '福岡県'],
      history: ['源頼朝', '織田信長', '徳川家康', '坂本龍馬', '西郷隆盛', '伊藤博文'],
      civics: ['内閣総理大臣', '国会議員', '最高裁判所', '地方自治体', '選挙権', '憲法']
    };
    
    const subjectDummies = dummies[subject as keyof typeof dummies] || dummies.geography;
    return [...subjectDummies].sort(() => Math.random() - 0.5);
  }

  /**
   * ダミー選択肢を1つ生成
   */
  private generateDummyOption(subject?: string, index: number = 0): string {
    const dummies = this.generateSubjectSpecificDummies(subject);
    return dummies[index % dummies.length];
  }

  /**
   * フォールバック問題を作成（エラー時用）
   */
  private createFallbackQuestion(sheetData: SheetQuestion): GeneratedQuestion {
    return {
      question: `${sheetData.keyword}について正しい説明を選んでください。`,
      options: [
        sheetData.keyword,
        ...this.generateSubjectSpecificDummies(sheetData.subject).slice(0, 3)
      ],
      correct: 0,
      explanation: sheetData.explanation,
      difficulty: 'medium' as const,
      subject: (sheetData.subject as any) || 'geography',
      category: this.detectCategory(sheetData),
      source: sheetData
    };
  }

  /**
   * 科目名を取得
   */
  private getSubjectName(subject?: string): string {
    const names = {
      geography: '地理',
      history: '歴史', 
      civics: '公民'
    };
    return names[subject as keyof typeof names] || '地理';
  }

  /**
   * カテゴリ自動判定
   */
  private detectCategory(sheetData: SheetQuestion): string {
    const text = (sheetData.keyword + ' ' + sheetData.explanation).toLowerCase();
    
    if (sheetData.subject === 'geography') {
      if (text.includes('気候') || text.includes('降水')) return 'climate';
      if (text.includes('生産') || text.includes('農業')) return 'agriculture';
      if (text.includes('山') || text.includes('川') || text.includes('地形')) return 'landforms';
      return 'regions';
    }
    
    if (sheetData.subject === 'history') {
      if (text.includes('平安') || text.includes('鎌倉')) return 'ancient';
      if (text.includes('室町') || text.includes('江戸')) return 'medieval';
      if (text.includes('明治') || text.includes('大正')) return 'modern';
      return 'general';
    }
    
    if (sheetData.subject === 'civics') {
      if (text.includes('経済') || text.includes('貨幣')) return 'economy';
      if (text.includes('政治') || text.includes('憲法')) return 'politics';
      return 'general';
    }
    
    return 'general';
  }
}