'use client';

import { useState, useEffect } from 'react';

export function Checklist({ checklist, lessonSlug }: { checklist: string[], lessonSlug: string }) {
  const [checked, setChecked] = useState<boolean[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`checklist-${lessonSlug}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Валидируем: массив той же длины, содержащий только boolean
        if (
          Array.isArray(parsed) && 
          parsed.length === checklist.length &&
          parsed.every((val: unknown): val is boolean => typeof val === 'boolean')
        ) {
          setChecked(parsed);
          return;
        }
      } catch(e) {
        console.warn(`Failed to parse checklist data for ${lessonSlug}:`, e);
      }
    }
    setChecked(new Array(checklist.length).fill(false));
  }, [lessonSlug, checklist.length]);
  
  const toggle = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
    localStorage.setItem(`checklist-${lessonSlug}`, JSON.stringify(newChecked));
  };
  
  if (!mounted || !checklist.length) return null;

  const progress = Math.round((checked.filter(Boolean).length / checklist.length) * 100);
  
  return (
    <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">✅ Чек-лист готовности</h2>
        <span className="text-sm font-medium bg-green-200 dark:bg-green-800 px-3 py-1 rounded-full">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <ul className="space-y-3">
        {checklist.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checked[i] || false}
                onChange={() => toggle(i)}
                aria-label={`Отметить задачу: ${item}`}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <span className={`text-lg leading-tight ${checked[i] ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
