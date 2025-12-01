import { useCallback, useState, useRef, useMemo } from 'react';
import { useStore } from './store';
import { ThemeProvider } from './features/theme';
import { CollaborationProvider, useCollaboration } from './features/collaboration';
import { I18nProvider, useI18n } from './features/i18n';
import { generateDocx } from './features/docx-export';
import { parseMarkdown } from './features/markdown';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { Preview } from './components/editor/Preview';
import { Toolbar } from './components/editor/Toolbar';
import { FileDropZone } from './components/editor/FileDropZone';
import { Toast } from './components/common/Toast';
import { ExportDialog } from './components/common/ExportDialog';
import { ConflictDialog } from './components/common/ConflictDialog';
import { CollaboratorList } from './components/collaboration/CollaboratorList';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { copyToClipboard, MAX_FILE_SIZE, hasValidExtension, hasValidMimeType } from './utils';
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
  const { conflict, resolveConflict, yText, isConnected } = useCollaboration();

  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [mergeLocalContent, setMergeLocalContent] = useState('');
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
      const ok = await copyToClipboard(html);
      showToast(ok ? t('toast.htmlCopied') : t('toast.copyFailed'), ok ? 'success' : 'warning');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Copy HTML failed:', error);
      }
      showToast(t('toast.copyFailed'), 'error');
    }
  }, [content, showToast, t]);

  const handleClear = useCallback(() => {
    // 在协作模式下，需要清除 yText
    if (isConnected && yText) {
      yText.delete(0, yText.length);
    }
    setContent('');
    setFileName(null);
    showToast(t('toast.cleared'), 'info');
  }, [isConnected, yText, setContent, setFileName, showToast, t]);

  const handleLoadSample = useCallback(() => {
    // 在协作模式下，需要更新 yText
    if (isConnected && yText) {
      yText.delete(0, yText.length);
      yText.insert(0, SAMPLE_MARKDOWN);
    }
    setContent(SAMPLE_MARKDOWN);
    setFileName(null);
    showToast(t('toast.sampleLoaded'), 'success');
  }, [isConnected, yText, setContent, setFileName, showToast, t]);

  const handleImport = useCallback(
    (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        showToast(`File exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB`, 'warning');
        return;
      }
      if (!hasValidExtension(file.name)) {
        showToast(t('import.invalidType'), 'warning');
        return;
      }
      if (file.type && !hasValidMimeType(file.type)) {
        showToast(t('import.invalidType'), 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        // 在协作模式下，需要更新 yText
        if (isConnected && yText) {
          yText.delete(0, yText.length);
          yText.insert(0, fileContent);
        }
        setContent(fileContent);
        setFileName(file.name);
        showToast(t('import.success', { name: file.name }), 'success');
      };
      reader.onerror = () => {
        if (import.meta.env.DEV) {
          console.error('File read error:', reader.error);
        }
        showToast(t('import.failed'), 'error');
      };
      reader.readAsText(file);
    },
    [isConnected, yText, setContent, setFileName, showToast, t]
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

  // Conflict resolution handlers
  const handleDownloadLocal = useCallback(() => {
    if (!conflict) return;
    const blob = new Blob([conflict.localContent], { type: 'text/markdown' });
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    saveAs(blob, `local_backup_${timestamp}.md`);
    showToast(t('conflict.downloadSuccess'), 'success');
    // After download, use remote version
    resolveConflict(true);
    showToast(t('conflict.syncedRemote'), 'info');
  }, [conflict, resolveConflict, showToast, t]);

  const handleUseRemote = useCallback(() => {
    resolveConflict(true);
    showToast(t('conflict.syncedRemote'), 'success');
  }, [resolveConflict, showToast, t]);

  const handleMergeEdit = useCallback(() => {
    if (!conflict) return;
    // Store local content for reference and close dialog
    setMergeLocalContent(conflict.localContent);
    setIsMergeMode(true);
    // Use remote as base, user can manually copy from local
    resolveConflict(true);
  }, [conflict, resolveConflict]);

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
        <ConflictDialog
          isOpen={!!conflict}
          conflict={conflict}
          onUseRemote={handleUseRemote}
          onDownloadLocal={handleDownloadLocal}
          onMergeEdit={handleMergeEdit}
        />
        {/* Merge mode: show local content reference panel */}
        {isMergeMode && mergeLocalContent && (
          <div className={styles.mergePanel}>
            <div className={styles.mergePanelHeader}>
              <span>{t('conflict.localVersion')}</span>
              <div className={styles.mergePanelActions}>
                <button
                  className={styles.mergePanelBtn}
                  onClick={async () => {
                    await copyToClipboard(mergeLocalContent);
                    showToast(t('toast.htmlCopied'), 'success');
                  }}
                >
                  📋 {t('conflict.copyAll')}
                </button>
                <button
                  className={styles.mergePanelClose}
                  onClick={() => {
                    setIsMergeMode(false);
                    setMergeLocalContent('');
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            <pre className={styles.mergePanelContent}>{mergeLocalContent}</pre>
          </div>
        )}
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
