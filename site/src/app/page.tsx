import { getAllLessons } from '@/lib/lessons';
import { LevelCard } from '@/components/home/LevelCard';

export default async function HomePage() {
  const level1Lessons = await getAllLessons(1);
  const level2Lessons = await getAllLessons(2);
  const level3Lessons = await getAllLessons(3);
  
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">DevOps Lessons</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Структурированный путь от новичка до инженера. Изучайте практики, инструменты и культуру DevOps шаг за шагом.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <LevelCard level={1} lessons={level1Lessons} title="Beginner" />
        <LevelCard level={2} lessons={level2Lessons} title="Intermediate" />
        <LevelCard level={3} lessons={level3Lessons} title="Advanced" />
      </div>
    </main>
  );
}
