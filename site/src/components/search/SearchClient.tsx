'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { Lesson } from '@/types';

export function SearchClient({ lessons }: { lessons: Lesson[] }) {
  const [query, setQuery] = useState('');
  
  const fuse = useMemo(() => new Fuse(lessons, {
    keys: ['frontmatter.lesson.title', 'frontmatter.meta.description', 'frontmatter.meta.keywords', 'glossary.term'],
    threshold: 0.3,
  }), [lessons]);
  
  const results = query ? fuse.search(query).map(r => r.item) : [];
  
  return (
    <div>
      <input 
        type="text" 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск уроков и терминов..." 
        className="w-full p-4 text-lg border dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none mb-8"
      />
      
      {query && results.length === 0 && (
        <p className="text-gray-500">Ничего не найдено по запросу "{query}"</p>
      )}
      
      <div className="space-y-4">
        {results.map(lesson => (
          <Link 
            key={lesson.frontmatter.lesson.slug}
            href={`/level${lesson.frontmatter.lesson.level}/${lesson.frontmatter.lesson.slug}`}
            className="block p-4 border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <h3 className="text-xl font-bold text-primary mb-2">
              {lesson.frontmatter.lesson.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lesson.frontmatter.meta.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
