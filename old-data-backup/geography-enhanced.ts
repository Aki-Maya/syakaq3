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
    question: '食品の輸送によって環境に与える負荷を表す指標「フードマイレージ」について、正しい説明はどれですか？',
    options: [
      '食料の重量×輸送距離で計算され、数値が小さいほど環境負荷が小さい',
      '食料の生産から消費までの総エネルギー消費量を表す指標',
      '食料の鮮度を保つための冷凍・冷蔵コストを数値化した指標',
      '国内生産量と輸入量の比率を表した食料自給率の指標'
    ],
    correct: 0,
    explanation: 'フードマイレージは食料の重量（トン）に輸送距離（km）を掛けた値（トン・km）で表される指標です。輸送距離が長いほど、また重量が重いほど数値は大きくなり、その分CO2排出量も増加するため環境負荷が大きくなります。地産地消を進めることでフードマイレージを減らすことができます。',
    category: 'industry',
    difficulty: 'medium',
    type: 'multiple-choice' as const
  },
  {
    id: 2,
    question: '日本の鉄鋼業で使用される鉄鉱石について、最大の輸入相手国はどこですか？',
    options: ['オーストラリア', 'ブラジル', '中国', 'インド'],
    correct: 0,
    explanation: '日本は鉄鉱石の約60％をオーストラリアから輸入しており、これが最大の輸入相手国です。オーストラリアの鉄鉱石は品質が高く、ピルバラ地域などの大規模な鉱山から安定して供給されています。その他、ブラジル（約20％）、インド、南アフリカなどからも輸入していますが、オーストラリアへの依存度が最も高くなっています。',
    category: 'industry',
    difficulty: 'easy',
    type: 'multiple-choice' as const
  },
  {
    id: 3,
    question: '江戸時代以来「日本三名園」として称される庭園の正しい組み合わせはどれですか？',
    options: [
      '偕楽園（茨城県水戸市）、兼六園（石川県金沢市）、後楽園（岡山県岡山市）',
      '偕楽園（茨城県水戸市）、栗林公園（香川県高松市）、後楽園（岡山県岡山市）',
      '兼六園（石川県金沢市）、栗林公園（香川県高松市）、縮景園（広島県広島市）',
      '偕楽園（茨城県水戸市）、兼六園（石川県金沢市）、栗林公園（香川県高松市）'
    ],
    correct: 0,
    explanation: '日本三名園は、水戸藩主徳川斉昭が造った偕楽園（1842年開園、梅の名所）、加賀藩主前田家が造った兼六園（江戸時代初期から造営、雪つりで有名）、岡山藩主池田綱政が造った後楽園（1700年完成、借景庭園）の3つです。これらは江戸時代の大名庭園の代表例として「日本三名園」と呼ばれ、それぞれ異なる特色を持つ回遊式庭園として現在も親しまれています。',
    category: 'regions',
    difficulty: 'hard',
    type: 'multiple-choice' as const
  },
  {
    id: 4,
    question: '潰したご飯を杉の棒に巻きつけて焼いた「きりたんぽ」を使った郷土料理で有名な県はどこですか？',
    options: ['山形県', '秋田県', '岩手県', '宮城県'],
    correct: 1,
    explanation: 'きりたんぽは秋田県北部（大館市・鹿角市周辺）発祥の郷土料理です。新米を半分潰して杉の棒に巻きつけて焼いたものを「きりたんぽ」と呼び、これを比内地鶏のスープで煮込んだ「きりたんぽ鍋」は秋田県の代表的な郷土料理となっています。きりたんぽの語源は、槍の先につける布製の「たんぽ」に形が似ていることから来ており、秋田の冬の味覚として全国的に知られています。',
    category: 'prefecture',
    difficulty: 'easy',
    type: 'multiple-choice' as const
  },
  {
    id: 5,
    question: '自動車産業が特に盛んな工業地帯はどこですか？',
    options: ['阪神工業地帯', '京葉工業地域', '中京工業地帯', '関東内陸工業地域'],
    correct: 2,
    explanation: '中京工業地帯は愛知県を中心とし、トヨタ自動車を始めとする多くの自動車関連企業が集積しています。',
    category: 'industry',
    difficulty: 'easy',
    type: 'multiple-choice'
  },
  {
    id: 6,
    question: '石油化学や鉄鋼業が盛んで、千葉県の東京湾沿岸に位置する工業地域は何ですか？',
    options: ['京浜工業地帯', '京葉工業地域', '鹿島臨海工業地域', '関東内陸工業地域'],
    correct: 1,
    explanation: '京葉工業地域は千葉県の東京湾沿岸に位置し、石油化学や鉄鋼業を中心とした重化学工業が盛んです。',
    category: 'industry',
    difficulty: 'medium',
    type: 'multiple-choice'
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
    category: 'prefecture',
    difficulty: 'hard',
    type: 'multiple-choice'
  },
  {
    id: 8,
    question: '日本三大急流に含まれない川はどれですか？',
    options: ['球磨川', '最上川', '富士川', '四万十川'],
    correct: 3,
    explanation: '日本三大急流は熊本県の球磨川、山形県の最上川、静岡県・山梨県の富士川です。 四万十川は資料に記載がありますが、三大急流には含まれません。',
    category: 'regions',
    difficulty: 'hard',
    type: 'multiple-choice'
  },
  {
    id: 9,
    question: '岩手県盛岡市や奥州市で生産される伝統工芸品は何ですか？',
    options: ['桐生織', '益子焼', '南部鉄器', '箱根寄木細工'],
    correct: 2,
    explanation: '南部鉄器は、岩手県盛岡市や奥州市で生産される伝統工芸品です。',
    category: 'prefecture',
    difficulty: 'medium',
    type: 'multiple-choice'
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
    difficulty: 'medium',
    type: 'multiple-choice'
  },
  {
    id: 11,
    question: '日本の初夏に、くもりや雨の日が多くなる現象を何と呼びますか？',
    options: ['梅雨（ばいう）', '台風（たいふう）', '木枯らし（こがらし）', '時雨（しぐれ）'],
    correct: 0,
    explanation: '日本の初夏には、オホーツク海気団と小笠原気団がぶつかり合って梅雨前線ができ、くもりや雨の日が多くなる「梅雨」という時期があります。',
    category: 'climate',
    difficulty: 'easy',
    type: 'multiple-choice'
  },
  {
    id: 12,
    question: '冬に、日本海側で雪が多く降る主な理由として、最も適切なものはどれですか？',
    options: [
      '太平洋からの湿った空気が山を越えるため',
      '大陸からの冷たく乾いた空気が日本海で水分を吸収し、山にぶつかるため',
      '南からの暖かい海流の影響を強く受けるため',
      '夏に多くの雨が降るため、冬は乾燥するから'
    ],
    correct: 1,
    explanation: '冬には、シベリアからの冷たく乾いた季節風が、対馬海流が流れる日本海の上空で水分を多く含み、日本の山地にぶつかって日本海側に大雪を降らせます。',
    category: 'climate',
    difficulty: 'hard',
    type: 'multiple-choice'
  },
  {
    id: 13,
    question: '夏に、太平洋側で晴れて蒸し暑い日が多くなるのは、主にどの方向からの季節風の影響ですか？',
    options: ['北西', '南東', '北東', '南西'],
    correct: 1,
    explanation: '夏には、太平洋の小笠原気団から、暖かく湿った南東の季節風が吹くため、太平洋側では晴れて蒸し暑い日が多くなります。',
    category: 'climate',
    difficulty: 'medium',
    type: 'multiple-choice'
  },
  {
    id: 14,
    question: '北海道の気候の特徴として、適切でないものはどれですか？',
    options: [
      '冬の寒さが厳しく、雪が多い',
      '梅雨がない',
      '夏は涼しい（冷涼）',
      '一年を通して台風の影響を最も多く受ける'
    ],
    correct: 3,
    explanation: '北海道は梅雨の影響がほとんどなく、夏は涼しく、冬の寒さが厳しいのが特徴です。台風は通常、沖縄や九州に上陸することが多いです。',
    category: 'climate',
    difficulty: 'medium',
    type: 'multiple-choice'
  },
  {
    id: 15,
    question: '日本の夏から秋にかけて、大雨や強風をもたらす熱帯低気圧を何と呼びますか？',
    options: ['竜巻', '梅雨前線', '台風', '偏西風'],
    correct: 2,
    explanation: '夏から秋にかけて、日本の南の海上で発生した熱帯低気圧のうち、最大風速が約17m/s以上になったものを台風と呼び、日本に大きな影響を与えます。',
    category: 'climate',
    difficulty: 'easy',
    type: 'multiple-choice'
  },
  {
    id: 16,
    question: '2022年度の日本のブロッコリー生産量で、1位の都道府県はどこですか？',
    options: ['愛知県', '埼玉県', '宮崎県', '北海道'],
    correct: 3,
    category: 'industry',
    difficulty: 'medium',
    explanation: '2022年度のブロッコリー生産量は、1位が北海道、2位が埼玉県、3位が愛知県です。',
    type: 'multiple-choice'
  },
  {
    id: 17,
    question: '多くの月で降水量が100mmを下回り、冬の降水量が少なく、梅雨や台風の影響で夏に降水量が多くなる気候は、主に日本のどの地域の特徴ですか？',
    options: ['日本海側', '太平洋側', '内陸部', '北海道'],
    correct: 1,
    category: 'climate',
    difficulty: 'medium',
    explanation: '太平洋側の気候は、梅雨や台風の影響で6月〜9月の降水量が多く、冬の降水量は少ないという特徴があります。',
    type: 'multiple-choice'
  },
  {
    id: 18,
    question: '日本最大級のカルスト台地として知られ、国の特別天然記念物にも指定されている「秋吉台」がある都道府県はどこですか？',
    options: ['鳥取県', '島根県', '山口県', '広島県'],
    correct: 2,
    category: 'regions',
    difficulty: 'hard',
    explanation: '秋吉台は山口県の中西部に位置する、日本最大級のカルスト台地です。 ',
    type: 'multiple-choice'
  },
  {
    id: 19,
    question: 'テスト問題：日本で最も面積が大きい都道府県はどこですか？',
    options: ['北海道', '青森県', '岩手県', '秋田県'],
    correct: 0,
    category: 'prefecture',
    difficulty: 'easy',
    explanation: '北海道は日本の全面積の約22%を占める、日本最大の都道府県です。',
    type: 'multiple-choice' as const
  },
  {
    id: 48,
    question: '次のうち、リアス式海岸について正しいものを選びなさい。',
    options: ['リアス式海岸', '寒帯', '大阪府', '湾'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: 'リアス式海岸について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 49,
    question: '利尻半島の特産品について正しい説明を選んでください。',
    options: ['利尻半島の特産品', '川', '山地', '沖縄'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '利尻半島の特産品について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 50,
    question: '次のうち、二官八省について正しいものを選びなさい。',
    options: ['二官八省', '米', '半島', '北海道'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '二官八省について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 51,
    question: 'せり市に関する記述として適切なものはどれですか。',
    options: ['せり市', '北海道', '海峡', '畜産業'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: 'せり市について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 52,
    question: '芥川龍之介について正しい説明を選んでください。',
    options: ['芥川龍之介', '川', 'とうもろこし', '果物'],
    correct: 0,
    category: 'landforms',
    difficulty: 'medium',
    explanation: '芥川龍之介について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 53,
    question: '次のうち、観阿弥と世阿弥について正しいものを選びなさい。',
    options: ['観阿弥と世阿弥', '湖', '北海道', '盆地'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '観阿弥と世阿弥について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 54,
    question: '女性天皇と女系天皇に関する記述として適切なものはどれですか。',
    options: ['女性天皇と女系天皇', '熱帯', '東京都', '本州'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '女性天皇と女系天皇について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 55,
    question: '大隈重信について正しい説明を選んでください。',
    options: ['大隈重信', '乾燥帯', '寒帯', '湿潤気候'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '大隈重信について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 56,
    question: '思いやり予算に関する記述として適切なものはどれですか。',
    options: ['思いやり予算', '海峡', '野菜', '寒帯'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '思いやり予算について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 57,
    question: '鉄道開通に関する記述として適切なものはどれですか。',
    options: ['鉄道開通', '畜産業', '熱帯', '湿潤気候'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '鉄道開通について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 58,
    question: '渤海に関する記述として適切なものはどれですか。',
    options: ['渤海', '海峡', '福岡県', '小麦'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '渤海について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 59,
    question: '小倉百人一首について正しい説明を選んでください。',
    options: ['小倉百人一首', '湾', '乾燥帯', '温帯'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '小倉百人一首について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 60,
    question: '次のうち、松江の気候的な特徴について正しいものを選びなさい。',
    options: ['松江の気候的な特徴', '本州', '大豆', '湿潤気候'],
    correct: 0,
    category: 'climate',
    difficulty: 'medium',
    explanation: '松江の気候的な特徴について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 61,
    question: '次のうち、松本の気候的な特徴について正しいものを選びなさい。',
    options: ['松本の気候的な特徴', '米', '東京都', '熱帯'],
    correct: 0,
    category: 'climate',
    difficulty: 'medium',
    explanation: '松本の気候的な特徴について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 62,
    question: '青木昂陽に関する記述として適切なものはどれですか。',
    options: ['青木昂陽', '盆地', '山地', '野菜'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '青木昂陽について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 63,
    question: '林羅山について正しい説明を選んでください。',
    options: ['林羅山', 'とうもろこし', '北海道', '湖'],
    correct: 0,
    category: 'landforms',
    difficulty: 'medium',
    explanation: '林羅山について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 64,
    question: '熱田神社に関する記述として適切なものはどれですか。',
    options: ['熱田神社', '平野', '熱帯', '米'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '熱田神社について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 65,
    question: '厳島神社に関する記述として適切なものはどれですか。',
    options: ['厳島神社', '愛知県', '大阪府', '盆地'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '厳島神社について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 66,
    question: '太宰府天満宮に関する記述として適切なものはどれですか。',
    options: ['太宰府天満宮', '湿潤気候', '湾', '漁業'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '太宰府天満宮について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 67,
    question: '諏訪大社に関する記述として適切なものはどれですか。',
    options: ['諏訪大社', '大陸性気候', '亜熱帯', '小麦'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '諏訪大社について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 68,
    question: 'インドの宗教に関する記述として適切なものはどれですか。',
    options: ['インドの宗教', '川', '大阪府', '大陸性気候'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: 'インドの宗教について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 69,
    question: '砂州に関する記述として適切なものはどれですか。',
    options: ['砂州', '大陸性気候', '北海道', '福岡県'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '砂州について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 70,
    question: 'ウクライナに関する記述として適切なものはどれですか。',
    options: ['ウクライナ', '湾', '湿潤気候', '大阪府'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: 'ウクライナについて詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 71,
    question: '商店街の問題について正しい説明を選んでください。',
    options: ['商店街の問題', '台地', '山地', '半島'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '商店街の問題について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 72,
    question: '九州の新幹線に関する記述として適切なものはどれですか。',
    options: ['九州の新幹線', '湿潤気候', '四国', '亜熱帯'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '九州の新幹線について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 73,
    question: '厚生労働省の役割に関する記述として適切なものはどれですか。',
    options: ['厚生労働省の役割', '果物', '平野', '九州'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '厚生労働省の役割について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 74,
    question: '熊本県の工業に関する記述として適切なものはどれですか。',
    options: ['熊本県の工業', '東京都', '四国', '寒帯'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '熊本県の工業について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 75,
    question: '次のうち、薩摩藩について正しいものを選びなさい。',
    options: ['薩摩藩', '湾', '平野', '沖縄'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '薩摩藩について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 76,
    question: '天守閣に関する記述として適切なものはどれですか。',
    options: ['天守閣', '九州', '小麦', '平野'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '天守閣について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 77,
    question: '次のうち、阿倍仲麻呂について正しいものを選びなさい。',
    options: ['阿倍仲麻呂', '盆地', '福岡県', '海峡'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '阿倍仲麻呂について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 78,
    question: '聖武天皇について正しい説明を選んでください。',
    options: ['聖武天皇', '愛知県', 'とうもろこし', '沖縄'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '聖武天皇について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 79,
    question: '天台宗に関する記述として適切なものはどれですか。',
    options: ['天台宗', '九州', '山地', '海峡'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '天台宗について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 80,
    question: '次のうち、比叡山延暦寺について正しいものを選びなさい。',
    options: ['比叡山延暦寺', '台地', '熱帯', '果物'],
    correct: 0,
    category: 'landforms',
    difficulty: 'medium',
    explanation: '比叡山延暦寺について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 81,
    question: '一向宗について正しい説明を選んでください。',
    options: ['一向宗', 'とうもろこし', '野菜', '大阪府'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '一向宗について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 82,
    question: '世界恐慌について正しい説明を選んでください。',
    options: ['世界恐慌', '半島', '九州', '海峡'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '世界恐慌について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 83,
    question: '岸信介について正しい説明を選んでください。',
    options: ['岸信介', '東京都', '寒帯', 'とうもろこし'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '岸信介について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 84,
    question: '次のうち、大豆の生産量について正しいものを選びなさい。',
    options: ['大豆の生産量', '果物', '熱帯', '米'],
    correct: 0,
    category: 'agriculture',
    difficulty: 'medium',
    explanation: '大豆の生産量について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 85,
    question: '普遍主義について正しい説明を選んでください。',
    options: ['普遍主義', '大陸性気候', '野菜', '北海道'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '普遍主義について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 86,
    question: '次のうち、社会権について正しいものを選びなさい。',
    options: ['社会権', '熱帯', '寒帯', '湾'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '社会権について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 87,
    question: '自由権について正しい説明を選んでください。',
    options: ['自由権', '台地', '乾燥帯', '米'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '自由権について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 88,
    question: '次のうち、石破茂について正しいものを選びなさい。',
    options: ['石破茂', '亜熱帯', '湾', '北海道'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '石破茂について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 89,
    question: '衆議院総選挙について正しい説明を選んでください。',
    options: ['衆議院総選挙', '湾', '北海道', '平野'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '衆議院総選挙について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 90,
    question: '次のうち、衆議院の解散について正しいものを選びなさい。',
    options: ['衆議院の解散', '沖縄', '九州', '湿潤気候'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '衆議院の解散について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 91,
    question: '熊野古道に関する記述として適切なものはどれですか。',
    options: ['熊野古道', '湾', '温帯', '北海道'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '熊野古道について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 92,
    question: '三十石船に関する記述として適切なものはどれですか。',
    options: ['三十石船', '川', '東京都', '山地'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '三十石船について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 93,
    question: '次のうち、菱垣廻船について正しいものを選びなさい。',
    options: ['菱垣廻船', '山地', '湖', '東京都'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '菱垣廻船について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 94,
    question: '次のうち、樽廻船について正しいものを選びなさい。',
    options: ['樽廻船', 'とうもろこし', '盆地', '四国'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '樽廻船について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 95,
    question: '次のうち、オーバーツーリズムについて正しいものを選びなさい。',
    options: ['オーバーツーリズム', '乾燥帯', '愛知県', '盆地'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: 'オーバーツーリズムについて詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 96,
    question: '夏目漱石に関する記述として適切なものはどれですか。',
    options: ['夏目漱石', '川', '愛知県', '大陸性気候'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '夏目漱石について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 97,
    question: '野口英世に関する記述として適切なものはどれですか。',
    options: ['野口英世', '九州', '東京都', '湖'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '野口英世について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 98,
    question: '北里柴三郎について正しい説明を選んでください。',
    options: ['北里柴三郎', '愛知県', '四国', '寒帯'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '北里柴三郎について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 99,
    question: '次のうち、日本銀行について正しいものを選びなさい。',
    options: ['日本銀行', '四国', '野菜', '本州'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '日本銀行について詳しく学習しましょう。',
    type: 'multiple-choice' as const
  },
  {
    id: 100,
    question: '高橋是清について正しい説明を選んでください。',
    options: ['高橋是清', '大阪府', '九州', '果物'],
    correct: 0,
    category: 'regions',
    difficulty: 'medium',
    explanation: '高橋是清について詳しく学習しましょう。',
    type: 'multiple-choice' as const
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
  return Array.from(new Set(geographyQuestions.map(q => q.category)));
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
