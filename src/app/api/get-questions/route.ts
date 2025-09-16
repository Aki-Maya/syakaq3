import { NextRequest, NextResponse } from 'next/server';
import { unifiedQuestions } from '@/data/questions-unified-complete';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredQuestions = [...unifiedQuestions];

    // 科目でフィルタ
    if (subject && subject !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.subject === subject);
    }

    // カテゴリでフィルタ
    if (category && category !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    // 統計情報
    const stats = {
      total: filteredQuestions.length,
      page,
      limit,
      totalPages: Math.ceil(filteredQuestions.length / limit),
      subjectCounts: {
        geography: unifiedQuestions.filter(q => q.subject === 'geography').length,
        history: unifiedQuestions.filter(q => q.subject === 'history').length,
        civics: unifiedQuestions.filter(q => q.subject === 'civics').length
      },
      difficultyCounts: {
        easy: filteredQuestions.filter(q => q.difficulty === 'easy').length,
        medium: filteredQuestions.filter(q => q.difficulty === 'medium').length,
        hard: filteredQuestions.filter(q => q.difficulty === 'hard').length
      }
    };

    return NextResponse.json({
      success: true,
      questions: paginatedQuestions,
      stats
    });

  } catch (error) {
    console.error('問題取得エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '問題の取得中にエラーが発生しました'
    }, { status: 500 });
  }
}