import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, updatedQuestion } = body;

    // 新しいデータ構造では編集機能は一時的に無効化
    return NextResponse.json({
      success: false,
      error: '現在のデータ構造では編集機能は利用できません。新しいバージョンで対応予定です。'
    }, { status: 501 });

  } catch (error) {
    console.error('問題編集エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '問題の編集中にエラーが発生しました'
    }, { status: 500 });
  }
}