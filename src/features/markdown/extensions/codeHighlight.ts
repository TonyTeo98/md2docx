import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import common languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

export function highlightCode(element: HTMLElement): void {
  const codeBlocks = element.querySelectorAll('pre code');

  codeBlocks.forEach((block) => {
    // Get language from class
    const className = block.className;
    const languageMatch = className.match(/language-(\w+)/);
    const language = languageMatch ? languageMatch[1] : 'plaintext';

    // Check if it's an ASCII diagram (skip highlighting)
    const code = block.textContent || '';
    if (isAsciiDiagram(code)) {
      block.parentElement?.classList.add('ascii-diagram');
      return;
    }

    // Apply Prism highlighting
    if (Prism.languages[language]) {
      block.innerHTML = Prism.highlight(
        code,
        Prism.languages[language],
        language
      );
    }
  });
}

export function highlightCodeString(code: string, language: string): string {
  if (Prism.languages[language]) {
    return Prism.highlight(code, Prism.languages[language], language);
  }
  return escapeHtml(code);
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function isAsciiDiagram(code: string): boolean {
  const boxCharCount = (code.match(/[┌┐└┘├┤┬┴┼─│▶◀▲▼→←↑↓]/g) || []).length;
  return boxCharCount > 10;
}
