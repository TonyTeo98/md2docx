# md2docx

[![License](https://img.shields.io/github/license/TonyTeo98/md2docx)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/TonyTeo98/md2docx)](https://github.com/TonyTeo98/md2docx/stargazers)
[![Issues](https://img.shields.io/github/issues/TonyTeo98/md2docx)](https://github.com/TonyTeo98/md2docx/issues)
[![Last Commit](https://img.shields.io/github/last-commit/TonyTeo98/md2docx)](https://github.com/TonyTeo98/md2docx/commits)
[![Demo](https://img.shields.io/badge/demo-md2docx.ytz.me-blue)](https://md2docx.ytz.me)

一个现代化的 Markdown 转 Word 文档工具，支持实时预览、代码高亮、数学公式和多人协作。

**[在线演示 Demo](https://md2docx.ytz.me)**

## 功能特性

- **Markdown 编辑** - 基于 CodeMirror 6 的专业编辑器
- **实时预览** - 即时渲染 Markdown 内容
- **Word 导出** - 一键导出为 .docx 文档
- **代码高亮** - 支持多种编程语言语法高亮
- **数学公式** - 支持 LaTeX 数学公式 (KaTeX)
- **多人协作** - 基于 Yjs 的实时协作编辑
- **多语言** - 支持中、英、日、韩、法、德、西、葡、俄 9 种语言
- **主题切换** - 浅色/深色主题
- **文件导入** - 支持拖拽或点击导入 .md 文件
- **快捷键** - Ctrl+S 导出、Ctrl+O 导入、Ctrl+Shift+C 复制 HTML

## 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 协作服务器（可选）

```bash
cd server
npm install
npm run dev
```

## 部署

### Docker 一键部署（推荐）

```bash
# 下载配置文件
curl -O https://raw.githubusercontent.com/TonyTeo98/md2docx/main/docker-compose.yml

# 启动
docker compose up -d
```

访问 `http://your-server-ip` 即可。

### Docker 镜像

| 镜像 | 说明 |
|------|------|
| `ghcr.io/tonyteo98/md2docx:main` | 前端应用 |
| `ghcr.io/tonyteo98/md2docx-server:main` | 协作服务器 |

更多部署方式详见 [DEPLOY.md](./DEPLOY.md)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 编辑器 | CodeMirror 6 |
| 状态管理 | Zustand + Immer |
| 样式 | CSS Modules |
| 协作 | Yjs + y-websocket |
| 导出 | docx |
| 公式 | KaTeX |
| 高亮 | Prism.js |

## 目录结构

```
md2docx/
├── src/
│   ├── components/      # React 组件
│   ├── features/        # 功能模块
│   ├── store/           # 状态管理
│   ├── hooks/           # 自定义 Hooks
│   └── styles/          # 全局样式
├── server/              # 协作服务器
├── dist/                # 构建产物
└── DEPLOY.md            # 部署文档
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + S` | 导出 Word |
| `Ctrl/Cmd + O` | 导入文件 |
| `Ctrl/Cmd + Shift + C` | 复制 HTML |

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=TonyTeo98/md2docx&type=Date)](https://star-history.com/#TonyTeo98/md2docx&Date)

## License

[MIT](./LICENSE)
