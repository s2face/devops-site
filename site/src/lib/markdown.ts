import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { LessonFrontmatter } from '@/types';
import { extractMainContent } from './parser';

export interface ParsedMarkdown {
  frontmatter: LessonFrontmatter;
  htmlContent: string;
  rawContent: string;
}

function validateLessonFrontmatter(data: unknown): LessonFrontmatter {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid frontmatter: not an object, using empty defaults');
    return {
      lesson: { title: '', slug: '', number: 0, level: 1, status: 'draft' },
      navigation: { previous: null, next: null, prerequisites: [] },
      meta: { description: '', keywords: [], updated: new Date().toISOString().split('T')[0] },
    } as LessonFrontmatter;
  }

  const fm = data as Record<string, unknown>;

  // Проверяем наличие lesson объекта
  if (!fm.lesson || typeof fm.lesson !== 'object') {
    console.warn('Invalid frontmatter: missing lesson object, using defaults');
    fm.lesson = { title: '', slug: '', number: 0, level: 1, status: 'draft' };
  }

  const lesson = fm.lesson as Record<string, unknown>;
  const requiredLessonFields = ['title', 'slug', 'number', 'level', 'status'];
  for (const field of requiredLessonFields) {
    if (!(field in lesson)) {
      console.warn(`Invalid frontmatter: missing lesson.${field}, using default`);
      lesson[field] = field === 'number' || field === 'level' ? 0 : '';
    }
  }

  // Проверяем наличие navigation объекта
  if (!fm.navigation || typeof fm.navigation !== 'object') {
    console.warn('Invalid frontmatter: missing navigation object, using defaults');
    fm.navigation = { previous: null, next: null, prerequisites: [] };
  }

  // Проверяем наличие meta объекта
  if (!fm.meta || typeof fm.meta !== 'object') {
    console.warn('Invalid frontmatter: missing meta object, using defaults');
    fm.meta = { description: '', keywords: [], updated: new Date().toISOString().split('T')[0] };
  }

  const meta = fm.meta as Record<string, unknown>;
  const requiredMetaFields = ['description', 'keywords', 'updated'];
  for (const field of requiredMetaFields) {
    if (!(field in meta)) {
      console.warn(`Invalid frontmatter: missing meta.${field}, using default`);
      meta[field] = field === 'keywords' ? [] : field === 'updated' ? new Date().toISOString().split('T')[0] : '';
    }
  }

  return data as LessonFrontmatter;
}

export async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown> {
  const { readFile } = await import('fs/promises');
  const raw = await readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);

  // Валидируем frontmatter
  const frontmatter = validateLessonFrontmatter(data);

  const mainContent = extractMainContent(content);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(mainContent);

  return {
    frontmatter,
    htmlContent: processed.toString(),
    rawContent: content,
  };
}
