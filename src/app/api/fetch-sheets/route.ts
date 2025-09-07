import { NextRequest, NextResponse } from 'next/server';
import { SheetsService } from '@/lib/sheets';

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new SheetsService();
    const questions = await sheetsService.fetchQuestionsData();
    
    console.log(`✅ API: ${questions.length}件のキーワードを取得しました`);
    
    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('❌ API: スプレッドシート取得エラー:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'スプレッドシートの取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // 将来的に特定の条件でデータを取得する場合に使用
  return GET(request);
}