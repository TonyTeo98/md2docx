import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { ReactNode, FC } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Awareness } from 'y-protocols/awareness';
import { useStore } from '../../store';

interface CollaborationContextValue {
  yDoc: Y.Doc | null;
  yText: Y.Text | null;
  awareness: Awareness | null;
  isConnected: boolean;
  roomId: string | null;
  joinRoom: (roomId: string, userName: string, seedLocalContent?: boolean) => void;
  leaveRoom: () => void;
  createRoom: (userName: string) => string;
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

    // Prefer explicit env port if provided
    const envPort = import.meta.env.VITE_COLLAB_WS_PORT as string | undefined;
    const targetPort = envPort
      ? envPort
      : hostname === 'localhost' || hostname === '127.0.0.1'
        ? '1234'
        : port;

    return `${wsProtocol}//${hostname}${targetPort ? `:${targetPort}` : ''}`;
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

      // Local persistence
      const localPersistence = new IndexeddbPersistence(newRoomId, doc);

      // WebSocket connection
      const wsProvider = new WebsocketProvider(wsUrl, newRoomId, doc);

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
          const states = wsProvider.awareness.getStates();

          // handle added/updated
          [...added, ...updated].forEach((clientId) => {
            const state = states.get(clientId);
            if (clientId !== wsProvider.awareness.clientID && state?.user) {
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
            if (clientId !== wsProvider.awareness.clientID) {
              removeCollaborator(clientId.toString());
            }
          });
        }
      );

      // Sync text changes to store
      text.observe(() => {
        setContent(text.toString());
      });

      setYDoc(doc);
      setProvider(wsProvider);
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
        joinRoom,
        leaveRoom,
        createRoom,
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
