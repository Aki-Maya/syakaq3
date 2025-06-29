"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getQuestionsBySubjectAndCategory, 
  getRandomQuestionsMixed,
  calculateXPFromScore,
  type UnifiedQuestion 
} from '@/data/index';
import Link from 'next/link';

interface QuizState {
  questions: UnifiedQuestion[];
  currentIndex: number;
  selectedAnswer: number | null;
  answers: (number | null)[];
  showExplanation: boolean;
  isCompleted: boolean;
  startTime: number;
  timeRemaining: number;
}

const QuizComponent = () => {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const category = searchParams.get('category');

  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    answers: [],
    showExplanation: false,
    isCompleted: false,
    startTime: Date.now(),
    timeRemaining: 30
  });

  // Initialize quiz
  useEffect(() => {
    let questions: UnifiedQuestion[] = [];

    if (subject && category) {
      questions = getQuestionsBySubjectAndCategory(subject as any, category);
    } else {
      questions = getRandomQuestionsMixed(10);
    }

    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, 5);

    setQuizState(prev => ({
      ...prev,
      questions: shuffled,
      answers: new Array(shuffled.length).fill(null)
    }));
  }, [subject, category]);

  // Timer effect
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.showExplanation && !quizState.isCompleted) {
      const timerId = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (quizState.timeRemaining === 0 && !quizState.showExplanation) {
      handleTimeUp();
    }
  }, [quizState.timeRemaining, quizState.showExplanation, quizState.isCompleted]);

  const handleTimeUp = () => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = null;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true
    }));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return;
    
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = answerIndex;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      answers: newAnswers,
      showExplanation: true
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedAnswer: null,
        showExplanation: false,
        timeRemaining: 30
      }));
    } else {
      setQuizState(prev => ({ ...prev, isCompleted: true }));
    }
  };

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progress = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;

  const correctAnswers = quizState.answers.filter((answer, index) => 
    answer === quizState.questions[index]?.correct
  ).length;

  const totalQuestions = quizState.questions.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
