import { marked } from 'marked';
import { extractMath, restoreMath } from './extensions/mathExtension';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

export function parseMarkdown(markdown: string): string {
  // Step 1: Extract math expressions and replace with placeholders
  const { text: textWithPlaceholders, store } = extractMath(markdown);

  // Step 2: Parse markdown (math is protected by placeholders)
  const html = marked.parse(textWithPlaceholders, { async: false }) as string;

  // Step 3: Restore math expressions with KaTeX rendering
  const result = restoreMath(html, store);

  return result;
}

export function parseMarkdownAsync(markdown: string): Promise<string> {
  return new Promise((resolve) => {
    const { text: textWithPlaceholders, store } = extractMath(markdown);
    marked.parse(textWithPlaceholders, { async: true }).then((html) => {
      resolve(restoreMath(html, store));
    });
  });
}
