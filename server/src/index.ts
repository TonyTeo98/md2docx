import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import * as Y from 'yjs';
import { setupWSConnection } from 'y-websocket/bin/utils';

// Load environment variables
const PORT = parseInt(process.env.PORT || '1234', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Create HTTP server
const server = http.createServer((req, res) => {
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // CORS headers for preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('md2docx Collaboration Server\n');
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Room management
const rooms = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  const roomId = req.url?.slice(1) || 'default';

  console.log(`Client connected to room: ${roomId}`);

  // Add to room
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId)!.add(ws);

  // Setup y-websocket connection
  setupWSConnection(ws, req, {
    docName: roomId,
    gc: true, // Enable garbage collection
  });

  ws.on('close', () => {
    console.log(`Client disconnected from room: ${roomId}`);
    rooms.get(roomId)?.delete(ws);
    if (rooms.get(roomId)?.size === 0) {
      rooms.delete(roomId);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error in room ${roomId}:`, error);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   md2docx Collaboration Server                             ║
║                                                            ║
║   WebSocket: ws://${HOST}:${PORT}                          ║
║   Health:    http://${HOST}:${PORT}/health                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  wss.close(() => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});
