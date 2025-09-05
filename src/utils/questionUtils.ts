// 問題関連のユーティリティ関数

export interface QuestionWithShuffledOptions {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: string;
  subject: string;
  category: string;
}

/**
 * 選択肢をランダムにシャッフルして、正解のインデックスも更新
 */
export function shuffleQuestionOptions<T extends {
  options: string[];
  correct: number;
}>(question: T): T {
  const { options, correct } = question;
  
  // 元の正解の選択肢を保存
  const correctAnswer = options[correct];
  
  // 選択肢と元のインデックスのペアを作成
  const optionsWithIndex = options.map((option, index) => ({
    option,
    originalIndex: index
  }));
  
  // Fisher-Yatesアルゴリズムでシャッフル
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }
  
  // シャッフル後の選択肢配列を作成
  const shuffledOptions = optionsWithIndex.map(item => item.option);
  
  // 新しい正解のインデックスを見つける
  const newCorrectIndex = shuffledOptions.findIndex(option => option === correctAnswer);
  
  return {
    ...question,
    options: shuffledOptions,
    correct: newCorrectIndex
  };
}

/**
 * 問題配列全体の選択肢をシャッフル
 */
export function shuffleAllQuestionOptions<T extends {
  options: string[];
  correct: number;
}>(questions: T[]): T[] {
  return questions.map(question => shuffleQuestionOptions(question));
}

/**
 * クイズ開始時に選択肢をシャッフルするヘルパー
 */
export function prepareQuestionsForQuiz<T extends {
  options: string[];
  correct: number;
}>(questions: T[]): T[] {
  // 問題の順番もシャッフル（オプション）
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
  
  // 各問題の選択肢をシャッフル
  return shuffleAllQuestionOptions(shuffledQuestions);
}

/**
 * 開発用：シャッフル結果をログ出力
 */
export function logShuffleResult<T extends {
  question: string;
  options: string[];
  correct: number;
}>(originalQuestion: T, shuffledQuestion: T): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('🎲 選択肢シャッフル結果:');
    console.log('問題:', shuffledQuestion.question);
    console.log('元の選択肢:', originalQuestion.options);
    console.log('元の正解:', originalQuestion.options[originalQuestion.correct], `(位置: ${originalQuestion.correct})`);
    console.log('新しい選択肢:', shuffledQuestion.options);
    console.log('新しい正解:', shuffledQuestion.options[shuffledQuestion.correct], `(位置: ${shuffledQuestion.correct})`);
    console.log('---');
  }
}

/**
 * 問題の妥当性をチェック
 */
export function validateShuffledQuestion<T extends {
  options: string[];
  correct: number;
}>(question: T): boolean {
  const { options, correct } = question;
  
  // 基本的な妥当性チェック
  if (!options || options.length !== 4) {
    console.error('❌ 選択肢は4つである必要があります');
    return false;
  }
  
  if (correct < 0 || correct >= options.length) {
    console.error('❌ 正解のインデックスが無効です');
    return false;
  }
  
  // 選択肢の重複チェック
  const uniqueOptions = new Set(options);
  if (uniqueOptions.size !== options.length) {
    console.error('❌ 選択肢に重複があります');
    return false;
  }
  
  return true;
}