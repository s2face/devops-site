import type { Metadata } from 'next';
import { getAllLessons } from '@/lib/lessons';
import { GlossaryFilter } from '@/components/glossary/GlossaryFilter';
import { LessonLevel } from '@/types';

export const metadata: Metadata = {
  title: 'Глоссарий - DevOps Lessons',
};

export default async function GlossaryPage() {
  // Загружаем уроки со всех уровней
  const allLevels: LessonLevel[] = [1, 2, 3];
  const allTerms = await Promise.all(
    allLevels.map(async (level) => {
      const lessons = await getAllLessons(level);
      return lessons.flatMap(l => l.glossary.map(t => ({ ...t, level })));
    })
  );

  const flatTerms = allTerms.flat();

  // Удаляем дубликаты терминов (оставляем первую версию)
  const uniqueTerms = Array.from(
    new Map(flatTerms.map(item => [item.term.toLowerCase(), item])).values()
  );

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">📖 Общий глоссарий</h1>
      <GlossaryFilter terms={uniqueTerms} />
    </main>
  );
}
