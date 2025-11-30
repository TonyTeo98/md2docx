import { marked } from 'marked';
import DOMPurify from 'dompurify';
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

  // Step 4: Sanitize to prevent XSS
  return DOMPurify.sanitize(result, { USE_PROFILES: { html: true } });
}

export function parseMarkdownAsync(markdown: string): Promise<string> {
  return new Promise((resolve) => {
    const { text: textWithPlaceholders, store } = extractMath(markdown);
    marked.parse(textWithPlaceholders, { async: true }).then((html) => {
      const restored = restoreMath(html, store);
      resolve(DOMPurify.sanitize(restored, { USE_PROFILES: { html: true } }));
    });
  });
}
