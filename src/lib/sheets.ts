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
   * CSV文字列をパース（横並び形式のキーワードに対応）
   */
  private parseCSV(csvText: string): SheetQuestion[] {
    const lines = csvText.split('\n');
    const questions: SheetQuestion[] = [];
    
    // 各行を処理
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const columns = this.parseCSVLine(lines[lineIndex]);
      
      // 各列をキーワードとして処理（空でない場合のみ）
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const keyword = columns[colIndex]?.trim();
        
        // 空文字、ヘッダー的な文字列、特殊文字のみの場合はスキップ
        if (keyword && 
            keyword !== '間違えた問題' && 
            keyword.length > 1 &&
            !keyword.match(/^[,\s]*$/)) {
          
          questions.push({
            id: questions.length + 1, // 連番でID生成
            keyword: keyword,
            explanation: this.generateDefaultExplanation(keyword),
            subject: this.detectSubject(keyword, ''),
            status: 'pending'
          });
        }
      }
    }
    
    // 重複を除去（同じキーワードが複数ある場合）
    const uniqueQuestions = questions.filter((question, index, self) => 
      index === self.findIndex(q => q.keyword === question.keyword)
    );
    
    console.log(`📊 スプレッドシートから ${uniqueQuestions.length}件のキーワードを取得しました`);
    return uniqueQuestions;
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
   * キーワードからデフォルト解説を生成
   */
  private generateDefaultExplanation(keyword: string): string {
    // キーワードの特徴に基づいて基本的な解説を生成
    if (keyword.includes('海岸') || keyword.includes('地形')) {
      return `${keyword}について詳しく学習しましょう。地理の重要な概念です。`;
    } else if (keyword.includes('時代') || keyword.includes('戦') || 
               keyword.match(/^[源平藤]/) || keyword.includes('幕府')) {
      return `${keyword}について詳しく学習しましょう。日本史の重要な人物・出来事です。`;
    } else if (keyword.includes('憲法') || keyword.includes('政治') || 
               keyword.includes('法') || keyword.includes('制度')) {
      return `${keyword}について詳しく学習しましょう。公民の重要な概念です。`;
    } else if (keyword.includes('文学') || keyword.match(/龍之介|芭蕉|芥川/)) {
      return `${keyword}について詳しく学習しましょう。文学史の重要な人物・作品です。`;
    } else {
      return `${keyword}について詳しく学習しましょう。中学受験の重要な学習項目です。`;
    }
  }

  /**
   * キーワードと解説から科目を自動判定
   */
  private detectSubject(keyword: string, explanation: string): string {
    const text = (keyword + ' ' + explanation).toLowerCase();
    
    // 地理関連キーワード（より詳細な判定）
    if (text.includes('県') || text.includes('市') || text.includes('気候') || 
        text.includes('生産量') || text.includes('山') || text.includes('川') ||
        text.includes('カルスト') || text.includes('富士山') || text.includes('海岸') ||
        text.includes('リアス') || text.includes('砂州') || text.includes('半島') ||
        text.includes('工業') || text.includes('農業') || text.includes('漁業') ||
        text.includes('松江') || text.includes('熊本') || text.includes('特産品')) {
      return 'geography';
    }
    
    // 歴史関連キーワード（より詳細な判定）
    if (text.includes('時代') || text.includes('幕府') || text.includes('将軍') ||
        text.includes('源') || text.includes('平') || text.includes('藤原') ||
        text.includes('鎌倉') || text.includes('室町') || text.includes('江戸') ||
        text.includes('明治') || text.includes('大正') || text.includes('昭和') ||
        text.includes('戦') || text.includes('壇ノ浦') || text.includes('卑弥呼') ||
        text.includes('北条') || text.includes('琉球') || text.includes('デモクラシー') ||
        text.includes('ghq') || text.includes('人形浄瑠璃') || text.includes('八幡製鉄所')) {
      return 'history';
    }
    
    // 公民関連キーワード（より詳細な判定）
    if (text.includes('貨幣') || text.includes('経済') || text.includes('政治') ||
        text.includes('国債') || text.includes('税') || text.includes('憲法') ||
        text.includes('交換') || text.includes('財政') || text.includes('法') ||
        text.includes('制度') || text.includes('権利') || text.includes('義務') ||
        text.includes('ヤングケアラー') || text.includes('高齢化') || 
        text.includes('子育て支援') || text.includes('oda') || text.includes('改正') ||
        text.includes('インフォームドコンセント') || text.includes('トレーサビリティ') ||
        text.includes('エコツーリズム') || text.includes('爆買い')) {
      return 'civics';
    }
    
    // 文学・文化関連は歴史に分類
    if (text.includes('芥川') || text.includes('芭蕉') || text.includes('文学') || 
        text.includes('龍之介') || text.includes('バカンス')) {
      return 'history';
    }
    
    return 'geography'; // デフォルト
  }

  /**
   * 解説をスプレッドシートのC列に書き戻し（簡易版）
   * 注意: これは読み取り専用のCSV APIなので、実際の書き込みはできません
   * 実際の実装では Google Sheets API v4 の認証付きアクセスが必要
   */
  generateExplanationUpdates(keywords: string[], explanations: string[]): string {
    const updates: string[] = [];
    
    keywords.forEach((keyword, index) => {
      const explanation = explanations[index] || 'デフォルト解説';
      updates.push(`"${keyword}","${explanation}"`);
    });
    
    return `スプレッドシートに追加するCSVデータ:\n\n${updates.join('\n')}\n\n上記のデータをC列に手動でコピー&ペーストしてください。`;
  }

  /**
   * 解説生成用のCSVフォーマットを作成
   */
  createExplanationCSV(keywordExplanations: Array<{keyword: string, explanation: string}>): string {
    let csv = 'キーワード,解説\n';
    
    keywordExplanations.forEach(item => {
      // CSVエスケープ処理
      const escapedKeyword = `"${item.keyword.replace(/"/g, '""')}"`;
      const escapedExplanation = `"${item.explanation.replace(/"/g, '""')}"`;
      csv += `${escapedKeyword},${escapedExplanation}\n`;
    });
    
    return csv;
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
   * 実際にGoogle Sheets APIで書き込みを行う場合の準備
   * （将来の拡張用 - 認証とAPI設定が必要）
   */
  async writeExplanationsToSheet(explanationData: Array<{row: number, explanation: string}>): Promise<boolean> {
    // TODO: Google Sheets API v4 での書き込み実装
    // 1. サービスアカウント認証
    // 2. sheets.spreadsheets.values.batchUpdate API 呼び出し
    // 3. C列への一括更新
    
    console.log('📝 Google Sheets API書き込み（未実装）:', explanationData.length, '件');
    return false; // 暫定的にfalseを返す
  }
}