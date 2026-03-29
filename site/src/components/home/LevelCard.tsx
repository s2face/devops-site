import Link from 'next/link';
import { Lesson } from '@/types';
import { ProgressBar } from './ProgressBar';

export function LevelCard({ level, lessons, title }: { level: number, lessons: Lesson[], title: string }) {
  const isAvailable = lessons.length > 0;
  
  return (
    <div className={`border rounded-xl p-6 ${isAvailable ? 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow' : 'bg-gray-50 dark:bg-gray-900 opacity-70'}`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">Level {level}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
          {isAvailable ? 'Доступно' : 'В разработке'}
        </span>
      </div>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        {isAvailable ? `${lessons.length} уроков для изучения основ DevOps практик.` : 'Материалы готовятся к публикации.'}
      </p>
      
      {isAvailable ? (
        <>
          <Link href={`/level${level}`} className="block w-full text-center bg-primary hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors font-medium">
            Начать обучение
          </Link>
          <ProgressBar level={level} totalLessons={lessons.length} />
        </>
      ) : (
        <button disabled className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-2 rounded-lg cursor-not-allowed font-medium">
          Скоро
        </button>
      )}
    </div>
  );
}
