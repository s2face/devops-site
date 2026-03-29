import Link from 'next/link';
import { Lesson } from '@/types';

export function LessonList({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Link 
          href={`/level${lesson.frontmatter.lesson.level}/${lesson.frontmatter.lesson.slug}`} 
          key={lesson.frontmatter.lesson.slug}
          className="block border dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-primary group-hover:underline">
              Урок {lesson.frontmatter.lesson.number}: {lesson.frontmatter.lesson.title}
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
              {lesson.frontmatter.lesson.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {lesson.frontmatter.meta.description}
          </p>
          <div className="mt-4 flex gap-2">
            {lesson.frontmatter.meta.keywords.map(kw => (
              <span key={kw} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded">
                #{kw}
              </span>
            ))}
          </div>
        </Link>
      ))}
      
      {lessons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Уроки для этого уровня пока не добавлены.
        </div>
      )}
    </div>
  );
}
