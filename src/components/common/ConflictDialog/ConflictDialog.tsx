import { useMemo } from 'react';
import { useI18n } from '../../../features/i18n';
import { Button } from '../Button';
import styles from './ConflictDialog.module.css';

export interface ConflictData {
  localContent: string;
  remoteContent: string;
  roomId: string;
}

interface ConflictDialogProps {
  isOpen: boolean;
  conflict: ConflictData | null;
  onUseRemote: () => void;
  onDownloadLocal: () => void;
  onMergeEdit: () => void;
}

function computeDiffStats(local: string, remote: string) {
  const localLines = local.split('\n');
  const remoteLines = remote.split('\n');

  // Simple diff: count lines that are different
  const localSet = new Set(localLines);
  const remoteSet = new Set(remoteLines);

  let added = 0;
  let removed = 0;

  for (const line of localLines) {
    if (!remoteSet.has(line)) {
      added++;
    }
  }

  for (const line of remoteLines) {
    if (!localSet.has(line)) {
      removed++;
    }
  }

  return { added, removed, localLines: localLines.length, remoteLines: remoteLines.length };
}

function truncatePreview(content: string, maxLines = 50): string {
  const lines = content.split('\n');
  if (lines.length <= maxLines) {
    return content;
  }
  return lines.slice(0, maxLines).join('\n') + `\n\n... (${lines.length - maxLines} more lines)`;
}

export const ConflictDialog: React.FC<ConflictDialogProps> = ({
  isOpen,
  conflict,
  onUseRemote,
  onDownloadLocal,
  onMergeEdit,
}) => {
  const { t } = useI18n();

  const diffStats = useMemo(() => {
    if (!conflict) return null;
    return computeDiffStats(conflict.localContent, conflict.remoteContent);
  }, [conflict]);

  if (!isOpen || !conflict) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Don't close on overlay click - user must make a choice
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.warningIcon}>⚠️</span>
          <h2 className={styles.title}>{t('conflict.title')}</h2>
        </div>

        <p className={styles.description}>{t('conflict.description')}</p>

        {diffStats && (
          <div className={styles.diffStats}>
            <span className={`${styles.diffStat} ${styles.addedStat}`}>
              +{diffStats.added} {t('conflict.linesAdded')}
            </span>
            <span className={`${styles.diffStat} ${styles.removedStat}`}>
              -{diffStats.removed} {t('conflict.linesRemoved')}
            </span>
          </div>
        )}

        <div className={styles.previewContainer}>
          <div className={styles.previewPanel}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTitle}>
                <span className={`${styles.previewBadge} ${styles.localBadge}`}>
                  {t('conflict.local')}
                </span>
                {t('conflict.localVersion')}
              </span>
              <span className={styles.previewStats}>
                {diffStats?.localLines} {t('conflict.lines')}
              </span>
            </div>
            <pre className={styles.previewContent}>
              {truncatePreview(conflict.localContent)}
            </pre>
          </div>

          <div className={styles.previewPanel}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTitle}>
                <span className={`${styles.previewBadge} ${styles.remoteBadge}`}>
                  {t('conflict.remote')}
                </span>
                {t('conflict.remoteVersion')}
              </span>
              <span className={styles.previewStats}>
                {diffStats?.remoteLines} {t('conflict.lines')}
              </span>
            </div>
            <pre className={styles.previewContent}>
              {truncatePreview(conflict.remoteContent)}
            </pre>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onDownloadLocal}>
            <span className={styles.actionButton}>
              📥 {t('conflict.downloadLocal')}
            </span>
          </Button>
          <Button variant="outline" onClick={onMergeEdit}>
            <span className={styles.actionButton}>
              ✏️ {t('conflict.mergeEdit')}
            </span>
          </Button>
          <Button variant="primary" onClick={onUseRemote}>
            <span className={styles.actionButton}>
              ☁️ {t('conflict.useRemote')}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConflictDialog;
