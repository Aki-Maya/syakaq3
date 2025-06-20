// History Data for ShakaQuest
export interface HistoryQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'map-select';
  era: string;
}

export interface HistoricalEra {
  id: number;
  name: string;
  period: string;
  keyFeatures: string[];
  importantPeople: string[];
  majorEvents: string[];
}

// Historical Eras Data (17 periods)
export const historicalEras: HistoricalEra[] = [
  {
    id: 1,
    name: "旧石器時代",
    period: "約1万2千年前まで",
    keyFeatures: ["狩猟・採集生活", "打製石器の使用", "氷河期の終わり"],
    importantPeople: [],
    majorEvents: ["日本列島への人類到来"]
  },
  {
    id: 2,
    name: "縄文時代",
    period: "約1万2千年前〜約2400年前",
    keyFeatures: ["縄文土器", "竪穴住居", "狩猟・採集・漁労"],
    importantPeople: [],
    majorEvents: ["土器の製作開始", "定住生活の始まり"]
  },
  {
    id: 3,
    name: "弥生時代",
    period: "約2400年前〜約1700年前",
    keyFeatures: ["稲作の伝来", "弥生土器", "金属器の使用"],
    importantPeople: ["卑弥呼"],
    majorEvents: ["稲作の始まり", "邪馬台国の成立"]
  },
  {
    id: 4,
    name: "古墳時代",
    period: "約1700年前〜約1400年前",
    keyFeatures: ["古墳の建設", "大和朝廷の成立", "渡来人の来日"],
    importantPeople: ["応神天皇", "仁徳天皇"],
    majorEvents: ["大和朝廷の統一", "大仙陵古墳の建設"]
  },
  {
    id: 5,
    name: "飛鳥時代",
    period: "593年〜710年",
    keyFeatures: ["仏教の伝来", "律令制度", "遣隋使・遣唐使"],
    importantPeople: ["聖徳太子", "蘇我馬子", "中大兄皇子", "中臣鎌足"],
    majorEvents: ["十七条憲法制定", "大化の改新", "壬申の乱"]
  },
  {
    id: 6,
    name: "奈良時代",
    period: "710年〜794年",
    keyFeatures: ["平城京", "大仏建立", "万葉集"],
    importantPeople: ["聖武天皇", "行基", "鑑真"],
    majorEvents: ["平城京遷都", "東大寺大仏開眼", "万葉集成立"]
  },
  {
    id: 7,
    name: "平安時代",
    period: "794年〜1185年",
    keyFeatures: ["平安京", "藤原氏の摂関政治", "源氏物語"],
    importantPeople: ["桓武天皇", "藤原道長", "紫式部", "清少納言"],
    majorEvents: ["平安京遷都", "藤原氏全盛期", "源平合戦"]
  },
  {
    id: 8,
    name: "鎌倉時代",
    period: "1185年〜1333年",
    keyFeatures: ["武士の政治", "鎌倉幕府", "御恩と奉公"],
    importantPeople: ["源頼朝", "源義経", "北条政子", "北条泰時"],
    majorEvents: ["鎌倉幕府成立", "承久の乱", "蒙古襲来（元寇）"]
  },
  {
    id: 9,
    name: "室町時代",
    period: "1336年〜1573年",
    keyFeatures: ["足利氏の政治", "南北朝の分裂", "勘合貿易"],
    importantPeople: ["足利尊氏", "足利義満", "雪舟"],
    majorEvents: ["室町幕府成立", "南北朝統一", "応仁の乱"]
  },
  {
    id: 10,
    name: "戦国時代",
    period: "1467年〜1590年頃",
    keyFeatures: ["戦国大名の争い", "鉄砲の伝来", "キリスト教の伝来"],
    importantPeople: ["織田信長", "武田信玄", "上杉謙信", "フランシスコ・ザビエル"],
    majorEvents: ["鉄砲伝来", "キリスト教伝来", "桶狭間の戦い"]
  },
  {
    id: 11,
    name: "安土桃山時代",
    period: "1573年〜1603年",
    keyFeatures: ["織田・豊臣政権", "天下統一", "朝鮮出兵"],
    importantPeople: ["織田信長", "豊臣秀吉", "徳川家康"],
    majorEvents: ["本能寺の変", "太閤検地", "朝鮮出兵", "関ヶ原の戦い"]
  },
  {
    id: 12,
    name: "江戸時代前期",
    period: "1603年〜1700年頃",
    keyFeatures: ["徳川幕府成立", "参勤交代", "鎖国"],
    importantPeople: ["徳川家康", "徳川家光", "徳川綱吉"],
    majorEvents: ["江戸幕府開府", "島原の乱", "鎖国完成"]
  },
  {
    id: 13,
    name: "江戸時代中期",
    period: "1700年頃〜1800年頃",
    keyFeatures: ["享保の改革", "田沼政治", "寛政の改革"],
    importantPeople: ["徳川吉宗", "田沼意次", "松平定信"],
    majorEvents: ["享保の改革", "田沼政治", "寛政の改革"]
  },
  {
    id: 14,
    name: "江戸時代後期",
    period: "1800年頃〜1867年",
    keyFeatures: ["天保の改革", "黒船来航", "尊王攘夷運動"],
    importantPeople: ["水野忠邦", "ペリー", "坂本龍馬", "西郷隆盛"],
    majorEvents: ["黒船来航", "日米和親条約", "大政奉還"]
  },
  {
    id: 15,
    name: "明治時代",
    period: "1868年〜1912年",
    keyFeatures: ["明治維新", "富国強兵", "文明開化"],
    importantPeople: ["明治天皇", "大久保利通", "木戸孝允", "伊藤博文"],
    majorEvents: ["明治維新", "廃藩置県", "日清戦争", "日露戦争"]
  },
  {
    id: 16,
    name: "大正時代",
    period: "1912年〜1926年",
    keyFeatures: ["大正デモクラシー", "第一次世界大戦", "大正文化"],
    importantPeople: ["大正天皇", "原敬", "吉野作造"],
    majorEvents: ["第一次世界大戦参戦", "米騒動", "関東大震災"]
  },
  {
    id: 17,
    name: "昭和時代",
    period: "1926年〜1989年",
    keyFeatures: ["軍国主義", "第二次世界大戦", "戦後復興"],
    importantPeople: ["昭和天皇", "東條英機", "マッカーサー"],
    majorEvents: ["満州事変", "日中戦争", "太平洋戦争", "終戦"]
  }
];

// History Questions
export const historyQuestions: HistoryQuestion[] = [
  {
    id: 1,
    question: "縄文時代の特徴として正しいものはどれですか？",
    options: ["稲作が始まった", "縄文土器を使った", "古墳を作った", "仏教が伝来した"],
    correct: 1,
    explanation: "縄文時代は縄文土器を特徴とする時代です。",
    category: "prehistoric",
    difficulty: "easy",
    type: "multiple-choice",
    era: "縄文時代"
  },
  {
    id: 2,
    question: "弥生時代に始まったものは何ですか？",
    options: ["狩猟", "採集", "稲作", "金属器"],
    correct: 2,
    explanation: "弥生時代に稲作が始まりました。",
    category: "prehistoric",
    difficulty: "easy",
    type: "multiple-choice",
    era: "弥生時代"
  },
  {
    id: 3,
    question: "聖徳太子が制定したのは何ですか？",
    options: ["十七条憲法", "大宝律令", "御成敗式目", "建武式目"],
    correct: 0,
    explanation: "聖徳太子は十七条憲法を制定しました。",
    category: "ancient",
    difficulty: "medium",
    type: "multiple-choice",
    era: "飛鳥時代"
  },
  {
    id: 4,
    question: "奈良時代の都はどこですか？",
    options: ["飛鳥京", "平城京", "平安京", "鎌倉"],
    correct: 1,
    explanation: "奈良時代の都は平城京です。",
    category: "ancient",
    difficulty: "easy",
    type: "multiple-choice",
    era: "奈良時代"
  },
  {
    id: 5,
    question: "源氏物語の作者は誰ですか？",
    options: ["清少納言", "紫式部", "和泉式部", "赤染衛門"],
    correct: 1,
    explanation: "源氏物語の作者は紫式部です。",
    category: "classical",
    difficulty: "medium",
    type: "multiple-choice",
    era: "平安時代"
  },
  {
    id: 6,
    question: "鎌倉幕府を開いたのは誰ですか？",
    options: ["源義朝", "源頼朝", "源義経", "源頼政"],
    correct: 1,
    explanation: "源頼朝が鎌倉幕府を開きました。",
    category: "medieval",
    difficulty: "easy",
    type: "multiple-choice",
    era: "鎌倉時代"
  },
  {
    id: 7,
    question: "元寇が起こったのはいつの時代ですか？",
    options: ["平安時代", "鎌倉時代", "室町時代", "戦国時代"],
    correct: 1,
    explanation: "元寇（蒙古襲来）は鎌倉時代に起こりました。",
    category: "medieval",
    difficulty: "medium",
    type: "multiple-choice",
    era: "鎌倉時代"
  },
  {
    id: 8,
    question: "応仁の乱が起こったのはどの時代ですか？",
    options: ["鎌倉時代", "室町時代", "戦国時代", "安土桃山時代"],
    correct: 1,
    explanation: "応仁の乱は室町時代に起こり、戦国時代の始まりとなりました。",
    category: "medieval",
    difficulty: "medium",
    type: "multiple-choice",
    era: "室町時代"
  },
  {
    id: 9,
    question: "桶狭間の戦いで今川義元を破ったのは誰ですか？",
    options: ["豊臣秀吉", "徳川家康", "織田信長", "武田信玄"],
    correct: 2,
    explanation: "織田信長が桶狭間の戦いで今川義元を破りました。",
    category: "warring-states",
    difficulty: "medium",
    type: "multiple-choice",
    era: "戦国時代"
  },
  {
    id: 10,
    question: "天下統一を果たしたのは誰ですか？",
    options: ["織田信長", "豊臣秀吉", "徳川家康", "武田信玄"],
    correct: 1,
    explanation: "豊臣秀吉が天下統一を果たしました。",
    category: "unification",
    difficulty: "medium",
    type: "multiple-choice",
    era: "安土桃山時代"
  },
  {
    id: 11,
    question: "江戸幕府を開いたのは誰ですか？",
    options: ["織田信長", "豊臣秀吉", "徳川家康", "徳川秀忠"],
    correct: 2,
    explanation: "徳川家康が江戸幕府を開きました。",
    category: "edo",
    difficulty: "easy",
    type: "multiple-choice",
    era: "江戸時代前期"
  },
  {
    id: 12,
    question: "鎖国を完成させたのは誰ですか？",
    options: ["徳川家康", "徳川秀忠", "徳川家光", "徳川家綱"],
    correct: 2,
    explanation: "徳川家光が鎖国を完成させました。",
    category: "edo",
    difficulty: "medium",
    type: "multiple-choice",
    era: "江戸時代前期"
  },
  {
    id: 13,
    question: "黒船で来航したアメリカの提督は誰ですか？",
    options: ["ペリー", "ハリス", "ヘボン", "フェノロサ"],
    correct: 0,
    explanation: "ペリー提督が黒船で来航しました。",
    category: "end-of-edo",
    difficulty: "easy",
    type: "multiple-choice",
    era: "江戸時代後期"
  },
  {
    id: 14,
    question: "明治維新の三大改革の一つでないものはどれですか？",
    options: ["廃藩置県", "地租改正", "学制", "大政奉還"],
    correct: 3,
    explanation: "大政奉還は明治維新の原因であり、三大改革ではありません。",
    category: "meiji",
    difficulty: "hard",
    type: "multiple-choice",
    era: "明治時代"
  },
  {
    id: 15,
    question: "日露戦争で活躍した提督は誰ですか？",
    options: ["東郷平八郎", "乃木希典", "大山巌", "児玉源太郎"],
    correct: 0,
    explanation: "東郷平八郎は日本海海戦で活躍した提督です。",
    category: "meiji",
    difficulty: "medium",
    type: "multiple-choice",
    era: "明治時代"
  },

  // === ここから追加した問題 (15問) ===
  {
    id: 16,
    question: "第一次世界大戦で日本が参戦した主な理由は何ですか？",
    options: ["三国干渉への報復", "シベリア出兵のため", "日英同盟", "国際連盟の設立"],
    correct: 2,
    explanation: "日本は日英同盟に基づき、連合国側として第一次世界大戦に参戦しました。",
    category: "taisho",
    difficulty: "medium",
    type: "multiple-choice",
    era: "大正時代"
  },
  {
    id: 17,
    question: "1925年（大正14年）に制定され、25歳以上の全ての男子に選挙権を与えた法律は何ですか？",
    options: ["治安維持法", "普通選挙法", "大日本帝国憲法", "五箇条の御誓文"],
    correct: 1,
    explanation: "普通選挙法により、納税額に関わらず25歳以上の全男子が選挙権を持つことになりました。ただし、女性の参政権はまだ認められませんでした。",
    category: "taisho",
    difficulty: "hard",
    type: "multiple-choice",
    era: "大正時代"
  },
  {
    id: 18,
    question: "満州事変のきっかけとなった、1931年に起きた事件は何ですか？",
    options: ["盧溝橋事件", "柳条湖事件", "二・二六事件", "五・一五事件"],
    correct: 1,
    explanation: "1931年、関東軍が南満州鉄道の線路を爆破した柳条湖事件をきっかけに満州事変が始まりました。",
    category: "showa-prewar",
    difficulty: "medium",
    type: "multiple-choice",
    era: "昭和時代"
  },
  {
    id: 19,
    question: "1933年に日本が国際連盟を脱退する直接の原因となったのは何ですか？",
    options: ["満州国の建国を非難されたため", "日独伊三国同盟を締結したため", "真珠湾攻撃を行ったため", "ワシントン海軍軍縮条約に不満だったため"],
    correct: 0,
    explanation: "リットン調査団の報告に基づき、国際連盟が満州国の独立を認めなかったため、日本はこれに反発し脱退しました。",
    category: "showa-prewar",
    difficulty: "hard",
    type: "multiple-choice",
    era: "昭和時代"
  },
  {
    id: 20,
    question: "太平洋戦争の終結を決定づけた「ポツダム宣言」を、日本が受諾することを国民に知らせた放送を何と呼びますか？",
    options: ["開戦の詔勅", "玉音放送", "大政奉還の上奏", "人間宣言"],
    correct: 1,
    explanation: "1945年8月15日、昭和天皇自らがラジオでポツダム宣言の受諾を国民に伝えた放送を玉音放送といいます。",
    category: "showa-war",
    difficulty: "easy",
    type: "multiple-choice",
    era: "昭和時代"
  },
  {
    id: 21,
    question: "672年に起きた、天智天皇の後継をめぐる古代最大の内乱を何といいますか？",
    options: ["保元の乱", "平治の乱", "壬申の乱", "承久の乱"],
    correct: 2,
    explanation: "壬申の乱は、大海人皇子（後の天武天皇）が甥の大友皇子を破った皇位継承争いです。",
    category: "ancient",
    difficulty: "medium",
    type: "multiple-choice",
    era: "飛鳥時代"
  },
  {
    id: 22,
    question: "何度も遭難しながらも日本へ渡来し、仏教の正式な戒律を伝えた唐の僧侶は誰ですか？",
    options: ["行基", "空海", "最澄", "鑑真"],
    correct: 3,
    explanation: "鑑真は6度の航海の末に来日を果たし、奈良の唐招提寺を建立しました。",
    category: "ancient",
    difficulty: "medium",
    type: "multiple-choice",
    era: "奈良時代"
  },
  {
    id: 23,
    question: "「この世をば わが世とぞ思ふ 望月の…」という歌を詠み、権勢を誇った平安時代の人物は誰ですか？",
    options: ["平清盛", "菅原道真", "藤原頼長", "藤原道長"],
    correct: 3,
    explanation: "摂関政治の全盛期を築いた藤原道長が、自分の権勢を満月に例えて詠んだ有名な歌です。",
    category: "classical",
    difficulty: "medium",
    type: "multiple-choice",
    era: "平安時代"
  },
  {
    id: 24,
    question: "1232年に北条泰時が制定した、日本初の武家法典（武士のための法律）は何ですか？",
    options: ["大宝律令", "養老律令", "御成敗式目", "建武式目"],
    correct: 2,
    explanation: "御成敗式目（貞永式目）は、御家人の権利や義務、紛争解決の基準などを定めた、武士社会の基本法です。",
    category: "medieval",
    difficulty: "medium",
    type: "multiple-choice",
    era: "鎌倉時代"
  },
  {
    id: 25,
    question: "足利義満が建てた金閣に代表される、室町時代前期の文化を何文化といいますか？",
    options: ["北山文化", "東山文化", "桃山文化", "化政文化"],
    correct: 0,
    explanation: "室町幕府3代将軍足利義満の時代に栄えた、公家文化と武家文化が融合した華やかな文化が北山文化です。",
    category: "medieval",
    difficulty: "easy",
    type: "multiple-choice",
    era: "室町時代"
  },
  {
    id: 26,
    question: "1543年に種子島に鉄砲を伝えたのは、どこの国の人々とされていますか？",
    options: ["スペイン", "ポルトガル", "オランダ", "イギリス"],
    correct: 1,
    explanation: "中国船に乗っていたポルトガル人が種子島に漂着し、鉄砲を伝えたことが日本の戦国時代の戦術に大きな影響を与えました。",
    category: "warring-states",
    difficulty: "easy",
    type: "multiple-choice",
    era: "戦国時代"
  },
  {
    id: 27,
    question: "「米将軍」と呼ばれ、目安箱の設置や公事方御定書の制定など享保の改革を行った将軍は誰ですか？",
    options: ["徳川家康", "徳川家光", "徳川吉宗", "徳川慶喜"],
    correct: 2,
    explanation: "江戸幕府第8代将軍の徳川吉宗は、幕府財政の再建と政治の安定を目指し、享保の改革を断行しました。",
    category: "edo",
    difficulty: "medium",
    type: "multiple-choice",
    era: "江戸時代中期"
  },
  {
    id: 28,
    question: "葛飾北斎の浮世絵や十返舎一九の滑稽本などが流行した、江戸時代後期の町人文化を何といいますか？",
    options: ["元禄文化", "化政文化", "北山文化", "桃山文化"],
    correct: 1,
    explanation: "19世紀初頭、江戸を中心に栄えた町人文化を化政文化と呼びます。皮肉やユーモアを交えた作品が多く生まれました。",
    category: "edo",
    difficulty: "medium",
    type: "multiple-choice",
    era: "江戸時代後期"
  },
  {
    id: 29,
    question: "1889年（明治22年）に発布された、アジアで最初の近代的な憲法は何ですか？",
    options: ["五箇条の御誓文", "十七条憲法", "大日本帝国憲法", "日本国憲法"],
    correct: 2,
    explanation: "大日本帝国憲法は、天皇が主権を持つプロイセン（ドイツ）の憲法を参考に作られ、帝国議会の開設などを定めました。",
    category: "meiji",
    difficulty: "medium",
    type: "multiple-choice",
    era: "明治時代"
  },
  {
    id: 30,
    question: "日本の戦後復興と高度経済成長を象徴する出来事として、1964年にアジアで初めて開催された国際的なイベントは何ですか？",
    options: ["東京オリンピック", "大阪万国博覧会", "札幌冬季オリンピック", "愛知万博"],
    correct: 0,
    explanation: "1964年の東京オリンピック開催は、日本が敗戦から復興し、国際社会に復帰したことを世界に示す一大イベントでした。",
    category: "showa-postwar",
    difficulty: "easy",
    type: "multiple-choice",
    era: "昭和時代"
  }
];

// Utility functions
export const getQuestionsByEra = (era: string): HistoryQuestion[] => {
  return historyQuestions.filter(q => q.era === era);
};

export const getQuestionsByCategory = (category: string): HistoryQuestion[] => {
  return historyQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): HistoryQuestion[] => {
  return historyQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number = 5): HistoryQuestion[] => {
  const shuffled = [...historyQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getEras = (): string[] => {
  return historicalEras.map(era => era.name);
};

export const getCategories = (): string[] => {
  return [...new Set(historyQuestions.map(q => q.category))];
};

export default {
  historicalEras,
  historyQuestions,
  getQuestionsByEra,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getRandomQuestions,
  getEras,
  getCategories
};
