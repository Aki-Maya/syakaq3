import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, keyword } = await request.json();
    
    if (!prompt || !keyword) {
      return NextResponse.json(
        { success: false, error: 'プロンプトとキーワードが必要です' },
        { status: 400 }
      );
    }

    console.log(`📝 解説生成開始: ${keyword}`);

    // GenSpark AI (実際のAPI呼び出し)
    // 注: 実際のGenSpark AIのエンドポイントとAPIキーに合わせて調整が必要
    try {
      // 暫定的にモック解説を生成（実際のGenSpark AI APIに置き換え）
      const explanation = await generateMockExplanation(keyword, prompt);
      
      console.log(`✅ 解説生成完了: ${keyword} (${explanation.length}文字)`);
      
      return NextResponse.json({
        success: true,
        explanation: explanation,
        keyword: keyword,
        references: [`${keyword}について詳しく学習しましょう`]
      });
      
    } catch (error) {
      console.error(`❌ GenSpark AI API エラー (${keyword}):`, error);
      
      // APIエラー時はフォールバック解説を生成
      const fallbackExplanation = generateFallbackExplanation(keyword);
      
      return NextResponse.json({
        success: true,
        explanation: fallbackExplanation,
        keyword: keyword,
        isFallback: true
      });
    }
    
  } catch (error) {
    console.error('❌ 解説生成API エラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '解説生成に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

/**
 * 実用的な解説生成（学習効果重視）
 * 実際のGenSpark AI APIに置き換える
 */
async function generateMockExplanation(keyword: string, prompt: string): Promise<string> {
  // 実際の実装では、ここでGenSpark AIのAPIを呼び出し
  // const response = await fetch('GenSpark_AI_ENDPOINT', { ... });
  
  // キーワード別の実用的解説（完全学習特化型）
  const explanations: { [key: string]: string } = {
    'リアス式海岸': 'リアス式海岸は海面上昇により山地の谷が沈水してできたノコギリ状の複雑な海岸線。【成因】氷河期後の海面上昇で陸地の谷間に海水侵入。【覚え方】「リアス→理想（リソウ）→理想的な天然の良港」三陸海岸・若狭湾が代表。【試験頻出】養殖業発達の理由、津波被害との関係、フィヨルドとの違い（氷河vs海面上昇）。【記憶のコツ】地図で実際の形を確認し「ギザギザ＝リアス」で暗記。対義語は単調海岸。',
    
    '藤原不比等': '藤原不比等（659-720）は律令国家完成と藤原氏繁栄の基礎を築いた政治家。【重要性】父・鎌足の功績を具体化し外戚政治の原型完成。【覚え方】「不比等（フヒトウ）→比べる人なし→藤原最強」年号は「六五九（ロクゴク）で不比等誕生」。【試験ポイント】大宝律令制定参加、娘光明子を皇后に、平城京遷都推進。【暗記セット】藤原四子の父、橘三千代の夫、文武天皇との関係で出題頻出。',
    
    '壇ノ浦の戦い': '壇ノ浦の戦い（1185年）は源平合戦最終決戦で平氏滅亡を決定づけた海戦。【場所】現在の山口県下関市、関門海峡。【覚え方】「いい箱（1185）片付けた平氏の夢」安徳天皇入水で三種の神器問題発生。【試験頻出】源義経の戦術、平家物語との関連、鎌倉幕府成立への影響。【暗記順序】一ノ谷（1184）→屋島（1185年初）→壇ノ浦（1185年春）で完全制覇。',
    
    '松江の気候': '松江市は日本海側気候で冬季多雨・多雪、夏季少雨が特徴。【原理】冬の季節風が日本海で水蒸気吸収し山地で上昇気流発生。【覚え方】「松江→雪マーク→日本海側」「夏は松江も少雨（瀬戸内海と同様）」。【試験必出】冬季降水量多い理由、太平洋側・瀬戸内海側との比較、季節風との関係。【応用】同じ中国地方でも広島（瀬戸内海側）は年中少雨で対比される。',
    
    '卑弥呼': '卑弥呼（生年不詳-248年頃）は邪馬台国女王で日本初の歴史的確実な統治者。【史料】中国「魏志倭人伝」が唯一の記録。【覚え方】「ヒミコ→日の巫女→太陽神に仕える女王」魏に239年朝貢し「親魏倭王」金印受領。【試験核心】邪馬台国位置論争（近畿説vs九州説）、弟による政治補佐、鬼道（宗教的権威）統治。【重要性】後の天皇制の原型、中国との外交関係開始。',
    
    '憲法改正の手続き': '日本国憲法改正は国会発議（各院2/3以上）→国民投票（過半数）の厳格な二段階方式。【世界比較】最も改正困難な「硬性憲法」で戦後一度も改正されず。【覚え方】「改正は2ステップ→国会は2/3→国民は1/2（シンプル）」。【試験頻出】なぜ厳しいか（基本的人権保護）、アメリカとの比較、96条の条文内容。【実例】自民党改正案での議論、国民投票法との関係。'
  };
  
  // キーワードに対応する解説があれば使用、なければ汎用的な解説を生成
  if (explanations[keyword]) {
    return explanations[keyword];
  }
  
  // 汎用的な解説生成ロジック
  return generateAdvancedGenericExplanation(keyword);
}

/**
 * 完全学習特化型の汎用解説生成
 */
function generateAdvancedGenericExplanation(keyword: string): string {
  const subjectInfo = detectSubjectForExplanation(keyword);
  
  // より具体的で実用的な解説構造
  const memoryTechnique = generateAdvancedMemoryTechnique(keyword);
  const examPattern = generateDetailedExamPattern(keyword, subjectInfo.subject);
  const historicalContext = generateHistoricalContext(keyword);
  const practicalTips = generatePracticalTips(keyword);
  
  return `${keyword}は${subjectInfo.definition}【${historicalContext}】【覚え方】${memoryTechnique}【試験頻出】${examPattern}【記憶のコツ】${practicalTips}${subjectInfo.relatedTopics}と関連付けて体系的に理解することが合格への近道です。`;
}

/**
 * 高度な記憶テクニック生成
 */
function generateAdvancedMemoryTechnique(keyword: string): string {
  if (keyword.includes('戦')) {
    return `「${keyword}」は戦場地図を描いて地理と年代をセット暗記。勝因・敗因を図解で整理。`;
  } else if (keyword.includes('海岸') || keyword.includes('地形')) {
    return `「${keyword}」は形成過程を4コマ漫画で描く。「原因→過程→結果→現在」の時系列で視覚記憶。`;
  } else if (keyword.includes('憲法') || keyword.includes('法')) {
    return `「${keyword}」は条文を日常例に置き換え。「もし学校で起きたら？」で具体化して暗記。`;
  } else if (keyword.includes('時代')) {
    return `「${keyword}」は年表に人物の顔イラスト付き。「誰が・いつ・何を」をキャラクター化。`;
  } else if (keyword.includes('人名')) {
    return `「${keyword}」は名前の由来や読み方の特徴をストーリー化。同時代人物と関係図作成。`;
  } else {
    return `「${keyword}」は語源分析と頭文字語呂合わせ。身近な例や現代との関連で記憶強化。`;
  }
}

/**
 * 詳細な試験出題パターン生成
 */
function generateDetailedExamPattern(keyword: string, subject: string): string {
  const detailedPatterns = {
    geography: [
      '地図上での正確な位置指摘と形成要因の説明問題',
      '気候データグラフとの関連付けで季節変化分析',
      '産業立地との因果関係を論述する記述問題',
      '他地域との比較表作成で特徴の違いを整理',
      '地形断面図と実際の写真の対応問題'
    ],
    history: [
      '年代順配列問題で前後関係の理解確認',
      '人物相関図完成で同時代の関係性把握',
      '原因→経過→結果の因果関係を順序立てて説明',
      '同時期の政治・経済・文化の関連性分析',
      '史料読解で当時の社会情勢を推測'
    ],
    civics: [
      '制度の仕組みを図表で整理する作図問題',
      '現実の社会問題への適用事例分析',
      '諸外国制度との比較表で相違点整理',
      '現代社会への影響を具体例で論述',
      '条文と実際の運用の関係性説明'
    ]
  };
  
  const subjectPatterns = detailedPatterns[subject as keyof typeof detailedPatterns] || detailedPatterns.civics;
  const randomPattern = subjectPatterns[Math.floor(Math.random() * subjectPatterns.length)];
  
  return randomPattern;
}

/**
 * キーワードから科目と詳細な学習情報を判定
 */
function detectSubjectForExplanation(keyword: string): {
  subject: string;
  definition: string;
  background: string;
  relatedTopics: string;
} {
  const text = keyword.toLowerCase();
  
  if (text.includes('海岸') || text.includes('地形') || text.includes('気候') || text.includes('県') || text.includes('市') || text.includes('工業') || text.includes('農業')) {
    return {
      subject: 'geography',
      definition: '地理分野の重要概念で、日本の自然環境や地域特色に関わります。',
      background: '地形の形成過程や気候との関係、人間活動への影響を理解することが重要です。',
      relatedTopics: '同じ地域の他の地理的特徴や近隣地域との比較'
    };
  }
  
  if (text.includes('時代') || text.includes('戦') || text.includes('幕府') || text.includes('源') || text.includes('平') || text.includes('天皇') || text.includes('将軍')) {
    return {
      subject: 'history',
      definition: '歴史分野の重要事項で、日本の政治・社会・文化の発展に関わります。',
      background: '時代背景や原因・結果の関係、当時の社会情勢との関連を把握することが大切です。',
      relatedTopics: '同時代の他の出来事や前後の時代との関連'
    };
  }
  
  if (text.includes('憲法') || text.includes('政治') || text.includes('制度') || text.includes('権利') || text.includes('法') || text.includes('民主')) {
    return {
      subject: 'civics',
      definition: '公民分野の基本概念で、現代社会の仕組みや市民生活に関わります。',
      background: '制度の成り立ちや目的、実際の運用における課題を理解することが重要です。',
      relatedTopics: '関連する他の制度や国際比較'
    };
  }
  
  return {
    subject: 'general',
    definition: '社会科の重要な学習項目で、総合的な理解が求められます。',
    background: '基本概念をしっかり理解し、具体例と結びつけることが大切です。',
    relatedTopics: '他分野との関連や応用例'
  };
}

/**
 * 歴史的背景・文脈生成
 */
function generateHistoricalContext(keyword: string): string {
  if (keyword.includes('戦') || keyword.includes('時代')) {
    return '歴史的背景';
  } else if (keyword.includes('海岸') || keyword.includes('地形')) {
    return '地質学的成因';
  } else if (keyword.includes('憲法') || keyword.includes('制度')) {
    return '制度的意義';
  } else if (keyword.includes('人名')) {
    return '人物の時代的位置';
  } else {
    return '学習の意義';
  }
}

/**
 * 実践的学習のコツ生成
 */
function generatePracticalTips(keyword: string): string {
  if (keyword.includes('戦')) {
    return '戦争の流れは「原因→開戦→経過→結果→影響」の5段階で整理。';
  } else if (keyword.includes('海岸') || keyword.includes('地形')) {
    return '地形は写真・地図・断面図の3点セットで立体的に理解。';
  } else if (keyword.includes('憲法') || keyword.includes('法')) {
    return '条文は具体的な生活場面に当てはめて理解度チェック。';
  } else if (keyword.includes('時代')) {
    return '時代区分は政治・経済・文化の変化を軸に整理。';
  } else {
    return '関連知識との相互関係を図解化して体系的に記憶。';
  }
}

/**
 * フォールバック解説生成
 */
function generateFallbackExplanation(keyword: string): string {
  return `${keyword}について詳しく学習しましょう。中学受験の重要な学習項目として、基本的な概念をしっかりと理解することが大切です。関連する用語や背景知識と合わせて覚えることで、より深い理解につながります。`;
}