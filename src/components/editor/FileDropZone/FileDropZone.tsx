import React, { useState, useCallback, useRef } from 'react';
import { useStore } from '../../../store';
import styles from './FileDropZone.module.css';

interface FileDropZoneProps {
  children: React.ReactNode;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const setContent = useStore((state) => state.setContent);
  const setFileName = useStore((state) => state.setFileName);
  const showToast = useStore((state) => state.showToast);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (
          file.name.endsWith('.md') ||
          file.name.endsWith('.markdown') ||
          file.name.endsWith('.txt')
        ) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            setContent(content);
            setFileName(file.name);
            showToast(`Loaded: ${file.name}`, 'success');
          };
          reader.onerror = () => {
            showToast('Failed to read file', 'error');
          };
          reader.readAsText(file);
        } else {
          showToast('Please drop a Markdown file (.md, .markdown, .txt)', 'warning');
        }
      }
    },
    [setContent, setFileName, showToast]
  );

  return (
    <div
      className={styles.container}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className={styles.overlay}>
          <div className={styles.dropMessage}>
            <span className={styles.icon}>📄</span>
            <span>Drop Markdown file here</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
