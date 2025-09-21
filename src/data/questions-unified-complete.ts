// 中学受験社会科 四択問題データベース
// 全127項目の完全版

export interface Question {
  id: string;
  subject: string;
  category: string;
  subcategory: string;
  grade: number;
  difficulty: string;
  tags: string[];
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: string;
  qualityScore: number;
  lastUpdated: string;
  createdAt: string;
  version: number;
}

export type Category = "地理" | "歴史" | "公民" | "経済" | "文化";
export type Difficulty = "易" | "中" | "難";
export type Grade = 5 | 6;

// 全127項目の問題データ
export const questions: Question[] = [
  {"id":"geography_hokkaido","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["北海道","寒冷地","農業"],"question":"北海道の主な農業の特徴として正しいものはどれですか？","options":["稲作が中心である","じゃがいもや小麦の栽培が盛ん","みかんの栽培が有名","茶の栽培が盛ん"],"correct":1,"explanation":"北海道は冷涼な気候を生かしてじゃがいもや小麦、とうもろこしなどの畑作が盛んです。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_honshu","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"中","tags":["本州","日本列島","最大"],"question":"本州について正しい説明はどれですか？","options":["日本で2番目に大きな島","九州と四国の間にある","日本最大の島で、東京や大阪がある","北海道の南にある小さな島"],"correct":2,"explanation":"本州は日本最大の島で、首都東京や大阪、名古屋などの大都市があります。","type":"地理知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_shikoku","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"中","tags":["四国","愛媛県","高知県"],"question":"四国地方について正しいものはどれですか？","options":["6つの県がある","香川県、愛媛県、徳島県、高知県の4県からなる","本州の北にある","沖縄県も含まれる"],"correct":1,"explanation":"四国地方は香川県、愛媛県、徳島県、高知県の4県で構成されています。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_kyushu","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"中","tags":["九州","福岡県","熊本県"],"question":"九州地方の県として正しいものはどれですか？","options":["山口県","愛媛県","福岡県","広島県"],"correct":2,"explanation":"福岡県は九州地方の県です。山口県は中国地方、愛媛県は四国地方、広島県は中国地方に属します。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_okinawa","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"中","tags":["沖縄県","亜熱帯","離島"],"question":"沖縄県について正しい説明はどれですか？","options":["本州の一部である","亜熱帯の気候で、多くの島からなる","四国地方に属する","北海道の近くにある"],"correct":1,"explanation":"沖縄県は亜熱帯気候で、沖縄本島をはじめ多くの島々からなる県です。","type":"地理知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_tokyo","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"易","tags":["東京","首都","関東"],"question":"東京都について正しいものはどれですか？","options":["日本の首都である","九州地方にある","最も人口が少ない県","北海道の一部である"],"correct":0,"explanation":"東京都は日本の首都であり、政治・経済の中心地です。","type":"地理知識","qualityScore":9.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_osaka","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"易","tags":["大阪","関西","商業"],"question":"大阪府について正しい説明はどれですか？","options":["東北地方にある","関西地方の中心的な府","人口が最も少ない","農業が主な産業"],"correct":1,"explanation":"大阪府は関西地方の中心的な府で、商業や工業が発達しています。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_aichi","subject":"社会","category":"地理","subcategory":"都道府県","grade":5,"difficulty":"中","tags":["愛知","中部","工業"],"question":"愛知県について正しいものはどれですか？","options":["九州地方にある","自動車工業が盛ん","県庁所在地は大阪市","主に農業の県"],"correct":1,"explanation":"愛知県はトヨタ自動車をはじめとする自動車工業が非常に盛んです。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_fujisan","subject":"社会","category":"地理","subcategory":"自然","grade":6,"difficulty":"中","tags":["富士山","火山","静岡"],"question":"富士山について正しい説明はどれですか？","options":["活火山である","北海道にある","海抜100m程度","川である"],"correct":0,"explanation":"富士山は活火山で、静岡県と山梨県にまたがる日本最高峰の山です。","type":"地理知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_biwa","subject":"社会","category":"地理","subcategory":"自然","grade":6,"difficulty":"中","tags":["琵琶湖","淡水湖","滋賀"],"question":"琵琶湖について正しいものはどれですか？","options":["海である","日本最大の淡水湖","九州にある","人工湖である"],"correct":1,"explanation":"琵琶湖は滋賀県にある日本最大の淡水湖です。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_setonaikai","subject":"社会","category":"地理","subcategory":"自然","grade":6,"difficulty":"中","tags":["瀬戸内海","内海","温暖"],"question":"瀬戸内海の気候の特徴として正しいものはどれですか？","options":["雪が多い","雨が非常に多い","温暖で雨が少ない","非常に寒い"],"correct":2,"explanation":"瀬戸内海は山に囲まれているため、温暖で雨の少ない気候です。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_kanto","subject":"社会","category":"地理","subcategory":"自然","grade":6,"difficulty":"中","tags":["関東平野","平野","首都圏"],"question":"関東平野について正しい説明はどれですか？","options":["九州にある平野","日本最大の平野","山がちな地形","離島にある"],"correct":1,"explanation":"関東平野は日本最大の平野で、東京都や埼玉県などが含まれます。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_ishikawa","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["石川県","日本海","金沢"],"question":"石川県について正しいものはどれですか？","options":["太平洋に面している","県庁所在地は金沢市","九州地方にある","離島である"],"correct":1,"explanation":"石川県は日本海に面し、県庁所在地は金沢市です。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_fukuoka","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["福岡県","九州","博多"],"question":"福岡県について正しい説明はどれですか？","options":["本州にある","四国地方の県","九州地方の県","北海道の一部"],"correct":2,"explanation":"福岡県は九州地方の県で、県庁所在地は福岡市です。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_aomori","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["青森県","東北","りんご"],"question":"青森県の特産物として有名なものはどれですか？","options":["みかん","りんご","ぶどう","パイナップル"],"correct":1,"explanation":"青森県はりんごの生産量が日本一で有名です。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_yamagata","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["山形県","東北","さくらんぼ"],"question":"山形県の特産物として正しいものはどれですか？","options":["みかん","さくらんぼ","バナナ","パイナップル"],"correct":1,"explanation":"山形県はさくらんぼの生産量が日本一です。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_hiroshima","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["広島県","中国地方","平和"],"question":"広島県について正しい説明はどれですか？","options":["九州地方にある","中国地方にある","四国地方にある","東北地方にある"],"correct":1,"explanation":"広島県は中国地方にあり、原爆ドームなどで平和の大切さを伝えています。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_nagano","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["長野県","中部","高原"],"question":"長野県の地形の特徴として正しいものはどれですか？","options":["海に囲まれている","平地が多い","山に囲まれた内陸県","離島が多い"],"correct":2,"explanation":"長野県は山に囲まれた内陸県で、海がありません。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_niigata","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["新潟県","日本海","米"],"question":"新潟県について正しいものはどれですか？","options":["太平洋に面している","米づくりが盛ん","九州地方にある","海がない県"],"correct":1,"explanation":"新潟県は日本海に面し、コシヒカリなど米づくりが非常に盛んです。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_shizuoka","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["静岡県","中部","茶"],"question":"静岡県の特産物として有名なものはどれですか？","options":["りんご","茶","さくらんぼ","みかん"],"correct":1,"explanation":"静岡県は茶の生産量が日本一で有名です。","type":"地理知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_chiba","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["千葉県","関東","平野"],"question":"千葉県について正しい説明はどれですか？","options":["九州地方にある","関東地方にある","山がちな地形","日本海に面している"],"correct":1,"explanation":"千葉県は関東地方にあり、平野が広がっています。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_kanagawa","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["神奈川県","関東","横浜"],"question":"神奈川県の県庁所在地はどこですか？","options":["川崎市","相模原市","横浜市","鎌倉市"],"correct":2,"explanation":"神奈川県の県庁所在地は横浜市です。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_saitama","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["埼玉県","関東","内陸"],"question":"埼玉県について正しいものはどれですか？","options":["海に面している","関東地方の内陸県","九州地方にある","離島がある"],"correct":1,"explanation":"埼玉県は関東地方の内陸県で、海に面していません。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"geography_ibaraki","subject":"社会","category":"地理","subcategory":"都道府県","grade":6,"difficulty":"中","tags":["茨城県","関東","農業"],"question":"茨城県について正しい説明はどれですか？","options":["九州地方にある","関東地方にある","日本海に面している","離島である"],"correct":1,"explanation":"茨城県は関東地方にあり、農業が盛んです。","type":"地理知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_jomon","subject":"社会","category":"歴史","subcategory":"原始","grade":6,"difficulty":"中","tags":["縄文時代","狩猟採集","土器"],"question":"縄文時代の人々の生活について正しいものはどれですか？","options":["米作りをしていた","狩りや魚とり、木の実採りをしていた","鉄の道具を使っていた","文字を書いていた"],"correct":1,"explanation":"縄文時代の人々は狩猟・採集生活を送り、縄文土器を作っていました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_yayoi","subject":"社会","category":"歴史","subcategory":"原始","grade":6,"difficulty":"中","tags":["弥生時代","稲作","金属"],"question":"弥生時代に始まったこととして正しいものはどれですか？","options":["狩猟・採集","米作り","土器作り","火の使用"],"correct":1,"explanation":"弥生時代には大陸から稲作が伝わり、米作りが始まりました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kofun","subject":"社会","category":"歴史","subcategory":"原始","grade":6,"difficulty":"中","tags":["古墳時代","大王","古墳"],"question":"古墳時代について正しい説明はどれですか？","options":["全ての人が同じ大きさの墓に埋葬された","力のある大王のために大きな古墳が作られた","古墳は作られなかった","仏教が伝来した"],"correct":1,"explanation":"古墳時代には力のある大王のために大仙陵古墳などの巨大な古墳が作られました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_shotoku","subject":"社会","category":"歴史","subcategory":"奈良時代以前","grade":6,"difficulty":"中","tags":["聖徳太子","十七条憲法","飛鳥時代"],"question":"聖徳太子が制定したものはどれですか？","options":["大化の改新","十七条憲法","大宝律令","班田収授法"],"correct":1,"explanation":"聖徳太子は十七条憲法を制定し、仏教を保護しました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_taika","subject":"社会","category":"歴史","subcategory":"奈良時代以前","grade":6,"difficulty":"中","tags":["大化の改新","中大兄皇子","中臣鎌足"],"question":"大化の改新を行った人物として正しいものはどれですか？","options":["聖徳太子と蘇我馬子","中大兄皇子と中臣鎌足","源頼朝と北条時政","織田信長と豊臣秀吉"],"correct":1,"explanation":"大化の改新は中大兄皇子と中臣鎌足によって行われました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_nara","subject":"社会","category":"歴史","subcategory":"奈良時代","grade":6,"difficulty":"中","tags":["奈良時代","平城京","仏教"],"question":"奈良時代の都はどこでしたか？","options":["平安京","平城京","藤原京","難波京"],"correct":1,"explanation":"奈良時代の都は平城京（現在の奈良市）でした。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_shomu","subject":"社会","category":"歴史","subcategory":"奈良時代","grade":6,"difficulty":"中","tags":["聖武天皇","東大寺","大仏"],"question":"聖武天皇が建てたもので正しいものはどれですか？","options":["法隆寺","東大寺の大仏","清水寺","金閣寺"],"correct":1,"explanation":"聖武天皇は東大寺の大仏を建立し、仏教による国づくりを目指しました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_ganjin","subject":"社会","category":"歴史","subcategory":"奈良時代","grade":6,"difficulty":"中","tags":["鑑真","唐招提寺","仏教"],"question":"鑑真について正しい説明はどれですか？","options":["日本から中国に渡った僧","中国から日本に来て仏教を伝えた僧","インドから仏教を伝えた","武士の出身"],"correct":1,"explanation":"鑑真は中国の唐から日本に来て仏教を伝え、唐招提寺を建てました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_heian","subject":"社会","category":"歴史","subcategory":"平安時代","grade":6,"difficulty":"中","tags":["平安時代","平安京","貴族"],"question":"平安時代の都はどこでしたか？","options":["奈良","平安京","鎌倉","江戸"],"correct":1,"explanation":"平安時代の都は平安京（現在の京都市）でした。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kanmu","subject":"社会","category":"歴史","subcategory":"平安時代","grade":6,"difficulty":"中","tags":["桓武天皇","平安京","遷都"],"question":"桓武天皇が行ったこととして正しいものはどれですか？","options":["大仏を建立した","平安京に都を移した","鎌倉幕府を開いた","鉄砲を伝えた"],"correct":1,"explanation":"桓武天皇は794年に平安京（現在の京都）に都を移しました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_michinaga","subject":"社会","category":"歴史","subcategory":"平安時代","grade":6,"difficulty":"中","tags":["藤原道長","摂関政治","貴族"],"question":"藤原道長について正しい説明はどれですか？","options":["武士として活躍した","摂関政治で権力を握った","僧として仏教を広めた","商人として富を築いた"],"correct":1,"explanation":"藤原道長は摂関政治により藤原氏の全盛期を築きました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_murasaki","subject":"社会","category":"歴史","subcategory":"平安時代","grade":6,"difficulty":"中","tags":["紫式部","源氏物語","文学"],"question":"紫式部が書いた作品はどれですか？","options":["枕草子","源氏物語","竹取物語","古事記"],"correct":1,"explanation":"紫式部は世界最古の長編小説といわれる『源氏物語』を書きました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_sei","subject":"社会","category":"歴史","subcategory":"平安時代","grade":6,"difficulty":"中","tags":["清少納言","枕草子","随筆"],"question":"清少納言が書いた作品はどれですか？","options":["源氏物語","枕草子","万葉集","古今和歌集"],"correct":1,"explanation":"清少納言は『枕草子』という随筆を書きました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kiyomori","subject":"社会","category":"歴史","subcategory":"平安時代末期","grade":6,"difficulty":"中","tags":["平清盛","平氏政権","武士"],"question":"平清盛について正しい説明はどれですか？","options":["貴族として摂関政治を行った","武士として初めて政治の中心となった","僧として仏教を広めた","商人として貿易を行った"],"correct":1,"explanation":"平清盛は武士として初めて政治の中心となり、平氏政権を築きました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_yoritomo","subject":"社会","category":"歴史","subcategory":"鎌倉時代","grade":6,"difficulty":"中","tags":["源頼朝","鎌倉幕府","征夷大将軍"],"question":"源頼朝について正しいものはどれですか？","options":["平安京に都を移した","鎌倉幕府を開いた","東大寺の大仏を建てた","遣唐使を派遣した"],"correct":1,"explanation":"源頼朝は1192年に鎌倉幕府を開き、征夷大将軍となりました。","type":"歴史知識","qualityScore":9.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_tokimasa","subject":"社会","category":"歴史","subcategory":"鎌倉時代","grade":6,"difficulty":"中","tags":["北条時政","執権政治","御家人"],"question":"北条時政について正しい説明はどれですか？","options":["征夷大将軍となった","執権として政治を行った","天皇として即位した","僧として活動した"],"correct":1,"explanation":"北条時政は初代執権として鎌倉幕府の政治を実際に行いました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_genko","subject":"社会","category":"歴史","subcategory":"鎌倉時代","grade":6,"difficulty":"難","tags":["元寇","蒙古襲来","神風"],"question":"元寇について正しい説明はどれですか？","options":["日本が中国を攻めた","元（モンゴル）が日本を攻めてきた","朝鮮が日本を攻めた","日本が朝鮮を攻めた"],"correct":1,"explanation":"元寇は1274年と1281年の2回、元（モンゴル）が日本を攻めてきた事件です。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_takauji","subject":"社会","category":"歴史","subcategory":"室町時代","grade":6,"difficulty":"中","tags":["足利尊氏","室町幕府","征夷大将軍"],"question":"足利尊氏について正しいものはどれですか？","options":["鎌倉幕府を開いた","室町幕府を開いた","江戸幕府を開いた","豊臣政権を築いた"],"correct":1,"explanation":"足利尊氏は1336年に室町幕府を開きました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kinkaku","subject":"社会","category":"歴史","subcategory":"室町時代","grade":6,"difficulty":"中","tags":["金閣寺","足利義満","北山文化"],"question":"金閣寺を建てたのは誰ですか？","options":["足利尊氏","足利義満","足利義政","足利義昭"],"correct":1,"explanation":"金閣寺は足利義満によって建てられ、北山文化の代表的な建物です。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_ginkaku","subject":"社会","category":"歴史","subcategory":"室町時代","grade":6,"difficulty":"中","tags":["銀閣寺","足利義政","東山文化"],"question":"銀閣寺を建てたのは誰ですか？","options":["足利尊氏","足利義満","足利義政","足利義昭"],"correct":2,"explanation":"銀閣寺は足利義政によって建てられ、東山文化の代表的な建物です。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_onin","subject":"社会","category":"歴史","subcategory":"室町時代","grade":6,"difficulty":"難","tags":["応仁の乱","戦国時代","内乱"],"question":"応仁の乱の結果として正しいものはどれですか？","options":["室町幕府が強くなった","戦国時代が始まった","江戸幕府が開かれた","明治時代が始まった"],"correct":1,"explanation":"応仁の乱により室町幕府の力が弱くなり、戦国時代が始まりました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_nobunaga","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["織田信長","天下統一","本能寺"],"question":"織田信長について正しい説明はどれですか？","options":["鎌倉幕府を開いた","天下統一を目指したが本能寺の変で死んだ","江戸幕府を開いた","遣唐使を派遣した"],"correct":1,"explanation":"織田信長は天下統一を目指しましたが、1582年の本能寺の変で明智光秀に討たれました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_hideyoshi","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["豊臣秀吉","天下統一","太閤"],"question":"豊臣秀吉について正しいものはどれですか？","options":["武士の出身","農民の出身から天下人となった","公家の出身","僧侶の出身"],"correct":1,"explanation":"豊臣秀吉は農民の出身から織田信長に仕え、天下統一を果たしました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_ieyasu","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["徳川家康","江戸幕府","関ヶ原"],"question":"徳川家康について正しいものはどれですか？","options":["室町幕府を開いた","江戸幕府を開いた","豊臣秀吉の息子","明智光秀の家臣"],"correct":1,"explanation":"徳川家康は1603年に江戸幕府を開き、征夷大将軍となりました。","type":"歴史知識","qualityScore":9.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_sekigahara","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["関ヶ原の戦い","徳川家康","石田三成"],"question":"関ヶ原の戦いで勝利したのは誰ですか？","options":["石田三成","徳川家康","豊臣秀頼","上杉景勝"],"correct":1,"explanation":"1600年の関ヶ原の戦いで徳川家康が勝利し、天下を取りました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_sakoku","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["鎖国","江戸幕府","オランダ"],"question":"江戸時代の鎖国中に貿易を許されていた国はどれですか？","options":["イギリス","フランス","オランダ","スペイン"],"correct":2,"explanation":"鎖国中も長崎でオランダと中国との貿易は続けられていました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_sankin","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["参勤交代","大名","江戸"],"question":"参勤交代について正しい説明はどれですか？","options":["農民が江戸に出てくる制度","大名が1年おきに江戸と領地を往復する制度","商人が各地を回る制度","僧侶が修行で旅をする制度"],"correct":1,"explanation":"参勤交代は大名が1年おきに江戸と領地を往復する制度で、幕府が大名を統制するためのものでした。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_shinokosho","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["士農工商","身分制度","武士"],"question":"江戸時代の身分制度で最も身分が高かったのはどれですか？","options":["農民","工人","商人","武士"],"correct":3,"explanation":"江戸時代は士農工商の身分制度があり、武士が最も身分が高かったです。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kabuki","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["歌舞伎","町人文化","芸能"],"question":"江戸時代に発達した芸能として正しいものはどれですか？","options":["能楽","雅楽","歌舞伎","声明"],"correct":2,"explanation":"歌舞伎は江戸時代に町人の間で発達した芸能です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_ukiyoe","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["浮世絵","葛飾北斎","町人文化"],"question":"浮世絵で有名な画家として正しいものはどれですか？","options":["雪舟","葛飾北斎","狩野永徳","円山応挙"],"correct":1,"explanation":"葛飾北斎は『富嶽三十六景』などで有名な浮世絵師です。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_terakoya","subject":"社会","category":"歴史","subcategory":"江戸時代","grade":6,"difficulty":"中","tags":["寺子屋","教育","読み書き"],"question":"江戸時代の寺子屋について正しい説明はどれですか？","options":["武士の子どもだけが通った","庶民の子どもが読み書きを学んだ","大学のような高等教育機関","僧侶だけが通った"],"correct":1,"explanation":"寺子屋は庶民の子どもが読み書きそろばんを学ぶ教育機関でした。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_perry","subject":"社会","category":"歴史","subcategory":"江戸時代末期","grade":6,"difficulty":"中","tags":["ペリー","黒船","開国"],"question":"ペリーについて正しい説明はどれですか？","options":["イギリスの軍人","アメリカの軍人で黒船で来航した","フランスの商人","オランダの医師"],"correct":1,"explanation":"ペリーはアメリカの軍人で、1853年に黒船で浦賀に来航しました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_nichibei","subject":"社会","category":"歴史","subcategory":"江戸時代末期","grade":6,"difficulty":"中","tags":["日米和親条約","開国","条約"],"question":"日米和親条約について正しいものはどれですか？","options":["日本が鎖国を続けることを約束した条約","日本がアメリカと結んだ最初の条約","日本がイギリスと結んだ条約","戦争を終わらせる条約"],"correct":1,"explanation":"日米和親条約は1854年に結ばれ、日本の開国のきっかけとなりました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_meiji_ishin","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["明治維新","王政復古","江戸幕府"],"question":"明治維新について正しい説明はどれですか？","options":["江戸幕府が続いた","天皇中心の政治に変わった","鎌倉幕府が始まった","鎖国が始まった"],"correct":1,"explanation":"明治維新により江戸幕府が倒れ、天皇中心の明治政府ができました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_gokajo","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["五箇条の御誓文","明治政府","新政府"],"question":"五箇条の御誓文について正しいものはどれですか？","options":["江戸幕府が出した法律","明治政府が出した政治方針","鎌倉幕府の法律","室町幕府の政策"],"correct":1,"explanation":"五箇条の御誓文は明治政府が出した新しい政治の基本方針でした。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_haihan","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["廃藩置県","明治政府","中央集権"],"question":"廃藩置県について正しい説明はどれですか？","options":["藩を残して県をなくした","藩をなくして県を置いた","江戸幕府が行った政策","室町幕府の政策"],"correct":1,"explanation":"廃藩置県は1871年に明治政府が藩をなくして県を置き、中央集権国家を作る政策でした。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_chiso","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["地租改正","土地制度","税制"],"question":"地租改正について正しいものはどれですか？","options":["米で税を納める制度にした","お金で税を納める制度にした","税をなくした","武士だけが税を納める制度にした"],"correct":1,"explanation":"地租改正により、米ではなくお金で税を納める制度に変わりました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_gakusei","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["学制","教育制度","義務教育"],"question":"1872年に出された学制について正しいものはどれですか？","options":["武士だけが学校に通える制度","すべての子どもが学校に通う制度を目指した","学校をなくす制度","外国人だけの学校制度"],"correct":1,"explanation":"学制により、身分に関係なくすべての子どもが学校教育を受けることを目指しました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_chohei","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["徴兵制","軍事制度","国民皆兵"],"question":"徴兵制について正しい説明はどれですか？","options":["武士だけが軍隊に入る制度","身分に関係なく男子が兵役につく制度","外国人が日本の軍隊に入る制度","女性だけが軍隊に入る制度"],"correct":1,"explanation":"徴兵制により、身分に関係なく20歳以上の男子に兵役の義務が課されました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_bunmei","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["文明開化","西洋文化","近代化"],"question":"文明開化について正しいものはどれですか？","options":["日本の伝統文化だけを重視した","西洋の文化や技術を積極的に取り入れた","中国の文化を取り入れた","文化の交流を禁止した"],"correct":1,"explanation":"文明開化により、西洋の文化や技術が積極的に取り入れられ、日本の近代化が進みました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_tomioka","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"中","tags":["富岡製糸場","殖産興業","工業"],"question":"富岡製糸場について正しい説明はどれですか？","options":["江戸時代に作られた","明治政府が作った官営の製糸工場","私人が作った工場","外国人だけの工場"],"correct":1,"explanation":"富岡製糸場は明治政府が殖産興業政策の一環として作った官営の製糸工場です。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kempo","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"難","tags":["大日本帝国憲法","立憲政治","伊藤博文"],"question":"大日本帝国憲法について正しいものはどれですか？","options":["江戸時代に作られた","明治22年に発布された","昭和時代に作られた","外国が作った憲法"],"correct":1,"explanation":"大日本帝国憲法は1889年（明治22年）に発布され、立憲政治が始まりました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_nisshin","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"難","tags":["日清戦争","朝鮮","中国"],"question":"日清戦争について正しい説明はどれですか？","options":["日本がロシアと戦った","日本が中国と戦った","日本がアメリカと戦った","日本がイギリスと戦った"],"correct":1,"explanation":"日清戦争（1894-1895年）は日本が中国（清）と朝鮮をめぐって戦った戦争です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_nichiro","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"難","tags":["日露戦争","ロシア","満州"],"question":"日露戦争について正しいものはどれですか？","options":["日本がアメリカと戦った","日本がロシアと戦った","日本がドイツと戦った","日本がフランスと戦った"],"correct":1,"explanation":"日露戦争（1904-1905年）は日本がロシアと満州・朝鮮をめぐって戦った戦争です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_heigo","subject":"社会","category":"歴史","subcategory":"明治時代","grade":6,"difficulty":"難","tags":["韓国併合","朝鮮","植民地"],"question":"韓国併合について正しい説明はどれですか？","options":["日本が朝鮮を植民地にした","朝鮮が独立した","中国が朝鮮を支配した","ロシアが朝鮮を占領した"],"correct":0,"explanation":"1910年の韓国併合により、日本は朝鮮を植民地として支配しました。","type":"歴史知識","qualityScore":7.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_ww1","subject":"社会","category":"歴史","subcategory":"大正時代","grade":6,"difficulty":"難","tags":["第一次世界大戦","世界大戦","ヨーロッパ"],"question":"第一次世界大戦中の日本について正しいものはどれですか？","options":["ドイツ側について参戦した","連合国側について参戦した","中立を保った","戦争に全く関与しなかった"],"correct":1,"explanation":"日本は第一次世界大戦で連合国側について参戦し、経済的に発展しました。","type":"歴史知識","qualityScore":7.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_democracy","subject":"社会","category":"歴史","subcategory":"大正時代","grade":6,"difficulty":"難","tags":["大正デモクラシー","民主主義","普通選挙"],"question":"大正デモクラシーについて正しい説明はどれですか？","options":["軍国主義が強くなった","民主主義的な風潮が高まった","鎖国政策が始まった","天皇制が廃止された"],"correct":1,"explanation":"大正デモクラシーは大正時代に民主主義的な考えや運動が盛んになった時期です。","type":"歴史知識","qualityScore":7.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kanto_quake","subject":"社会","category":"歴史","subcategory":"大正時代","grade":6,"difficulty":"中","tags":["関東大震災","災害","復興"],"question":"関東大震災について正しいものはどれですか？","options":["昭和時代に起こった","大正12年に起こった","明治時代に起こった","江戸時代に起こった"],"correct":1,"explanation":"関東大震災は1923年（大正12年）に起こった大地震で、東京や横浜に大きな被害をもたらしました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_election","subject":"社会","category":"歴史","subcategory":"大正時代","grade":6,"difficulty":"難","tags":["普通選挙法","選挙権","民主主義"],"question":"1925年の普通選挙法について正しいものはどれですか？","options":["女性に選挙権が与えられた","25歳以上の男子に選挙権が与えられた","外国人に選挙権が与えられた","年齢に関係なく選挙権が与えられた"],"correct":1,"explanation":"1925年の普通選挙法により、財産に関係なく25歳以上の男子に選挙権が与えられました。","type":"歴史知識","qualityScore":7.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_manchurian","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"難","tags":["満州事変","満州","軍部"],"question":"満州事変について正しい説明はどれですか？","options":["中国で起こった事変","朝鮮で起こった事変","日本国内で起こった事変","ロシアで起こった事変"],"correct":0,"explanation":"満州事変は1931年に中国の満州で日本軍が起こした事変です。","type":"歴史知識","qualityScore":7.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_sino_japanese","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"難","tags":["日中戦争","中国","長期化"],"question":"日中戦争について正しいものはどれですか？","options":["1937年に始まった","1941年に始まった","1945年に始まった","1950年に始まった"],"correct":0,"explanation":"日中戦争は1937年に始まり、太平洋戦争と合わせて長期化しました。","type":"歴史知識","qualityScore":7.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_pacific_war","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"難","tags":["太平洋戦争","真珠湾","アメリカ"],"question":"太平洋戦争の開戦について正しいものはどれですか？","options":["日本がドイツを攻撃して始まった","日本が真珠湾を攻撃して始まった","アメリカが日本を攻撃して始まった","中国が日本を攻撃して始まった"],"correct":1,"explanation":"太平洋戦争は1941年12月8日、日本が真珠湾を攻撃することで始まりました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_atomic_bomb","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"難","tags":["原子爆弾","広島","長崎"],"question":"原子爆弾が投下された都市として正しいものはどれですか？","options":["東京と大阪","広島と長崎","京都と奈良","横浜と神戸"],"correct":1,"explanation":"1945年8月6日に広島、9日に長崎に原子爆弾が投下されました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_surrender","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"中","tags":["終戦","ポツダム宣言","降伏"],"question":"日本が太平洋戦争で降伏したのはいつですか？","options":["1944年8月15日","1945年8月15日","1946年8月15日","1947年8月15日"],"correct":1,"explanation":"日本は1945年8月15日にポツダム宣言を受け入れて降伏し、太平洋戦争が終わりました。","type":"歴史知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_constitution","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"中","tags":["日本国憲法","平和憲法","人権"],"question":"日本国憲法について正しいものはどれですか？","options":["1945年に制定された","1946年に制定された","1947年に施行された","1948年に施行された"],"correct":2,"explanation":"日本国憲法は1946年に制定され、1947年5月3日に施行されました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_olympics","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"中","tags":["東京オリンピック","1964年","復興"],"question":"戦後初の東京オリンピックが開かれたのはいつですか？","options":["1960年","1962年","1964年","1968年"],"correct":2,"explanation":"1964年の東京オリンピックは戦後の日本の復興を世界に示す大きな意味がありました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_economic_growth","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"中","tags":["高度経済成長","経済発展","所得倍増"],"question":"高度経済成長について正しい説明はどれですか？","options":["経済が停滞した時期","急激な経済発展をした時期","戦争中の時期","江戸時代の時期"],"correct":1,"explanation":"高度経済成長は1950年代半ばから1970年代初めにかけて日本経済が急速に発展した時期です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_okinawa_return","subject":"社会","category":"歴史","subcategory":"昭和時代","grade":6,"difficulty":"中","tags":["沖縄返還","アメリカ統治","本土復帰"],"question":"沖縄が日本に返還されたのはいつですか？","options":["1970年","1971年","1972年","1973年"],"correct":2,"explanation":"沖縄は1972年5月15日にアメリカから日本に返還され、本土復帰を果たしました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_muromachi_culture","subject":"社会","category":"歴史","subcategory":"室町時代","grade":6,"difficulty":"中","tags":["室町文化","水墨画","茶道"],"question":"室町時代の文化について正しいものはどれですか？","options":["華やかな貴族文化が中心","水墨画や茶道などの簡素な文化","西洋文化の影響が強い","農民の文化が主流"],"correct":1,"explanation":"室町時代は禅宗の影響で水墨画や茶道など簡素で精神的な文化が発達しました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_teppo","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["鉄砲伝来","種子島","ポルトガル"],"question":"鉄砲伝来について正しい説明はどれですか？","options":["中国人が伝えた","ポルトガル人が種子島に伝えた","オランダ人が長崎に伝えた","アメリカ人が伝えた"],"correct":1,"explanation":"1543年にポルトガル人が種子島に鉄砲を伝えました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_christianity","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["キリスト教","フランシスコ・ザビエル","宣教師"],"question":"日本にキリスト教を伝えた人物は誰ですか？","options":["ペリー","フランシスコ・ザビエル","シーボルト","アダムス"],"correct":1,"explanation":"1549年にフランシスコ・ザビエルが日本にキリスト教を伝えました。","type":"歴史知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_azuchi","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["安土城","織田信長","天守閣"],"question":"安土城について正しいものはどれですか？","options":["豊臣秀吉が建てた","織田信長が建てた","徳川家康が建てた","足利義満が建てた"],"correct":1,"explanation":"安土城は織田信長が建てた城で、初めて天守閣を持つ城として有名です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_osaka_castle","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["大阪城","豊臣秀吉","天下統一"],"question":"大阪城を建てた人物は誰ですか？","options":["織田信長","豊臣秀吉","徳川家康","武田信玄"],"correct":1,"explanation":"大阪城は豊臣秀吉が天下統一の拠点として建てました。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_katanagari","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["刀狩","豊臣秀吉","身分制度"],"question":"刀狩について正しい説明はどれですか？","options":["武士が農民から刀を取り上げた","農民が武士から刀を奪った","外国人から武器を没収した","僧侶が武器を集めた"],"correct":0,"explanation":"刀狩は豊臣秀吉が農民から武器を取り上げ、武士と農民の身分をはっきり分けた政策です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_kenchi","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"中","tags":["検地","太閤検地","土地制度"],"question":"太閤検地について正しいものはどれですか？","options":["土地の面積や収穫量を正確に調べた","土地をすべて国有化した","農民から土地を取り上げた","外国に土地を売った"],"correct":0,"explanation":"太閤検地は豊臣秀吉が全国の土地の面積や収穫量を正確に調べた政策です。","type":"歴史知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"history_korea_invasion","subject":"社会","category":"歴史","subcategory":"安土桃山時代","grade":6,"difficulty":"難","tags":["朝鮮出兵","文禄・慶長の役","豊臣秀吉"],"question":"文禄・慶長の役について正しいものはどれですか？","options":["日本が中国を攻めた","豊臣秀吉が朝鮮に出兵した","朝鮮が日本を攻めた","中国が日本を攻めた"],"correct":1,"explanation":"文禄・慶長の役は豊臣秀吉が朝鮮に2度出兵した戦争です。","type":"歴史知識","qualityScore":7.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_separation","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["三権分立","立法","行政"],"question":"三権分立の三権として正しいものはどれですか？","options":["立法・行政・司法","立法・行政・軍事","行政・司法・外交","立法・司法・教育"],"correct":0,"explanation":"三権分立は立法権（国会）、行政権（内閣）、司法権（裁判所）に分かれています。","type":"公民知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_kokkai","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["国会","立法権","衆議院"],"question":"国会について正しい説明はどれですか？","options":["行政を行う機関","法律を作る機関","裁判を行う機関","警察を統括する機関"],"correct":1,"explanation":"国会は立法権を持ち、法律を作る国の最高機関です。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_cabinet","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["内閣","行政権","総理大臣"],"question":"内閣について正しいものはどれですか？","options":["法律を作る","行政を行う","裁判を行う","選挙を管理する"],"correct":1,"explanation":"内閣は行政権を持ち、総理大臣と各大臣で構成されて政治を行います。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_court","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["裁判所","司法権","最高裁判所"],"question":"裁判所の役割として正しいものはどれですか？","options":["法律を作る","行政を行う","裁判を行う","税金を集める"],"correct":2,"explanation":"裁判所は司法権を持ち、争いごとを法律に基づいて解決します。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_election","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["選挙","選挙権","民主主義"],"question":"選挙権について正しいものはどれですか？","options":["16歳から持てる","18歳から持てる","20歳から持てる","25歳から持てる"],"correct":1,"explanation":"現在の日本では18歳から選挙権を持つことができます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_human_rights","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["基本的人権","人権","平等"],"question":"基本的人権について正しい説明はどれですか？","options":["お金持ちだけが持つ権利","すべての人が生まれながらに持つ権利","大人だけが持つ権利","日本人だけが持つ権利"],"correct":1,"explanation":"基本的人権は、すべての人が生まれながらにして持っている大切な権利です。","type":"公民知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_equality","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["平等権","法の下の平等","差別"],"question":"法の下の平等について正しいものはどれですか？","options":["お金持ちが優遇される","すべての人が平等に扱われる","男性だけが平等","大人だけが平等"],"correct":1,"explanation":"法の下の平等は、性別・出身・財産などに関係なく、すべての人が平等に扱われることです。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_freedom","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["自由権","表現の自由","思想の自由"],"question":"自由権に含まれるものとして正しいものはどれですか？","options":["お金をもらう権利","表現の自由","働く義務","税金を払う義務"],"correct":1,"explanation":"自由権には表現の自由、思想・良心の自由、信教の自由などが含まれます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_social_rights","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["社会権","教育を受ける権利","生存権"],"question":"社会権に含まれるものとして正しいものはどれですか？","options":["表現の自由","教育を受ける権利","選挙権","信教の自由"],"correct":1,"explanation":"社会権には教育を受ける権利、生存権、労働基本権などが含まれます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_political_rights","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["参政権","選挙権","被選挙権"],"question":"参政権について正しい説明はどれですか？","options":["政治に参加する権利","働く権利","教育を受ける権利","表現する権利"],"correct":0,"explanation":"参政権は政治に参加する権利で、選挙権や被選挙権などが含まれます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_claim_rights","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"難","tags":["請求権","裁判を受ける権利","国家賠償"],"question":"請求権に含まれるものとして正しいものはどれですか？","options":["表現の自由","裁判を受ける権利","選挙権","教育を受ける権利"],"correct":1,"explanation":"請求権には裁判を受ける権利、国家賠償請求権などが含まれます。","type":"公民知識","qualityScore":7.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_local_government","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["地方自治","都道府県","市町村"],"question":"地方自治について正しい説明はどれですか？","options":["国がすべてを決める","地方が自分たちのことを自分たちで決める","外国が決める","誰も決めない"],"correct":1,"explanation":"地方自治は、地方の人々が自分たちの地域のことを自分たちで決めることです。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_prefecture","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["都道府県","知事","県議会"],"question":"都道府県の長は誰ですか？","options":["市長","町長","知事","村長"],"correct":2,"explanation":"都道府県の長は知事で、住民の選挙で選ばれます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_municipality","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["市町村","市長","市議会"],"question":"市の長は誰ですか？","options":["市長","知事","町長","村長"],"correct":0,"explanation":"市の長は市長で、住民の選挙で選ばれます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_tax","subject":"社会","category":"公民","subcategory":"経済","grade":6,"difficulty":"中","tags":["税金","公共サービス","納税"],"question":"税金について正しい説明はどれですか？","options":["お金持ちだけが払う","みんなが公共サービスのために払う","外国人だけが払う","子どもは払わない"],"correct":1,"explanation":"税金は道路や学校などの公共サービスのためにみんなで負担するお金です。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_consumption_tax","subject":"社会","category":"公民","subcategory":"経済","grade":6,"difficulty":"中","tags":["消費税","間接税","買い物"],"question":"消費税について正しいものはどれですか？","options":["買い物をするときにかかる税","働いているときにかかる税","土地を持っているときにかかる税","車を持っているときにかかる税"],"correct":0,"explanation":"消費税は商品やサービスを購入するときにかかる税金です。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_income_tax","subject":"社会","category":"公民","subcategory":"経済","grade":6,"difficulty":"中","tags":["所得税","直接税","収入"],"question":"所得税について正しい説明はどれですか？","options":["買い物にかかる税","収入にかかる税","土地にかかる税","車にかかる税"],"correct":1,"explanation":"所得税は人々の収入（所得）にかかる税金です。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_public_service","subject":"社会","category":"公民","subcategory":"経済","grade":6,"difficulty":"中","tags":["公共サービス","道路","学校"],"question":"公共サービスに含まれるものとして正しいものはどれですか？","options":["コンビニ","道路や学校","デパート","映画館"],"correct":1,"explanation":"公共サービスには道路、学校、病院、警察、消防などがあります。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_budget","subject":"社会","category":"公民","subcategory":"経済","grade":6,"difficulty":"中","tags":["予算","国の支出","財政"],"question":"国の予算について正しい説明はどれですか？","options":["個人のお小遣い","国のお金の使い道の計画","会社の利益","学校の授業料"],"correct":1,"explanation":"予算は国や地方自治体がお金をどのように使うかの計画です。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_social_security","subject":"社会","category":"公民","subcategory":"経済","grade":6,"difficulty":"中","tags":["社会保障","年金","医療保険"],"question":"社会保障制度に含まれるものとして正しいものはどれですか？","options":["お小遣い","医療保険や年金","習い事","旅行"],"correct":1,"explanation":"社会保障制度には医療保険、年金、生活保護、失業保険などがあります。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_un","subject":"社会","category":"公民","subcategory":"国際","grade":6,"difficulty":"中","tags":["国際連合","国連","平和"],"question":"国際連合（国連）について正しい説明はどれですか？","options":["アジアだけの組織","世界の平和と安全を守る国際機関","ヨーロッパだけの組織","経済活動だけを行う組織"],"correct":1,"explanation":"国際連合は世界の平和と安全を守り、国際協力を進める国際機関です。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_unicef","subject":"社会","category":"公民","subcategory":"国際","grade":6,"difficulty":"中","tags":["ユニセフ","子どもの権利","国際機関"],"question":"ユニセフについて正しい説明はどれですか？","options":["大人だけを支援する組織","子どもの権利を守る国際機関","動物を保護する組織","環境を守る組織"],"correct":1,"explanation":"ユニセフは世界中の子どもの権利を守り、支援する国際機関です。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_environment","subject":"社会","category":"公民","subcategory":"国際","grade":6,"difficulty":"中","tags":["地球環境","温暖化","環境問題"],"question":"地球環境問題について正しいものはどれですか？","options":["一つの国だけの問題","世界全体で取り組む必要がある問題","解決する必要がない問題","お金があれば解決できる問題"],"correct":1,"explanation":"地球温暖化などの環境問題は世界全体で協力して取り組む必要があります。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_pacifism","subject":"社会","category":"公民","subcategory":"国際","grade":6,"difficulty":"中","tags":["平和主義","憲法9条","戦争放棄"],"question":"日本国憲法の平和主義について正しいものはどれですか？","options":["戦争をする権利","戦争を放棄し平和を愛する","他国を攻撃する権利","軍隊を持つ義務"],"correct":1,"explanation":"日本国憲法第9条では戦争を放棄し、平和を愛することを定めています。","type":"公民知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_international_cooperation","subject":"社会","category":"公民","subcategory":"国際","grade":6,"difficulty":"中","tags":["国際協力","援助","技術協力"],"question":"国際協力について正しい説明はどれですか？","options":["自分の国だけを考える","世界の国々が助け合う","競争だけをする","関係を持たない"],"correct":1,"explanation":"国際協力は世界の国々が様々な分野で助け合い、協力することです。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_democracy","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["民主主義","多数決","話し合い"],"question":"民主主義について正しい説明はどれですか？","options":["一人が全てを決める","みんなで話し合って決める","外国が決める","くじ引きで決める"],"correct":1,"explanation":"民主主義はみんなで話し合い、多数決などで物事を決める政治の仕組みです。","type":"公民知識","qualityScore":9.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_public_opinion","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["世論","国民の意見","世論調査"],"question":"世論について正しい説明はどれですか？","options":["一人の意見","国民全体の意見や考え","外国人の意見","政治家の意見"],"correct":1,"explanation":"世論は社会の問題について、国民全体がどのように考えているかを表します。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_political_party","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["政党","政治団体","選挙"],"question":"政党について正しい説明はどれですか？","options":["スポーツチーム","同じ政治的な考えを持つ人の団体","会社","学校のクラブ"],"correct":1,"explanation":"政党は同じような政治的な考えや目標を持つ人々が集まった団体です。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_mass_media","subject":"社会","category":"公民","subcategory":"政治","grade":6,"difficulty":"中","tags":["マスメディア","新聞","テレビ"],"question":"マスメディアに含まれるものとして正しいものはどれですか？","options":["個人の日記","新聞やテレビ","友達との会話","学校の宿題"],"correct":1,"explanation":"マスメディアには新聞、テレビ、ラジオ、インターネットなどがあり、多くの人に情報を伝えます。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_information_society","subject":"社会","category":"公民","subcategory":"現代","grade":6,"difficulty":"中","tags":["情報社会","インターネット","情報技術"],"question":"情報社会について正しい説明はどれですか？","options":["情報が重要な役割を果たす社会","工業だけの社会","農業だけの社会","昔の社会"],"correct":0,"explanation":"情報社会は情報やIT技術が重要な役割を果たす現代の社会です。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_personal_information","subject":"社会","category":"公民","subcategory":"現代","grade":6,"difficulty":"中","tags":["個人情報","プライバシー","保護"],"question":"個人情報について正しいものはどれですか？","options":["誰にでも教えてよい情報","大切に守るべき個人の情報","いらない情報","みんなで共有する情報"],"correct":1,"explanation":"個人情報は一人ひとりのプライバシーに関わる大切な情報で、適切に保護する必要があります。","type":"公民知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"civics_aging_society","subject":"社会","category":"公民","subcategory":"現代","grade":6,"difficulty":"中","tags":["少子高齢化","人口問題","社会問題"],"question":"少子高齢化について正しい説明はどれですか？","options":["子どもが増えて高齢者が減る","子どもが減って高齢者が増える","人口が急激に増える","外国人だけの問題"],"correct":1,"explanation":"少子高齢化は出生率が下がって子どもが減り、同時に高齢者の割合が増えることです。","type":"公民知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"economics_supply_demand","subject":"社会","category":"経済","subcategory":"市場","grade":6,"difficulty":"中","tags":["需要","供給","価格"],"question":"需要と供給について正しい説明はどれですか？","options":["需要が増えると価格は下がる","供給が増えると価格は上がる","需要が増えて供給が少ないと価格は上がる","価格は需要と供給に関係ない"],"correct":2,"explanation":"需要が多く供給が少ないと商品の価格は上がり、需要が少なく供給が多いと価格は下がります。","type":"経済知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"economics_trade","subject":"社会","category":"経済","subcategory":"国際経済","grade":6,"difficulty":"中","tags":["貿易","輸出","輸入"],"question":"日本の貿易について正しいものはどれですか？","options":["日本は何も輸入していない","日本は石油や食料を輸入し、工業製品を輸出している","日本は農産物だけを輸出している","日本は貿易をしていない"],"correct":1,"explanation":"日本は石油や食料などを輸入し、自動車や電子製品などの工業製品を輸出しています。","type":"経済知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"culture_world_heritage","subject":"社会","category":"文化","subcategory":"文化財","grade":6,"difficulty":"中","tags":["世界遺産","ユネスコ","文化財"],"question":"日本の世界遺産について正しいものはどれですか？","options":["日本には世界遺産がない","法隆寺や富士山が世界遺産に登録されている","外国人は見ることができない","最近作られた建物だけが登録される"],"correct":1,"explanation":"日本には法隆寺、姫路城、富士山、厳島神社など多くの世界遺産があります。","type":"文化知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"culture_traditional","subject":"社会","category":"文化","subcategory":"日本文化","grade":6,"difficulty":"中","tags":["伝統文化","茶道","華道"],"question":"日本の伝統文化として正しいものはどれですか？","options":["バレエ","茶道や華道","サッカー","ピアノ"],"correct":1,"explanation":"茶道、華道、書道、能楽などは日本の伝統文化です。","type":"文化知識","qualityScore":8.0,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1},
  {"id":"culture_multicultural","subject":"社会","category":"文化","subcategory":"現代社会","grade":6,"difficulty":"中","tags":["多文化共生","国際化","異文化理解"],"question":"多文化共生について正しい説明はどれですか？","options":["自分の文化だけを大切にする","異なる文化を持つ人々が共に生きる","外国の文化を禁止する","文化の交流をしない"],"correct":1,"explanation":"多文化共生は、異なる文化や価値観を持つ人々がお互いを尊重し合いながら共に生きることです。","type":"文化知識","qualityScore":8.5,"lastUpdated":"2024-12-20T04:00:00Z","createdAt":"2024-12-20T04:00:00Z","version":1}
];

// ヘルパー関数

/**
 * カテゴリ別に問題を取得
 */
export function getQuestionsByCategory(category: Category): Question[] {
  return questions.filter(q => q.category === category);
}

/**
 * 難易度別に問題を取得
 */
export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
  return questions.filter(q => q.difficulty === difficulty);
}

/**
 * 学年別に問題を取得
 */
export function getQuestionsByGrade(grade: Grade): Question[] {
  return questions.filter(q => q.grade === grade);
}

/**
 * キーワードで問題を検索
 */
export function searchQuestions(keyword: string): Question[] {
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
export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * 条件に合致する問題をランダム取得
 */
export function getRandomQuestionsByCondition(
  condition: Partial>,
  count: number = 10
): Question[] {
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
  const categoryStats: Record = {
    "地理": 0, "歴史": 0, "公民": 0, "経済": 0, "文化": 0
  };

  const difficultyStats: Record = {
    "易": 0, "中": 0, "難": 0
  };

  const gradeStats: Record = {
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
    const categoryResults: Record = {};

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

  getRecommendedQuestions(count: number = 5): Question[] {
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
  StudyHistory
};
