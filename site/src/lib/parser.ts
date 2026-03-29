import matter from 'gray-matter';
import { LessonFrontmatter, Lesson, Term } from '@/types';

export function parseLesson(markdown: string): Lesson {
  const { data, content } = matter(markdown);
  
  return {
    frontmatter: data as LessonFrontmatter,
    content: extractMainContent(content),
    takeaways: parseTakeaways(content),
    glossary: parseGlossary(content),
    checklist: parseChecklist(content)
  };
}

export function extractMainContent(content: string): string {
  // Return everything before ## Ключевые выводы урока or ## Key Takeaways
  // Используем [\s\S] вместо флага s для совместимости
  const match = content.match(/^([\s\S]*?)(?=## (?:Ключевые выводы урока|Key Takeaways))/);
  return match ? match[1].trim() : content.trim();
}

export function parseTakeaways(content: string): string[] {
  const takeawaysRegex = /## (?:Ключевые выводы урока|Key Takeaways)\n\n((?:\d+\..+\n?)+)/;
  const match = content.match(takeawaysRegex);
  if (!match) return [];
  return match[1].split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').replace(/_/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim())
    .filter(Boolean);
}

export function parseGlossary(content: string): Term[] {
  // Используем [\s\S] вместо флага s для совместимости
  const glossaryRegex = /## (?:Глоссарий терминов урока|Глоссарий|Glossary)\n\n\|([\s\S]+?)(?=\n\n|\n## |$)/;
  const match = content.match(glossaryRegex);
  if (!match) return [];

  const lines = match[0].split('\n').filter(line => line.startsWith('|'));
  if (lines.length < 3) {
    console.warn('Glossary table has insufficient rows (need header, separator, and data)');
    return [];
  }

  const terms: Term[] = [];
  for (let i = 2; i < lines.length; i++) {
    const parts = lines[i].split('|').map(p => p.trim());
    // Проверяем, что есть минимум 4 колонки: | термин | расширение | объяснение |
    if (parts.length >= 4) {
      terms.push({
        term: parts[1],
        expansion: parts[2],
        explanation: parts[3]
      });
    } else if (parts.length > 1 && parts[1]) {
      // Если есть только термин, логируем предупреждение
      console.warn(`Glossary term "${parts[1]}" has insufficient columns (${parts.length} found, need 4)`);
    }
  }
  return terms;
}

export function parseChecklist(content: string): string[] {
  const checklistRegex = /## (?:Чек-лист готовности урока|Чек-лист|Checklist)\n\n((?:- \[[ xX]\].+\n?)+)/;
  const match = content.match(checklistRegex);
  if (!match) return [];
  return match[1].split('\n')
    .map(line => line.replace(/^- \[[ xX]\]\s*/, '').trim())
    .filter(Boolean);
}
