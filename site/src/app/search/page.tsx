import { getAllLessons } from '@/lib/lessons';
import { SearchClient } from '@/components/search/SearchClient';

export default async function SearchPage() {
  const lessons1 = await getAllLessons(1);
  const lessons = [...lessons1];
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Поиск по курсу</h1>
      <SearchClient lessons={lessons} />
    </main>
  );
}
