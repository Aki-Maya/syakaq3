import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 問題データの型定義
interface QuestionData {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AddQuestionRequest {
  subject: 'geography' | 'history' | 'civics';
  questionData: QuestionData;
}

// 各科目のファイルパス
const FILE_PATHS = {
  geography: path.join(process.cwd(), 'src/data/geography-enhanced.ts'),
  history: path.join(process.cwd(), 'src/data/history.ts'),
  civics: path.join(process.cwd(), 'src/data/civics.ts')
};

// 各科目のID範囲
const ID_RANGES = {
  geography: { min: 1, max: 100 },
  history: { min: 101, max: 200 },
  civics: { min: 201, max: 300 }
};

// ファイルから最大IDを取得
function getNextAvailableId(fileContent: string, subject: keyof typeof ID_RANGES): number {
  const idMatches = fileContent.match(/id:\s*(\d+)/g);
  if (!idMatches) {
    return ID_RANGES[subject].min;
  }

  const existingIds = idMatches
    .map(match => parseInt(match.replace(/id:\s*/, '')))
    .filter(id => id >= ID_RANGES[subject].min && id <= ID_RANGES[subject].max);

  if (existingIds.length === 0) {
    return ID_RANGES[subject].min;
  }

  const maxId = Math.max(...existingIds);
  return maxId + 1;
}

// 新しい問題のTypeScript形式文字列を生成
function generateQuestionString(id: number, questionData: QuestionData, subject: string): string {
  const { question, options, correct, explanation, category, difficulty } = questionData;
  
  // エスケープ処理
  const escapedQuestion = question.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  const escapedExplanation = explanation.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  const escapedOptions = options.map(opt => opt.replace(/'/g, "\\'").replace(/\n/g, '\\n'));

  // 歴史問題の場合はeraフィールドを追加
  const eraField = subject === 'history' ? `\n    era: '${category}',` : '';

  return `  {
    id: ${id},
    question: '${escapedQuestion}',
    options: ['${escapedOptions.join("', '")}'],
    correct: ${correct},${eraField}
    category: '${category}',
    difficulty: '${difficulty}',
    explanation: '${escapedExplanation}',
    type: 'multiple-choice' as const
  }`;
}

// ファイルに問題を追加
async function addQuestionToFile(subject: keyof typeof FILE_PATHS, questionData: QuestionData): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const filePath = FILE_PATHS[subject];
    
    // ファイルを読み取り
    if (!fs.existsSync(filePath)) {
      return { success: false, error: `ファイルが見つかりません: ${filePath}` };
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // 次のIDを取得
    const nextId = getNextAvailableId(fileContent, subject);
    
    if (nextId > ID_RANGES[subject].max) {
      return { success: false, error: `${subject}の問題数が上限に達しました` };
    }

    // 新しい問題文字列を生成
    const newQuestionString = generateQuestionString(nextId, questionData, subject);

    // 問題配列の終了位置を見つけて新しい問題を挿入
    // ファイル固有の配列名を使用
    const arrayNames = {
      geography: 'geographyQuestions',
      history: 'historyQuestions', 
      civics: 'civicsQuestions'
    };
    
    const arrayName = arrayNames[subject];
    const arrayStartPattern = new RegExp(`export const ${arrayName}.*?\\[`, 's');
    const arrayStartMatch = fileContent.match(arrayStartPattern);
    
    if (!arrayStartMatch) {
      return { success: false, error: `${arrayName}配列が見つかりません` };
    }
    
    const arrayStartIndex = arrayStartMatch.index! + arrayStartMatch[0].length;
    const remainingContent = fileContent.substring(arrayStartIndex);
    const arrayEndMatch = remainingContent.match(/\];/);
    
    if (!arrayEndMatch) {
      return { success: false, error: '問題配列の終了位置が見つかりません' };
    }
    
    const insertPosition = arrayStartIndex + arrayEndMatch.index!;

    // 最後のオブジェクトの後にカンマがあるかチェック
    const beforeInsertPosition = fileContent.substring(0, insertPosition).trim();
    const needsComma = beforeInsertPosition.endsWith('}');
    
    const updatedContent = 
      fileContent.substring(0, insertPosition).trim() + 
      (needsComma ? ',' : '') + 
      '\n' + newQuestionString + '\n];' +
      fileContent.substring(insertPosition + 2);

    // ファイルに書き込み
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    
    return { success: true, id: nextId };
  } catch (error) {
    console.error('問題追加エラー:', error);
    return { success: false, error: error instanceof Error ? error.message : '不明なエラー' };
  }
}

// バリデーション関数
function validateQuestionData(data: any): data is AddQuestionRequest {
  if (!data.subject || !['geography', 'history', 'civics'].includes(data.subject)) {
    return false;
  }
  
  const { questionData } = data;
  if (!questionData) return false;
  
  if (!questionData.question || typeof questionData.question !== 'string') return false;
  if (!Array.isArray(questionData.options) || questionData.options.length !== 4) return false;
  if (typeof questionData.correct !== 'number' || questionData.correct < 0 || questionData.correct > 3) return false;
  if (!questionData.explanation || typeof questionData.explanation !== 'string') return false;
  if (!questionData.category || typeof questionData.category !== 'string') return false;
  if (!['easy', 'medium', 'hard'].includes(questionData.difficulty)) return false;
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!validateQuestionData(body)) {
      return NextResponse.json(
        { success: false, error: 'リクエストデータが不正です' },
        { status: 400 }
      );
    }

    const { subject, questionData } = body as AddQuestionRequest;
    
    // 問題をファイルに追加
    const result = await addQuestionToFile(subject, questionData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${subject}に新しい問題を追加しました (ID: ${result.id})`,
        id: result.id
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}