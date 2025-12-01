import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import type { ReactNode, FC } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Awareness } from 'y-protocols/awareness';
import { useStore } from '../../store';

export interface ConflictInfo {
  localContent: string;
  remoteContent: string;
  roomId: string;
}

interface CollaborationContextValue {
  yDoc: Y.Doc | null;
  yText: Y.Text | null;
  awareness: Awareness | null;
  isConnected: boolean;
  roomId: string | null;
  conflict: ConflictInfo | null;
  joinRoom: (roomId: string, userName: string, seedLocalContent?: boolean) => void;
  leaveRoom: () => void;
  createRoom: (userName: string) => string;
  resolveConflict: (useRemote: boolean) => void;
}

const CollaborationContext = createContext<CollaborationContextValue | null>(
  null
);

const USER_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
];

function generateUserColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getDefaultWsUrl(): string {
  // Highest priority: explicit env override
  const envUrl = import.meta.env.VITE_COLLAB_WS_URL as string | undefined;
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

    // 本地开发环境：直接连接 WebSocket 服务器端口 1234
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const envPort = import.meta.env.VITE_COLLAB_WS_PORT as string | undefined;
      return `${wsProtocol}//${hostname}:${envPort || '1234'}`;
    }

    // 生产环境：通过 Nginx 代理的 /ws/ 路径连接
    const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : '';
    return `${wsProtocol}//${hostname}${portSuffix}/ws`;
  }

  return 'ws://localhost:1234';
}

interface CollaborationProviderProps {
  children: ReactNode;
  wsUrl?: string;
}

export const CollaborationProvider: FC<CollaborationProviderProps> = ({
  children,
  wsUrl = getDefaultWsUrl(),
}) => {
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [persistence, setPersistence] = useState<IndexeddbPersistence | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);

  // Refs to store pending conflict resolution data
  const pendingConflictRef = useRef<{
    localContent: string;
    yText: Y.Text;
    roomId: string;
  } | null>(null);

  const setConnectionStatus = useStore((state) => state.setConnectionStatus);
  const updateCollaborator = useStore((state) => state.updateCollaborator);
  const removeCollaborator = useStore((state) => state.removeCollaborator);
  const clearCollaborators = useStore((state) => state.clearCollaborators);
  const setContent = useStore((state) => state.setContent);
  const getContent = useStore.getState;

  const joinRoom = useCallback(
    (newRoomId: string, userName: string, seedLocalContent = false) => {
      // Clean up existing connection
      provider?.destroy();
      persistence?.destroy();
      yDoc?.destroy();
      setConflict(null);

      setConnectionStatus('connecting');

      // Create new document
      const doc = new Y.Doc();
      const text = doc.getText('markdown');

      // 仅在明确要求时种子本地内容（首个创建者）。避免重复加入同一房间时内容叠加。
      if (seedLocalContent) {
        const currentContent = getContent().editor.content;
        if (!text.length && currentContent) {
          text.insert(0, currentContent);
        }
      }

      // Local persistence - load from IndexedDB first
      const localPersistence = new IndexeddbPersistence(newRoomId, doc);

      // Track sync states for conflict detection
      let localSynced = false;
      let remoteSynced = false;
      let conflictChecked = false;
      let localContentSnapshot: string | null = null;
      let wsProvider: WebsocketProvider | null = null;

      // Capture current editor content BEFORE any sync happens
      // This is important for the case where user edits content after leaving a room
      const editorContentBeforeJoin = getContent().editor.content;

      // When local persistence syncs, capture local content BEFORE connecting to WebSocket
      localPersistence.on('synced', () => {
        if (!localSynced) {
          // Capture content from IndexedDB
          const indexedDbContent = text.toString();

          // Use editor content if it's different from IndexedDB (user edited after leaving room)
          // Otherwise use IndexedDB content
          if (
            editorContentBeforeJoin &&
            editorContentBeforeJoin.trim() !== '' &&
            editorContentBeforeJoin !== indexedDbContent
          ) {
            localContentSnapshot = editorContentBeforeJoin;
            if (import.meta.env.DEV) {
              console.log('[Editor Content] Using editor content (edited after leaving):', localContentSnapshot?.substring(0, 100));
            }
          } else {
            localContentSnapshot = indexedDbContent;
            if (import.meta.env.DEV) {
              console.log('[IndexedDB Synced] Local content captured:', localContentSnapshot?.substring(0, 100));
            }
          }
          localSynced = true;

          // First, fetch remote content using a temporary doc to compare
          const tempDoc = new Y.Doc();
          const tempProvider = new WebsocketProvider(wsUrl, newRoomId, tempDoc, {
            connect: true,
          });

          tempProvider.on('sync', (isSynced: boolean) => {
            if (isSynced && !remoteSynced) {
              remoteSynced = true;
              const remoteContent = tempDoc.getText('markdown').toString();

              if (import.meta.env.DEV) {
                console.log('[Remote Fetched] Remote content:', remoteContent?.substring(0, 100));
                console.log('[Conflict Check]', {
                  localContentSnapshot,
                  remoteContent,
                  localLength: localContentSnapshot?.length,
                  remoteLength: remoteContent.length,
                  areDifferent: localContentSnapshot !== remoteContent,
                });
              }

              // Destroy temp provider
              tempProvider.destroy();
              tempDoc.destroy();

              // Check if there's a conflict (local differs from remote)
              if (
                localContentSnapshot &&
                localContentSnapshot.trim() !== '' &&
                remoteContent.trim() !== '' &&
                localContentSnapshot !== remoteContent
              ) {
                // Store conflict data for resolution
                pendingConflictRef.current = {
                  localContent: localContentSnapshot,
                  yText: text,
                  roomId: newRoomId,
                };
                setConflict({
                  localContent: localContentSnapshot,
                  remoteContent,
                  roomId: newRoomId,
                });
                // Don't connect main provider yet - wait for conflict resolution
                conflictChecked = true;
              } else {
                // No conflict, connect main provider
                connectMainProvider();
              }
            }
          });

          // Function to connect main WebSocket provider
          const connectMainProvider = () => {
            conflictChecked = true;
            wsProvider = new WebsocketProvider(wsUrl, newRoomId, doc);

            // Set user info
            const userColor = generateUserColor();
            wsProvider.awareness.setLocalStateField('user', {
              name: userName,
              color: userColor,
            });

            // Listen for connection status
            wsProvider.on('status', ({ status }: { status: string }) => {
              const connected = status === 'connected';
              setIsConnected(connected);
              setConnectionStatus(connected ? 'connected' : 'disconnected');
              if (!connected) {
                clearCollaborators();
              }
            });

            // Listen for awareness updates (joins, updates, leaves)
            wsProvider.awareness.on(
              'update',
              ({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }) => {
                const states = wsProvider!.awareness.getStates();

                // handle added/updated
                [...added, ...updated].forEach((clientId) => {
                  const state = states.get(clientId);
                  if (clientId !== wsProvider!.awareness.clientID && state?.user) {
                    updateCollaborator({
                      id: clientId.toString(),
                      name: state.user.name,
                      color: state.user.color,
                      cursor: state.cursor || null,
                      selection: state.selection || null,
                      isActive: true,
                    });
                  }
                });

                // handle removed
                removed.forEach((clientId) => {
                  if (clientId !== wsProvider!.awareness.clientID) {
                    removeCollaborator(clientId.toString());
                  }
                });
              }
            );

            wsProvider.on('sync', () => {
              setContent(text.toString());
            });

            setProvider(wsProvider);
          };

          // Store connectMainProvider for use after conflict resolution
          (window as unknown as Record<string, unknown>).__connectMainProvider = connectMainProvider;
        }
      });

      // Sync text changes to store (only after conflict is resolved)
      text.observe(() => {
        if (conflictChecked && !pendingConflictRef.current) {
          setContent(text.toString());
        }
      });

      setYDoc(doc);
      setPersistence(localPersistence);
      setRoomId(newRoomId);
    },
    [
      provider,
      persistence,
      yDoc,
      wsUrl,
      setConnectionStatus,
      updateCollaborator,
      clearCollaborators,
      setContent,
      conflict,
    ]
  );

  const leaveRoom = useCallback(() => {
    provider?.destroy();
    persistence?.destroy();
    yDoc?.destroy();
    setYDoc(null);
    setProvider(null);
    setPersistence(null);
    setRoomId(null);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    clearCollaborators();
  }, [
    provider,
    persistence,
    yDoc,
    setConnectionStatus,
    clearCollaborators,
  ]);

  const createRoom = useCallback(
    (userName: string): string => {
      const newRoomId = generateRoomId();
      joinRoom(newRoomId, userName, true);
      return newRoomId;
    },
    [joinRoom]
  );

  // Resolve conflict: useRemote=true means discard local, useRemote=false means keep local (not supported - use download)
  const resolveConflict = useCallback(
    (useRemote: boolean) => {
      const pending = pendingConflictRef.current;
      if (!pending) {
        setConflict(null);
        return;
      }

      if (useRemote) {
        // Clear local IndexedDB data to use remote version
        // The yText will be synced from remote when we connect
      }
      // Note: "use local" is not directly supported to avoid overwriting remote
      // Users should download local copy and manually merge

      pendingConflictRef.current = null;
      setConflict(null);

      // Connect main provider after conflict resolution
      const connectFn = (window as unknown as Record<string, () => void>).__connectMainProvider;
      if (connectFn) {
        connectFn();
        delete (window as unknown as Record<string, unknown>).__connectMainProvider;
      }
    },
    [setContent]
  );

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, []);

  return (
    <CollaborationContext.Provider
      value={{
        yDoc,
        yText: yDoc?.getText('markdown') || null,
        awareness: provider?.awareness || null,
        isConnected,
        roomId,
        conflict,
        joinRoom,
        leaveRoom,
        createRoom,
        resolveConflict,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      'useCollaboration must be used within CollaborationProvider'
    );
  }
  return context;
};

export default CollaborationProvider;
