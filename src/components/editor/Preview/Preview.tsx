import { useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../../store';
import { useI18n } from '../../../features/i18n';
import { parseMarkdown, highlightCode } from '../../../features/markdown';
import styles from './Preview.module.css';

interface PreviewProps {
  className?: string;
}

export const Preview: React.FC<PreviewProps> = ({ className }) => {
  const { t } = useI18n();
  const previewRef = useRef<HTMLDivElement>(null);
  const content = useStore((state) => state.editor.content);
  const previewFontSize = useStore((state) => state.settings.previewFontSize);

  const htmlContent = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  useEffect(() => {
    if (!previewRef.current) return;
    highlightCode(previewRef.current);
  }, [htmlContent]);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          <span className={styles.titleIcon}>👁️</span>
          {t('preview.title')}
        </span>
        <span className={styles.subtitle}>{t('preview.subtitle')}</span>
      </div>
      <div
        ref={previewRef}
        className={styles.content}
        style={{ fontSize: `${previewFontSize}px` }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default Preview;
