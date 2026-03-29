import Link from 'next/link';
import { getAllLessons } from '@/lib/lessons';
import { LessonLevel } from '@/types';

export async function Sidebar({ currentSlug, level }: { currentSlug: string; level: LessonLevel }) {
  const lessons = await getAllLessons(level);
  
  const currentIndex = lessons.findIndex(l => l.frontmatter.lesson.slug === currentSlug);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <aside className="w-64 flex-shrink-0 border-r dark:border-gray-800 p-6 hidden lg:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Уроки Level {level}</h3>
      <nav className="space-y-2 mb-8">
        {lessons.map((lesson) => {
          const isActive = lesson.frontmatter.lesson.slug === currentSlug;
          return (
            <Link
              key={lesson.frontmatter.lesson.slug}
              href={`/level${level}/${lesson.frontmatter.lesson.slug}`}
              className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                isActive 
                  ? 'bg-primary text-white font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {lesson.frontmatter.lesson.number}. {lesson.frontmatter.lesson.title}
            </Link>
          );
        })}
      </nav>
      
      {(prev || next) && (
        <div className="border-t dark:border-gray-800 pt-6 space-y-3">
          {prev && (
            <Link 
              href={`/level${level}/${prev.frontmatter.lesson.slug}`}
              className="flex flex-col text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <span className="text-xs uppercase font-semibold">← Назад</span>
              <span className="truncate">{prev.frontmatter.lesson.title}</span>
            </Link>
          )}
          {next && (
            <Link 
              href={`/level${level}/${next.frontmatter.lesson.slug}`}
              className="flex flex-col text-sm text-gray-500 hover:text-primary transition-colors text-right"
            >
              <span className="text-xs uppercase font-semibold">Вперёд →</span>
              <span className="truncate">{next.frontmatter.lesson.title}</span>
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}
