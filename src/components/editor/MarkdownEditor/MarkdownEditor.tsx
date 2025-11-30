import { useEffect, useRef, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { useStore } from '../../../store';
import { useI18n } from '../../../features/i18n';
import { EditorToolbar } from '../EditorToolbar';
import styles from './MarkdownEditor.module.css';

interface MarkdownEditorProps {
  className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ className }) => {
  const { t } = useI18n();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const content = useStore((state) => state.editor.content);
  const setContent = useStore((state) => state.setContent);
  const theme = useStore((state) => state.settings.theme);
  const editorFontSize = useStore((state) => state.settings.editorFontSize);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      basicSetup,
      markdown(),
      keymap.of([...defaultKeymap, indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString();
          setContent(newContent);
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: `${editorFontSize}px`,
        },
        '.cm-scroller': {
          overflow: 'auto',
          fontFamily: "'SF Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        },
        '.cm-content': {
          padding: '16px',
        },
        '.cm-gutters': {
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          border: 'none',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'var(--border)',
        },
      }),
      EditorView.contentAttributes.of({
        'aria-label': 'Markdown editor',
      }),
    ];

    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: content,
      extensions,
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [theme, editorFontSize]);

  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content,
          },
        });
      }
    }
  }, [content]);

  // Insert text at cursor position
  const handleInsert = useCallback((text: string, cursorOffset?: number) => {
    if (!viewRef.current) return;

    const view = viewRef.current;
    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);

    // If there's selected text and the insert has a placeholder pattern
    let insertText = text;
    let newCursorPos = from + text.length;

    if (selectedText && cursorOffset !== undefined) {
      // For patterns like **text**, wrap the selected text
      const halfLen = Math.floor(text.length / 2);
      const prefix = text.slice(0, halfLen);
      const suffix = text.slice(halfLen);
      insertText = prefix + selectedText + suffix;
      newCursorPos = from + insertText.length;
    } else if (cursorOffset !== undefined) {
      newCursorPos = from + text.length + cursorOffset;
    }

    view.dispatch({
      changes: { from, to, insert: insertText },
      selection: { anchor: newCursorPos },
    });
    view.focus();
  }, []);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          <span className={styles.titleIcon}>✏️</span>
          {t('editor.title')}
        </span>
        <span className={styles.charCount}>
          {t('editor.charCount', { count: content.length })}
        </span>
      </div>
      <EditorToolbar onInsert={handleInsert} />
      <div ref={editorRef} className={styles.editor} />
    </div>
  );
};

export default MarkdownEditor;
