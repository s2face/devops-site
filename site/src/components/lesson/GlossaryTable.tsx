'use client';

import { useState } from 'react';
import { Term } from '@/types';
import { ArrowUpDown } from 'lucide-react';

export function GlossaryTable({ glossary }: { glossary: Term[] }) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  if (!glossary.length) return null;

  const sorted = [...glossary].sort((a, b) => 
    sortOrder === 'asc' 
      ? a.term.localeCompare(b.term)
      : b.term.localeCompare(a.term)
  );
  
  return (
    <section className="my-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-4 min-w-[500px]">
        <h2 className="text-2xl font-bold">📖 Глоссарий</h2>
        <button 
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          Сортировка {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <table className="w-full border-collapse min-w-[500px]">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="border dark:border-gray-700 p-3">Термин</th>
            <th className="border dark:border-gray-700 p-3">Расшифровка</th>
            <th className="border dark:border-gray-700 p-3">Объяснение</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((term, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="border dark:border-gray-700 p-3 font-semibold text-primary">{term.term}</td>
              <td className="border dark:border-gray-700 p-3">{term.expansion}</td>
              <td className="border dark:border-gray-700 p-3">{term.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
