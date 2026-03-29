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

export async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown> {
  const { readFile } = await import('fs/promises');
  const raw = await readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const mainContent = extractMainContent(content);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(mainContent);

  return {
    frontmatter: data as LessonFrontmatter,
    htmlContent: processed.toString(),
    rawContent: content,
  };
}
