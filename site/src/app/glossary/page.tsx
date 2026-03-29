import { getAllLessons } from '@/lib/lessons';
import { GlossaryFilter } from '@/components/glossary/GlossaryFilter';

export const metadata = {
  title: 'Глоссарий - DevOps Lessons',
};

export default async function GlossaryPage() {
  const lessons = await getAllLessons(1);
  const allTerms = lessons.flatMap(l => l.glossary.map(t => ({ ...t, level: 1 })));
  
  // Удаляем дубликаты терминов
  const uniqueTerms = Array.from(new Map(allTerms.map(item => [item.term.toLowerCase(), item])).values());
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">📖 Общий глоссарий</h1>
      <GlossaryFilter terms={uniqueTerms} />
    </main>
  );
}
