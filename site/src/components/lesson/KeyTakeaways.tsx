export function KeyTakeaways({ takeaways }: { takeaways: string[] }) {
  if (!takeaways.length) return null;
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
