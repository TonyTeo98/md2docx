import { useState, useEffect } from 'react';
import { useI18n } from '../../../features/i18n';
import { Button } from '../Button';
import styles from './ExportDialog.module.css';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (fileName: string) => void;
  defaultFileName: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  defaultFileName,
}) => {
  const { t } = useI18n();
  const [fileName, setFileName] = useState(defaultFileName);

  useEffect(() => {
    setFileName(defaultFileName);
  }, [defaultFileName, isOpen]);

  if (!isOpen) return null;

  const handleExport = () => {
    const name = fileName.trim() || defaultFileName;
    onExport(name.endsWith('.docx') ? name : `${name}.docx`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExport();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{t('export.title')}</h2>

        <div className={styles.field}>
          <label className={styles.label}>{t('export.fileName')}</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('export.fileNamePlaceholder')}
              className={styles.input}
              autoFocus
            />
            <span className={styles.extension}>.docx</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            {t('export.cancel')}
          </Button>
          <Button variant="primary" onClick={handleExport}>
            {t('export.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
