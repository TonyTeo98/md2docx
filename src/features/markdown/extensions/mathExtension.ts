import katex from 'katex';
import 'katex/dist/katex.min.css';

// Placeholder to protect math from markdown parsing
const MATH_PLACEHOLDER_PREFIX = '%%%MATH_DISPLAY_';
const MATH_PLACEHOLDER_SUFFIX = '%%%';
const INLINE_MATH_PREFIX = '%%%MATH_INLINE_';

interface MathStore {
  display: Map<string, string>;
  inline: Map<string, string>;
}

// Pre-process: Extract math and replace with placeholders
export function extractMath(text: string): { text: string; store: MathStore } {
  const store: MathStore = {
    display: new Map(),
    inline: new Map(),
  };

  let counter = 0;

  // Extract display math ($$...$$) - must come first
  let processed = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const id = `${counter++}`;
    store.display.set(id, math.trim());
    return `${MATH_PLACEHOLDER_PREFIX}${id}${MATH_PLACEHOLDER_SUFFIX}`;
  });

  // Extract inline math ($...$)
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    const id = `${counter++}`;
    store.inline.set(id, math.trim());
    return `${INLINE_MATH_PREFIX}${id}${MATH_PLACEHOLDER_SUFFIX}`;
  });

  return { text: processed, store };
}

// Post-process: Replace placeholders with rendered KaTeX
export function restoreMath(html: string, store: MathStore): string {
  let result = html;

  // Restore display math
  store.display.forEach((math, id) => {
    const placeholder = `${MATH_PLACEHOLDER_PREFIX}${id}${MATH_PLACEHOLDER_SUFFIX}`;
    // Also handle case where placeholder is wrapped in <p> tags
    const wrappedPlaceholder = `<p>${placeholder}</p>`;

    try {
      const rendered = katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
      });
      const wrappedRendered = `<div class="katex-display-wrapper">${rendered}</div>`;
      result = result.replace(wrappedPlaceholder, wrappedRendered);
      result = result.replace(placeholder, rendered);
    } catch {
      result = result.replace(wrappedPlaceholder, `<p>$$${math}$$</p>`);
      result = result.replace(placeholder, `$$${math}$$`);
    }
  });

  // Restore inline math
  store.inline.forEach((math, id) => {
    const placeholder = `${INLINE_MATH_PREFIX}${id}${MATH_PLACEHOLDER_SUFFIX}`;
    try {
      const rendered = katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000',
      });
      result = result.replaceAll(placeholder, rendered);
    } catch {
      result = result.replaceAll(placeholder, `$${math}$`);
    }
  });

  return result;
}

// Legacy function for DOM-based rendering (kept for compatibility)
export function renderMath(element: HTMLElement): void {
  // This function is now mostly a no-op since we handle math in the parsing phase
  // But we keep it for any edge cases
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent || '';

    // Skip if no math delimiters
    if (!text.includes('$')) return;

    const container = document.createElement('span');

    // Process display math ($$...$$)
    let processedText = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
        });
      } catch {
        return `$$${math}$$`;
      }
    });

    // Process inline math ($...$)
    processedText = processedText.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          errorColor: '#cc0000',
        });
      } catch {
        return `$${math}$`;
      }
    });

    if (processedText !== text) {
      container.innerHTML = processedText;
      textNode.parentNode?.replaceChild(container, textNode);
    }
  });
}

export function renderMathInString(text: string): string {
  // Process display math ($$...$$)
  let result = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        errorColor: '#cc0000',
      });
    } catch {
      return `$$${math}$$`;
    }
  });

  // Process inline math ($...$)
  result = result.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        errorColor: '#cc0000',
      });
    } catch {
      return `$${math}$`;
    }
  });

  return result;
}
