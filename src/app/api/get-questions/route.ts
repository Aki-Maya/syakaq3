import { NextRequest, NextResponse } from 'next/server';
import { allUnifiedQuestions, UnifiedQuestion } from '@/data/questions-unified-complete';

// 新しい型から古い型への変換ヘルパー
interface LegacyQuestion {
  id: number | string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

function convertToLegacyFormat(question: UnifiedQuestion, index: number): LegacyQuestion {
  // 難易度マッピング
  const difficultyMap = {
    'basic': 'easy',
    'standard': 'medium', 
    'advanced': 'hard'
  } as const;

  return {
    id: index + 1, // 数値IDに変換
    question: question.question,
    options: question.options,
    correct: question.correct,
    explanation: question.explanation,
    category: question.category,
    difficulty: difficultyMap[question.difficulty] || 'medium',
    subject: question.subject
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredQuestions = [...allUnifiedQuestions];

    // 科目でフィルタ
    if (subject && subject !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.subject === subject);
    }

    // カテゴリでフィルタ
    if (category && category !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }

    // レガシー形式に変換
    const legacyQuestions = filteredQuestions.map((q, index) => convertToLegacyFormat(q, index));

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuestions = legacyQuestions.slice(startIndex, endIndex);

    // 統計情報
    const stats = {
      total: legacyQuestions.length,
      page,
      limit,
      totalPages: Math.ceil(legacyQuestions.length / limit),
      subjectCounts: {
        geography: allUnifiedQuestions.filter(q => q.subject === 'geography').length,
        history: allUnifiedQuestions.filter(q => q.subject === 'history').length,
        civics: allUnifiedQuestions.filter(q => q.subject === 'civics').length
      },
      difficultyCounts: {
        easy: allUnifiedQuestions.filter(q => q.difficulty === 'basic').length,
        medium: allUnifiedQuestions.filter(q => q.difficulty === 'standard').length,
        hard: allUnifiedQuestions.filter(q => q.difficulty === 'advanced').length
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