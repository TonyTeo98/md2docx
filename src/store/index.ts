import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  EditorState,
  CollaborationState,
  SettingsState,
  UIState,
  Theme,
  Language,
  ToastType,
  Collaborator,
  CursorPosition,
  ExportOptions,
} from '../types';

interface AppState {
  editor: EditorState;
  collaboration: CollaborationState;
  settings: SettingsState;
  ui: UIState;

  // Editor actions
  setContent: (content: string) => void;
  setCursorPosition: (position: CursorPosition) => void;
  setFileName: (name: string | null) => void;
  setDirty: (isDirty: boolean) => void;

  // Collaboration actions
  setRoomId: (roomId: string | null) => void;
  setConnectionStatus: (status: CollaborationState['connectionStatus']) => void;
  updateCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (id: string) => void;
  clearCollaborators: () => void;

  // Settings actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setExportOptions: (options: Partial<ExportOptions>) => void;
  setEditorFontSize: (size: number) => void;
  setPreviewFontSize: (size: number) => void;

  // UI actions
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  setExportDialogOpen: (open: boolean) => void;
  setCollaborationPanelOpen: (open: boolean) => void;
}

const initialEditorState: EditorState = {
  content: '',
  cursorPosition: { line: 0, column: 0 },
  selection: null,
  isDirty: false,
  fileName: null,
};

const initialCollaborationState: CollaborationState = {
  roomId: null,
  isConnected: false,
  collaborators: [],
  connectionStatus: 'disconnected',
};

const initialSettingsState: SettingsState = {
  theme: 'light',
  language: 'zh',
  exportOptions: {
    format: 'docx',
    includeStyles: true,
    pageSize: 'A4',
    margins: { top: 72, right: 72, bottom: 72, left: 72 },
    fontFamily: 'SimSun',
    fontSize: 12,
  },
  editorFontSize: 14,
  previewFontSize: 16,
};

const initialUIState: UIState = {
  toast: null,
  isExportDialogOpen: false,
  isSidebarOpen: true,
  isCollaborationPanelOpen: false,
};

export const useStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        editor: initialEditorState,
        collaboration: initialCollaborationState,
        settings: initialSettingsState,
        ui: initialUIState,

        // Editor actions
        setContent: (content) =>
          set((state) => {
            state.editor.content = content;
            state.editor.isDirty = true;
          }),

        setCursorPosition: (position) =>
          set((state) => {
            state.editor.cursorPosition = position;
          }),

        setFileName: (name) =>
          set((state) => {
            state.editor.fileName = name;
          }),

        setDirty: (isDirty) =>
          set((state) => {
            state.editor.isDirty = isDirty;
          }),

        // Collaboration actions
        setRoomId: (roomId) =>
          set((state) => {
            state.collaboration.roomId = roomId;
          }),

        setConnectionStatus: (status) =>
          set((state) => {
            state.collaboration.connectionStatus = status;
            state.collaboration.isConnected = status === 'connected';
          }),

        updateCollaborator: (collaborator) =>
          set((state) => {
            const index = state.collaboration.collaborators.findIndex(
              (c) => c.id === collaborator.id
            );
            if (index >= 0) {
              state.collaboration.collaborators[index] = collaborator;
            } else {
              state.collaboration.collaborators.push(collaborator);
            }
          }),

        removeCollaborator: (id) =>
          set((state) => {
            state.collaboration.collaborators =
              state.collaboration.collaborators.filter((c) => c.id !== id);
          }),

        clearCollaborators: () =>
          set((state) => {
            state.collaboration.collaborators = [];
          }),

        // Settings actions
        setTheme: (theme) =>
          set((state) => {
            state.settings.theme = theme;
          }),

        setLanguage: (language) =>
          set((state) => {
            state.settings.language = language;
          }),

        setExportOptions: (options) =>
          set((state) => {
            state.settings.exportOptions = {
              ...state.settings.exportOptions,
              ...options,
            };
          }),

        setEditorFontSize: (size) =>
          set((state) => {
            state.settings.editorFontSize = size;
          }),

        setPreviewFontSize: (size) =>
          set((state) => {
            state.settings.previewFontSize = size;
          }),

        // UI actions
        showToast: (message, type = 'info') =>
          set((state) => {
            state.ui.toast = { message, type, id: Date.now() };
          }),

        hideToast: () =>
          set((state) => {
            state.ui.toast = null;
          }),

        setExportDialogOpen: (open) =>
          set((state) => {
            state.ui.isExportDialogOpen = open;
          }),

        setCollaborationPanelOpen: (open) =>
          set((state) => {
            state.ui.isCollaborationPanelOpen = open;
          }),
      })),
      {
        name: 'md2docx-storage',
        partialize: (state) => ({
          settings: state.settings,
        }),
      }
    )
  )
);

// Selector hooks for better performance
export const useEditorContent = () => useStore((state) => state.editor.content);
export const useTheme = () => useStore((state) => state.settings.theme);
export const useCollaborators = () =>
  useStore((state) => state.collaboration.collaborators);
export const useConnectionStatus = () =>
  useStore((state) => state.collaboration.connectionStatus);
export const useToast = () => useStore((state) => state.ui.toast);
