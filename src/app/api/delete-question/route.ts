import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId } = body;

    if (!questionId) {
      return NextResponse.json({
        success: false,
        error: '問題IDが指定されていません'
      }, { status: 400 });
    }

    // 新しいデータ構造では削除機能は一時的に無効化
    return NextResponse.json({
      success: false,
      error: '現在のデータ構造では削除機能は利用できません。新しいバージョンで対応予定です。'
    }, { status: 501 });

  } catch (error) {
    console.error('問題削除エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '問題の削除中にエラーが発生しました'
    }, { status: 500 });
  }
}