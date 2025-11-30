/**
 * Application-wide constants
 */

/** Maximum file size for import (in bytes) */
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/** Allowed file extensions for markdown import */
export const ALLOWED_FILE_EXTENSIONS = ['.md', '.markdown', '.txt'] as const;

/** Allowed MIME types for markdown import */
export const ALLOWED_MIME_TYPES = ['text/markdown', 'text/plain', ''] as const;

/**
 * Check if a file has a valid extension
 */
export function hasValidExtension(fileName: string): boolean {
  return ALLOWED_FILE_EXTENSIONS.some((ext) =>
    fileName.toLowerCase().endsWith(ext)
  );
}

/**
 * Check if a file has a valid MIME type
 */
export function hasValidMimeType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}
