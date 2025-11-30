import type { Locale } from './zh';

export const ko: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: '가져오기',
    export: 'Word 내보내기',
    copyHtml: 'HTML 복사',
    clear: '지우기',
    sample: '샘플',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} 자',
    placeholder: 'Markdown 내용을 입력하거나 붙여넣으세요...',
  },

  // Preview
  preview: {
    title: '미리보기',
    subtitle: 'LaTeX 수식 & 코드 하이라이트',
  },

  // Export dialog
  export: {
    title: '내보내기 설정',
    fileName: '파일 이름',
    fileNamePlaceholder: '파일 이름 입력',
    pageSize: '페이지 크기',
    cancel: '취소',
    confirm: '내보내기',
    generating: 'Word 문서 생성 중...',
    success: '문서 내보내기 성공!',
    failed: '내보내기 실패',
    noContent: '먼저 내용을 입력해주세요',
  },

  // Import
  import: {
    success: '로드됨: {name}',
    failed: '파일 읽기 실패',
    invalidType: 'Markdown 파일을 선택해주세요 (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Markdown 파일을 여기에 드롭하세요',
  },

  // Toast messages
  toast: {
    cleared: '내용이 지워졌습니다',
    sampleLoaded: '샘플이 로드되었습니다',
    htmlCopied: 'HTML이 클립보드에 복사되었습니다!',
    copyFailed: '복사 실패',
  },

  // Collaboration
  collaboration: {
    title: '협업',
    yourName: '이름',
    roomId: '방 ID (선택사항)',
    createRoom: '방 만들기',
    joinRoom: '방 참가',
    leaveRoom: '방 나가기',
    online: '온라인',
    roomCreated: '방 생성됨: {id}',
    roomIdCopied: '방 ID가 복사되었습니다!',
    leftRoom: '방을 나갔습니다',
    enterName: '이름을 입력해주세요',
    enterRoomId: '방 ID를 입력해주세요',
    status: {
      connected: '연결됨',
      connecting: '연결 중',
      disconnected: '연결 안됨',
      error: '오류',
    },
  },

  // Theme
  theme: {
    light: '라이트',
    dark: '다크',
    switchTo: '{theme} 모드로 전환',
  },

  // Editor toolbar
  editorToolbar: {
    bold: '굵게',
    italic: '기울임',
    strikethrough: '취소선',
    inlineCode: '인라인 코드',
    link: '링크',
    image: '이미지',
    heading1: '제목 1',
    heading2: '제목 2',
    heading3: '제목 3',
    bulletList: '글머리 기호',
    numberedList: '번호 매기기',
    taskList: '작업 목록',
    quote: '인용',
    divider: '구분선',
    table: '표',
    codeBlock: '코드 블록',
    math: '수식',
  },
};
