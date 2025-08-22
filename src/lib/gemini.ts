// Gemini API連携ライブラリ
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

export class GeminiService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * スプレッドシートのデータから問題を生成
   */
  async generateQuestionFromSheet(sheetData: SheetQuestion): Promise<GeneratedQuestion | null> {
    try {
      const prompt = this.createQuestionPrompt(sheetData);
      const response = await this.callGeminiAPI(prompt);
      
      if (response) {
        return {
          ...response,
          source: sheetData
        };
      }
      
      return null;
    } catch (error) {
      console.error('Gemini API呼び出しエラー:', error);
      return null;
    }
  }

  /**
   * 複数の問題を一括生成
   */
  async generateMultipleQuestions(sheetDataList: SheetQuestion[]): Promise<GeneratedQuestion[]> {
    const results: GeneratedQuestion[] = [];
    
    // APIレート制限を考慮して順次実行
    for (const sheetData of sheetDataList) {
      const question = await this.generateQuestionFromSheet(sheetData);
      if (question) {
        results.push(question);
      }
      
      // APIレート制限対応：1秒待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * 問題生成用プロンプトを作成
   */
  private createQuestionPrompt(sheetData: SheetQuestion): string {
    return `
中学受験レベルの4択問題を作成してください。

【キーワード/答え】: ${sheetData.keyword}
【解説】: ${sheetData.explanation}

以下の条件を満たしてください：
1. 問題文は中学受験生に適したレベル
2. 4つの選択肢を作成（正解1つ、もっともらしい間違い3つ）
3. 解説は提供された内容をベースに分かりやすく

出力形式は以下のJSONのみ：
{
  "question": "問題文をここに記述",
  "options": [
    "選択肢1（正解）",
    "選択肢2",
    "選択肢3", 
    "選択肢4"
  ],
  "correct": 0,
  "explanation": "解説文をここに記述",
  "difficulty": "medium",
  "subject": "${sheetData.subject}",
  "category": "自動判定したカテゴリ"
}
`;
  }

  /**
   * Gemini APIを呼び出し
   */
  private async callGeminiAPI(prompt: string): Promise<Omit<GeneratedQuestion, 'source'> | null> {
    try {
      // 実際のGemini API呼び出し
      // 注: 実装時は環境変数から API Key を取得
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        const generatedText = result.candidates[0].content.parts[0].text;
        
        // JSON部分を抽出してパース
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const questionData = JSON.parse(jsonMatch[0]);
          return questionData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Gemini API呼び出しエラー:', error);
      return null;
    }
  }

  /**
   * 開発用：モックデータでテスト
   */
  async generateMockQuestion(sheetData: SheetQuestion): Promise<GeneratedQuestion> {
    // 開発・テスト用のモック実装
    await new Promise(resolve => setTimeout(resolve, 500)); // API呼び出しを模擬

    return {
      question: `${sheetData.keyword}に関する問題です。正しいものを選んでください。`,
      options: [
        sheetData.keyword, // 正解
        "ダミー選択肢1",
        "ダミー選択肢2", 
        "ダミー選択肢3"
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