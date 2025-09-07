import { NextResponse } from 'next/server';
import { SheetsService } from '@/lib/sheets';

export async function GET() {
  try {
    console.log('📊 スプレッドシートデータ取得開始');
    
    const sheetsService = new SheetsService();
    const questions = await sheetsService.fetchQuestionsData();
    
    console.log(`✅ ${questions.length}件のデータを取得`);
    
    return NextResponse.json(questions);
    
  } catch (error) {
    console.error('❌ スプレッドシート取得エラー:', error);
    
    return NextResponse.json(
      {
        error: 'スプレッドシートの取得に失敗しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}