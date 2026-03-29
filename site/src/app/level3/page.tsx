import type { Metadata } from 'next';
import { getAllLessons } from '@/lib/lessons';
import { LessonList } from '@/components/level/LessonList';

export const metadata: Metadata = {
  title: 'Level 3: Advanced - DevOps Lessons',
};

export default async function LevelPage() {
  const lessons = await getAllLessons(3);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Level 3: Advanced</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Экспертные практики и архитектуры DevOps.
      </p>

      <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-800">
        <h3 className="font-bold mb-4">Диаграмма зависимостей (Roadmap)</h3>
        <div className="overflow-x-auto text-sm font-mono whitespace-pre text-gray-700 dark:text-gray-300">
          {`[Microservices] ---> [Service Mesh] ---> [GitOps]
                              |
                              +---> [Observability] ---> [SRE]`}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Список уроков</h2>
      <LessonList lessons={lessons} />
    </main>
  );
}
