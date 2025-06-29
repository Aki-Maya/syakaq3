// Enhanced Geography Data for ShakaQuest
export interface Prefecture {
  id: number;
  name: string;
  capital: string;
  region: string;
  isCapitalDifferent: boolean;
}

export interface GeographyQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'map-select';
}

export interface ClimateRegion {
  id: number;
  name: string;
  characteristics: string;
  regions: string[];
}

export interface IndustrialRegion {
  id: number;
  name: string;
  location: string;
  industries: string[];
  features: string;
}

// Original 47 Prefectures Data
export const prefectures: Prefecture[] = [
  // Hokkaido & Tohoku (7 prefectures)
  { id: 1, name: "北海道", capital: "札幌市", region: "北海道", isCapitalDifferent: true },
  { id: 2, name: "青森県", capital: "青森市", region: "東北", isCapitalDifferent: false },
  { id: 3, name: "岩手県", capital: "盛岡市", region: "東北", isCapitalDifferent: true },
  { id: 4, name: "宮城県", capital: "仙台市", region: "東北", isCapitalDifferent: true },
  { id: 5, name: "秋田県", capital: "秋田市", region: "東北", isCapitalDifferent: false },
  { id: 6, name: "山形県", capital: "山形市", region: "東北", isCapitalDifferent: false },
  { id: 7, name: "福島県", capital: "福島市", region: "東北", isCapitalDifferent: false },

  // Kanto (7 prefectures)
  { id: 8, name: "茨城県", capital: "水戸市", region: "関東", isCapitalDifferent: true },
  { id: 9, name: "栃木県", capital: "宇都宮市", region: "関東", isCapitalDifferent: true },
  { id: 10, name: "群馬県", capital: "前橋市", region: "関東", isCapitalDifferent: true },
  { id: 11, name: "埼玉県", capital: "さいたま市", region: "関東", isCapitalDifferent: true },
  { id: 12, name: "千葉県", capital: "千葉市", region: "関東", isCapitalDifferent: false },
  { id: 13, name: "東京都", capital: "東京", region: "関東", isCapitalDifferent: false },
  { id: 14, name: "神奈川県", capital: "横浜市", region: "関東", isCapitalDifferent: true },

  // Chubu (9 prefectures)
  { id: 15, name: "新潟県", capital: "新潟市", region: "中部", isCapitalDifferent: false },
  { id: 16, name: "富山県", capital: "富山市", region: "中部", isCapitalDifferent: false },
  { id: 17, name: "石川県", capital: "金沢市", region: "中部", isCapitalDifferent: true },
  { id: 18, name: "福井県", capital: "福井市", region: "中部", isCapitalDifferent: false },
  { id: 19, name: "山梨県", capital: "甲府市", region: "中部", isCapitalDifferent: true },
  { id: 20, name: "長野県", capital: "長野市", region: "中部", isCapitalDifferent: false },
  { id: 21, name: "岐阜県", capital: "岐阜市", region: "中部", isCapitalDifferent: false },
  { id: 22, name: "静岡県", capital: "静岡市", region: "中部", isCapitalDifferent: false },
  { id: 23, name: "愛知県", capital: "名古屋市", region: "中部", isCapitalDifferent: true },

  // Kansai (7 prefectures)
  { id: 24, name: "三重県", capital: "津市", region: "関西", isCapitalDifferent: true },
  { id: 25, name: "滋賀県", capital: "大津市", region: "関西", isCapitalDifferent: true },
  { id: 26, name: "京都府", capital: "京都市", region: "関西", isCapitalDifferent: false },
  { id: 27, name: "大阪府", capital: "大阪市", region: "関西", isCapitalDifferent: false },
  { id: 28, name: "兵庫県", capital: "神戸市", region: "関西", isCapitalDifferent: true },
  { id: 29, name: "奈良県", capital: "奈良市", region: "関西", isCapitalDifferent: false },
  { id: 30, name: "和歌山県", capital: "和歌山市", region: "関西", isCapitalDifferent: false },

  // Chugoku (5 prefectures)
  { id: 31, name: "鳥取県", capital: "鳥取市", region: "中国", isCapitalDifferent: false },
  { id: 32, name: "島根県", capital: "松江市", region: "中国", isCapitalDifferent: true },
  { id: 33, name: "岡山県", capital: "岡山市", region: "中国", isCapitalDifferent: false },
  { id: 34, name: "広島県", capital: "広島市", region: "中国", isCapitalDifferent: false },
  { id: 35, name: "山口県", capital: "山口市", region: "中国", isCapitalDifferent: false },

  // Shikoku (4 prefectures)
  { id: 36, name: "徳島県", capital: "徳島市", region: "四国", isCapitalDifferent: false },
  { id: 37, name: "香川県", capital: "高松市", region: "四国", isCapitalDifferent: true },
  { id: 38, name: "愛媛県", capital: "松山市", region: "四国", isCapitalDifferent: true },
  { id: 39, name: "高知県", capital: "高知市", region: "四国", isCapitalDifferent: false },

  // Kyushu & Okinawa (8 prefectures)
  { id: 40, name: "福岡県", capital: "福岡市", region: "九州", isCapitalDifferent: false },
  { id: 41, name: "佐賀県", capital: "佐賀市", region: "九州", isCapitalDifferent: false },
  { id: 42, name: "長崎県", capital: "長崎市", region: "九州", isCapitalDifferent: false },
  { id: 43, name: "熊本県", capital: "熊本市", region: "九州", isCapitalDifferent: false },
  { id: 44, name: "大分県", capital: "大分市", region: "九州", isCapitalDifferent: false },
  { id: 45, name: "宮崎県", capital: "宮崎市", region: "九州", isCapitalDifferent: false },
  { id: 46, name: "鹿児島県", capital: "鹿児島市", region: "九州", isCapitalDifferent: false },
  { id: 47, name: "沖縄県", capital: "那覇市", region: "九州", isCapitalDifferent: true }
];

// Climate Regions Data
export const climateRegions: ClimateRegion[] = [
  {
    id: 1,
    name: "太平洋岸式気候",
    characteristics: "夏暑く冬温暖、降水量は梅雨と台風の時期に多い",
    regions: ["関東", "東海", "関西", "瀬戸内"]
  },
  {
    id: 2,
    name: "日本海岸式気候",
    characteristics: "冬に雪が多く、夏は高温多湿",
    regions: ["東北日本海側", "北陸", "山陰"]
  },
  {
    id: 3,
    name: "内陸性気候",
    characteristics: "気温の日較差・年較差が大きい",
    regions: ["中央高地", "盆地"]
  },
  {
    id: 4,
    name: "瀬戸内式気候",
    characteristics: "年間を通じて雨が少なく温暖",
    regions: ["瀬戸内海沿岸"]
  },
  {
    id: 5,
    name: "南西諸島式気候",
    characteristics: "亜熱帯気候、台風の通り道",
    regions: ["沖縄", "奄美"]
  },
  {
    id: 6,
    name: "北海道式気候",
    characteristics: "冷涼で梅雨がない、積雪期間が長い",
    regions: ["北海道"]
  }
];

// Industrial Regions Data
export const industrialRegions: IndustrialRegion[] = [
  {
    id: 1,
    name: "京浜工業地帯",
    location: "東京湾沿岸",
    industries: ["機械工業", "化学工業", "印刷・出版"],
    features: "日本最大の工業地帯、重化学工業の中心"
  },
  {
    id: 2,
    name: "中京工業地帯",
    location: "愛知県・三重県",
    industries: ["自動車工業", "航空機工業", "機械工業"],
    features: "自動車工業の中心、トヨタ自動車"
  },
  {
    id: 3,
    name: "阪神工業地帯",
    location: "大阪湾沿岸",
    industries: ["鉄鋼業", "化学工業", "機械工業"],
    features: "鉄鋼業の中心、重化学工業"
  },
  {
    id: 4,
    name: "北九州工業地帯",
    location: "福岡県北部",
    industries: ["鉄鋼業", "化学工業"],
    features: "日本の重工業発祥の地"
  },
  {
    id: 5,
    name: "瀬戸内工業地域",
    location: "瀬戸内海沿岸",
    industries: ["石油化学工業", "鉄鋼業"],
    features: "石油化学コンビナート"
  },
  {
    id: 6,
    name: "京葉工業地域",
    location: "東京湾東岸",
    industries: ["鉄鋼業", "石油化学工業"],
    features: "埋立地に建設された臨海工業地域"
  }
];

// Enhanced Geography Questions
export const geographyQuestions: GeographyQuestion[] = [
  // Prefecture Questions
  {
    id: 1,
    question: 'フードマイレージの説明として、最も適切なものはどれですか？',
    options: [
      '食料の輸送距離が長いほど環境負荷が大きいことを示す指標',
      '食料の生産にかかるエネルギーを示す指標',
      '食料の鮮度を輸送時間で示した指標',
      '食料の輸入量と輸出量の差額を示す指標'
    ],
    correct: 0,
    explanation: 'フードマイレージは、食料の重さに輸送距離を掛け合わせたもので、数値が小さいほど環境負荷が小さいとされます。',
    category: 'industry',
    difficulty: 'normal'
  },
  {
    id: 2,
    question: '日本の鉄鋼業について、鉄鉱石の最大の輸入相手国はどこですか？',
    options: ['オーストラリア', 'ブラジル', '中国', 'アメリカ'],
    correct: 0,
    explanation: '日本の鉄鋼業において、鉄鉱石を最も多く輸入している国はオーストラリアです。',
    category: 'industry',
    difficulty: 'easy'
  },
  {
    id: 3,
    question: '日本三名園の組み合わせとして、正しいものはどれですか？',
    options: [
      '水戸市の偕楽園、金沢市の兼六園、岡山市の後楽園',
      '水戸市の偕楽園、高松市の栗林公園、岡山市の後楽園',
      '京都市の金閣寺、金沢市の兼六園、岡山市の後楽園',
      '日光市の東照宮、水戸市の偕楽園、金沢市の兼六園'
    ],
    correct: 0,
    explanation: '日本三名園は、水戸市の偕楽園、金沢市の兼六園、岡山市の後楽園です。',
    category: 'regions',
    difficulty: 'hard'
  },
  {
    id: 4,
    question: '「きりたんぽ鍋」は、どの県の郷土料理ですか？',
    options: ['山形県', '秋田県', '岩手県', '宮城県'],
    correct: 1,
    explanation: 'きりたんぽ鍋は秋田県の郷土料理で、きりたんぽと鶏肉、野菜などを煮込んだ鍋料理です。',
    category: 'regions',
    difficulty: 'easy'
  },
  {
    id: 5,
    question: '自動車産業が特に盛んな工業地帯はどこですか？',
    options: ['阪神工業地帯', '京葉工業地域', '中京工業地帯', '関東内陸工業地域'],
    correct: 2,
    explanation: '中京工業地帯は愛知県を中心とし、トヨタ自動車を始めとする多くの自動車関連企業が集積しています。',
    category: 'industry',
    difficulty: 'easy'
  },
  {
    id: 6,
    question: '石油化学や鉄鋼業が盛んで、千葉県の東京湾沿岸に位置する工業地域は何ですか？',
    options: ['京浜工業地帯', '京葉工業地域', '鹿島臨海工業地域', '関東内陸工業地域'],
    correct: 1,
    explanation: '京葉工業地域は千葉県の東京湾沿岸に位置し、石油化学や鉄鋼業を中心とした重化学工業が盛んです。',
    category: 'industry',
    difficulty: 'normal'
  },
  {
    id: 7,
    question: '岡山県の県庁所在地である岡山市の特徴として、正しいものはどれですか？',
    options: [
      '人口100万人を超える政令指定都市である',
      '太田川が流れている',
      '政令指定都市だが、人口は100万人を超えていない',
      'ラムサール条約に登録されたカルスト地形がある'
    ],
    correct: 2,
    explanation: '岡山市は政令指定都市ですが、人口は100万人を超えていません。',
    category: 'regions',
    difficulty: 'hard'
  },
  {
    id: 8,
    question: '日本三大急流に含まれない川はどれですか？',
    options: ['球磨川', '最上川', '富士川', '四万十川'],
    correct: 3,
    explanation: '日本三大急流は熊本県の球磨川、山形県の最上川、静岡県・山梨県の富士川です。 四万十川は資料に記載がありますが、三大急流には含まれません。',
    category: 'regions',
    difficulty: 'hard'
  },
  {
    id: 9,
    question: '岩手県盛岡市や奥州市で生産される伝統工芸品は何ですか？',
    options: ['桐生織', '益子焼', '南部鉄器', '箱根寄木細工'],
    correct: 2,
    explanation: '南部鉄器は、岩手県盛岡市や奥州市で生産される伝統工芸品です。',
    category: 'regions',
    difficulty: 'normal'
  },
  {
    id: 10,
    question: '東海道新幹線の窓から名古屋方面に向かう際、左側に見える景色として正しいものはどれですか？',
    options: [
      '富士山',
      '日本アルプス',
      '太平洋側の海岸線',
      '琵琶湖'
    ],
    correct: 2,
    explanation: '東海道新幹線で名古屋方面に向かう場合、左側の車窓からは太平洋側であり、御前崎や伊豆大島などの海岸線が見えることがあります。',
    category: 'regions',
    difficulty: 'normal'
  }
];

// Utility functions
export const getQuestionsByCategory = (category: string): GeographyQuestion[] => {
  return geographyQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): GeographyQuestion[] => {
  return geographyQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number = 5): GeographyQuestion[] => {
  const shuffled = [...geographyQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getCategories = (): string[] => {
  return [...new Set(geographyQuestions.map(q => q.category))];
};

export const getDifficulties = (): string[] => {
  return ['easy', 'medium', 'hard'];
};

export default {
  prefectures,
  climateRegions,
  industrialRegions,
  geographyQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getRandomQuestions,
  getCategories,
  getDifficulties
};
