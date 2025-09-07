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
 * モック解説生成（開発用）
 * 実際のGenSpark AI APIに置き換える
 */
async function generateMockExplanation(keyword: string, prompt: string): Promise<string> {
  // 実際の実装では、ここでGenSpark AIのAPIを呼び出し
  // const response = await fetch('GenSpark_AI_ENDPOINT', { ... });
  
  // キーワードの特徴に基づいて詳細な解説を生成
  const explanations: { [key: string]: string } = {
    'リアス式海岸': 'リアス式海岸は、海面の上昇や地盤の沈降により、山地や丘陵の谷間に海水が入り込んで形成された複雑な海岸線のことです。ノコギリの歯のような入り組んだ形が特徴で、深い湾と岬が交互に現れます。三陸海岸や若狭湾などが代表例で、天然の良港ができやすく漁業が盛んです。',
    
    '藤原不比等': '藤原不比等（659-720）は奈良時代初期の政治家で、藤原氏の基礎を築いた人物です。藤原鎌足の次男として生まれ、大宝律令の制定に関わりました。娘の光明子を聖武天皇の皇后にするなど、藤原氏の権力拡大に努めました。その後の藤原氏による摂関政治の礎を作った重要人物です。',
    
    '壇ノ浦の戦い': '壇ノ浦の戦い（1185年）は、源平合戦の最後を飾る海戦です。現在の山口県下関市で行われ、源義経率いる源氏軍が平氏を完全に滅ぼしました。幼帝安徳天皇も入水し、平氏政権は終焉を迎えました。この戦いにより源頼朝による鎌倉幕府成立への道筋が確定的になった歴史的転換点です。'
  };
  
  // キーワードに対応する解説があれば使用、なければ汎用的な解説を生成
  if (explanations[keyword]) {
    return explanations[keyword];
  }
  
  // 汎用的な解説生成ロジック
  return generateGenericExplanation(keyword);
}

/**
 * 汎用的な解説生成
 */
function generateGenericExplanation(keyword: string): string {
  const subjectInfo = detectSubjectForExplanation(keyword);
  
  return `${keyword}は${subjectInfo.subject}分野の重要な学習項目です。${subjectInfo.context}中学受験では${subjectInfo.examPoint}として出題されることが多く、${subjectInfo.studyTip}関連する用語や背景知識と合わせて理解することが大切です。`;
}

/**
 * キーワードから科目と詳細情報を判定
 */
function detectSubjectForExplanation(keyword: string): {
  subject: string;
  context: string;
  examPoint: string;
  studyTip: string;
} {
  const text = keyword.toLowerCase();
  
  if (text.includes('海岸') || text.includes('地形') || text.includes('気候') || text.includes('県') || text.includes('市')) {
    return {
      subject: '地理',
      context: '日本の自然環境や地域の特色に関わる内容で、',
      examPoint: '場所や特徴、形成過程',
      studyTip: '地図と合わせて位置関係を覚え、'
    };
  }
  
  if (text.includes('時代') || text.includes('戦') || text.includes('幕府') || text.includes('源') || text.includes('平')) {
    return {
      subject: '歴史',
      context: '日本の政治・社会の変遷に関わる重要な出来事で、',
      examPoint: '年代や人物、影響',
      studyTip: '時代の流れと因果関係を理解し、'
    };
  }
  
  if (text.includes('憲法') || text.includes('政治') || text.includes('制度') || text.includes('権利')) {
    return {
      subject: '公民',
      context: '現代社会の仕組みや課題に関する概念で、',
      examPoint: '制度の特徴や意義',
      studyTip: '現代の具体例と結びつけて考え、'
    };
  }
  
  return {
    subject: '社会',
    context: '総合的な社会科の知識として、',
    examPoint: '基本的な概念や応用',
    studyTip: '他の分野との関連も意識して、'
  };
}

/**
 * フォールバック解説生成
 */
function generateFallbackExplanation(keyword: string): string {
  return `${keyword}について詳しく学習しましょう。中学受験の重要な学習項目として、基本的な概念をしっかりと理解することが大切です。関連する用語や背景知識と合わせて覚えることで、より深い理解につながります。`;
}