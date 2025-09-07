// Unified Question Type System for ShakaQuest
// 統一問題データ型システム

/**
 * 基本科目の定義
 */
export type Subject = 'geography' | 'history' | 'civics';

/**
 * 難易度レベル（中学受験標準）
 */
export type Difficulty = 'basic' | 'standard' | 'advanced';

/**
 * 問題形式
 */
export type QuestionType = 'multiple-choice' | 'fill-blank' | 'matching' | 'map-select';

/**
 * 対象学年
 */
export type Grade = 4 | 5 | 6;

/**
 * 地理科目のカテゴリ体系（学習指導要領準拠）
 */
export type GeographyCategory = 
  | 'physical'     // 自然地理（地形、気候、災害）
  | 'human'        // 人文地理（人口、産業、交通）
  | 'regional';    // 地域地理（都道府県、地方、国際）

/**
 * 地理科目のサブカテゴリ
 */
export type GeographySubcategory = 
  // 自然地理
  | 'landforms' | 'climate' | 'disasters'
  // 人文地理  
  | 'population' | 'agriculture' | 'industry' | 'transportation'
  // 地域地理
  | 'prefectures' | 'regions' | 'international';

/**
 * 歴史科目のカテゴリ体系（時代区分）
 */
export type HistoryCategory = 
  | 'ancient'        // 古代（〜1185年）
  | 'medieval'       // 中世（1185-1573年） 
  | 'early-modern'   // 近世（1573-1867年）
  | 'modern'         // 近代（1868-1945年）
  | 'contemporary';  // 現代（1945年〜）

/**
 * 歴史科目のサブカテゴリ（具体的時代）
 */
export type HistorySubcategory = 
  // 古代
  | 'prehistoric' | 'jomon' | 'yayoi' | 'kofun' | 'asuka' | 'nara' | 'heian'
  // 中世
  | 'kamakura' | 'nanbokucho' | 'muromachi'
  // 近世  
  | 'azuchi-momoyama' | 'edo'
  // 近代
  | 'meiji' | 'taisho' | 'showa-prewar'
  // 現代
  | 'showa-postwar' | 'heisei' | 'reiwa';

/**
 * 公民科目のカテゴリ体系
 */
export type CivicsCategory = 
  | 'constitution'   // 憲法・基本的人権
  | 'politics'       // 政治制度  
  | 'economics'      // 経済・国際関係
  | 'environment';   // 環境問題

/**
 * 公民科目のサブカテゴリ
 */
export type CivicsSubcategory = 
  // 憲法・人権
  | 'basic-principles' | 'human-rights' | 'emperor-system'
  // 政治制度
  | 'three-powers' | 'local-government' | 'election-system'
  // 経済・国際
  | 'market-economy' | 'international-relations' | 'trade'
  // 環境問題
  | 'global-warming' | 'sustainability' | 'resource-management';

/**
 * 年代情報（歴史問題専用）
 */
export interface EraInfo {
  start: number;      // 開始年（西暦、負数は紀元前）
  end: number;        // 終了年（西暦）
  label: string;      // 表示用ラベル "710-794年"
  description: string; // 時代の特徴
}

/**
 * 統一問題インターフェース
 */
export interface UnifiedQuestion {
  // 基本識別情報
  id: string;                    // "GEO_PHY_001", "HIS_ANC_045" 形式
  subject: Subject;
  category: GeographyCategory | HistoryCategory | CivicsCategory;
  subcategory?: GeographySubcategory | HistorySubcategory | CivicsSubcategory;
  
  // 歴史専用情報
  era?: EraInfo;
  
  // 学習メタデータ
  grade: Grade;
  difficulty: Difficulty;
  tags: string[];               // 横断検索用タグ
  
  // 問題内容
  question: string;
  options: string[];
  correct: number;              // 正解のインデックス (0-3)
  explanation: string;          // 詳細解説（100文字以上推奨）
  type: QuestionType;
  
  // 管理情報
  source?: string;              // 参考資料・出典
  lastUpdated: Date;           // 最終更新日時
  createdAt: Date;             // 作成日時
  version: number;             // バージョン管理
  qualityScore?: number;       // 品質スコア（1-10）
}

/**
 * カテゴリ情報定義
 */
export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  subcategories: SubcategoryDefinition[];
}

export interface SubcategoryDefinition {
  id: string;
  name: string;
  description: string;
  examples?: string[];
}

/**
 * 科目別カテゴリマッピング
 */
export const SUBJECT_CATEGORIES: Record<Subject, CategoryDefinition[]> = {
  geography: [
    {
      id: 'physical',
      name: '自然地理',
      description: '地形、気候、災害などの自然環境',
      subcategories: [
        { id: 'landforms', name: '地形', description: '山地、平野、海岸線、河川' },
        { id: 'climate', name: '気候', description: '気候区分、季節風、降水量' },
        { id: 'disasters', name: '災害', description: '地震、火山、台風、洪水' }
      ]
    },
    {
      id: 'human',
      name: '人文地理', 
      description: '人間活動と地理的環境の関係',
      subcategories: [
        { id: 'population', name: '人口', description: '人口分布、過疎・過密問題' },
        { id: 'agriculture', name: '農業', description: '農業地域、農作物、畜産業' },
        { id: 'industry', name: '工業', description: '工業地帯、工業地域、製造業' },
        { id: 'transportation', name: '交通', description: '交通網、物流、通信' }
      ]
    },
    {
      id: 'regional',
      name: '地域地理',
      description: '特定地域の地理的特徴',
      subcategories: [
        { id: 'prefectures', name: '都道府県', description: '各都道府県の特色、県庁所在地' },
        { id: 'regions', name: '地方', description: '北海道、東北、関東等の地方区分' },
        { id: 'international', name: '国際', description: '隣国関係、貿易、国際比較' }
      ]
    }
  ],
  
  history: [
    {
      id: 'ancient',
      name: '古代',
      description: '〜1185年（縄文時代〜平安時代）',
      subcategories: [
        { id: 'prehistoric', name: '先史時代', description: '旧石器時代' },
        { id: 'jomon', name: '縄文時代', description: '紀元前14000-300年頃' },
        { id: 'yayoi', name: '弥生時代', description: '紀元前300-300年頃' },
        { id: 'kofun', name: '古墳時代', description: '300-710年頃' },
        { id: 'asuka', name: '飛鳥時代', description: '592-710年' },
        { id: 'nara', name: '奈良時代', description: '710-794年' },
        { id: 'heian', name: '平安時代', description: '794-1185年' }
      ]
    },
    {
      id: 'medieval',
      name: '中世',
      description: '1185-1573年（鎌倉〜室町時代）',
      subcategories: [
        { id: 'kamakura', name: '鎌倉時代', description: '1185-1333年' },
        { id: 'nanbokucho', name: '南北朝時代', description: '1336-1392年' },
        { id: 'muromachi', name: '室町時代', description: '1336-1573年' }
      ]
    },
    {
      id: 'early-modern',
      name: '近世',
      description: '1573-1867年（安土桃山〜江戸時代）',
      subcategories: [
        { id: 'azuchi-momoyama', name: '安土桃山時代', description: '1573-1603年' },
        { id: 'edo', name: '江戸時代', description: '1603-1867年' }
      ]
    },
    {
      id: 'modern',
      name: '近代',
      description: '1868-1945年（明治〜昭和前期）',
      subcategories: [
        { id: 'meiji', name: '明治時代', description: '1868-1912年' },
        { id: 'taisho', name: '大正時代', description: '1912-1926年' },
        { id: 'showa-prewar', name: '昭和前期', description: '1926-1945年' }
      ]
    },
    {
      id: 'contemporary',
      name: '現代',
      description: '1945年〜現在',
      subcategories: [
        { id: 'showa-postwar', name: '昭和後期', description: '1945-1989年' },
        { id: 'heisei', name: '平成時代', description: '1989-2019年' },
        { id: 'reiwa', name: '令和時代', description: '2019年〜' }
      ]
    }
  ],
  
  civics: [
    {
      id: 'constitution',
      name: '憲法・人権',
      description: '日本国憲法と基本的人権',
      subcategories: [
        { id: 'basic-principles', name: '憲法の基本原則', description: '国民主権、基本的人権の尊重、平和主義' },
        { id: 'human-rights', name: '基本的人権', description: '自由権、社会権、参政権、平等権' },
        { id: 'emperor-system', name: '天皇制', description: '象徴天皇制、国事行為' }
      ]
    },
    {
      id: 'politics',
      name: '政治制度',
      description: '日本の政治システム',
      subcategories: [
        { id: 'three-powers', name: '三権分立', description: '立法・行政・司法の分離と均衡' },
        { id: 'local-government', name: '地方自治', description: '都道府県、市町村の制度' },
        { id: 'election-system', name: '選挙制度', description: '選挙権、被選挙権、選挙の仕組み' }
      ]
    },
    {
      id: 'economics',
      name: '経済・国際',
      description: '経済システムと国際関係',
      subcategories: [
        { id: 'market-economy', name: '市場経済', description: '需要と供給、価格メカニズム' },
        { id: 'international-relations', name: '国際関係', description: '国連、外交、安全保障' },
        { id: 'trade', name: '貿易', description: '輸出入、貿易収支、TPP' }
      ]
    },
    {
      id: 'environment',
      name: '環境問題',
      description: '地球環境と持続可能な社会',
      subcategories: [
        { id: 'global-warming', name: '地球温暖化', description: 'CO2削減、パリ協定' },
        { id: 'sustainability', name: '持続可能性', description: 'SDGs、リサイクル、再生可能エネルギー' },
        { id: 'resource-management', name: '資源管理', description: 'フードマイレージ、水資源、エネルギー' }
      ]
    }
  ]
};

/**
 * ID生成ヘルパー関数
 */
export function generateQuestionId(
  subject: Subject, 
  category: string, 
  number: number
): string {
  const subjectCode = subject.toUpperCase().slice(0, 3); // GEO, HIS, CIV
  const categoryCode = category.toUpperCase().slice(0, 3); // PHY, HUM, REG, ANC, etc.
  const numberCode = number.toString().padStart(3, '0');   // 001, 002, etc.
  
  return `${subjectCode}_${categoryCode}_${numberCode}`;
}

/**
 * データ検証関数
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateQuestion(question: UnifiedQuestion): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // ID形式チェック
  if (!/^[A-Z]{3}_[A-Z]{3}_\d{3}$/.test(question.id)) {
    errors.push(`Invalid ID format: ${question.id}`);
  }
  
  // 解説文字数チェック
  if (question.explanation.length < 100) {
    warnings.push(`Explanation too short (${question.explanation.length} chars, recommended 100+)`);
  }
  
  // 選択肢数チェック
  if (question.options.length !== 4) {
    errors.push(`Must have exactly 4 options, got ${question.options.length}`);
  }
  
  // 正解番号チェック
  if (question.correct < 0 || question.correct >= question.options.length) {
    errors.push(`Invalid correct answer index: ${question.correct}`);
  }
  
  // 歴史問題のera必須チェック
  if (question.subject === 'history' && !question.era) {
    errors.push('History questions must have era information');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export default {
  SUBJECT_CATEGORIES,
  generateQuestionId,
  validateQuestion
};