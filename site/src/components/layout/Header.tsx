'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
          🚀 DevOps Lessons
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/level1" className="hover:text-primary transition-colors">Level 1</Link>
          <span className="text-gray-400 cursor-not-allowed">Level 2</span>
          <span className="text-gray-400 cursor-not-allowed">Level 3</span>
          <Link href="/glossary" className="hover:text-primary transition-colors">Глоссарий</Link>
          <Link href="/about" className="hover:text-primary transition-colors">О курсе</Link>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            aria-label="Открыть меню"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <nav className="md:hidden border-t dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-4">
          <Link href="/level1" className="block hover:text-primary transition-colors">Level 1</Link>
          <span className="block text-gray-400 cursor-not-allowed">Level 2</span>
          <span className="block text-gray-400 cursor-not-allowed">Level 3</span>
          <Link href="/glossary" className="block hover:text-primary transition-colors">Глоссарий</Link>
          <Link href="/about" className="block hover:text-primary transition-colors">О курсе</Link>
        </nav>
      )}
    </header>
  );
}
