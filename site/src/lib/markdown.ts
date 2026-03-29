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
    throw new Error('Invalid frontmatter: not an object');
  }

  const fm = data as Record<string, unknown>;

  // Валидируем обязательные поля
  if (!fm.lesson || typeof fm.lesson !== 'object') {
    throw new Error('Invalid frontmatter: missing lesson object');
  }

  const lesson = fm.lesson as Record<string, unknown>;
  const requiredLessonFields = ['title', 'slug', 'number', 'level', 'status'];
  for (const field of requiredLessonFields) {
    if (!(field in lesson)) {
      throw new Error(`Invalid frontmatter: missing lesson.${field}`);
    }
  }

  if (!fm.meta || typeof fm.meta !== 'object') {
    throw new Error('Invalid frontmatter: missing meta object');
  }

  const meta = fm.meta as Record<string, unknown>;
  const requiredMetaFields = ['description', 'keywords'];
  for (const field of requiredMetaFields) {
    if (!(field in meta)) {
      throw new Error(`Invalid frontmatter: missing meta.${field}`);
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
