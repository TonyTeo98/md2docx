import type { Locale } from './zh';

export const ja: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'インポート',
    export: 'Word出力',
    copyHtml: 'HTMLコピー',
    clear: 'クリア',
    sample: 'サンプル',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} 文字',
    placeholder: 'Markdownを入力またはペーストしてください...',
  },

  // Preview
  preview: {
    title: 'プレビュー',
    subtitle: 'LaTeX数式 & コードハイライト',
  },

  // Export dialog
  export: {
    title: 'エクスポート設定',
    fileName: 'ファイル名',
    fileNamePlaceholder: 'ファイル名を入力',
    pageSize: 'ページサイズ',
    cancel: 'キャンセル',
    confirm: 'エクスポート',
    generating: 'Word文書を生成中...',
    success: 'ドキュメントのエクスポートに成功しました！',
    failed: 'エクスポートに失敗しました',
    noContent: '先にコンテンツを入力してください',
  },

  // Import
  import: {
    success: '読み込み完了: {name}',
    failed: 'ファイルの読み込みに失敗しました',
    invalidType: 'Markdownファイルを選択してください (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Markdownファイルをここにドロップ',
  },

  // Toast messages
  toast: {
    cleared: 'コンテンツをクリアしました',
    sampleLoaded: 'サンプルを読み込みました',
    htmlCopied: 'HTMLをクリップボードにコピーしました！',
    copyFailed: 'コピーに失敗しました',
  },

  // Collaboration
  collaboration: {
    title: 'コラボレーション',
    yourName: 'あなたの名前',
    roomId: 'ルームID（任意）',
    createRoom: 'ルーム作成',
    joinRoom: 'ルーム参加',
    leaveRoom: 'ルーム退出',
    online: 'オンライン',
    roomCreated: 'ルーム作成: {id}',
    roomIdCopied: 'ルームIDをコピーしました！',
    leftRoom: 'ルームを退出しました',
    enterName: '名前を入力してください',
    enterRoomId: 'ルームIDを入力してください',
    status: {
      connected: '接続済み',
      connecting: '接続中',
      disconnected: '未接続',
      error: 'エラー',
    },
  },

  // Theme
  theme: {
    light: 'ライト',
    dark: 'ダーク',
    switchTo: '{theme}モードに切り替え',
  },

  // Editor toolbar
  editorToolbar: {
    bold: '太字',
    italic: '斜体',
    strikethrough: '取り消し線',
    inlineCode: 'インラインコード',
    link: 'リンク',
    image: '画像',
    heading1: '見出し1',
    heading2: '見出し2',
    heading3: '見出し3',
    bulletList: '箇条書き',
    numberedList: '番号付きリスト',
    taskList: 'タスクリスト',
    quote: '引用',
    divider: '区切り線',
    table: '表',
    codeBlock: 'コードブロック',
    math: '数式',
  },

  // Conflict resolution
  conflict: {
    title: 'ドキュメントの競合を検出',
    description:
      'オフライン編集内容がリモートバージョンと異なります。処理方法を選択してください：',
    local: 'ローカル',
    remote: 'リモート',
    localVersion: 'オフライン編集版',
    remoteVersion: '現在のリモート版',
    lines: '行',
    linesAdded: '行追加',
    linesRemoved: '行削除',
    downloadLocal: 'ローカルコピーをダウンロード',
    useRemote: 'リモート版を使用',
    mergeEdit: '手動でマージ',
    downloadSuccess: 'ローカルコピーをダウンロードしました',
    syncedRemote: 'リモート版に同期しました',
    copyAll: 'すべてコピー',
  },
};
