'use client';

import { useState } from 'react';
import { Term } from '@/types';

export function GlossaryFilter({ terms }: { terms: (Term & { level: number })[] }) {
  const [search, setSearch] = useState('');
  
  const filtered = terms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.expansion.toLowerCase().includes(search.toLowerCase()) ||
    t.explanation.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div>
      <input 
        type="text" 
        placeholder="Поиск по глоссарию..." 
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md p-3 mb-6 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary outline-none"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th className="border dark:border-gray-700 p-3">Термин</th>
              <th className="border dark:border-gray-700 p-3">Расшифровка</th>
              <th className="border dark:border-gray-700 p-3">Объяснение</th>
              <th className="border dark:border-gray-700 p-3 w-24">Уровень</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((term, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="border dark:border-gray-700 p-3 font-semibold text-primary">{term.term}</td>
                <td className="border dark:border-gray-700 p-3">{term.expansion}</td>
                <td className="border dark:border-gray-700 p-3">{term.explanation}</td>
                <td className="border dark:border-gray-700 p-3 text-center">
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">L{term.level}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
