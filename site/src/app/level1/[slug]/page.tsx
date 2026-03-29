import { getLessonBySlug, getAllSlugs } from '@/lib/lessons';
import { LessonContent } from '@/components/lesson/LessonContent';
import { KeyTakeaways } from '@/components/lesson/KeyTakeaways';
import { GlossaryTable } from '@/components/lesson/GlossaryTable';
import { Checklist } from '@/components/lesson/Checklist';
import { Sidebar } from '@/components/layout/Sidebar';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllSlugs(1);
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const lesson = await getLessonBySlug(params.slug, 1);
  if (!lesson) return { title: 'Not Found' };
  
  return {
    title: `${lesson.frontmatter.lesson.title} - Level 1`,
    description: lesson.frontmatter.meta.description,
  };
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await getLessonBySlug(params.slug, 1);
  
  if (!lesson) {
    notFound();
  }
  
  return (
    <div className="flex mx-auto max-w-7xl">
      <Sidebar currentSlug={lesson.frontmatter.lesson.slug} level={1} />
      <main className="flex-1 p-6 lg:p-10 w-full overflow-hidden">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Главная → Level 1 → Урок {lesson.frontmatter.lesson.number}: {lesson.frontmatter.lesson.title}
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          {lesson.frontmatter.lesson.title}
        </h1>
        
        <LessonContent htmlContent={lesson.content} />
        <KeyTakeaways takeaways={lesson.takeaways} />
        <GlossaryTable glossary={lesson.glossary} />
        <Checklist checklist={lesson.checklist} lessonSlug={lesson.frontmatter.lesson.slug} />
      </main>
    </div>
  );
}
