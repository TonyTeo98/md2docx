import type { Locale } from './zh';

export const ru: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'Импорт',
    export: 'Экспорт Word',
    copyHtml: 'Копировать HTML',
    clear: 'Очистить',
    sample: 'Пример',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} символов',
    placeholder: 'Введите или вставьте Markdown здесь...',
  },

  // Preview
  preview: {
    title: 'Предпросмотр',
    subtitle: 'LaTeX и подсветка кода',
  },

  // Export dialog
  export: {
    title: 'Настройки экспорта',
    fileName: 'Имя файла',
    fileNamePlaceholder: 'Введите имя файла',
    pageSize: 'Размер страницы',
    cancel: 'Отмена',
    confirm: 'Экспорт',
    generating: 'Создание документа Word...',
    success: 'Документ успешно экспортирован!',
    failed: 'Ошибка экспорта',
    noContent: 'Сначала введите содержимое',
  },

  // Import
  import: {
    success: 'Загружено: {name}',
    failed: 'Не удалось прочитать файл',
    invalidType: 'Выберите файл Markdown (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Перетащите файл Markdown сюда',
  },

  // Toast messages
  toast: {
    cleared: 'Содержимое очищено',
    sampleLoaded: 'Пример загружен',
    htmlCopied: 'HTML скопирован в буфер обмена!',
    copyFailed: 'Ошибка копирования',
  },

  // Collaboration
  collaboration: {
    title: 'Совместная работа',
    yourName: 'Ваше имя',
    roomId: 'ID комнаты (необязательно)',
    createRoom: 'Создать комнату',
    joinRoom: 'Войти в комнату',
    leaveRoom: 'Покинуть комнату',
    online: 'Онлайн',
    roomCreated: 'Комната создана: {id}',
    roomIdCopied: 'ID комнаты скопирован!',
    leftRoom: 'Вы покинули комнату',
    enterName: 'Введите ваше имя',
    enterRoomId: 'Введите ID комнаты',
    status: {
      connected: 'Подключено',
      connecting: 'Подключение...',
      disconnected: 'Отключено',
      error: 'Ошибка',
    },
  },

  // Theme
  theme: {
    light: 'Светлая',
    dark: 'Тёмная',
    switchTo: 'Переключить на {theme} тему',
  },

  // Editor toolbar
  editorToolbar: {
    bold: 'Жирный',
    italic: 'Курсив',
    strikethrough: 'Зачёркнутый',
    inlineCode: 'Код в строке',
    link: 'Ссылка',
    image: 'Изображение',
    heading1: 'Заголовок 1',
    heading2: 'Заголовок 2',
    heading3: 'Заголовок 3',
    bulletList: 'Маркированный список',
    numberedList: 'Нумерованный список',
    taskList: 'Список задач',
    quote: 'Цитата',
    divider: 'Разделитель',
    table: 'Таблица',
    codeBlock: 'Блок кода',
    math: 'Математическая формула',
  },
};
