export function LessonContent({ htmlContent }: { htmlContent: string }) {
  return (
    <article
      className="prose prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
