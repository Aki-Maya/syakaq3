# 問題データ構造の最適化提案

## 📊 現状の問題点

### 1. 分類の曖昧さ
- **地理**: フードマイレージ（環境問題）、工業地帯（社会科産業）が混在
- **歴史**: general カテゴリが19問もあり、年代分類が不明確
- **公民**: general カテゴリが14問、constitutional が1問のみ

### 2. ID番号の無秩序
- 地理: 1-100番台（ランダム）
- 歴史: 101-192番台（ランダム）  
- 公民: 201-247番台（ランダム）

### 3. ファイル構成の問題
- 科目別に分離されているが、科目横断的な問題の扱いが不明確
- メンテナンス時に3ファイルを個別に管理する必要

## 🎯 最適なファイル構成案

### 提案A: 統一ファイル + メタデータ管理方式

```typescript
// src/data/questions-unified.ts
interface Question {
  id: string;           // "GEO001", "HIS002", "CIV003" 形式
  subject: 'geography' | 'history' | 'civics';
  category: string;     // 正式な学習指導要領ベース
  subcategory?: string; // 詳細分類
  era?: string;         // 歴史のみ
  grade: number;        // 対象学年 (4-6)
  difficulty: 'basic' | 'standard' | 'advanced';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: 'multiple-choice' | 'fill-blank';
  tags: string[];       // 横断的タグ ["environment", "industry", "region"]
  source?: string;      // 参考資料
  lastUpdated: Date;
}

const questions: Question[] = [
  // 地理問題
  {
    id: "GEO001",
    subject: "geography",
    category: "industry",
    subcategory: "environmental-impact",
    grade: 6,
    difficulty: "standard",
    tags: ["environment", "sustainability", "transport"],
    // ... 問題データ
  },
  // 歴史問題  
  {
    id: "HIS001",
    subject: "history", 
    category: "ancient",
    subcategory: "nara-period",
    era: "710-794",
    grade: 6,
    difficulty: "basic",
    tags: ["politics", "culture", "religion"],
    // ... 問題データ
  }
];
```

### 提案B: 科目別ファイル + 統一インターface

```
src/data/
├── shared/
│   ├── types.ts          # 共通型定義
│   ├── categories.ts     # 正式分類体系
│   └── validators.ts     # データ検証
├── geography/
│   ├── physical.ts       # 自然地理
│   ├── human.ts          # 人文地理
│   └── regional.ts       # 地域地理
├── history/
│   ├── ancient.ts        # 古代（〜1185）
│   ├── medieval.ts       # 中世（1185-1573）
│   ├── early-modern.ts   # 近世（1573-1867）
│   ├── modern.ts         # 近代（1868-1945）
│   └── contemporary.ts   # 現代（1945〜）
├── civics/
│   ├── constitution.ts   # 憲法・基本的人権
│   ├── politics.ts       # 政治制度
│   └── economics.ts      # 経済・国際関係
└── index.ts             # 統一エクスポート
```

## 📚 正しい学習分類体系

### 地理（中学受験レベル）
1. **自然地理** 
   - 地形（山地、平野、海岸線）
   - 気候（気候区分、季節風、降水量）
   - 災害（地震、火山、台風）

2. **人文地理**
   - 人口（分布、過疎・過密）  
   - 産業（農業、工業、商業、サービス業）
   - 交通・通信

3. **地域地理**
   - 都道府県（位置、特色、名産品）
   - 地方区分（北海道、東北、関東など）
   - 国際関係（隣国、貿易）

### 歴史（中学受験レベル）
1. **原始・古代**（〜1185年）
   - 旧石器・縄文・弥生時代
   - 古墳時代・飛鳥時代  
   - 奈良時代・平安時代

2. **中世**（1185-1573年）
   - 鎌倉時代
   - 南北朝時代
   - 室町時代

3. **近世**（1573-1867年）
   - 安土桃山時代
   - 江戸時代

4. **近現代**（1868年〜）
   - 明治時代
   - 大正・昭和・平成・令和

### 公民（中学受験レベル）
1. **憲法・人権**
   - 日本国憲法の三原則
   - 基本的人権
   - 天皇制

2. **政治制度**
   - 国会・内閣・裁判所
   - 地方自治
   - 選挙制度

3. **経済・国際**
   - 経済の仕組み
   - 国際関係
   - 環境・平和

## 🔧 推奨実装方針

### 最終推奨: **提案A（統一ファイル）**

**理由:**
1. **一元管理**: 全問題を一箇所で管理、メンテナンスが容易
2. **横断検索**: 科目を跨いだ問題検索・分析が可能
3. **拡張性**: 新しいメタデータやタグの追加が容易
4. **一貫性**: IDスキーム、品質チェックを統一可能
5. **性能**: ファイル分割によるロード遅延なし

### ID命名規則
```
{SUBJECT}{CATEGORY}{NUMBER}
例:
- GEO_PHY_001: 地理・自然地理・1番目
- HIS_ANC_045: 歴史・古代・45番目  
- CIV_POL_012: 公民・政治・12番目
```

### データ検証
```typescript
// 問題データの整合性チェック
function validateQuestion(q: Question): ValidationResult {
  // ID形式チェック
  // カテゴリ妥当性チェック
  // 年代整合性チェック（歴史）
  // 解説文字数チェック（100文字以上）
  // 選択肢数チェック（4個）
  // 正解番号チェック（0-3）
}
```

この構成に移行することで、学習効果が高く、メンテナンスしやすい問題データベースになります。