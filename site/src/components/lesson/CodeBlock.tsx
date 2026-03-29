import { createHighlighter } from 'shiki';
import { CopyButton } from './CopyButton';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['bash', 'yaml', 'dockerfile', 'typescript', 'javascript', 'python', 'go', 'json', 'toml'],
    });
  }
  return highlighterPromise;
}

export async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang: lang || 'text',
    theme: 'github-dark',
  });

  return (
    <div className="relative group font-mono text-sm my-6 rounded-lg overflow-hidden">
      <div 
        className="overflow-x-auto p-4 bg-[#24292e]" 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
      <CopyButton code={code} />
    </div>
  );
}
