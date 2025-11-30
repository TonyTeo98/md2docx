# md2docx Collaboration Server

Real-time collaboration server for md2docx using Yjs and WebSocket.

## Quick Start

### Development

```bash
cd server
npm install
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t md2docx-collab .
docker run -p 1234:1234 md2docx-collab
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 1234 | WebSocket server port |
| HOST | 0.0.0.0 | Server host |

## API

### WebSocket Connection

Connect to `ws://localhost:1234/{roomId}` where `{roomId}` is a unique room identifier.

### Health Check

```bash
curl http://localhost:1234/health
```

## Architecture

- Uses Yjs CRDT for conflict-free real-time collaboration
- y-websocket for WebSocket transport
- Automatic room management
- Supports multiple concurrent rooms
