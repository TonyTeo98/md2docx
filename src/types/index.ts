// Editor types
export interface CursorPosition {
  line: number;
  column: number;
}

export interface SelectionRange {
  start: CursorPosition;
  end: CursorPosition;
}

export interface EditorState {
  content: string;
  cursorPosition: CursorPosition;
  selection: SelectionRange | null;
  isDirty: boolean;
  fileName: string | null;
}

// Collaboration types
export interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor: CursorPosition | null;
  selection: SelectionRange | null;
  isActive: boolean;
}

export interface CollaborationState {
  roomId: string | null;
  isConnected: boolean;
  collaborators: Collaborator[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

// Theme types
export type Theme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  destructive: string;
  success: string;
}

// Export types
export interface ExportOptions {
  format: 'docx' | 'pdf' | 'html';
  includeStyles: boolean;
  pageSize: 'A4' | 'Letter';
  margins: MarginConfig;
  fontFamily: string;
  fontSize: number;
}

export interface MarginConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// UI types
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Language types
export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'pt' | 'ru';

// Settings types
export interface SettingsState {
  theme: Theme;
  language: Language;
  exportOptions: ExportOptions;
  editorFontSize: number;
  previewFontSize: number;
}

// UI State
export interface UIState {
  toast: Toast | null;
  isExportDialogOpen: boolean;
  isSidebarOpen: boolean;
  isCollaborationPanelOpen: boolean;
}
