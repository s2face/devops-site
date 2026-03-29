import { createHighlighter } from 'shiki';
import { CopyButton } from './CopyButton';

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['bash', 'yaml', 'dockerfile', 'typescript', 'javascript', 'python', 'go', 'json', 'toml'],
    }).catch((error) => {
      console.error('Failed to initialize Shiki highlighter:', error);
      throw error;
    });
  }
  return highlighterPromise;
}

export async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  try {
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
  } catch (error) {
    console.error(`Failed to highlight code block for language "${lang}":`, error);
    return (
      <pre className="font-mono text-sm my-6 rounded-lg overflow-x-auto p-4 bg-[#24292e] text-gray-200">
        <code>{code}</code>
      </pre>
    );
  }
}
