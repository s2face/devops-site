import path from 'path';
import { readdir } from 'fs/promises';
import { parseMarkdownFile } from './markdown';
import { parseTakeaways, parseGlossary, parseChecklist } from './parser';
import { Lesson, LessonLevel } from '@/types';
import { cache } from 'react';

// Linux: прямое чтение, без копирования
const LESSONS_BASE = path.join(process.cwd(), '..', 'lessons');

// Кэширование уроков по уровням
const lessonsCache = new Map<LessonLevel, Promise<Lesson[]>>();

export const getAllLessons = cache(async function getAllLessons(level: LessonLevel): Promise<Lesson[]> {
  // Проверяем кэш
  if (lessonsCache.has(level)) {
    return lessonsCache.get(level)!;
  }

  const levelPath = path.join(LESSONS_BASE, `level${level}`);
  let lessonDirs: string[] = [];
  try {
    const entries = await readdir(levelPath, { withFileTypes: true });
    lessonDirs = entries.filter(d => d.isDirectory()).map(d => d.name).sort();
  } catch (e) {
    console.warn(`Could not read level ${level} lessons at ${levelPath}`, e);
    return [];
  }

  const lessonsPromise = (async () => {
    const lessons: Lesson[] = [];
    for (const dir of lessonDirs) {
      const filePath = path.join(levelPath, dir, 'ARTICLE.md');
      try {
        const { frontmatter, htmlContent, rawContent } = await parseMarkdownFile(filePath);
        lessons.push({
          frontmatter,
          content: htmlContent,
          takeaways: parseTakeaways(rawContent),
          glossary: parseGlossary(rawContent),
          checklist: parseChecklist(rawContent),
        });
      } catch (e) {
        console.error(`Error parsing lesson ${dir}:`, e);
      }
    }

    return lessons.sort((a, b) => a.frontmatter.lesson.number - b.frontmatter.lesson.number);
  })();

  lessonsCache.set(level, lessonsPromise);
  return lessonsPromise;
});

export async function getLessonBySlug(slug: string, level: LessonLevel): Promise<Lesson | null> {
  const lessons = await getAllLessons(level);
  return lessons.find(l => l.frontmatter.lesson.slug === slug) || null;
}

export async function getAllSlugs(level: LessonLevel): Promise<string[]> {
  const lessons = await getAllLessons(level);
  // Фильтруем уроки с пустыми slug
  return lessons
    .map(l => l.frontmatter.lesson.slug)
    .filter(slug => slug && slug.length > 0);
}
