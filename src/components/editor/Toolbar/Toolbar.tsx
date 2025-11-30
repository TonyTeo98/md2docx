import { useRef } from 'react';
import { Button } from '../../common/Button';
import { ThemeToggle } from '../../common/ThemeToggle';
import { LanguageSwitch } from '../../common/LanguageSwitch';
import { useStore } from '../../../store';
import { useI18n } from '../../../features/i18n';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onExport: () => void;
  onCopyHtml: () => void;
  onClear: () => void;
  onLoadSample: () => void;
  onImport: (file: File) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onExport,
  onCopyHtml,
  onClear,
  onLoadSample,
  onImport,
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCollaborationPanelOpen = useStore(
    (state) => state.ui.isCollaborationPanelOpen
  );
  const setCollaborationPanelOpen = useStore(
    (state) => state.setCollaborationPanelOpen
  );
  const connectionStatus = useStore(
    (state) => state.collaboration.connectionStatus
  );
  const fileName = useStore((state) => state.editor.fileName);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          <span className={styles.logo}>📄</span>
          md2docx
        </h1>
        {fileName && (
          <span className={styles.fileName} title={fileName}>
            {fileName}
          </span>
        )}
      </div>

      <div className={styles.center}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* File operations group */}
        <div className={styles.buttonGroup}>
          <Button variant="outline" onClick={handleImportClick} title="Ctrl+O">
            <span>📂</span>
            <span className={styles.btnText}>{t('toolbar.import')}</span>
          </Button>
          <Button variant="primary" onClick={onExport} title="Ctrl+S">
            <span>📥</span>
            <span className={styles.btnText}>{t('toolbar.export')}</span>
          </Button>
        </div>

        <div className={styles.divider} />

        {/* Edit operations group */}
        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={onCopyHtml} title="Ctrl+Shift+C">
            <span>📋</span>
            <span className={styles.btnText}>{t('toolbar.copyHtml')}</span>
          </Button>
          <Button variant="ghost" onClick={onClear}>
            <span>🗑️</span>
            <span className={styles.btnText}>{t('toolbar.clear')}</span>
          </Button>
        </div>

        <div className={styles.divider} />

        {/* Sample */}
        <Button variant="ghost" onClick={onLoadSample}>
          <span>📝</span>
          <span className={styles.btnText}>{t('toolbar.sample')}</span>
        </Button>
      </div>

      <div className={styles.right}>
        <Button
          variant={isCollaborationPanelOpen ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCollaborationPanelOpen(!isCollaborationPanelOpen)}
          title={t('collaboration.title')}
          className={styles.collabBtn}
        >
          <span>👥</span>
          {connectionStatus === 'connected' && (
            <span className={styles.connectedDot} />
          )}
        </Button>
        <div className={styles.dividerVertical} />
        <a
          href="https://github.com/TonyTeo98/md2docx"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
          title="GitHub"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <div className={styles.dividerVertical} />
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Toolbar;
