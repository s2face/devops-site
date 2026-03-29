import { getAllLessons } from '@/lib/lessons';
import { SearchClient } from '@/components/search/SearchClient';
import { LessonLevel } from '@/types';

export default async function SearchPage() {
  // Загружаем уроки со всех уровней
  const allLevels: LessonLevel[] = [1, 2, 3];
  const allLessons = await Promise.all(
    allLevels.map(level => getAllLessons(level))
  );
  const lessons = allLessons.flat();

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Поиск по курсу</h1>
      <SearchClient lessons={lessons} />
    </main>
  );
}
