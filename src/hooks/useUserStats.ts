"use client";

import { useState, useEffect, useCallback } from 'react';
import { UserStats, DailyRecord } from '@/types';
import { subjects } from '@/data/index';

// 日付取得関数
const getCurrentDate = () => {
  return new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// LocalStorage Keys
const STORAGE_KEYS = {
  USER_STATS: 'shakaquest_userStats',
  DAILY_RECORDS: 'shakaquest_dailyRecords'
} as const;

export const useUserStats = () => {
  // --- State定義 ---
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1, 
    xp: 0, 
    coins: 0, 
    streak: 0, 
    totalAnswered: 0, 
    correctAnswers: 0,
    subjectProgress: {},
    dailyGoal: {
      target: 10,
      completed: 0,
      date: getCurrentDate()
    }
  });

  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);

  // --- データ初期化 ---
  const initializeStats = useCallback(() => {
    const currentDate = getCurrentDate();
    const initialStats: UserStats = {
      level: 1, 
      xp: 0, 
      coins: 0, 
      streak: 0, 
      totalAnswered: 0, 
      correctAnswers: 0,
      subjectProgress: {},
      dailyGoal: {
        target: 10,
        completed: 0,
        date: currentDate
      }
    };

    // 各科目の初期データを設定
    subjects.forEach(subject => {
      initialStats.subjectProgress[subject.id] = { 
        answered: 0, 
        correct: 0, 
        lastStudied: '' 
      };
    });

    setUserStats(initialStats);
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(initialStats));
    
    return initialStats;
  }, []);

  // --- データロード ---
  useEffect(() => {
    const savedStats = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    const savedRecords = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        
        // 古いデータ構造との互換性のためのチェック
        if (!parsedStats.subjectProgress) {
          parsedStats.subjectProgress = {};
        }
        
        // 今日の日付と比較してdailyGoalをリセット
        const currentDate = getCurrentDate();
        if (!parsedStats.dailyGoal || parsedStats.dailyGoal.date !== currentDate) {
          parsedStats.dailyGoal = {
            target: parsedStats.dailyGoal?.target || 10,
            completed: 0,
            date: currentDate
          };
        }
        
        setUserStats(parsedStats);
      } catch (error) {
        console.error('Error parsing saved stats:', error);
        initializeStats();
      }
    } else {
      initializeStats();
    }

    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        setDailyRecords(parsedRecords);
      } catch (error) {
        console.error('Error parsing daily records:', error);
        setDailyRecords([]);
      }
    }
  }, [initializeStats]);

  // --- データ保存 ---
  const saveUserStats = useCallback((stats: UserStats) => {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  }, []);

  const saveDailyRecords = useCallback((records: DailyRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
  }, []);

  // --- 統計更新関数 ---
  const updateStats = useCallback((
    questionsAnswered: number, 
    correctAnswers: number, 
    xpGained: number, 
    subjectId: string
  ) => {
    const currentDate = getCurrentDate();
    
    setUserStats(prev => {
      const updated = {
        ...prev,
        totalAnswered: prev.totalAnswered + questionsAnswered,
        correctAnswers: prev.correctAnswers + correctAnswers,
        xp: prev.xp + xpGained,
        coins: prev.coins + correctAnswers * 10, // 正解1問あたり10コイン
        subjectProgress: {
          ...prev.subjectProgress,
          [subjectId]: {
            answered: (prev.subjectProgress[subjectId]?.answered || 0) + questionsAnswered,
            correct: (prev.subjectProgress[subjectId]?.correct || 0) + correctAnswers,
            lastStudied: currentDate
          }
        },
        dailyGoal: {
          ...prev.dailyGoal!,
          completed: prev.dailyGoal!.completed + questionsAnswered
        }
      };
      
      saveUserStats(updated);
      return updated;
    });

    // 日別記録を更新
    setDailyRecords(prev => {
      const existingRecordIndex = prev.findIndex(record => record.date === currentDate);
      let updatedRecords: DailyRecord[];
      
      if (existingRecordIndex >= 0) {
        // 既存の記録を更新
        updatedRecords = [...prev];
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          questionsAnswered: updatedRecords[existingRecordIndex].questionsAnswered + questionsAnswered,
          correctAnswers: updatedRecords[existingRecordIndex].correctAnswers + correctAnswers,
          xpGained: updatedRecords[existingRecordIndex].xpGained + xpGained,
          studiedSubjects: Array.from(new Set([...updatedRecords[existingRecordIndex].studiedSubjects, subjectId]))
        };
      } else {
        // 新しい記録を追加
        const newRecord: DailyRecord = {
          date: currentDate,
          questionsAnswered,
          correctAnswers,
          xpGained,
          studiedSubjects: [subjectId]
        };
        updatedRecords = [...prev, newRecord];
      }
      
      saveDailyRecords(updatedRecords);
      return updatedRecords;
    });
  }, [saveUserStats, saveDailyRecords]);

  // --- 最終学習日更新 ---
  const updateLastStudied = useCallback((subjectId: string) => {
    setUserStats(prev => {
      const updated = {
        ...prev,
        subjectProgress: {
          ...prev.subjectProgress,
          [subjectId]: {
            ...prev.subjectProgress[subjectId],
            lastStudied: getCurrentDate()
          }
        }
      };
      saveUserStats(updated);
      return updated;
    });
  }, [saveUserStats]);

  // --- 今日の目標設定 ---
  const setDailyGoalTarget = useCallback((target: number) => {
    setUserStats(prev => {
      const updated = {
        ...prev,
        dailyGoal: {
          ...prev.dailyGoal!,
          target
        }
      };
      saveUserStats(updated);
      return updated;
    });
  }, [saveUserStats]);

  return {
    userStats,
    dailyRecords,
    updateStats,
    updateLastStudied,
    setDailyGoalTarget,
    initializeStats
  };
};