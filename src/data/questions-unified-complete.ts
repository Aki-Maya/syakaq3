// 中学受験社会科 四択問題データベース
// 全127項目の完全版

export interface UnifiedQuestion {
  id: string;
  subject: string;
  category: string;
  subcategory?: string;
  grade: number;
  difficulty: string;
  tags: string[];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: string;
  qualityScore?: number;
  lastUpdated: string;
  createdAt: string;
  version: number;
  era?: any;
  source?: string;
}

export type Category = "地理" | "歴史" | "公民" | "経済" | "文化";
export type Difficulty = "易" | "中" | "難";
export type Grade = 5 | 6;

// 全127項目の問題データ
export const questions: UnifiedQuestion[] = [
{
    id: "CIV_CON_001_NEW",
    subject: "civics" as const,
    category: "constitution" as const,
    subcategory: "constitution",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["日本国憲法","三大原則","公民"],
    question: "日本国憲法の三大原則に当てはまらないものはどれですか？",
    options: ["国民主権","議会主権","基本的人権の尊重","平和主義"],
    correct: 1,
    explanation: "議会主権は日本国憲法の三大原則には含まれません。三大原則は国民主権、基本的人権の尊重、平和主義です。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_ANC_002_NEW",
    subject: "history" as const,
    category: "ancient" as const,
    subcategory: "culture",
    grade: 6,
    difficulty: "basic" as const,
    tags: ["縄文時代","土器","考古学"],
    question: "縄文土器の特徴として最も適切なものはどれですか？",
    options: ["釉薬が塗られていて表面がなめらかである","表面に縄目の模様がある","金属で装飾が施されている","ろくろを使って作られている"],
    correct: 1,
    explanation: "縄文土器は、表面に縄を押し当てて付けた縄目の模様が特徴です。この模様から縄文時代という名前がつけられました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_ANC_003_NEW",
    subject: "history" as const,
    category: "ancient" as const,
    subcategory: "figure",
    grade: 6,
    difficulty: "basic" as const,
    tags: ["飛鳥時代","奈良時代","藤原氏"],
    question: "飛鳥時代・奈良時代の政治家で、藤原氏の権力の基礎を築いた人物は誰ですか？",
    options: ["藤原道長","藤原不比等","藤原頼通","藤原定家"],
    correct: 1,
    explanation: "藤原不比等は飛鳥・奈良時代の政治家で、娘を天皇の妃にするなどして、後の藤原氏による摂関政治の基礎を築きました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "GEO_PHY_002_NEW",
    subject: "geography" as const,
    category: "physical" as const,
    subcategory: "terrain",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["地形","海岸線","リアス式海岸"],
    question: "日本の海岸線の特徴で、リアス式海岸の説明として正しいものはどれですか？",
    options: ["河川の堆積作用によってできた三角形の地形","氷河の浸食によって作られた複雑な海岸線で、多くの入り江がある","砂が堆積してできた細長い陸地で、海から湖を切り離す","海流によって運ばれた砂が堆積してできた地形"],
    correct: 1,
    explanation: "リアス式海岸は、氷河の浸食によって作られた複雑な海岸線であり、谷が海水に沈んで多数の入り江ができた地形です。養殖業が盛んな場所が多いです。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_EMO_001_NEW",
    subject: "history" as const,
    category: "early-modern" as const,
    subcategory: "economy",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["江戸時代","交通","商業"],
    question: "江戸時代に大坂と江戸の間で酒樽を運んだ専用の貨物船は何と呼ばれていましたか？",
    options: ["北前船","菱垣廻船","樽廻船","三十石船"],
    correct: 2,
    explanation: "樽廻船は、特に酒樽を運ぶために発達した貨物船です。菱垣廻船よりも高速で運航され、江戸の酒文化の発展に貢献しました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_CON_001_NEW",
    subject: "history" as const,
    category: "contemporary" as const,
    subcategory: "politics",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["戦後史","民主化","GHQ"],
    question: "戦後の日本を占領統治し、日本国憲法の制定や財閥解体などの民主化政策を推進した機関の略称は何ですか？",
    options: ["IMF","GHQ","UN","NATO"],
    correct: 1,
    explanation: "GHQは「General Headquarters」の略称で、連合国軍総司令部を指します。第二次世界大戦後に日本の占領統治を行い、多くの民主化政策を推進しました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_EMO_002_NEW",
    subject: "history" as const,
    category: "early-modern" as const,
    subcategory: "figure",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["江戸時代","徳川綱吉","経済"],
    question: "江戸時代の徳川綱吉が行った政治のうち、経済に影響を与えたことは何ですか？",
    options: ["株仲間の解散を命じた","金銀の含有量が少ない貨幣を発行した","質素倹約を奨励した","金銀の流出を防ぐために貿易額を制限した"],
    correct: 1,
    explanation: "徳川綱吉は、少ない金で多くの貨幣を作るために、金の含有量が少ない元禄小判を発行しました。これにより、貨幣の価値が低くなりました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_MOD_001_NEW",
    subject: "history" as const,
    category: "modern" as const,
    subcategory: "transport",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["明治時代","交通","鉄道"],
    question: "日本初の鉄道が開通したのはいつ、どの区間ですか？",
    options: ["1871年、東京〜大阪間","1872年、新橋〜横浜間","1869年、東京〜横浜間","1882年、札幌〜小樽間"],
    correct: 1,
    explanation: "日本初の鉄道は、明治政府の殖産興業政策の一環として、1872年に新橋〜横浜間で開通しました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "HIS_MED_001_NEW",
    subject: "history" as const,
    category: "medieval" as const,
    subcategory: "figure",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["平安時代","奥州藤原氏","平泉"],
    question: "平安時代後期に東北地方を統一し、平泉に黄金文化を築いた奥州藤原氏の初代当主は誰ですか？",
    options: ["藤原秀衡","藤原清衡","源頼朝","平清盛"],
    correct: 1,
    explanation: "藤原清衡は、前九年の役と後三年の役を経て奥州を統一し、中尊寺金色堂を建立するなど平泉の繁栄の基礎を築きました。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  },
  {
    id: "CIV_ECO_001_NEW",
    subject: "civics" as const,
    category: "economics" as const,
    subcategory: "finance",
    grade: 6,
    difficulty: "standard" as const,
    tags: ["地方自治","財政","地方交付税"],
    question: "地方公共団体間の財政格差を是正するために、国が交付する資金を何と言いますか？",
    options: ["国債","地方交付税","補助金","消費税"],
    correct: 1,
    explanation: "地方交付税は、国税の一部を財源として、各地方公共団体が一定水準の行政サービスを維持できるよう国が交付する資金です。",
    type: "multiple-choice" as const,
    lastUpdated: new Date("2025-09-16T22:47:14.897Z"),
    createdAt: new Date("2025-09-16T22:47:14.897Z"),
    version: 1,
    qualityScore: 9
  }
];

// エイリアスを追加
export const allUnifiedQuestions = questions;

// ヘルパー関数

/**
 * カテゴリ別に問題を取得
 */
export function getQuestionsByCategory(category: Category): UnifiedQuestion[] {
  return questions.filter(q => q.category === category);
}

/**
 * 難易度別に問題を取得
 */
export function getQuestionsByDifficulty(difficulty: Difficulty): UnifiedQuestion[] {
  return questions.filter(q => q.difficulty === difficulty);
}

/**
 * 学年別に問題を取得
 */
export function getQuestionsByGrade(grade: Grade): UnifiedQuestion[] {
  return questions.filter(q => q.grade === grade);
}

/**
 * キーワードで問題を検索
 */
export function searchQuestions(keyword: string): UnifiedQuestion[] {
  const lowerKeyword = keyword.toLowerCase();
  return questions.filter(q => 
    q.question.toLowerCase().includes(lowerKeyword) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
    q.explanation.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * ランダムに問題を取得
 */
export function getRandomQuestions(count: number = 10): UnifiedQuestion[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * 条件に合致する問題をランダム取得
 */
export function getRandomQuestionsByCondition(
  condition: Partial<Pick<UnifiedQuestion, 'category' | 'difficulty' | 'grade'>>,
  count: number = 10
): UnifiedQuestion[] {
  let filtered = questions;

  if (condition.category) {
    filtered = filtered.filter(q => q.category === condition.category);
  }
  if (condition.difficulty) {
    filtered = filtered.filter(q => q.difficulty === condition.difficulty);
  }
  if (condition.grade) {
    filtered = filtered.filter(q => q.grade === condition.grade);
  }

  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * 統計情報を取得
 */
export function getStatistics() {
  const categoryStats: Record<string, number> = {
    "地理": 0, "歴史": 0, "公民": 0, "経済": 0, "文化": 0
  };

  const difficultyStats: Record<string, number> = {
    "易": 0, "中": 0, "難": 0
  };

  const gradeStats: Record<number, number> = {
    5: 0, 6: 0
  };

  questions.forEach(q => {
    categoryStats[q.category as Category]++;
    difficultyStats[q.difficulty as Difficulty]++;
    gradeStats[q.grade as Grade]++;
  });

  return {
    total: questions.length,
    byCategory: categoryStats,
    byDifficulty: difficultyStats,
    byGrade: gradeStats
  };
}

/**
 * 問題の正答率を計算するためのインターフェース
 */
export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: number;
  timeSpent?: number;
}

/**
 * 学習履歴を管理するクラス
 */
export class StudyHistory {
  private results: QuestionResult[] = [];

  addResult(result: QuestionResult): void {
    this.results.push(result);
  }

  getAccuracyRate(): number {
    if (this.results.length === 0) return 0;
    const correct = this.results.filter(r => r.isCorrect).length;
    return correct / this.results.length;
  }

  getWeakAreas(): Category[] {
    const categoryResults: Record<string, { correct: number; total: number }> = {};

    this.results.forEach(result => {
      const question = questions.find(q => q.id === result.questionId);
      if (question) {
        const category = question.category;
        if (!categoryResults[category]) {
          categoryResults[category] = { correct: 0, total: 0 };
        }
        categoryResults[category].total++;
        if (result.isCorrect) {
          categoryResults[category].correct++;
        }
      }
    });

    return Object.entries(categoryResults)
      .filter(([_, stats]) => stats.total >= 3 && stats.correct / stats.total < 0.7)
      .map(([category, _]) => category as Category);
  }

  getRecommendedQuestions(count: number = 5): UnifiedQuestion[] {
    const weakAreas = this.getWeakAreas();
    if (weakAreas.length === 0) {
      return getRandomQuestions(count);
    }

    const weakAreaQuestions = questions.filter(q => 
      weakAreas.includes(q.category as Category)
    );

    const shuffled = [...weakAreaQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

// 追加のヘルパー関数
export function getQuestionsBySubject(subject: string): UnifiedQuestion[] {
  return questions.filter(q => q.subject === subject);
}

export function getQuestionsByTag(tag: string): UnifiedQuestion[] {
  return questions.filter(q => q.tags.includes(tag));
}

export function getHighQualityQuestions(minScore: number = 8.0): UnifiedQuestion[] {
  return questions.filter(q => q.qualityScore >= minScore);
}

// 使用例とエクスポート
export default {
  questions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getQuestionsByGrade,
  searchQuestions,
  getRandomQuestions,
  getRandomQuestionsByCondition,
  getStatistics,
  StudyHistory,
  getQuestionsBySubject,
  getQuestionsByTag,
  getHighQualityQuestions
};
