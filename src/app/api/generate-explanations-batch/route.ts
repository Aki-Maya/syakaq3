import { NextRequest, NextResponse } from 'next/server';
import { ExplanationGenerator } from '@/lib/explanation-generator';

export async function POST(request: NextRequest) {
  try {
    const { keywords } = await request.json();
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'キーワードの配列が必要です' },
        { status: 400 }
      );
    }

    console.log(`📝 一括解説生成開始: ${keywords.length}件`);

    const explanationGenerator = new ExplanationGenerator();
    const explanations = await explanationGenerator.generateMultipleExplanations(keywords);
    
    console.log(`✅ 一括解説生成完了: ${explanations.length}件`);
    
    return NextResponse.json({
      success: true,
      explanations: explanations,
      count: explanations.length
    });
    
  } catch (error) {
    console.error('❌ 一括解説生成エラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '一括解説生成に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}