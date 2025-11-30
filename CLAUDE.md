# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

md2docx is a Markdown to Word converter with real-time collaboration support.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Build for production
npx tsc --noEmit   # Type check
```

## Tech Stack

- React 18 + TypeScript + Vite
- CodeMirror 6 (editor)
- Zustand + Immer (state)
- CSS Modules (styling)
- Yjs + y-websocket (collaboration)
- docx (Word export)
- KaTeX (math formulas)
- Prism.js (code highlighting)

## Structure

```
src/
├── components/
│   ├── common/         # Button, Toast, Loading, etc.
│   ├── editor/         # MarkdownEditor, Preview, Toolbar
│   └── collaboration/  # CollaboratorList
├── features/
│   ├── markdown/       # Parser, extensions
│   ├── docx-export/    # Word generation
│   ├── collaboration/  # Yjs provider
│   ├── i18n/           # 9 languages
│   └── theme/          # Light/dark theme
├── store/              # Zustand store
├── hooks/              # useKeyboardShortcuts
└── styles/             # Global CSS
```

## Key Files

- `src/store/index.ts` - Global state
- `src/features/docx-export/DocxGenerator.ts` - Word export
- `src/features/markdown/parser.ts` - Markdown parsing
- `src/features/i18n/` - Translations (zh, en, ja, ko, fr, de, es, pt, ru)

## Collaboration Server

```bash
cd server
npm install
npm run dev    # Development
npm run build  # Build
npm start      # Production
```
