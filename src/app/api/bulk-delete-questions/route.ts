import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { allUnifiedQuestions, UnifiedQuestion } from '@/data/questions-unified-complete';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionIds } = body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: '削除する問題IDのリストが指定されていません'
      }, { status: 400 });
    }

    // データファイルのパスを取得
    const dataPath = join(process.cwd(), 'src', 'data', 'questions-unified-complete.ts');
    
    // 現在のファイル内容を読み取り
    const fileContent = readFileSync(dataPath, 'utf8');
    
    // questions配列の開始と終了位置を見つける
    const questionsStartMatch = fileContent.match(/export const allUnifiedQuestions: UnifiedQuestion\[\] = \[/);
    const questionsEndMatch = fileContent.match(/\];[\s\S]*?export const getQuestionsBySubject/);
    
    if (!questionsStartMatch || !questionsEndMatch) {
      throw new Error('問題データの形式が正しくありません');
    }

    const beforeQuestions = fileContent.substring(0, questionsStartMatch.index! + questionsStartMatch[0].length);
    const afterQuestions = fileContent.substring(questionsEndMatch.index!);
    
    // 削除対象の問題を特定（数値IDを文字列IDに変換）
    const targetStringIds = questionIds.map((id: number) => {
      const question = allUnifiedQuestions[id - 1]; // 数値IDは1ベースなので-1
      return question?.id;
    }).filter(Boolean);

    console.log('削除対象ID:', targetStringIds);

    // 削除対象以外の問題を取得
    const remainingQuestions = allUnifiedQuestions.filter(q => !targetStringIds.includes(q.id));
    
    if (remainingQuestions.length === allUnifiedQuestions.length) {
      return NextResponse.json({
        success: false,
        error: '指定された問題が見つかりませんでした'
      }, { status: 404 });
    }

    // 削除された問題の情報
    const deletedQuestions = allUnifiedQuestions.filter(q => targetStringIds.includes(q.id));
    const deletedCount = allUnifiedQuestions.length - remainingQuestions.length;

    // 新しい問題配列をTypeScript形式で構築
    const updatedQuestionsContent = remainingQuestions.map(q => {
      // 日付オブジェクトを文字列に変換
      const lastUpdated = q.lastUpdated instanceof Date ? q.lastUpdated.toISOString() : q.lastUpdated;
      const createdAt = q.createdAt instanceof Date ? q.createdAt.toISOString() : q.createdAt;
      
      return `  {
    id: ${JSON.stringify(q.id)},
    subject: ${JSON.stringify(q.subject)} as const,
    category: ${JSON.stringify(q.category)} as const,
    subcategory: ${JSON.stringify(q.subcategory)},
    grade: ${q.grade},
    difficulty: ${JSON.stringify(q.difficulty)} as const,
    tags: ${JSON.stringify(q.tags)},
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correct: ${q.correct},
    explanation: ${JSON.stringify(q.explanation)},
    type: ${JSON.stringify(q.type)} as const,
    lastUpdated: new Date(${JSON.stringify(lastUpdated)}),
    createdAt: new Date(${JSON.stringify(createdAt)}),
    version: ${q.version},
    qualityScore: ${q.qualityScore || 8}${q.era ? `,
    era: ${JSON.stringify(q.era)}` : ''}${q.source ? `,
    source: ${JSON.stringify(q.source)}` : ''}
  }`;
    }).join(',\n');

    // 新しいファイル内容を作成
    const newFileContent = beforeQuestions + '\n' + updatedQuestionsContent + '\n' + afterQuestions;

    // ファイルに書き込み
    writeFileSync(dataPath, newFileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: `${deletedCount}問の問題を削除しました`,
      deletedCount,
      remainingCount: remainingQuestions.length,
      deletedQuestions: deletedQuestions.map(q => ({
        id: q.id,
        question: q.question.substring(0, 50) + '...'
      }))
    });

  } catch (error) {
    console.error('一括削除エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '問題の一括削除中にエラーが発生しました'
    }, { status: 500 });
  }
}