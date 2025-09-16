// 解説生成ライブラリ
import { SheetQuestion } from './sheets';

export interface GeneratedExplanation {
  keyword: string;
  explanation: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  references?: string[];
}

export class ExplanationGenerator {
  /**
   * キーワードから詳細な解説を生成
   */
  async generateExplanation(keyword: string): Promise<GeneratedExplanation> {
    try {
      // GenSpark AIで解説を生成
      const generatedExplanation = await this.generateWithGenSparkAI(keyword);
      
      return {
        keyword,
        explanation: generatedExplanation.explanation,
        subject: this.detectSubject(keyword),
        difficulty: this.estimateDifficulty(keyword),
        tags: this.extractTags(keyword),
        references: generatedExplanation.references
      };
    } catch (error) {
      console.error(`解説生成エラー (${keyword}):`, error);
      // エラー時はデフォルト解説を生成
      return this.createFallbackExplanation(keyword);
    }
  }

  /**
   * 複数のキーワードの解説を一括生成
   */
  async generateMultipleExplanations(keywords: string[]): Promise<GeneratedExplanation[]> {
    const results: GeneratedExplanation[] = [];
    
    for (const keyword of keywords) {
      try {
        const explanation = await this.generateExplanation(keyword);
        results.push(explanation);
        
        // API制限対策で少し待機
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`解説生成エラー (${keyword}):`, error);
        results.push(this.createFallbackExplanation(keyword));
      }
    }
    
    return results;
  }

  /**
   * GenSpark AIで解説を生成
   */
  private async generateWithGenSparkAI(keyword: string): Promise<{explanation: string, references?: string[]}> {
    const prompt = this.createExplanationPrompt(keyword);

    try {
      const response = await fetch('/api/generate-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          keyword: keyword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          explanation: data.explanation,
          references: data.references
        };
      } else {
        throw new Error(data.error || '解説生成に失敗しました');
      }
    } catch (error) {
      console.error('GenSpark AI API エラー:', error);
      throw error;
    }
  }

  /**
   * 学習効果の高い解説生成用プロンプト作成
   */
  private createExplanationPrompt(keyword: string): string {
    const subject = this.detectSubject(keyword);
    const subjectName = this.getSubjectName(subject);
    
    return `中学受験の${subjectName}分野「${keyword}」について、中学受験を控える小学6年生の知識定着のための解説を作成してください。

            【対象レベル】
            ・中学受験（小学6年生）の学習範囲内
            ・四択問題として後で活用予定
            
            【解説要件】
            1. **文字数**: 50-100文字程度（簡潔で要点を押さえた内容）
            2. **内容**: 
               - 基本的な定義や意味
               - 重要な年代・人物・場所
               - 歴史的意義や現代への影響
               - 代表例や具体例
            3. **表現**: 
               - 中学受験生が理解できる平易な言葉
               - 専門用語には簡単な説明を併記
               - 記憶に残りやすい特徴的な情報を含む
            
            【分野別ポイント】
            ・**歴史**: 年代、人物、出来事の背景と影響
            ・**地理**: 位置、気候、産業、特産品
            ・**政治**: 制度の仕組み、目的、現代との関連
            ・**文化**: 時代背景、代表作品、影響
            
            【出力形式】
            各キーワードについて以下の形式で出力：
            ${keyword}は 【解説】。
            `;
  }

  /**
   * 科目判定
   */
  private detectSubject(keyword: string): string {
    const text = keyword.toLowerCase();
    
    // 地理関連
    if (text.includes('県') || text.includes('市') || text.includes('気候') || 
        text.includes('海岸') || text.includes('山') || text.includes('川') ||
        text.includes('リアス') || text.includes('砂州') || text.includes('半島') ||
        text.includes('工業') || text.includes('農業') || text.includes('漁業') ||
        text.includes('特産品') || text.includes('カルスト')) {
      return 'geography';
    }
    
    // 歴史関連
    if (text.includes('時代') || text.includes('幕府') || text.includes('将軍') ||
        text.includes('源') || text.includes('平') || text.includes('藤原') ||
        text.includes('戦') || text.includes('卑弥呼') || text.includes('北条') ||
        text.includes('明治') || text.includes('大正') || text.includes('昭和') ||
        text.includes('デモクラシー') || text.includes('ghq') || text.includes('製鉄所')) {
      return 'history';
    }
    
    // 公民関連
    if (text.includes('憲法') || text.includes('政治') || text.includes('法') ||
        text.includes('制度') || text.includes('権利') || text.includes('義務') ||
        text.includes('ケアラー') || text.includes('高齢化') || text.includes('支援') ||
        text.includes('oda') || text.includes('改正') || text.includes('インフォームド') ||
        text.includes('トレーサビリティ') || text.includes('エコツーリズム')) {
      return 'civics';
    }
    
    return 'geography'; // デフォルト
  }

  /**
   * 科目名取得
   */
  private getSubjectName(subject: string): string {
    switch (subject) {
      case 'geography': return '地理';
      case 'history': return '歴史';
      case 'civics': return '公民';
      default: return '社会';
    }
  }

  /**
   * 難易度推定
   */
  private estimateDifficulty(keyword: string): 'easy' | 'medium' | 'hard' {
    // 長さと複雑さで判定
    if (keyword.length <= 4) return 'easy';
    if (keyword.length <= 8) return 'medium';
    return 'hard';
  }

  /**
   * タグ抽出
   */
  private extractTags(keyword: string): string[] {
    const tags: string[] = [];
    
    if (keyword.includes('時代')) tags.push('時代');
    if (keyword.includes('戦')) tags.push('戦争');
    if (keyword.includes('海岸') || keyword.includes('地形')) tags.push('地形');
    if (keyword.includes('気候')) tags.push('気候');
    if (keyword.includes('憲法') || keyword.includes('法')) tags.push('法律');
    if (keyword.includes('工業') || keyword.includes('農業')) tags.push('産業');
    
    return tags;
  }

  /**
   * フォールバック解説生成
   */
  private createFallbackExplanation(keyword: string): GeneratedExplanation {
    const subject = this.detectSubject(keyword);
    const subjectName = this.getSubjectName(subject);
    
    return {
      keyword,
      explanation: `${keyword}は${subjectName}の重要な学習項目です。中学受験でよく出題される内容で、基本的な概念を理解することが大切です。関連する用語や背景知識と合わせて覚えましょう。`,
      subject,
      difficulty: this.estimateDifficulty(keyword),
      tags: this.extractTags(keyword)
    };
  }
}
