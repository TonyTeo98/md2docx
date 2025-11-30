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
  joinRoom: (roomId: string, userName: string) => void;
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

interface CollaborationProviderProps {
  children: ReactNode;
  wsUrl?: string;
}

export const CollaborationProvider: FC<CollaborationProviderProps> = ({
  children,
  wsUrl = 'ws://localhost:1234',
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
  const clearCollaborators = useStore((state) => state.clearCollaborators);
  const setContent = useStore((state) => state.setContent);

  const joinRoom = useCallback(
    (newRoomId: string, userName: string) => {
      // Clean up existing connection
      provider?.destroy();
      persistence?.destroy();
      yDoc?.destroy();

      setConnectionStatus('connecting');

      // Create new document
      const doc = new Y.Doc();
      const text = doc.getText('markdown');

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
      });

      // Listen for awareness changes (other users)
      wsProvider.awareness.on('change', () => {
        const states = wsProvider.awareness.getStates();
        states.forEach((state, clientId) => {
          if (clientId !== wsProvider.awareness.clientID && state.user) {
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
      });

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
      joinRoom(newRoomId, userName);
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
