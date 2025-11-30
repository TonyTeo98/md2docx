import { useState, useRef, useEffect } from 'react';
import { useI18n, languageList } from '../../../features/i18n';
import type { Language } from '../../../types';
import styles from './LanguageSwitch.module.css';

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languageList.find((l) => l.code === language);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.globe}>🌐</span>
        <span className={styles.langName}>{currentLang?.name}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {languageList.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.option} ${lang.code === language ? styles.active : ''}`}
              onClick={() => handleSelect(lang.code)}
              role="option"
              aria-selected={lang.code === language}
            >
              {lang.name}
              {lang.code === language && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitch;
