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
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Toolbar;
