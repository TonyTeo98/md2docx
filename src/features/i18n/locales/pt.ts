import type { Locale } from './zh';

export const pt: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'Importar',
    export: 'Exportar Word',
    copyHtml: 'Copiar HTML',
    clear: 'Limpar',
    sample: 'Exemplo',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} caracteres',
    placeholder: 'Digite ou cole conteúdo Markdown aqui...',
  },

  // Preview
  preview: {
    title: 'Pré-visualização',
    subtitle: 'LaTeX e destaque de código',
  },

  // Export dialog
  export: {
    title: 'Configurações de exportação',
    fileName: 'Nome do arquivo',
    fileNamePlaceholder: 'Digite o nome do arquivo',
    pageSize: 'Tamanho da página',
    cancel: 'Cancelar',
    confirm: 'Exportar',
    generating: 'Gerando documento Word...',
    success: 'Documento exportado com sucesso!',
    failed: 'Falha na exportação',
    noContent: 'Por favor, insira algum conteúdo primeiro',
  },

  // Import
  import: {
    success: 'Carregado: {name}',
    failed: 'Falha ao ler o arquivo',
    invalidType: 'Por favor, selecione um arquivo Markdown (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Solte o arquivo Markdown aqui',
  },

  // Toast messages
  toast: {
    cleared: 'Conteúdo limpo',
    sampleLoaded: 'Exemplo carregado',
    htmlCopied: 'HTML copiado para a área de transferência!',
    copyFailed: 'Falha ao copiar',
  },

  // Collaboration
  collaboration: {
    title: 'Colaboração',
    yourName: 'Seu nome',
    roomId: 'ID da sala (opcional)',
    createRoom: 'Criar sala',
    joinRoom: 'Entrar na sala',
    leaveRoom: 'Sair da sala',
    online: 'Online',
    roomCreated: 'Sala criada: {id}',
    roomIdCopied: 'ID da sala copiado!',
    leftRoom: 'Você saiu da sala',
    enterName: 'Por favor, insira seu nome',
    enterRoomId: 'Por favor, insira o ID da sala',
    status: {
      connected: 'Conectado',
      connecting: 'Conectando...',
      disconnected: 'Desconectado',
      error: 'Erro',
    },
  },

  // Theme
  theme: {
    light: 'Claro',
    dark: 'Escuro',
    switchTo: 'Mudar para modo {theme}',
  },

  // Editor toolbar
  editorToolbar: {
    bold: 'Negrito',
    italic: 'Itálico',
    strikethrough: 'Tachado',
    inlineCode: 'Código em linha',
    link: 'Link',
    image: 'Imagem',
    heading1: 'Título 1',
    heading2: 'Título 2',
    heading3: 'Título 3',
    bulletList: 'Lista com marcadores',
    numberedList: 'Lista numerada',
    taskList: 'Lista de tarefas',
    quote: 'Citação',
    divider: 'Separador',
    table: 'Tabela',
    codeBlock: 'Bloco de código',
    math: 'Fórmula matemática',
  },
};
