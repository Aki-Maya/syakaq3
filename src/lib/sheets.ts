// Google Sheets API連携ライブラリ
export interface SheetQuestion {
  id: number;
  keyword: string;
  explanation: string;
  subject?: string;
  status?: 'pending' | 'generated' | 'added';
  generatedAt?: string;
}

export class SheetsService {
  private sheetId = '1gI0WuQn5N0jqRAs04Y4gyZ6OI6AoGEB2WkoCDskI7Zw';
  private gid = '134040064'; // 現在のシートのgid
  
  /**
   * スプレッドシートからデータを取得（CSV形式でパブリック取得）
   */
  async fetchQuestionsData(): Promise<SheetQuestion[]> {
    try {
      // Google SheetsのCSV出力URLを使用
      const csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv&gid=${this.gid}`;
      
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      
      return this.parseCSV(csvText);
    } catch (error) {
      console.error('スプレッドシート取得エラー:', error);
      return [];
    }
  }

  /**
   * CSV文字列をパース
   */
  private parseCSV(csvText: string): SheetQuestion[] {
    const lines = csvText.split('\n');
    const questions: SheetQuestion[] = [];
    
    for (let i = 1; i < lines.length; i++) { // ヘッダー行をスキップ
      const columns = this.parseCSVLine(lines[i]);
      
      // B列（キーワード）とC列（解説）が両方存在する場合のみ
      if (columns[1] && columns[2]) {
        questions.push({
          id: i,
          keyword: columns[1].trim(),
          explanation: columns[2].trim(),
          subject: this.detectSubject(columns[1], columns[2]),
          status: 'pending'
        });
      }
    }
    
    return questions;
  }

  /**
   * CSVの1行をパース（カンマとクォートを適切に処理）
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  /**
   * キーワードと解説から科目を自動判定
   */
  private detectSubject(keyword: string, explanation: string): string {
    const text = (keyword + ' ' + explanation).toLowerCase();
    
    // 地理関連キーワード
    if (text.includes('県') || text.includes('市') || text.includes('気候') || 
        text.includes('生産量') || text.includes('山') || text.includes('川') ||
        text.includes('カルスト') || text.includes('富士山')) {
      return 'geography';
    }
    
    // 歴史関連キーワード
    if (text.includes('時代') || text.includes('幕府') || text.includes('将軍') ||
        text.includes('源') || text.includes('平') || text.includes('藤原') ||
        text.includes('鎌倉') || text.includes('室町') || text.includes('江戸') ||
        text.includes('明治') || text.includes('大正') || text.includes('昭和')) {
      return 'history';
    }
    
    // 公民関連キーワード
    if (text.includes('貨幣') || text.includes('経済') || text.includes('政治') ||
        text.includes('国債') || text.includes('税') || text.includes('憲法') ||
        text.includes('交換') || text.includes('財政')) {
      return 'civics';
    }
    
    return 'geography'; // デフォルト
  }

  /**
   * 新しいデータのみを取得（前回取得時との差分）
   */
  async getNewQuestions(lastFetchTime?: string): Promise<SheetQuestion[]> {
    const allQuestions = await this.fetchQuestionsData();
    
    // 既存データとの重複チェックやフィルタリングロジックをここに実装
    // 今回は全データを返す（実際は localStorage などで管理）
    return allQuestions;
  }
}