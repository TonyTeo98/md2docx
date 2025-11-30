import { useEffect, useRef, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { yCollab } from 'y-codemirror.next';
import * as Y from 'yjs';
import { useStore } from '../../../store';
import { useI18n } from '../../../features/i18n';
import { useCollaboration } from '../../../features/collaboration';
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
  const { yText, awareness, isConnected } = useCollaboration();
  const undoManagerRef = useRef<Y.UndoManager | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      basicSetup,
      markdown(),
      keymap.of([...defaultKeymap, indentWithTab]),
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

    if (isConnected && yText && awareness) {
      // yjs 协同插件
      undoManagerRef.current = new Y.UndoManager(yText);
      extensions.push(yCollab(yText, awareness, { undoManager: undoManagerRef.current }));
    } else {
      // 本地单机模式，用 updateListener 写入 store
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            setContent(newContent);
          }
        })
      );
    }

    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: isConnected && yText ? yText.toString() : content,
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
  }, [theme, editorFontSize, isConnected, yText]);

  useEffect(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;

    // 当未连接协作时，同步 store 内容到编辑器；连接协作后由 yjs 管理
    if (!isConnected) {
      const currentContent = view.state.doc.toString();
      if (currentContent !== content) {
        view.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content,
          },
        });
      }
    }
  }, [content, isConnected]);

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
