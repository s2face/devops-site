export function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>© {new Date().getFullYear()} DevOps Lessons. Все права защищены.</p>
        <div className="mt-4 flex justify-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на GitHub"
            className="hover:text-primary"
          >
            GitHub
          </a>
          <a href="/about" className="hover:text-primary">
            Контакты
          </a>
        </div>
      </div>
    </footer>
  );
}
