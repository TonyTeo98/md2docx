import type { Locale } from './zh';

export const es: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'Importar',
    export: 'Exportar Word',
    copyHtml: 'Copiar HTML',
    clear: 'Limpiar',
    sample: 'Ejemplo',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} caracteres',
    placeholder: 'Ingrese o pegue contenido Markdown aquí...',
  },

  // Preview
  preview: {
    title: 'Vista previa',
    subtitle: 'LaTeX y resaltado de código',
  },

  // Export dialog
  export: {
    title: 'Configuración de exportación',
    fileName: 'Nombre del archivo',
    fileNamePlaceholder: 'Ingrese el nombre del archivo',
    pageSize: 'Tamaño de página',
    cancel: 'Cancelar',
    confirm: 'Exportar',
    generating: 'Generando documento Word...',
    success: '¡Documento exportado exitosamente!',
    failed: 'Error al exportar',
    noContent: 'Por favor ingrese contenido primero',
  },

  // Import
  import: {
    success: 'Cargado: {name}',
    failed: 'Error al leer el archivo',
    invalidType: 'Por favor seleccione un archivo Markdown (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Suelte el archivo Markdown aquí',
  },

  // Toast messages
  toast: {
    cleared: 'Contenido limpiado',
    sampleLoaded: 'Ejemplo cargado',
    htmlCopied: '¡HTML copiado al portapapeles!',
    copyFailed: 'Error al copiar',
  },

  // Collaboration
  collaboration: {
    title: 'Colaboración',
    yourName: 'Tu nombre',
    roomId: 'ID de sala (opcional)',
    createRoom: 'Crear sala',
    joinRoom: 'Unirse a sala',
    leaveRoom: 'Salir de sala',
    online: 'En línea',
    roomCreated: 'Sala creada: {id}',
    roomIdCopied: '¡ID de sala copiado!',
    leftRoom: 'Has salido de la sala',
    enterName: 'Por favor ingrese su nombre',
    enterRoomId: 'Por favor ingrese el ID de la sala',
    status: {
      connected: 'Conectado',
      connecting: 'Conectando...',
      disconnected: 'Desconectado',
      error: 'Error',
    },
  },

  // Theme
  theme: {
    light: 'Claro',
    dark: 'Oscuro',
    switchTo: 'Cambiar a modo {theme}',
  },

  // Editor toolbar
  editorToolbar: {
    bold: 'Negrita',
    italic: 'Cursiva',
    strikethrough: 'Tachado',
    inlineCode: 'Código en línea',
    link: 'Enlace',
    image: 'Imagen',
    heading1: 'Título 1',
    heading2: 'Título 2',
    heading3: 'Título 3',
    bulletList: 'Lista con viñetas',
    numberedList: 'Lista numerada',
    taskList: 'Lista de tareas',
    quote: 'Cita',
    divider: 'Separador',
    table: 'Tabla',
    codeBlock: 'Bloque de código',
    math: 'Fórmula matemática',
  },

  // Conflict resolution
  conflict: {
    title: 'Conflicto de documento detectado',
    description:
      'Tus ediciones sin conexión difieren de la versión remota. Por favor, elige cómo proceder:',
    local: 'Local',
    remote: 'Remoto',
    localVersion: 'Ediciones sin conexión',
    remoteVersion: 'Versión remota actual',
    lines: 'líneas',
    linesAdded: 'líneas añadidas',
    linesRemoved: 'líneas eliminadas',
    downloadLocal: 'Descargar copia local',
    useRemote: 'Usar versión remota',
    mergeEdit: 'Fusionar manualmente',
    downloadSuccess: 'Copia local descargada',
    syncedRemote: 'Sincronizado con versión remota',
    copyAll: 'Copiar todo',
  },
};
