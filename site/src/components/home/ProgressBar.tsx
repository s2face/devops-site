'use client';

import { useEffect, useState, useMemo } from 'react';

function getCompletedLessonsCount(): number {
  if (typeof window === 'undefined') return 0;
  
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('checklist-')) {
      try {
        const state = JSON.parse(localStorage.getItem(key) || '[]');
        if (state.every(Boolean) && state.length > 0) count++;
      } catch(e) {}
    }
  }
  return count;
}

export function ProgressBar({ level, totalLessons }: { level: number, totalLessons: number }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const count = getCompletedLessonsCount();
    setCompleted(Math.min(count, totalLessons));
  }, [totalLessons]);

  const percent = useMemo(() => 
    totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100),
    [completed, totalLessons]
  );

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Прогресс</span>
        <span>{completed} / {totalLessons} ({percent}%)</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
