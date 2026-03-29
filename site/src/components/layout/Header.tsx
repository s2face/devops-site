import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Menu } from 'lucide-react';

export function Header() {
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
          <button aria-label="Menu" className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
