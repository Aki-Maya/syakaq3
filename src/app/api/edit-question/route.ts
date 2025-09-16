import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { UnifiedQuestion } from '@/data/questions-unified-complete';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, updatedQuestion } = body;

    if (!questionId || !updatedQuestion) {
      return NextResponse.json({
        success: false,
        error: '問題IDまたは更新データが不足しています'
      }, { status: 400 });
    }

    // データファイルのパスを取得
    const dataPath = join(process.cwd(), 'src', 'data', 'questions-unified-complete.ts');
    
    // 現在のファイル内容を読み取り
    const fileContent = readFileSync(dataPath, 'utf8');
    
    // questions配列の開始と終了位置を見つける
    const questionsStartMatch = fileContent.match(/export const unifiedQuestions: UnifiedQuestion\[\] = \[/);
    const questionsEndMatch = fileContent.match(/\];(?=\s*$)/);
    
    if (!questionsStartMatch || !questionsEndMatch) {
      throw new Error('問題データの形式が正しくありません');
    }

    const beforeQuestions = fileContent.substring(0, questionsStartMatch.index! + questionsStartMatch[0].length);
    const afterQuestions = fileContent.substring(questionsEndMatch.index!);
    
    // 問題データ部分を抽出して解析
    const questionsContent = fileContent.substring(
      questionsStartMatch.index! + questionsStartMatch[0].length,
      questionsEndMatch.index!
    );

    // 既存の問題配列を解析（簡単な正規表現パース）
    const questions: UnifiedQuestion[] = [];
    const questionMatches = questionsContent.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
    
    for (const match of questionMatches) {
      try {
        // 安全な評価のためにFunctionを使用
        const questionObj = new Function('return ' + match[0])();
        questions.push(questionObj);
      } catch (e) {
        console.warn('問題の解析に失敗:', match[0]);
      }
    }

    // 指定されたIDの問題を更新
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      return NextResponse.json({
        success: false,
        error: '指定された問題が見つかりません'
      }, { status: 404 });
    }

    // 問題を更新（IDは保持）
    questions[questionIndex] = {
      ...updatedQuestion,
      id: questionId // IDは変更しない
    };

    // 更新された配列をTypeScript形式で再構築
    const updatedQuestionsContent = questions.map(q => {
      return `  {
    id: ${q.id},
    question: ${JSON.stringify(q.question)},
    options: ${JSON.stringify(q.options)},
    correct: ${q.correct},
    explanation: ${JSON.stringify(q.explanation)},
    category: ${JSON.stringify(q.category)},
    difficulty: ${JSON.stringify(q.difficulty)},
    subject: ${JSON.stringify(q.subject)}
  }`;
    }).join(',\n');

    // 新しいファイル内容を作成
    const newFileContent = beforeQuestions + '\n' + updatedQuestionsContent + '\n' + afterQuestions;

    // ファイルに書き込み
    writeFileSync(dataPath, newFileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: '問題が正常に更新されました',
      questionId: questionId
    });

  } catch (error) {
    console.error('問題編集エラー:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '問題の編集中にエラーが発生しました'
    }, { status: 500 });
  }
}