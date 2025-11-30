import { useI18n } from '../../../features/i18n';
import styles from './EditorToolbar.module.css';

interface EditorToolbarProps {
  onInsert: (text: string, cursorOffset?: number) => void;
}

interface ToolbarItem {
  icon: string;
  label: string;
  action: () => void;
  title?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onInsert }) => {
  const { t } = useI18n();

  const tools: ToolbarItem[] = [
    {
      icon: 'B',
      label: t('editorToolbar.bold'),
      action: () => onInsert('****', -2),
      title: 'Ctrl+B',
    },
    {
      icon: 'I',
      label: t('editorToolbar.italic'),
      action: () => onInsert('**', -1),
      title: 'Ctrl+I',
    },
    {
      icon: 'S',
      label: t('editorToolbar.strikethrough'),
      action: () => onInsert('~~~~', -2),
    },
    {
      icon: '``',
      label: t('editorToolbar.inlineCode'),
      action: () => onInsert('``', -1),
    },
    {
      icon: '🔗',
      label: t('editorToolbar.link'),
      action: () => onInsert('[](url)', -5),
    },
    {
      icon: '🖼️',
      label: t('editorToolbar.image'),
      action: () => onInsert('![alt](url)', -5),
    },
    {
      icon: 'H1',
      label: t('editorToolbar.heading1'),
      action: () => onInsert('# '),
    },
    {
      icon: 'H2',
      label: t('editorToolbar.heading2'),
      action: () => onInsert('## '),
    },
    {
      icon: 'H3',
      label: t('editorToolbar.heading3'),
      action: () => onInsert('### '),
    },
    {
      icon: '•',
      label: t('editorToolbar.bulletList'),
      action: () => onInsert('- '),
    },
    {
      icon: '1.',
      label: t('editorToolbar.numberedList'),
      action: () => onInsert('1. '),
    },
    {
      icon: '☑',
      label: t('editorToolbar.taskList'),
      action: () => onInsert('- [ ] '),
    },
    {
      icon: '❝',
      label: t('editorToolbar.quote'),
      action: () => onInsert('> '),
    },
    {
      icon: '—',
      label: t('editorToolbar.divider'),
      action: () => onInsert('\n---\n'),
    },
    {
      icon: '📊',
      label: t('editorToolbar.table'),
      action: () => onInsert('| Header | Header |\n|--------|--------|\n| Cell   | Cell   |\n'),
    },
    {
      icon: '{ }',
      label: t('editorToolbar.codeBlock'),
      action: () => onInsert('```\n\n```', -4),
    },
    {
      icon: '∑',
      label: t('editorToolbar.math'),
      action: () => onInsert('$$\n\n$$', -3),
    },
  ];

  return (
    <div className={styles.toolbar}>
      {tools.map((tool, index) => (
        <button
          key={index}
          className={styles.toolButton}
          onClick={tool.action}
          title={tool.title || tool.label}
          type="button"
        >
          <span className={styles.icon}>{tool.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default EditorToolbar;
