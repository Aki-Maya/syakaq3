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

// Historical Eras Data (6 periods)
export const historicalEras: HistoricalEra[] = [
  {
    id: 1,
    name: "原始",
    period: "〜約2400年前",
    keyFeatures: ["狩猟・採集・漁労", "打製石器・縄文土器の使用", "定住生活の始まり"],
    importantPeople: [],
    majorEvents: ["日本列島への人類到来", "土器の製作開始"]
  },
  {
    id: 2,
    name: "古代",
    period: "約2400年前〜1185年",
    keyFeatures: ["稲作の開始と普及", "前方後円墳と大和朝廷", "仏教伝来と律令国家の形成", "摂関政治と国風文化"],
    importantPeople: ["卑弥呼", "聖徳太子", "聖武天皇", "桓武天皇", "藤原道長", "紫式部"],
    majorEvents: ["邪馬台国の成立", "大化の改新", "大仏建立", "平安京遷都", "源平合戦"]
  },
  {
    id: 3,
    name: "中世",
    period: "1185年〜1573年",
    keyFeatures: ["武家政権の成立（幕府）", "封建制度（御恩と奉公）", "禅宗などの武家文化", "応仁の乱と下克上"],
    importantPeople: ["源頼朝", "北条政子", "足利尊氏", "足利義満", "雪舟", "フランシスコ・ザビエル"],
    majorEvents: ["鎌倉幕府成立", "元寇（蒙古襲来）", "南北朝の動乱", "応仁の乱", "鉄砲・キリスト教の伝来"]
  },
  {
    id: 4,
    name: "近世",
    period: "1573年〜1867年",
    keyFeatures: ["天下統一事業", "幕藩体制と参勤交代", "鎖国政策", "町人文化の発展（元禄・化政文化）"],
    importantPeople: ["織田信長", "豊臣秀吉", "徳川家康", "徳川吉宗", "ペリー", "坂本龍馬"],
    majorEvents: ["関ヶ原の戦い", "江戸幕府開府", "鎖国完成", "享保・寛政・天保の改革", "黒船来航", "大政奉還"]
  },
  {
    id: 5,
    name: "近代",
    period: "1868年〜1945年",
    keyFeatures: ["明治維新と中央集権化", "富国強兵・殖産興業", "大正デモクラシー", "二度の大戦（日清・日露・第一次・第二次）"],
    importantPeople: ["明治天皇", "伊藤博文", "大久保利通", "原敬", "東條英機"],
    majorEvents: ["明治維新", "大日本帝国憲法発布", "日清戦争", "日露戦争", "第一次世界大戦", "太平洋戦争"]
  },
  {
    id: 6,
    name: "現代",
    period: "1945年〜現在",
    keyFeatures: ["戦後改革と民主化", "高度経済成長", "国際社会への復帰", "バブル経済と安定成長"],
    importantPeople: ["昭和天皇", "マッカーサー", "吉田茂"],
    majorEvents: ["終戦", "日本国憲法公布", "サンフランシスコ平和条約", "東京オリンピック開催（1964年）", "石油危機（オイルショック）"]
  }
];
// History Questions
export const historyQuestions: HistoryQuestion[] = [
   {
    id: 1,
    question: '三・一独立運動に影響を与えたとされる、ウィルソン米大統領が提唱した原則は何ですか？',
    options: ['民族自決', '門戸開放', '自由貿易', '秘密外交の廃止'],
    correct: 0,
    category: 'modern',
    difficulty: 'normal',
    explanation: 'ウィルソン米大統領の民族自決の提唱が、三・一独立運動に影響を与えました。'
  },
  {
    id: 2,
    question: '聖武天皇が行った政策として、適切でないものはどれですか？',
    options: ['東大寺の大仏造立', '国分寺・国分尼寺の建立', '墾田永年私財法の制定', '武家諸法度の発布'],
    correct: 3,
    category: 'ancient',
    difficulty: 'easy',
    explanation: '武家諸法度は、江戸時代に徳川家光によって発布されたものであり、聖武天皇の政策ではありません。'
  },
  {
    id: 3,
    question: '鎌倉幕府の第8代執権である北条時宗が行ったこととして、正しいものはどれですか？',
    options: ['元寇の際の防衛体制の強化', '平等院鳳凰堂の建立', '日明貿易の開始', '享保の改革の実施'],
    correct: 0,
    category: 'medieval',
    difficulty: 'normal',
    explanation: '北条時宗は、元寇に際して防衛体制を強化し、元の使者を拒否しました。'
  },
  {
    id: 4,
    question: '江戸時代の元禄文化で活躍した人物と作品の組み合わせとして、正しいものはどれですか？',
    options: ['井原西鶴 - 浮世草子', '滝沢馬琴 - 南総里見八犬伝', '葛飾北斎 - 富嶽三十六景', '松尾芭蕉 - 平家物語'],
    correct: 0,
    category: 'early-modern',
    difficulty: 'easy',
    explanation: '井原西鶴は、元禄文化を代表する浮世草子の作者です。'
  },
  {
    id: 5,
    question: '古墳時代に大陸から渡来人によってもたらされたと考えられているものは、次のうちどれですか？',
    options: ['鉄器と稲作', '牛や馬', '仏教と漢字', '火薬と羅針盤'],
    correct: 1,
    category: 'ancient',
    difficulty: 'normal',
    explanation: '各地の遺跡から牛や馬の骨、埴輪、馬具が出土していることから、古墳時代に渡来人によって牛や馬が大陸から持ち込まれたと考えられています。'
  },
  {
    id: 6,
    question: '645年に中大兄皇子らによって暗殺された、聖徳太子の死後に強い権力を持った人物は誰ですか？',
    options: ['蘇我馬子', '蘇我蝦夷', '蘇我入鹿', '物部守屋'],
    correct: 2,
    category: 'ancient',
    difficulty: 'normal',
    explanation: '蘇我馬子の孫である蘇我入鹿は、聖徳太子の死後に権力を持ちましたが、645年に中大兄皇子らによって暗殺されました。'
  },
  {
    id: 7,
    question: '稗田阿礼が暗唱した内容を、太安万侶が記録する形で成立した歴史書は何ですか？',
    options: ['日本書紀', '古事記', '万葉集', '風土記'],
    correct: 1,
    category: 'ancient',
    difficulty: 'normal',
    explanation: '古事記は、稗田阿礼が暗唱した内容を太安万侶が記録する形で作られました。'
  },
  {
    id: 8,
    question: '舎人親王らが中心となって編纂した、日本初の正式な歴史書（正史）は何ですか？',
    options: ['古事記', '日本書紀', '続日本紀', '古語拾遺'],
    correct: 1,
    category: 'ancient',
    difficulty: 'normal',
    explanation: '日本書紀は、大海人皇子の子である舎人親王らによって書かれた歴史書です。'
  },
  {
    id: 9,
    question: '奈良時代、西アジアなどから伝わった品々や天皇の遺品などが保管されている、東大寺の施設は何ですか？',
    options: ['法華堂（三月堂）', '転害門', '正倉院', '大仏殿'],
    correct: 2,
    category: 'ancient',
    difficulty: 'easy',
    explanation: '東大寺正倉院には、奈良時代に西アジアから伝わった品物や、天皇の遺品などが保管されています。'
  },
  {
    id: 10,
    question: '遣唐使の一員として唐に渡り、その地で高い評価を受けたものの、日本に帰ることができなかった奈良時代の人物は誰ですか？',
    options: ['山上憶良', '阿倍仲麻呂', '鑑真', '吉備真備'],
    correct: 1,
    category: 'ancient',
    difficulty: 'normal',
    explanation: '阿倍仲麻呂は遣唐使の一員として中国に渡りました。'
  },
  {
    id: 11,
    question: '平安時代後期、源義家と清原氏の間で起こり、東国における武士の勢力が拡大するきっかけとなった戦いは何ですか？',
    options: ['前九年合戦', '保元の乱', '平治の乱', '後三年合戦'],
    correct: 3,
    category: 'ancient',
    difficulty: 'hard',
    explanation: '後三年合戦は平安時代後期に奥州で源義家と清原氏の間で起こった戦いで、源義家が勝利しました。'
  },
  {
    id: 12,
    question: '藤原道長の子で関白となり、京都の宇治に平等院鳳凰堂を築いた人物は誰ですか？',
    options: ['藤原頼通', '藤原実資', '藤原兼家', '藤原伊周'],
    correct: 0,
    category: 'ancient',
    difficulty: 'normal',
    explanation: '藤原頼通は藤原道長の息子で関白となり、平等院鳳凰堂を築きました。'
  },
  {
    id: 13,
    question: '源頼朝が、国ごとに設置して軍事や警察の役割を担わせた役職は何ですか？',
    options: ['地頭', '守護', '検非違使', '勘解由使'],
    correct: 1,
    category: 'medieval',
    difficulty: 'easy',
    explanation: '源頼朝は、国ごとに軍事や警察の役割を持った守護を配置し、権力を強めました。'
  },
  {
    id: 14,
    question: '鎌倉時代、荘園や公領に派遣され、年貢の取り立てなどを行った役職は何ですか？',
    options: ['守護', '奉行', '地頭', '問注所'],
    correct: 2,
    category: 'medieval',
    difficulty: 'easy',
    explanation: '地頭は荘園に派遣され、税の取り立てを行った武士です。'
  },
  {
    id: 15,
    question: '鎌倉時代の仏教について、日蓮が唱えた題目（だもく）は何ですか？',
    options: ['南無阿弥陀仏', '南無妙法蓮華経', '同行二人', '即身成仏'],
    correct: 1,
    category: 'medieval',
    difficulty: 'easy',
    explanation: '日蓮は日蓮宗を開き、「南無妙法蓮華経」という題目を唱えました。'
  },
  {
    id: 16,
    question: '鎌倉時代の仏教について、「南無阿弥陀仏」と念仏を唱えることで救われると説いた親鸞が開いた宗派は何ですか？',
    options: ['浄土宗', '時宗', '浄土真宗', '臨済宗'],
    correct: 2,
    category: 'medieval',
    difficulty: 'easy',
    explanation: '親鸞は浄土真宗を開き、「南無阿弥陀仏」と念仏を唱えることで救われると説きました。'
  },
  {
    id: 17,
    question: '鎌倉時代に栄西が伝えた禅宗の一派は何ですか？',
    options: ['曹洞宗', '黄檗宗', '法相宗', '臨済宗'],
    correct: 3,
    category: 'medieval',
    difficulty: 'normal',
    explanation: '栄西は臨済宗を伝えました。（曹洞宗は道元が伝えました。）'
  },
  {
    id: 18,
    question: '室町時代の日明貿易において、日本からの主な輸出品は何でしたか？',
    options: ['生糸、絹織物', '書籍、陶磁器', '硫黄、刀剣', '綿織物、木綿'],
    correct: 2,
    category: 'medieval',
    difficulty: 'normal',
    explanation: '日明貿易では、硫黄、漆器、刀剣などが日本からの主な輸出品でした。生糸や書籍などは輸入品です。'
  },
  {
    id: 19,
    question: '1543年にポルトガル人が種子島に伝えたものは何ですか？',
    options: ['キリスト教', '鉄砲', '活版印刷術', 'じゃがいも'],
    correct: 1,
    category: 'medieval',
    difficulty: 'easy',
    explanation: '1543年、ポルトガル人によって種子島に鉄砲が伝えられました。'
  },
  {
    id: 20,
    question: '九州地方のキリシタン大名がローマ教皇に使節を派遣した出来事（天正遣欧少年使節）が起きたのはいつですか？',
    options: ['1549年', '1560年', '1582年', '1588年'],
    correct: 2,
    category: 'early-modern',
    difficulty: 'normal',
    explanation: '1582年に、九州地方のキリシタン大名がローマ教皇に使者を派遣しました。'
  },
  {
    id: 21,
    question: '豊臣秀吉が行った太閤検地の目的の一つとして、適切でないものはどれですか？',
    options: [
      '全国の田畑の面積や土地の良し悪しを統一した基準で調査した',
      'コメの収穫高である石高を基準に大名に領地を与えた',
      '石高に応じて軍役を課した',
      '貴族や寺社の荘園を保護し、財力を安定させた'
    ],
    correct: 3,
    category: 'early-modern',
    difficulty: 'hard',
    explanation: '太閤検地により、貴族や寺社の持つ荘園は消滅し、その財力は低下しました。'
  },
  {
    id: 22,
    question: '1609年に琉球王国に軍事侵攻を行ったのは、どこの藩ですか？',
    options: ['宗氏（対馬藩）', '松前氏（松前藩）', '島津氏（薩摩藩）', '毛利氏（長州藩）'],
    correct: 2,
    category: 'early-modern',
    difficulty: 'normal',
    explanation: '1609年、島津氏（薩摩藩）が琉球王国に対して軍事行動を起こしました。'
  },
  {
    id: 23,
    question: '徳川家光が武家諸法度で定めた内容として、正しいものはどれですか？',
    options: ['参勤交代の義務化', '大型船の建造禁止', '生類憐みの令', 'キリスト教の禁止'],
    correct: 1,
    category: 'early-modern',
    difficulty: 'normal',
    explanation: '徳川家光は武家諸法度を発布し、大名の力を抑えるために大型船の建造禁止などを定めました。'
  },
  {
    id: 24,
    question: '徳川綱吉の時代に発行された、金の含有量が少ない貨幣は何ですか？',
    options: ['慶長小判', '元禄小判', '天保小判', '和同開珎'],
    correct: 1,
    category: 'early-modern',
    difficulty: 'normal',
    explanation: '徳川綱吉は、金の含有量が少ない元禄小判を発行させました。これにより貨幣の価値が下がりました。'
  },
  {
    id: 25,
    question: '人形浄瑠璃の脚本家として「曽根崎心中」などの作品で知られる元禄時代の人物は誰ですか？',
    options: ['井原西鶴', '松尾芭蕉', '近松門左衛門', '菱川師宣'],
    correct: 2,
    category: 'early-modern',
    difficulty: 'easy',
    explanation: '元禄文化では、近松門左衛門が人形浄瑠璃の脚本家として活躍しました。'
  },
  {
    id: 26,
    question: '江戸時代の化政文化で、「南総里見八犬伝」を著した作家は誰ですか？',
    options: ['十返舎一九', '滝沢馬琴', '式亭三馬', '井原西鶴'],
    correct: 1,
    category: 'early-modern',
    difficulty: 'easy',
    explanation: '化政文化を代表する読み本作家である滝沢馬琴が「南総里見八犬伝」を著しました。'
  },
  {
    id: 27,
    question: '化政文化の浮世絵師で、「富嶽三十六景」を描いたことで知られるのは誰ですか？',
    options: ['喜多川歌麿', '東洲斎写楽', '歌川広重', '葛飾北斎'],
    correct: 3,
    category: 'early-modern',
    difficulty: 'easy',
    explanation: '葛飾北斎は化政文化を代表する浮世絵師で、「富嶽三十六景」などの風景画で知られます。'
  },
  {
    id: 28,
    question: '江戸幕府の三大改革のうち、目安箱の設置や公事方御定書の制定が行われたのはどの改革ですか？',
    options: ['享保の改革', '寛政の改革', '天保の改革', '文政の改革'],
    correct: 0,
    category: 'early-modern',
    difficulty: 'normal',
    explanation: '目安箱の設置や公事方御定書の制定は、徳川吉宗による享保の改革で行われた政策です。'
  },
  {
    id: 29,
    question: '松平定信による寛政の改革で行われた政策はどれですか？',
    options: ['株仲間の解散', '上米の制', '棄捐令の発令', '人返し令'],
    correct: 2,
    category: 'early-modern',
    difficulty: 'hard',
    explanation: '棄捐令（旗本・御家人の借金を帳消しにする法令）の発令は、寛政の改革で行われました。 人返し令は寛政の改革と天保の改革の両方で行われています。'
  },
  {
    id: 30,
    question: '水野忠邦による天保の改革で行われた政策として、誤っているものはどれですか？',
    options: ['株仲間の解散', '人返し令', '外国船打払令の緩和', '朱子学以外の学問の禁止'],
    correct: 3,
    category: 'early-modern',
    difficulty: 'hard',
    explanation: '朱子学以外の学問を禁止した「寛政異学の禁」は、松平定信による寛政の改革の政策です。 天保の改革では株仲間の解散、人返し令、薪水給与令（外国船打払令の緩和）などが行われました。'
  },
  {
    id: 31,
    question: '1792年に、通商を求めて根室に来航したロシアの使節は誰ですか？',
    options: ['ペリー', 'プチャーチン', 'ラクスマン', 'レザノフ'],
    correct: 2,
    category: 'early-modern',
    difficulty: 'normal',
    explanation: '1792年、ロシアのラクスマンが根室に来航し、通商を求めました。'
  },
  {
    id: 32,
    question: 'アヘン戦争の結果を受け、1842年に江戸幕府が外国船打払令を緩和して出した法令は何ですか？',
    options: ['海舶互市新例', '武家諸法度', '薪水給与令', '五品江戸廻送令'],
    correct: 2,
    category: 'early-modern',
    difficulty: 'hard',
    explanation: '1842年、アヘン戦争での清の敗北を知った幕府は、外国船打払令を緩和し、遭難した船に燃料や食料を与えることを認める薪水給与令を出しました。'
  },
  {
    id: 33,
    question: '安政の五か国条約が結ばれた後、日本の金が大量に海外へ流出した主な理由は何ですか？',
    options: [
      '外国の金製品が大量に輸入されたため',
      '日本と海外で金銀の交換比率が異なったため',
      '外国人に金の保有が義務付けられたため',
      '幕府が多額の賠償金を金で支払ったため'
    ],
    correct: 1,
    category: 'early-modern',
    difficulty: 'hard',
    explanation: '当時の日本では金と銀の交換比率が1:5だったのに対し、海外では1:15と異なっていました。そのため、外国人が海外から銀を持ち込み日本の金に両替して持ち出したことで、大量の金が流出しました。'
  },
  {
    id: 34,
    question: '日本で最初の鉄道が開通した区間はどこですか？',
    options: ['東京〜上野', '新橋〜横浜', '京都〜神戸', '大阪〜神戸'],
    correct: 1,
    category: 'modern',
    difficulty: 'easy',
    explanation: '日本最初の鉄道は、1872年に新橋（現在の汐留）と横浜（現在の桜木町）の間で開業しました。'
  },
  {
    id: 35,
    question: '前島密が中心となって整備した、1871年に始まった制度は何ですか？',
    options: ['電信制度', '鉄道制度', '学制', '郵便制度'],
    correct: 3,
    category: 'modern',
    difficulty: 'easy',
    explanation: '1871年に前島密によって郵便制度が整備されました。'
  },
  {
    id: 36,
    question: '1877年に西郷隆盛らが九州で起こした、士族による最後の大きな反乱は何ですか？',
    options: ['西南戦争', '戊辰戦争', '佐賀の乱', '萩の乱'],
    correct: 0,
    category: 'modern',
    difficulty: 'easy',
    explanation: '岩倉使節団の帰国後、政府の方針に対立した西郷隆盛が九州南部で挙兵した戦いを西南戦争といいます。'
  },
  {
    id: 37,
    question: '明治政府の殖産興業政策の一環として、1901年に福岡県に設立された官営の製鉄所は何ですか？',
    options: ['釜石製鉄所', '八幡製鉄所', '室蘭製鉄所', '神戸製鋼所'],
    correct: 1,
    category: 'modern',
    difficulty: 'easy',
    explanation: '1901年に、福岡県に官営の八幡製鉄所が設立されました。'
  },
  {
    id: 38,
    question: '蚕のまゆから生糸を生産する産業を何といいますか？',
    options: ['紡績業', '製紙業', '製糸業', '織物業'],
    correct: 2,
    category: 'modern',
    difficulty: 'easy',
    explanation: '蚕のまゆから生糸を生産することを製糸業といいます。綿花から綿糸を生産するのは紡績業です。'
  },
  {
    id: 39,
    question: '1895年の下関条約で、日本が清から得た領土はどこですか？',
    options: ['台湾・澎湖諸島、遼東半島', '南樺太', '朝鮮半島', '山東省'],
    correct: 0,
    category: 'modern',
    difficulty: 'normal',
    explanation: '下関条約により、日本は台湾などを得ました。（注：遼東半島は後の三国干渉で返還）'
  },
  {
    id: 40,
    question: '1905年のポーツマス条約で、ロシアから日本に譲られたのはどこですか？',
    options: ['千島列島全域', '北緯50度以南の樺太（南樺太）', '遼東半島', '沿海州'],
    correct: 1,
    category: 'modern',
    difficulty: 'normal',
    explanation: 'ポーツマス条約により、日本は北緯50度以南の樺太（南樺太）などを得ました。'
  },
  {
    id: 41,
    question: '日露戦争中に、夫の出征を嘆き、反戦詩「君死にたまふこと勿れ」を発表した歌人は誰ですか？',
    options: ['樋口一葉', '与謝野晶子', '林芙美子', '平塚らいてう'],
    correct: 1,
    category: 'modern',
    difficulty: 'normal',
    explanation: '与謝野晶子は明治時代の歌人で、日露戦争中に反戦詩を発表しました。'
  },
  {
    id: 42,
    question: '第一次世界大戦のきっかけの一つとなった、イギリス、フランス、ロシア間で成立した同盟関係を何といいますか？',
    options: ['三国同盟', '日英同盟', '三国協商', '日独伊三国同盟'],
    correct: 2,
    category: 'modern',
    difficulty: 'normal',
    explanation: '三国協商はイギリス、フランス、ロシアの間で成立した政治・軍事同盟で、ドイツ中心の三国同盟に対抗しました。'
  },
  {
    id: 43,
    question: '第一次桂太郎内閣の時に起こった、日本の歴史上の大きな出来事は何ですか？',
    options: ['第一次世界大戦', '米騒動', '日露戦争', '満州事変'],
    correct: 2,
    category: 'modern',
    difficulty: 'normal',
    explanation: '桂太郎の第一次内閣（1901〜1906年）の時に日露戦争が起こりました。'
  },
  {
    id: 44,
    question: '大正時代に起きた米騒動の主な原因は何ですか？',
    options: ['豊作による米価の暴落', 'シベリア出兵を見込んだ米の買い占めによる米価の急騰', '不作による米不足', '米の輸入自由化'],
    correct: 1,
    category: 'modern',
    difficulty: 'normal',
    explanation: '1918年の米騒動は、シベリア出兵を背景とした米の買い占めなどによる米価の急騰が原因で全国に広がりました。'
  },
  {
    id: 45,
    question: '五・一五事件で海軍将校らによって暗殺された、当時の内閣総理大臣は誰ですか？',
    options: ['浜口雄幸', '犬養毅', '高橋是清', '斎藤実'],
    correct: 1,
    category: 'modern',
    difficulty: 'normal',
    explanation: '犬養毅は、五・一五事件で海軍将校らによって暗殺されました。'
  },
  {
    id: 46,
    question: '1940年、日本が中国での戦争を継続するために進出した地域はどこですか？',
    options: ['イギリス領マレー半島', 'オランダ領東インド', 'フランス領インドシナ半島', 'アメリカ領フィリピン'],
    correct: 2,
    category: 'modern',
    difficulty: 'hard',
    explanation: '日本は中国での戦争を継続するため、1940年にフランス領インドシナ半島に進出しました。'
  },
  {
    id: 47,
    question: '太平洋戦争を開始し、戦後に極東国際軍事裁判（東京裁判）で死刑判決を受けた、当時の内閣総理大臣は誰ですか？',
    options: ['近衛文麿', '東条英機', '小磯国昭', '鈴木貫太郎'],
    correct: 1,
    category: 'modern',
    difficulty: 'normal',
    explanation: '東条英機は、内閣総理大臣在任中に太平洋戦争が始まり、戦後、極東国際軍事裁判にかけられ処刑されました。'
  },
  {
    id: 48,
    question: 'GHQ（連合国軍総司令部）の指導のもとで行われた農地改革の内容として、正しいものはどれですか？',
    options: [
      '政府が小作地を強制的に買い上げ、地主に安く売り渡した',
      '地主が持つ農地を政府が買い上げ、小作人に安く売り渡した',
      '農家一戸あたりの耕地面積を拡大させた',
      '小作人の数を増やし、農業生産を安定させた'
    ],
    correct: 1,
    category: 'contemporary',
    difficulty: 'normal',
    explanation: '農地改革では、地主から農地を買い上げ、小作人に安く売却したことで、自作農が増え、小作人が減りました。'
  },
  {
    id: 49,
    question: 'サンフランシスコ平和条約と同時に結ばれ、アメリカ軍が日本の独立後も日本国内に駐留することを認めた条約は何ですか？',
    options: ['日米和親条約', '日米修好通商条約', '日米安全保障条約', '日米地位協定'],
    correct: 2,
    category: 'contemporary',
    difficulty: 'normal',
    explanation: '1951年、吉田茂内閣はサンフランシスコ平和条約と同時に日米安全保障条約を結び、アメリカ軍の日本駐留を認めました。'
  },
  {
    id: 50,
    question: '吉田茂内閣が、日本の治安維持を目的として組織したものは何ですか？',
    options: ['自衛隊', '警察予備隊', '海軍', '警視庁'],
    correct: 1,
    category: 'contemporary',
    difficulty: 'normal',
    explanation: '吉田茂内閣は、日本の周辺地域での戦争に備え、国内の治安を守るために警察予備隊を組織しました。'
  },
  {
    id: 51,
    question: '1956年の日ソ共同宣言で合意された内容として、誤っているものはどれですか？',
    options: [
      '日本とソ連の戦争状態の終結',
      'ソ連は日本の国連加盟を支持すること',
      '平和条約締結後に北方領土全島を日本へ引き渡すこと',
      'ソ連は抑留していた日本人捕虜を帰還させること'
    ],
    correct: 2,
    category: 'contemporary',
    difficulty: 'hard',
    explanation: '日ソ共同宣言では、平和条約締結後に歯舞群島・色丹島が日本へ引き渡される予定とされましたが、北方領土問題全体は未解決のままです。'
  },
  {
    id: 52,
    question: '佐藤栄作内閣の時に実現した出来事として、正しいものはどれですか？',
    options: ['日中国交正常化', '沖縄の返還', '消費税の導入', 'カンボジアへの自衛隊派遣'],
    correct: 1,
    category: 'contemporary',
    difficulty: 'normal',
    explanation: '佐藤栄作内閣の時、1972年に沖縄の島々が日本に返還されました。'
  },
  {
    id: 53,
    question: '高度経済成長期の1970年に、アジアで初めて開催された万国博覧会はどこで開かれましたか？',
    options: ['東京', '名古屋', '大阪', '札幌'],
    correct: 2,
    category: 'contemporary',
    difficulty: 'easy',
    explanation: '1970年に大阪で大阪万国博覧会が開催されました。'
  },
  {
    id: 54,
    question: '1989年に初めて導入された税金は何ですか？',
    options: ['所得税', '法人税', '住民税', '消費税'],
    correct: 3,
    category: 'contemporary',
    difficulty: 'easy',
    explanation: '平成元年である1989年に、消費税が導入されました。'
  },
  {
    id: 55, // 既存の問題IDと重複しないように設定してください
    question: '縄文時代の人々の生活の様子として、正しいものはどれですか？',
    options: ['稲作を行い、高床倉庫に米を保管した', '縄文土器を使い、狩りや採集をしていた', '大きな古墳を造り、はにわを並べた', '平城京に住み、天皇中心の政治を行っていた'],
    correct: 1,
    category: 'primitive',
    difficulty: 'easy',
    explanation: '縄文時代は、縄目の文様が特徴の縄文土器を使い、狩りや漁、木の実の採集を中心とした生活を送っていました。稲作や高床倉庫は弥生時代の特徴です。'
  },
  {
    id: 56, // 既存の問題IDと重複しないように設定してください
    question: '大陸から伝わり、人々の生活を大きく変え、弥生時代の始まりのきっかけとなったものは何ですか？',
    options: ['仏教の教え', '鉄砲の製造技術', '稲作の技術', '漢字の使用'],
    correct: 2,
    category: 'primitive',
    difficulty: 'normal',
    explanation: '大陸から稲作が伝わったことで食料を生産・備蓄できるようになり、弥生時代が始まりました。これにより定住化が進み、ムラ（集落）がクニ（国）へと発展していきました。'
  },
  {
    id: 57, // 既存の問題IDと重複しないように設定してください
    question: '弥生時代に作られ、祭りのための道具であったと考えられている青銅器は何ですか？',
    options: ['銅鐸（どうたく）', '埴輪（はにわ）', '土偶（どぐう）', '和同開珎（わどうかいちん）'],
    correct: 0,
    category: 'primitive',
    difficulty: 'hard',
    explanation: '銅鐸は弥生時代を代表する青銅器で、主に祭りに使われたと考えられています。土偶は縄文時代、埴輪は古墳時代、和同開珎は奈良時代のものです。'
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
