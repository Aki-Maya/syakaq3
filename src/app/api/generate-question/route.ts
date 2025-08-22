import { NextRequest, NextResponse } from 'next/server';
// GenSpark AIの機能を活用した問題生成API

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = 'genspark-ai', temperature = 0.7, max_tokens = 1000 } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'プロンプトが必要です' }, { status: 400 });
    }

    // GenSpark AIを使用してテキスト生成
    // 注: 実際のGenSpark AIのテキスト生成APIがない場合は、
    // 画像生成APIの説明文機能を活用するか、独自のロジックで問題生成
    
    const generatedQuestion = await generateQuestionWithAI(prompt);
    
    return NextResponse.json({
      generated_text: generatedQuestion,
      model_used: model,
      success: true
    });

  } catch (error) {
    console.error('問題生成API エラー:', error);
    return NextResponse.json(
      { error: '問題生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * AIを使用して問題を生成する関数
 */
async function generateQuestionWithAI(prompt: string): Promise<string> {
  try {
    // GenSpark AIの機能を活用した問題生成
    // 実際のAPIに応じて実装を調整
    
    // 方法1: テキスト生成APIが利用可能な場合
    // const result = await someTextGenerationAPI(prompt);
    
    // 方法2: 既存のAI機能を活用した独自ロジック
    const questionData = await generateQuestionLogic(prompt);
    
    return questionData;
    
  } catch (error) {
    console.error('AI問題生成エラー:', error);
    throw error;
  }
}

/**
 * プロンプトから問題を生成するロジック
 */
async function generateQuestionLogic(prompt: string): Promise<string> {
  // プロンプトからキーワードと解説を抽出
  const keywordMatch = prompt.match(/キーワード\/答え:\s*(.+)/);
  const explanationMatch = prompt.match(/詳細解説:\s*(.+)/);
  
  const keyword = keywordMatch ? keywordMatch[1].trim() : '';
  const explanation = explanationMatch ? explanationMatch[1].trim() : '';
  
  if (!keyword || !explanation) {
    throw new Error('キーワードまたは解説が見つかりません');
  }

  // 科目を判定
  const subject = detectSubjectFromContent(keyword + ' ' + explanation);
  
  // 問題文を生成
  const question = generateQuestionText(keyword, subject);
  
  // 選択肢を生成
  const options = generateOptions(keyword, subject, explanation);
  
  // 解説を整理
  const formattedExplanation = formatExplanation(explanation, keyword);
  
  // 結果をフォーマット
  const result = `問題: ${question}

選択肢:
1. ${options[0]}
2. ${options[1]}
3. ${options[2]}
4. ${options[3]}

正解: 1

解説: ${formattedExplanation}`;

  return result;
}

/**
 * コンテンツから科目を判定
 */
function detectSubjectFromContent(text: string): 'geography' | 'history' | 'civics' {
  const lowerText = text.toLowerCase();
  
  // 地理関連キーワード
  if (lowerText.includes('県') || lowerText.includes('市') || lowerText.includes('気候') || 
      lowerText.includes('生産量') || lowerText.includes('山') || lowerText.includes('川') ||
      lowerText.includes('カルスト') || lowerText.includes('富士山') || lowerText.includes('地域')) {
    return 'geography';
  }
  
  // 歴史関連キーワード
  if (lowerText.includes('時代') || lowerText.includes('幕府') || lowerText.includes('将軍') ||
      lowerText.includes('源') || lowerText.includes('平') || lowerText.includes('藤原') ||
      lowerText.includes('鎌倉') || lowerText.includes('室町') || lowerText.includes('江戸') ||
      lowerText.includes('明治') || lowerText.includes('大正') || lowerText.includes('昭和') ||
      lowerText.includes('年') || lowerText.includes('時') || lowerText.includes('世紀')) {
    return 'history';
  }
  
  // 公民関連キーワード
  if (lowerText.includes('貨幣') || lowerText.includes('経済') || lowerText.includes('政治') ||
      lowerText.includes('国債') || lowerText.includes('税') || lowerText.includes('憲法') ||
      lowerText.includes('交換') || lowerText.includes('財政') || lowerText.includes('制度')) {
    return 'civics';
  }
  
  return 'geography'; // デフォルト
}

/**
 * 問題文を生成
 */
function generateQuestionText(keyword: string, subject: 'geography' | 'history' | 'civics'): string {
  const templates = {
    geography: [
      `${keyword}について正しい説明を選んでください。`,
      `${keyword}に関する記述として適切なものはどれですか。`,
      `次のうち、${keyword}について正しいものを選びなさい。`
    ],
    history: [
      `${keyword}について正しい説明を選んでください。`,
      `${keyword}に関する記述として適切なものはどれですか。`,
      `次のうち、${keyword}について正しいものを選びなさい。`
    ],
    civics: [
      `${keyword}について正しい説明を選んでください。`,
      `${keyword}に関する記述として適切なものはどれですか。`,
      `次のうち、${keyword}について正しいものを選びなさい。`
    ]
  };
  
  const subjectTemplates = templates[subject];
  return subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
}

/**
 * 選択肢を生成
 */
function generateOptions(keyword: string, subject: 'geography' | 'history' | 'civics', explanation: string): string[] {
  // 正解は常に最初
  const correctAnswer = keyword;
  
  // 科目別のダミー選択肢データベース
  const dummyOptions = {
    geography: {
      places: ['北海道', '本州', '四国', '九州', '沖縄', '東京都', '大阪府', '愛知県', '福岡県'],
      climate: ['温帯', '寒帯', '熱帯', '亜熱帯', '乾燥帯', '湿潤気候', '大陸性気候'],
      features: ['平野', '山地', '台地', '盆地', '半島', '湾', '海峡', '川', '湖'],
      agriculture: ['米', '小麦', 'とうもろこし', '大豆', '野菜', '果物', '畜産業', '漁業']
    },
    history: {
      periods: ['古代', '中世', '近世', '近代', '現代', '平安時代', '鎌倉時代', '室町時代', '江戸時代'],
      people: ['源頼朝', '織田信長', '豊臣秀吉', '徳川家康', '坂本龍馬', '西郷隆盛', '大久保利通'],
      events: ['関ヶ原の戦い', '本能寺の変', '明治維新', '大政奉還', '廃藩置県', '文明開化']
    },
    civics: {
      concepts: ['民主主義', '立憲主義', '法の支配', '人権', '自由', '平等', '公正'],
      institutions: ['国会', '内閣', '裁判所', '地方自治体', '選挙', '政党', '憲法'],
      economy: ['市場経済', '計画経済', '混合経済', '資本主義', '社会主義', '税制', '財政']
    }
  };
  
  // コンテキストに応じたダミー選択肢を選択
  const relevantDummies = selectRelevantDummies(explanation, dummyOptions[subject]);
  
  return [
    correctAnswer,
    ...relevantDummies.slice(0, 3)
  ];
}

/**
 * コンテキストに関連するダミー選択肢を選択
 */
function selectRelevantDummies(explanation: string, dummyCategories: any): string[] {
  const allDummies: string[] = [];
  
  // 全カテゴリからダミーを収集
  for (const category of Object.values(dummyCategories)) {
    if (Array.isArray(category)) {
      allDummies.push(...category);
    }
  }
  
  // ランダムに選択してシャッフル
  return allDummies
    .sort(() => Math.random() - 0.5)
    .slice(0, 10); // 十分な選択肢を確保
}

/**
 * 解説をフォーマット
 */
function formatExplanation(explanation: string, keyword: string): string {
  // 解説にキーワードが含まれていない場合は追加
  if (!explanation.includes(keyword)) {
    return `${keyword}は、${explanation}`;
  }
  
  return explanation;
}