import { useCallback, useState, useRef, useMemo } from 'react';
import { useStore } from './store';
import { ThemeProvider } from './features/theme';
import { CollaborationProvider } from './features/collaboration';
import { I18nProvider, useI18n } from './features/i18n';
import { generateDocx } from './features/docx-export';
import { parseMarkdown } from './features/markdown';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { Preview } from './components/editor/Preview';
import { Toolbar } from './components/editor/Toolbar';
import { FileDropZone } from './components/editor/FileDropZone';
import { Toast } from './components/common/Toast';
import { ExportDialog } from './components/common/ExportDialog';
import { CollaboratorList } from './components/collaboration/CollaboratorList';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { saveAs } from 'file-saver';
import './styles/globals.css';
import styles from './App.module.css';

const SAMPLE_MARKDOWN = `# Markdown to Word Converter

## Features

This tool supports:

- **Bold** and *italic* text
- Code blocks with syntax highlighting
- Mathematical formulas: $E = mc^2$
- Tables and lists

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table Example

| Feature | Status |
|---------|--------|
| Markdown parsing | ✅ |
| Code highlighting | ✅ |
| Math formulas | ✅ |
| Word export | ✅ |

## Math Formula

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

> This is a blockquote with some important information.

---

Enjoy using md2docx!
`;

function getDefaultFileName(fileName: string | null, content: string): string {
  // If we have a loaded file name, use it without extension
  if (fileName) {
    return fileName.replace(/\.(md|markdown|txt)$/i, '');
  }

  // Try to extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    // Clean up the title for use as filename
    return titleMatch[1]
      .trim()
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename chars
      .substring(0, 50); // Limit length
  }

  // Default name with timestamp
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `document_${dateStr}`;
}

function AppContent() {
  const { t } = useI18n();
  const content = useStore((state) => state.editor.content);
  const fileName = useStore((state) => state.editor.fileName);
  const setContent = useStore((state) => state.setContent);
  const setFileName = useStore((state) => state.setFileName);
  const showToast = useStore((state) => state.showToast);
  const exportOptions = useStore((state) => state.settings.exportOptions);

  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportClick = useCallback(() => {
    if (!content.trim()) {
      showToast(t('export.noContent'), 'warning');
      return;
    }
    setExportDialogOpen(true);
  }, [content, showToast, t]);

  const handleExport = useCallback(
    async (exportFileName: string) => {
      try {
        showToast(t('export.generating'), 'info');
        const blob = await generateDocx(content, {
          pageSize: exportOptions.pageSize,
          margins: exportOptions.margins,
          defaultFont: exportOptions.fontFamily,
          defaultFontSize: exportOptions.fontSize * 2,
        });
        saveAs(blob, exportFileName);
        showToast(t('export.success'), 'success');
      } catch (error) {
        console.error('Export error:', error);
        showToast(t('export.failed'), 'error');
      }
    },
    [content, exportOptions, showToast, t]
  );

  const handleCopyHtml = useCallback(async () => {
    if (!content.trim()) {
      showToast(t('export.noContent'), 'warning');
      return;
    }

    try {
      const html = parseMarkdown(content);
      await navigator.clipboard.writeText(html);
      showToast(t('toast.htmlCopied'), 'success');
    } catch (error) {
      showToast(t('toast.copyFailed'), 'error');
    }
  }, [content, showToast, t]);

  const handleClear = useCallback(() => {
    setContent('');
    setFileName(null);
    showToast(t('toast.cleared'), 'info');
  }, [setContent, setFileName, showToast, t]);

  const handleLoadSample = useCallback(() => {
    setContent(SAMPLE_MARKDOWN);
    setFileName(null);
    showToast(t('toast.sampleLoaded'), 'success');
  }, [setContent, setFileName, showToast, t]);

  const handleImport = useCallback(
    (file: File) => {
      if (
        !file.name.endsWith('.md') &&
        !file.name.endsWith('.markdown') &&
        !file.name.endsWith('.txt')
      ) {
        showToast(t('import.invalidType'), 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setContent(fileContent);
        setFileName(file.name);
        showToast(t('import.success', { name: file.name }), 'success');
      };
      reader.onerror = () => {
        showToast(t('import.failed'), 'error');
      };
      reader.readAsText(file);
    },
    [setContent, setFileName, showToast, t]
  );

  const defaultExportName = getDefaultFileName(fileName, content);

  // Handle file input change for keyboard shortcut
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImport(file);
        e.target.value = '';
      }
    },
    [handleImport]
  );

  // Keyboard shortcuts
  const shortcutHandlers = useMemo(
    () => ({
      onSave: handleExportClick,
      onOpen: () => fileInputRef.current?.click(),
      onCopy: handleCopyHtml,
    }),
    [handleExportClick, handleCopyHtml]
  );
  useKeyboardShortcuts(shortcutHandlers);

  return (
    <FileDropZone>
      {/* Hidden file input for keyboard shortcut */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <div className={styles.app}>
        <Toolbar
          onExport={handleExportClick}
          onCopyHtml={handleCopyHtml}
          onClear={handleClear}
          onLoadSample={handleLoadSample}
          onImport={handleImport}
        />
        <div className={styles.main}>
          <div className={styles.editorContainer}>
            <MarkdownEditor className={styles.editor} />
            <Preview className={styles.preview} />
          </div>
        </div>
        <CollaboratorList />
        <Toast />
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          onExport={handleExport}
          defaultFileName={defaultExportName}
        />
      </div>
    </FileDropZone>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CollaborationProvider>
          <AppContent />
        </CollaborationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
