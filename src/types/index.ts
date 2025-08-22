// ユーザー統計情報の型定義
export interface UserStats {
  level: number;
  xp: number;
  coins: number;
  streak: number;
  totalAnswered: number;
  correctAnswers: number;
  subjectProgress: {
    [key: string]: {
      answered: number;
      correct: number;
      lastStudied: string;
    };
  };
  dailyGoal?: {
    target: number;
    completed: number;
    date: string;
  };
}

// 日別学習記録の型定義
export interface DailyRecord {
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  xpGained: number;
  studiedSubjects: string[];
}

// レベル情報の型定義
export interface LevelData {
  level: number;
  name: string;
  badge: string;
  minXP: number;
  maxXP: number;
}