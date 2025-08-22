"use client";

import Link from 'next/link';
import { SubjectCategory } from '@/data/index';

interface CategoryCardProps {
  category: SubjectCategory;
  subjectId: string;
  onStudyStart: () => void;
}

export const CategoryCard = ({ category, subjectId, onStudyStart }: CategoryCardProps) => (
  <div 
    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-200 hover:border-blue-300"
    onClick={() => onStudyStart()}
  >
    <h4 className="font-bold text-lg text-gray-800 mb-2">{category.name}</h4>
    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{category.questionCount}問</span>
      <Link 
        href={`/quiz?subject=${subjectId}&category=${category.id}`}
        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onStudyStart();
        }}
      >
        開始
      </Link>
    </div>
  </div>
);