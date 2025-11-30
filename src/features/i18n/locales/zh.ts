export const zh = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: '导入',
    export: '导出 Word',
    copyHtml: '复制 HTML',
    clear: '清空',
    sample: '示例',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} 字符',
    placeholder: '在这里输入或粘贴 Markdown 内容...',
  },

  // Preview
  preview: {
    title: '预览',
    subtitle: 'LaTeX 公式 & 代码高亮',
  },

  // Export dialog
  export: {
    title: '导出设置',
    fileName: '文件名',
    fileNamePlaceholder: '输入文件名',
    pageSize: '页面大小',
    cancel: '取消',
    confirm: '导出',
    generating: '正在生成 Word 文档...',
    success: '文档导出成功！',
    failed: '导出失败',
    noContent: '请先输入内容',
  },

  // Import
  import: {
    success: '已加载: {name}',
    failed: '读取文件失败',
    invalidType: '请选择 Markdown 文件 (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: '拖拽 Markdown 文件到这里',
  },

  // Toast messages
  toast: {
    cleared: '内容已清空',
    sampleLoaded: '示例已加载',
    htmlCopied: 'HTML 已复制到剪贴板',
    copyFailed: '复制失败',
  },

  // Collaboration
  collaboration: {
    title: '协作',
    yourName: '你的名字',
    roomId: '房间 ID (可选)',
    createRoom: '创建房间',
    joinRoom: '加入房间',
    leaveRoom: '离开房间',
    online: '在线',
    roomCreated: '房间已创建: {id}',
    roomIdCopied: '房间 ID 已复制！',
    leftRoom: '已离开房间',
    enterName: '请输入你的名字',
    enterRoomId: '请输入房间 ID',
    status: {
      connected: '已连接',
      connecting: '连接中',
      disconnected: '未连接',
      error: '错误',
    },
  },

  // Theme
  theme: {
    light: '浅色',
    dark: '深色',
    switchTo: '切换到{theme}模式',
  },

  // Editor toolbar
  editorToolbar: {
    bold: '粗体',
    italic: '斜体',
    strikethrough: '删除线',
    inlineCode: '行内代码',
    link: '链接',
    image: '图片',
    heading1: '一级标题',
    heading2: '二级标题',
    heading3: '三级标题',
    bulletList: '无序列表',
    numberedList: '有序列表',
    taskList: '任务列表',
    quote: '引用',
    divider: '分隔线',
    table: '表格',
    codeBlock: '代码块',
    math: '数学公式',
  },
};

export type Locale = typeof zh;
