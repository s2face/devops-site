export const metadata = {
  title: 'О курсе - DevOps Lessons',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl prose prose-invert">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">О курсе</h1>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        DevOps Lessons — это структурированная база знаний для инженеров любого уровня. 
        Наша цель — собрать лучшие практики и инструменты в одном месте, предоставив их в 
        удобном для изучения формате.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Методология</h2>
      <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-600 dark:text-gray-300">
        <li><strong>Практика превыше всего.</strong> Поменьше воды, побольше реальных примеров из продакшена.</li>
        <li><strong>Итеративность.</strong> Материалы разбиты на уровни (Level 1, 2, 3), от простого к сложному.</li>
        <li><strong>Проверка знаний.</strong> Каждый урок сопровождается интерактивным чек-листом.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Как проходить курс?</h2>
      <ol className="list-decimal pl-6 mb-8 space-y-2 text-gray-600 dark:text-gray-300">
        <li>Выберите свой уровень. Для новичков рекомендуем начать с Level 1.</li>
        <li>Читайте уроки последовательно, следуя навигационной диаграмме.</li>
        <li>Отмечайте пройденные пункты в чек-листах (состояние сохраняется в вашем браузере).</li>
        <li>Используйте глоссарий для поиска незнакомых терминов.</li>
      </ol>
    </main>
  );
}
