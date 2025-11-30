import type { Locale } from './zh';

export const en: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'Import',
    export: 'Export Word',
    copyHtml: 'Copy HTML',
    clear: 'Clear',
    sample: 'Sample',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} chars',
    placeholder: 'Enter or paste Markdown content here...',
  },

  // Preview
  preview: {
    title: 'Preview',
    subtitle: 'LaTeX & Code Highlight',
  },

  // Export dialog
  export: {
    title: 'Export Settings',
    fileName: 'File Name',
    fileNamePlaceholder: 'Enter file name',
    pageSize: 'Page Size',
    cancel: 'Cancel',
    confirm: 'Export',
    generating: 'Generating Word document...',
    success: 'Document exported successfully!',
    failed: 'Export failed',
    noContent: 'Please enter some content first',
  },

  // Import
  import: {
    success: 'Loaded: {name}',
    failed: 'Failed to read file',
    invalidType: 'Please select a Markdown file (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Drop Markdown file here',
  },

  // Toast messages
  toast: {
    cleared: 'Content cleared',
    sampleLoaded: 'Sample loaded',
    htmlCopied: 'HTML copied to clipboard!',
    copyFailed: 'Copy failed',
  },

  // Collaboration
  collaboration: {
    title: 'Collaboration',
    yourName: 'Your name',
    roomId: 'Room ID (optional)',
    createRoom: 'Create Room',
    joinRoom: 'Join Room',
    leaveRoom: 'Leave Room',
    online: 'Online',
    roomCreated: 'Room created: {id}',
    roomIdCopied: 'Room ID copied!',
    leftRoom: 'Left the room',
    enterName: 'Please enter your name',
    enterRoomId: 'Please enter room ID',
    status: {
      connected: 'Connected',
      connecting: 'Connecting',
      disconnected: 'Disconnected',
      error: 'Error',
    },
  },

  // Theme
  theme: {
    light: 'Light',
    dark: 'Dark',
    switchTo: 'Switch to {theme} mode',
  },

  // Editor toolbar
  editorToolbar: {
    bold: 'Bold',
    italic: 'Italic',
    strikethrough: 'Strikethrough',
    inlineCode: 'Inline Code',
    link: 'Link',
    image: 'Image',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bulletList: 'Bullet List',
    numberedList: 'Numbered List',
    taskList: 'Task List',
    quote: 'Quote',
    divider: 'Divider',
    table: 'Table',
    codeBlock: 'Code Block',
    math: 'Math Formula',
  },

  // Conflict resolution
  conflict: {
    title: 'Document Conflict Detected',
    description:
      'Your offline edits differ from the remote version. Please choose how to proceed:',
    local: 'Local',
    remote: 'Remote',
    localVersion: 'Offline Edits',
    remoteVersion: 'Current Remote',
    lines: 'lines',
    linesAdded: 'lines added',
    linesRemoved: 'lines removed',
    downloadLocal: 'Download Local Copy',
    useRemote: 'Use Remote Version',
    mergeEdit: 'Merge Manually',
    downloadSuccess: 'Local copy downloaded',
    syncedRemote: 'Synced to remote version',
    copyAll: 'Copy All',
  },
};
