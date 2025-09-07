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
   * CSV文字列をパース（横並び形式対応）
   */
  private parseCSV(csvText: string): SheetQuestion[] {
    const lines = csvText.split('\n');
    const questions: SheetQuestion[] = [];
    
    // デバッグ用ログ
    console.log('📊 CSV行数:', lines.length);
    if (lines.length > 0) {
      console.log('📋 1行目:', lines[0]);
      if (lines.length > 1) {
        console.log('📋 2行目:', lines[1]);
      }
    }
    
    // 複数行をチェックして、キーワードが含まれている行を探す
    for (let rowIndex = 0; rowIndex < Math.min(lines.length, 5); rowIndex++) {
      const columns = this.parseCSVLine(lines[rowIndex]);
      console.log(`📋 ${rowIndex + 1}行目の列数:`, columns.length);
      
      // B列から始まってキーワードが存在する限り処理
      for (let col = 1; col < columns.length; col++) {
        const keyword = columns[col]?.trim();
        
        if (keyword && keyword !== '' && keyword.length > 1) {
          // 重複チェック
          const exists = questions.some(q => q.keyword === keyword);
          if (!exists) {
            questions.push({
              id: questions.length + 1,
              keyword: keyword,
              explanation: `${keyword}について詳しく学習しましょう。`, // デフォルト解説
              subject: this.detectSubject(keyword, ''),
              status: 'pending'
            });
          }
        }
      }
      
      // 十分なキーワードが見つかったら終了
      if (questions.length > 50) break;
    }
    
    console.log('✅ 抽出されたキーワード数:', questions.length);
    if (questions.length > 0) {
      console.log('📝 最初の5件:', questions.slice(0, 5).map(q => q.keyword));
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

  /**
   * 解説データをGoogle Sheets C列用のCSV形式で生成
   * @param explanations 解説データ配列
   * @returns CSV形式の文字列
   */
  generateCSVForColumn(explanations: {keyword: string, explanation: string}[]): string {
    // Google Sheetsの列に直接貼り付け用のCSV（改行区切り）
    return explanations.map(exp => 
      `"${exp.explanation.replace(/"/g, '""')}"`
    ).join('\n');
  }

  /**
   * 解説データを完全なCSV形式で生成（ダウンロード用）
   */
  generateFullCSV(explanations: {keyword: string, explanation: string, subject?: string}[]): string {
    const header = 'キーワード,解説,科目\n';
    const rows = explanations.map(exp => 
      `"${exp.keyword}","${exp.explanation.replace(/"/g, '""')}","${exp.subject || ''}"`
    ).join('\n');
    
    return header + rows;
  }

  /**
   * キーワードと行番号のマッピングを取得（C列への正確な配置用）
   */
  async getKeywordRowMapping(): Promise<Map<string, number>> {
    const questions = await this.fetchQuestionsData();
    const mapping = new Map<string, number>();
    
    questions.forEach((question, index) => {
      mapping.set(question.keyword, index + 2); // ヘッダー行を考慮して+2
    });
    
    return mapping;
  }
}