import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onOpen?: () => void;
  onCopy?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
      }

      if (modifier && e.key === 'o') {
        e.preventDefault();
        handlers.onOpen?.();
      }

      if (modifier && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        handlers.onCopy?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
