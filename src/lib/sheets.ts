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
      
      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/csv,text/plain,*/*'
        },
        redirect: 'follow' // リダイレクトを自動追跡
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log(`📥 取得したCSVサイズ: ${csvText.length} 文字`);
      
      // HTMLが返されていないかチェック
      if (csvText.includes('<HTML>') || csvText.includes('<html>')) {
        console.warn('🚨 HTMLが返されました - スプレッドシートのアクセス権限を確認してください');
        console.log('取得内容の先頭:', csvText.substring(0, 200));
        return [];
      }
      
      return this.parseCSV(csvText);
    } catch (error) {
      console.error('スプレッドシート取得エラー:', error);
      return [];
    }
  }

  /**
   * CSV文字列をパース（縦並び形式対応）
   */
  private parseCSV(csvText: string): SheetQuestion[] {
    const lines = csvText.split('\n');
    const questions: SheetQuestion[] = [];
    
    console.log('📊 スプレッドシートからデータを処理中...');
    console.log(`   総行数: ${lines.length}`);
    console.log(`   先頭3行の内容:`);
    lines.slice(0, 3).forEach((line, i) => {
      console.log(`     ${i + 1}: ${line}`);
    });
    
    // ヘッダー行をスキップして、2行目以降からキーワードを抽出
    for (let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
      const columns = this.parseCSVLine(lines[rowIndex]);
      
      // B列（index 1）からキーワードを取得
      const keyword = columns[1]?.trim().replace(/\r/g, '');
      
      if (keyword && keyword !== '' && keyword.length > 1) {
        // ヘッダー行の「キーワード」をスキップ
        if (keyword === 'キーワード') continue;
        
        questions.push({
          id: questions.length + 1,
          keyword: keyword,
          explanation: `${keyword}について詳しく学習しましょう。`, // デフォルト解説
          subject: this.detectSubject(keyword, ''),
          status: 'pending'
        });
      }
      
      // 制限を削除してすべてのデータを取得
      // 以前の制限: if (questions.length > 100) break;
    }
    
    console.log(`✅ ${questions.length}件のキーワードを取得完了`);
    if (questions.length > 0) {
      console.log(`📝 最初: ${questions[0].keyword}`);
      console.log(`📝 最後: ${questions[questions.length - 1].keyword}`);
      
      if (questions.length > 100) {
        console.log(`🎉 101行制限を突破！ 合計 ${questions.length} 件のデータを取得しました`);
      }
    }
    
    // 処理された行の詳細を表示
    console.log(`📈 処理統計: ${lines.length - 1} 行中 ${questions.length} 行が有効なキーワードでした`);
    
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