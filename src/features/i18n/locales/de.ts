import type { Locale } from './zh';

export const de: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'Importieren',
    export: 'Word Export',
    copyHtml: 'HTML kopieren',
    clear: 'Löschen',
    sample: 'Beispiel',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} Zeichen',
    placeholder: 'Markdown-Inhalt hier eingeben oder einfügen...',
  },

  // Preview
  preview: {
    title: 'Vorschau',
    subtitle: 'LaTeX & Code-Hervorhebung',
  },

  // Export dialog
  export: {
    title: 'Export-Einstellungen',
    fileName: 'Dateiname',
    fileNamePlaceholder: 'Dateiname eingeben',
    pageSize: 'Seitengröße',
    cancel: 'Abbrechen',
    confirm: 'Exportieren',
    generating: 'Word-Dokument wird erstellt...',
    success: 'Dokument erfolgreich exportiert!',
    failed: 'Export fehlgeschlagen',
    noContent: 'Bitte geben Sie zuerst Inhalt ein',
  },

  // Import
  import: {
    success: 'Geladen: {name}',
    failed: 'Datei konnte nicht gelesen werden',
    invalidType: 'Bitte wählen Sie eine Markdown-Datei (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Markdown-Datei hier ablegen',
  },

  // Toast messages
  toast: {
    cleared: 'Inhalt gelöscht',
    sampleLoaded: 'Beispiel geladen',
    htmlCopied: 'HTML in Zwischenablage kopiert!',
    copyFailed: 'Kopieren fehlgeschlagen',
  },

  // Collaboration
  collaboration: {
    title: 'Zusammenarbeit',
    yourName: 'Ihr Name',
    roomId: 'Raum-ID (optional)',
    createRoom: 'Raum erstellen',
    joinRoom: 'Raum beitreten',
    leaveRoom: 'Raum verlassen',
    online: 'Online',
    roomCreated: 'Raum erstellt: {id}',
    roomIdCopied: 'Raum-ID kopiert!',
    leftRoom: 'Raum verlassen',
    enterName: 'Bitte geben Sie Ihren Namen ein',
    enterRoomId: 'Bitte geben Sie die Raum-ID ein',
    status: {
      connected: 'Verbunden',
      connecting: 'Verbinde...',
      disconnected: 'Getrennt',
      error: 'Fehler',
    },
  },

  // Theme
  theme: {
    light: 'Hell',
    dark: 'Dunkel',
    switchTo: 'Zu {theme} Modus wechseln',
  },

  // Editor toolbar
  editorToolbar: {
    bold: 'Fett',
    italic: 'Kursiv',
    strikethrough: 'Durchgestrichen',
    inlineCode: 'Inline-Code',
    link: 'Link',
    image: 'Bild',
    heading1: 'Überschrift 1',
    heading2: 'Überschrift 2',
    heading3: 'Überschrift 3',
    bulletList: 'Aufzählung',
    numberedList: 'Nummerierte Liste',
    taskList: 'Aufgabenliste',
    quote: 'Zitat',
    divider: 'Trennlinie',
    table: 'Tabelle',
    codeBlock: 'Codeblock',
    math: 'Mathematische Formel',
  },

  // Conflict resolution
  conflict: {
    title: 'Dokumentkonflikt erkannt',
    description:
      'Ihre Offline-Bearbeitungen unterscheiden sich von der Remote-Version. Bitte wählen Sie, wie Sie fortfahren möchten:',
    local: 'Lokal',
    remote: 'Remote',
    localVersion: 'Offline-Bearbeitungen',
    remoteVersion: 'Aktuelle Remote-Version',
    lines: 'Zeilen',
    linesAdded: 'Zeilen hinzugefügt',
    linesRemoved: 'Zeilen entfernt',
    downloadLocal: 'Lokale Kopie herunterladen',
    useRemote: 'Remote-Version verwenden',
    mergeEdit: 'Manuell zusammenführen',
    downloadSuccess: 'Lokale Kopie heruntergeladen',
    syncedRemote: 'Mit Remote-Version synchronisiert',
    copyAll: 'Alles kopieren',
  },
};
