# 🚀 План реализации сайта DevOps Lessons

**Версия:** 2.0  
**Дата:** 29 марта 2026  
**На основе:** TECHNICAL_SPECIFICATION.md v2.0  
**Платформа:** Linux-only

---

## 📋 Общая информация

**Продукт:** Образовательный портал для изучения DevOps  
**Контент:** 15 уроков Level 1 (готовы), Level 2-3 (в разработке)  
**Стек:** Next.js 14 + TypeScript + Tailwind CSS + Shiki  
**Срок оценки:** 4-5 недель (MVP)

---

## 🎯 Этап 0: Подготовка (1-2 дня)

### Шаг 0.1: Инициализация проекта
```bash
cd site
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**Результат:** Базовая структура Next.js проекта

---

### Шаг 0.2: Установка зависимостей
```bash
npm install gray-matter remark remark-rehype remark-gfm rehype-stringify rehype-sanitize shiki lucide-react fuse.js
npm install -D @types/node @types/react @types/react-dom
```

> ⚠️ Не использовать `remark-html` — уязвим к XSS. Использовать `rehype-sanitize`.

**Результат:** Все необходимые пакеты установлены

---

### Шаг 0.3: Создание скрипта миграции контента
**Файл:** `scripts/migrate-content.js`

**Задача:** Автоматически добавить frontmatter во все существующие ARTICLE.md

**Логика скрипта:**
1. Пройтись по `lessons/level1/lesson*/ARTICLE.md`
2. Извлечь заголовок из первой строки Markdown
3. Сгенерировать slug из названия урока
4. Добавить frontmatter с полями:
   - `lesson.number` (из номера папки)
   - `lesson.title` (из заголовка)
   - `lesson.slug` (транслитерация)
   - `lesson.level` (1)
   - `lesson.status` ("ready")
   - `navigation.previous` (предыдущий урок)
   - `navigation.next` (следующий урок)
   - `meta.description` (первые 150 символов контента)
   - `meta.updated` (текущая дата)

**DoD:** Все 15 файлов `lessons/level1/lesson*/ARTICLE.md` содержат валидный frontmatter. `gray-matter` парсит без ошибок.

**Результат:** Все 15 уроков имеют валидный frontmatter

---

### Шаг 0.4: Настройка прямого чтения контента (Linux)

> ✅ **Linux-only:** Symlinks работают нативно. Скрипт синхронизации (`sync-content.js`) **не нужен**.

Контент читается напрямую через `fs` из абсолютного пути:
```typescript
// В src/lib/lessons.ts
const LESSONS_BASE = path.join(process.cwd(), '..', 'lessons');
// Пример: /home/user/devops-lessons/lessons/level1/lesson01/ARTICLE.md
```

Директория `content/` **не создаётся**. Директива `content/` в structure.md убрана.

**Результат:** Прямое чтение из `../lessons/` настроено, лишних копий файлов нет

---

### Шаг 0.5: Настройка package.json
```json
{
  "scripts": {
    "migrate": "node scripts/migrate-content.js",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  }
}
```

> ✅ `sync-content` убран — на Linux symlinks работают нативно.

**Результат:** Команды для разработки и сборки

---

## 🏗️ Этап 1: Архитектура (2-3 дня)

### Шаг 1.1: Вызов @web_architect
**Задача:** Спроектировать архитектуру сайта

**Входные данные:**
- TECHNICAL_SPECIFICATION.md
- Структура контента (lessons/level1/lesson01-15)

**Ожидаемый результат:** Файл `ARCHITECTURE.md`

**Вопросы к архитектору:**
1. Предложи структуру папок `src/app/` для Next.js App Router
2. Опиши компоненты для рендеринга урока (LessonPage, Sidebar, Navigation)
3. Спроектируй систему роутинга (`/level1/lesson01-slug`)
4. Предложи решение для навигационной диаграммы зависимостей
5. Опиши стратегию работы с localStorage для чек-листов

---

### Шаг 1.2: Создание типов данных
**Файл:** `src/types/index.ts`

**Содержание:**
```typescript
export type LessonStatus = 'ready' | 'draft' | 'todo';
export type LessonLevel = 1 | 2 | 3;

export interface LessonFrontmatter {
  lesson: {
    number: number;
    title: string;
    slug: string;
    level: LessonLevel;
    status: LessonStatus;
  };
  navigation: {
    previous: string | null;
    next: string | null;
    prerequisites?: string[];
  };
  meta: {
    description: string;
    keywords: string[];
    updated: string;
  };
}

export interface Term {
  term: string;
  expansion: string;
  explanation: string;
}

export interface Lesson {
  frontmatter: LessonFrontmatter;
  content: string;
  takeaways: string[];
  glossary: Term[];
  checklist: string[];
}

export interface LessonProgress {
  lessonSlug: string;
  checklistState: boolean[];
  completedAt?: string;
  version: string;
}
```

**Результат:** TypeScript интерфейсы для всех сущностей

---

## 🔧 Этап 2: Бекенд/Парсер (3-4 дня)

### Шаг 2.1: Вызов @web_backend
**Задача:** Реализовать парсинг контента и серверную логику

**Входные данные:**
- ARCHITECTURE.md
- TECHNICAL_SPECIFICATION.md (разделы 4, 5, 6)

**Ожидаемый результат:** Рабочий парсер и утилиты

---

### Шаг 2.2: Создание парсера Markdown
**Файл:** `src/lib/parser.ts`

**Функции для реализации:**

#### 2.2.1: `parseLesson(markdown: string): Lesson`
```typescript
import matter from 'gray-matter';
import { parseTakeaways, parseGlossary, parseChecklist } from './parser';

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
```

---

#### 2.2.2: `parseTakeaways(content: string): string[]`
**Логика:**
1. Найти заголовок `## Ключевые выводы урока` или `## Key Takeaways`
2. Извлечь нумерованный список до следующего `##`
3. Очистить от Markdown (`**`, `_`, `[link](url)`)

**Regex:**
```typescript
const takeawaysRegex = /## (?:Ключевые выводы урока|Key Takeaways)\n\n((?:\d+\..+\n?)+)/;
```

---

#### 2.2.3: `parseGlossary(content: string): Term[]`
**Логика:**
1. Найти заголовок `## Глоссарий терминов урока` или `## Glossary`
2. Извлечь Markdown-таблицу
3. Распарсить в массив объектов

**Regex:**
```typescript
const glossaryRegex = /## (?:Глоссарий терминов урока|Глоссарий|Glossary)\n\n\|(.+)\|/s;
```

---

#### 2.2.4: `parseChecklist(content: string): string[]`
**Логика:**
1. Найти заголовок `## Чек-лист готовности урока` или `## Checklist`
2. Извлечь строки с `- [ ]` или `- [x]`
3. Очистить от синтаксиса чекбоксов

**Regex:**
```typescript
const checklistRegex = /## (?:Чек-лист готовности урока|Чек-лист|Checklist)\n\n((?:- \[[ x]\].+\n?)+)/;
```

---

### Шаг 2.3: Создание утилиты парсинга markdown
**Файл:** `src/lib/markdown.ts`

```typescript
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { LessonFrontmatter } from '@/types';

export interface ParsedMarkdown {
  frontmatter: LessonFrontmatter;
  htmlContent: string;  // Санитизированный HTML
  rawContent: string;   // Raw Markdown (для парсера секций)
}

export async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown> {
  const { readFile } = await import('fs/promises');
  const raw = await readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)   // ← Защита от XSS
    .use(rehypeStringify)
    .process(content);

  return {
    frontmatter: data as LessonFrontmatter,
    htmlContent: processed.toString(),
    rawContent: content,
  };
}
```

---

### Шаг 2.4: Создание утилиты загрузки уроков
**Файл:** `src/lib/lessons.ts`

**Функции:**

#### 2.4.1: `getAllLessons(level: LessonLevel): Lesson[]`
```typescript
import path from 'path';
import { readdir } from 'fs/promises';
import { parseMarkdownFile } from './markdown';
import { parseTakeaways, parseGlossary, parseChecklist } from './parser';

// Linux: прямое чтение, без копирования
const LESSONS_BASE = path.join(process.cwd(), '..', 'lessons');

export async function getAllLessons(level: LessonLevel): Promise<Lesson[]> {
  const levelPath = path.join(LESSONS_BASE, `level${level}`);
  const lessonDirs = (await readdir(levelPath, { withFileTypes: true }))
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  const lessons: Lesson[] = [];
  for (const dir of lessonDirs) {
    const filePath = path.join(levelPath, dir, 'ARTICLE.md');
    const { frontmatter, htmlContent, rawContent } = await parseMarkdownFile(filePath);
    lessons.push({
      frontmatter,
      content: htmlContent,
      takeaways: parseTakeaways(rawContent),
      glossary: parseGlossary(rawContent),
      checklist: parseChecklist(rawContent),
    });
  }

  return lessons.sort((a, b) => a.frontmatter.lesson.number - b.frontmatter.lesson.number);
}
```

---

#### 2.3.2: `getLessonBySlug(slug: string, level: LessonLevel): Lesson | null`
```typescript
export async function getLessonBySlug(slug: string, level: LessonLevel): Promise<Lesson | null> {
  const lessons = await getAllLessons(level);
  return lessons.find(l => l.frontmatter.lesson.slug === slug) || null;
}
```

---

#### 2.3.3: `getAllSlugs(level: LessonLevel): string[]`
```typescript
export async function getAllSlugs(level: LessonLevel): Promise<string[]> {
  const lessons = await getAllLessons(level);
  return lessons.map(l => l.frontmatter.lesson.slug);
}
```

---

### Шаг 2.4: Создание генератора хэша для версионирования
**Файл:** `src/lib/versioning.ts`

```typescript
import { createHash } from 'crypto';

export function getContentVersion(content: string): string {
  // Хэшируем только секцию чек-листа для стабильности
  const checklistMatch = content.match(/## (?:Чек-лист готовности урока|Checklist)\n\n([\s\S]+)/);
  const checklistContent = checklistMatch ? checklistMatch[1] : content;
  return createHash('sha256').update(checklistContent).digest('hex').slice(0, 8);
}

export function validateProgressVersion(storedVersion: string, currentContent: string): boolean {
  return storedVersion === getContentVersion(currentContent);
}
```

**Результат:** Парсер готов, все функции работают

---

## 🎨 Этап 3: Фронтенд (5-7 дней)

### Шаг 3.1: Вызов @web_frontend
**Задача:** Реализовать UI компоненты и страницы

**Входные данные:**
- ARCHITECTURE.md
- TECHNICAL_SPECIFICATION.md (разделы 2, 11, 12)

**Ожидаемый результат:** Рабочий интерфейс сайта

---

### Шаг 3.2: Создание базовых компонентов Layout
**Файл:** `src/components/layout/Header.tsx`

**Содержание:**
- Логотип / название курса
- Навигация: Главная, Level 1, Level 2, Level 3, Глоссарий
- Переключатель тёмной темы

---

**Файл:** `src/components/layout/Footer.tsx`

**Содержание:**
- Копирайт
- Ссылки на GitHub
- Контакты

---

**Файл:** `src/components/layout/Sidebar.tsx`

**Содержание:**
- Список уроков уровня
- Кнопки «Назад» / «Вперёд»
- Индикатор текущего урока

---

### Шаг 3.3: Создание компонентов урока

#### 3.3.1: `LessonContent.tsx`

> ⚠️ **Важно:** контент рендерится из `htmlContent` — уже санитизированного HTML, полученного из `markdown.ts` через `rehype-sanitize`. Не использовать `remark-html` с `sanitize: false`.

```tsx
// Server Component — рендерится на сервере, не требует 'use client'
export function LessonContent({ htmlContent }: { htmlContent: string }) {
  return (
    <article
      className="prose prose-invert max-w-none"
      // htmlContent уже санитизирован через rehype-sanitize в markdown.ts
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
```

---

#### 3.3.2: `KeyTakeaways.tsx`
```tsx
export function KeyTakeaways({ takeaways }: { takeaways: string[] }) {
  return (
    <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg my-8">
      <h2 className="text-2xl font-bold mb-4">🎯 Ключевые выводы</h2>
      <ol className="list-decimal list-inside space-y-2">
        {takeaways.map((takeaway, i) => (
          <li key={i}>{takeaway}</li>
        ))}
      </ol>
    </section>
  );
}
```

---

#### 3.3.3: `GlossaryTable.tsx`
```tsx
import { useState } from 'react';

export function GlossaryTable({ glossary }: { glossary: Term[] }) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const sorted = [...glossary].sort((a, b) => 
    sortOrder === 'asc' 
      ? a.term.localeCompare(b.term)
      : b.term.localeCompare(a.term)
  );
  
  return (
    <section className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📖 Глоссарий</h2>
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Сортировка {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border p-2">Термин</th>
            <th className="border p-2">Расшифровка</th>
            <th className="border p-2">Объяснение</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((term, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border p-2 font-semibold">{term.term}</td>
              <td className="border p-2">{term.expansion}</td>
              <td className="border p-2">{term.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

---

#### 3.3.4: `Checklist.tsx`
```tsx
'use client';

import { useState, useEffect } from 'react';

export function Checklist({ checklist, lessonSlug }: { checklist: string[], lessonSlug: string }) {
  const [checked, setChecked] = useState<boolean[]>([]);
  
  useEffect(() => {
    // Загрузка из localStorage
    const stored = localStorage.getItem(`checklist-${lessonSlug}`);
    if (stored) {
      setChecked(JSON.parse(stored));
    } else {
      setChecked(new Array(checklist.length).fill(false));
    }
  }, [lessonSlug, checklist.length]);
  
  const toggle = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
    localStorage.setItem(`checklist-${lessonSlug}`, JSON.stringify(newChecked));
  };
  
  const progress = Math.round((checked.filter(Boolean).length / checklist.length) * 100);
  
  return (
    <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">✅ Чек-лист готовности</h2>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <ul className="space-y-2">
        {checklist.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={checked[i] || false}
              onChange={() => toggle(i)}
              className="w-5 h-5 rounded"
            />
            <span className={checked[i] ? 'line-through text-gray-500' : ''}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

#### 3.3.5: `CodeBlock.tsx`

> ⚠️ Shiki v2+ использует `createHighlighter` вместо устаревшего `getHighlighter`. Хайлайтер инициализируется один раз на сервере.

```tsx
// Server Component — подсветка происходит на сервере, без клиентского JS
import { createHighlighter } from 'shiki';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['bash', 'yaml', 'dockerfile', 'typescript', 'javascript', 'python', 'go', 'json', 'toml'],
    });
  }
  return highlighterPromise;
}

export async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    theme: 'github-dark',
  });

  return (
    <div className="relative group font-mono text-sm overflow-x-auto">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {/* Кнопка копирования — client island */}
      <CopyButton code={code} />
    </div>
  );
}
```

```tsx
// src/components/lesson/CopyButton.tsx  — отдельный client component
'use client';

export function CopyButton({ code }: { code: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code)}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs bg-gray-700 rounded"
      aria-label="Копировать код"
    >
      📋 Копировать
    </button>
  );
}
```

---

### Шаг 3.4: Создание страниц

#### 3.4.1: Главная страница (`src/app/page.tsx`)
```tsx
import { getAllLessons } from '@/lib/lessons';
import { LevelCard } from '@/components/home/LevelCard';

export default async function HomePage() {
  const level1Lessons = await getAllLessons(1);
  const level2Lessons = await getAllLessons(2);
  const level3Lessons = await getAllLessons(3);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">DevOps Lessons</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <LevelCard level={1} lessons={level1Lessons} title="Beginner" />
        <LevelCard level={2} lessons={level2Lessons} title="Intermediate" />
        <LevelCard level={3} lessons={level3Lessons} title="Advanced" />
      </div>
    </main>
  );
}
```

---

#### 3.4.2: Страница уровня (`src/app/level1/page.tsx`)
```tsx
import { getAllLessons } from '@/lib/lessons';
import { LessonList } from '@/components/level/LessonList';

export default async function LevelPage({ params }: { params: { level: string } }) {
  const level = parseInt(params.level) as LessonLevel;
  const lessons = await getAllLessons(level);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Level {level}: {getLevelTitle(level)}</h1>
      <LessonList lessons={lessons} />
    </main>
  );
}
```

---

#### 3.4.3: Страница урока (`src/app/level1/[slug]/page.tsx`)
```tsx
import { getLessonBySlug, getAllSlugs } from '@/lib/lessons';
import { LessonContent } from '@/components/lesson/LessonContent';
import { KeyTakeaways } from '@/components/lesson/KeyTakeaways';
import { GlossaryTable } from '@/components/lesson/GlossaryTable';
import { Checklist } from '@/components/lesson/Checklist';
import { Sidebar } from '@/components/layout/Sidebar';

export async function generateStaticParams() {
  const slugs = await getAllSlugs(1);
  return slugs.map(slug => ({ slug }));
}

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = await getLessonBySlug(params.slug, 1);
  
  if (!lesson) {
    return <div>Урок не найден</div>;
  }
  
  return (
    <div className="flex">
      <Sidebar currentSlug={lesson.frontmatter.lesson.slug} level={1} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{lesson.frontmatter.lesson.title}</h1>
        <LessonContent markdown={lesson.content} />
        <KeyTakeaways takeaways={lesson.takeaways} />
        <GlossaryTable glossary={lesson.glossary} />
        <Checklist checklist={lesson.checklist} lessonSlug={lesson.frontmatter.lesson.slug} />
      </main>
    </div>
  );
}
```

---

#### 3.4.4: Страница глоссария (`src/app/glossary/page.tsx`)
```tsx
import { getAllLessons } from '@/lib/lessons';
import { GlossaryFilter } from '@/components/glossary/GlossaryFilter';

export default async function GlossaryPage() {
  const lessons = await getAllLessons(1);
  const allTerms = lessons.flatMap(l => l.glossary.map(t => ({ ...t, level: 1 })));
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">📖 Глоссарий</h1>
      <GlossaryFilter terms={allTerms} />
    </main>
  );
}
```

---

#### 3.4.5: Страница 404 (`src/app/not-found.tsx`)
```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Урок не найден</p>
      <Link href="/" className="text-blue-500 hover:underline">
        ← На главную
      </Link>
    </div>
  );
}
```

---

### Шаг 3.5: Создание навигационной диаграммы
**Файл:** `src/components/level/DependencyDiagram.tsx`

**Решение:** Использовать Mermaid.js для рендеринга

```tsx
'use client';

import { useEffect } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true });

export function DependencyDiagram({ dependencies }: { dependencies: string }) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);
  
  return <div className="mermaid">{dependencies}</div>;
}
```

**Или упрощённо:** Статический SVG с горизонтальным скроллом

---

### Шаг 3.6: Настройка тёмной темы
**Файл:** `src/components/layout/ThemeToggle.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setDark(stored === 'dark');
  }, []);
  
  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };
  
  return (
    <button onClick={toggle} className="p-2">
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
```

---

### Шаг 3.7: Настройка Tailwind CSS
**Файл:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        accent: '#10B981',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

**Результат этапа:** Все UI компоненты готовы, страницы работают

---

## 🔍 Этап 4: Тестирование и безопасность (2-3 дня)

### Шаг 4.1: Вызов @web_security
**Задача:** Провести аудит безопасности

**Входные данные:**
- TECHNICAL_SPECIFICATION.md (раздел 9)
- Исходный код сайта

**Ожидаемый результат:** Файл `SECURITY_AUDIT.md`

**Чек-лист для аудитора:**
- [ ] Проверка CSP заголовков
- [ ] Проверка санитизации Markdown (XSS)
- [ ] Проверка HTTPS редиректа
- [ ] Проверка заголовков безопасности
- [ ] Проверка localStorage на уязвимости
- [ ] Проверка зависимостей на CVE

---

### Шаг 4.2: Реализация исправлений безопасности
**По отчёту `SECURITY_AUDIT.md`**

**Типичные исправления:**
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: securityHeaders
    }
  ];
}
```

---

### Шаг 4.3: Вызов @web_qa
**Задача:** Найти баги в функциональности

**Входные данные:**
- Рабочий сайт (localhost)
- TECHNICAL_SPECIFICATION.md (раздел 14)

**Ожидаемый результат:** Файл `QA_BUG_REPORT.md`

**Сценарии для тестирования:**
1. Открыть главную → Level 1 → Урок 1
2. Пройти чек-лист → перезагрузить → прогресс сохранён
3. Поиск по термину → открыть результат
4. Переключить тёмную тему → перезагрузить → тема сохранена
5. Открыть несуществующий урок → 404 страница
6. Проверить мобильную версию (ASCII-диаграммы читаемы?)

---

### Шаг 4.4: Реализация исправлений багов
**По отчёту `QA_BUG_REPORT.md`**

**Распределение по агентам:**
- Бэкенд-баги → @web_backend
- Фронтенд-баги → @web_frontend

---

## 👤 Этап 5: Пользовательский тест (1 день)

### Шаг 5.1: Вызов @web_end_user
**Задача:** Оценить удобство платформы

**Входные данные:**
- Рабочий сайт (localhost или деплой)
- Сценарий использования: «Пройти урок 1-3 Level 1»

**Ожидаемый результат:** Файл `USER_FEEDBACK.md`

**Вопросы для оценки:**
1. Понятна ли навигация?
2. Удобно ли работать с чек-листами?
3. Читаемы ли код-блоки на мобильных?
4. Достаточно ли информации в глоссарии?
5. Что можно улучшить?

---

### Шаг 5.2: Финальные исправления
**По отчёту `USER_FEEDBACK.md`**

**Приоритизация:**
- Критичные UX-проблемы → исправить сразу
- Пожелания → добавить в бэклог

---

## 🚀 Этап 6: Деплой (0.5-1 день)

### Шаг 6.1: Подготовка к деплою
**Файл:** `next.config.js`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',  // Для статического хостинга
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

---

### Шаг 6.2: Деплой на Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Или через GitHub:**
1. Запушить код в GitHub репозиторий
2. Подключить репозиторий в Vercel
3. Настроить Auto Deploy на push в main

---

### Шаг 6.3: Настройка домена (опционально)
1. Добавить домен в Vercel Dashboard
2. Настроить DNS записи
3. Подождать SSL сертификат

---

### Шаг 6.4: Финальная проверка
- [ ] Сайт доступен по публичному URL
- [ ] Все 15 уроков Level 1 работают
- [ ] Чек-листы сохраняют прогресс
- [ ] Поиск работает
- [ ] Мобильная версия корректна
- [ ] Lighthouse Score > 90

---

## 📊 Итоговый план по агентам

| Агент | Этап | Задачи | Срок |
|-------|------|--------|------|
| **@web_architect** | 1 | ARCHITECTURE.md, структура папок, роутинг | 2-3 дня |
| **@web_backend** | 2 | Парсер, утилиты, загрузка уроков | 3-4 дня |
| **@web_frontend** | 3 | UI компоненты, страницы, темы | 5-7 дней |
| **@web_security** | 4 | Аудит безопасности | 1 день |
| **@web_qa** | 4 | Тестирование, баг-репорт | 1 день |
| **@web_end_user** | 5 | Пользовательский тест | 1 день |

**Общий срок:** 4-5 недель

---

## 📁 Итоговая структура файлов

```
devops-lessons/
├── lessons/                          # Контент (НЕ копируется)
│   └── level1/
│       ├── lesson01/ARTICLE.md
│       └── ...
site/
├── PROJECT_PLAN.md                   # Лог работы менеджера
├── ARCHITECTURE.md                   # От @web_architect
├── SECURITY_AUDIT.md                 # От @web_security
├── QA_BUG_REPORT.md                  # От @web_qa
├── USER_FEEDBACK.md                  # От @web_end_user
├── scripts/
│   └── migrate-content.js            # Миграция frontmatter (одноразово)
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Главная
│   │   ├── level1/
│   │   │   ├── page.tsx              # Страница уровня
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Страница урока
│   │   ├── glossary/page.tsx
│   │   ├── about/page.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── lesson/
│   │       ├── LessonContent.tsx
│   │       ├── KeyTakeaways.tsx
│   │       ├── GlossaryTable.tsx
│   │       ├── Checklist.tsx         # 'use client'
│   │       ├── CodeBlock.tsx         # Server Component
│   │       └── CopyButton.tsx        # 'use client'
│   ├── lib/
│   │   ├── markdown.ts               # gray-matter + rehype-sanitize
│   │   ├── parser.ts                 # Извлечение секций
│   │   ├── lessons.ts                # Загрузка из ../lessons/
│   │   └── versioning.ts             # Хэш контента
│   └── types/
│       └── index.ts
└── package.json
# Нет content/ директории — читаем напрямую из ../lessons/
```

---

## 🎯 Команда для запуска агента

```
@web_manager

Прочитай IMPLEMENTATION_STEPS.md и TECHNICAL_SPECIFICATION.md полностью перед началом работы.
Пути к файлам:
- ТЗ: c:/Users/s2face/devops-lessons/site/TECHNICAL_SPECIFICATION.md
- Шаги: c:/Users/s2face/devops-lessons/site/IMPLEMENTATION_STEPS.md

Выполни все шаги workflow строго по порядку (Шаг 0 → Шаг 6).
Переходи к следующему шагу только после выполнения DoD текущего.
```

---

**Последнее обновление:** 29 марта 2026  
**Версия:** 2.0 (исправлены: XSS, Shiki API, Linux-only пути, добавлен markdown.ts)  
**Статус:** Готов к запуску
