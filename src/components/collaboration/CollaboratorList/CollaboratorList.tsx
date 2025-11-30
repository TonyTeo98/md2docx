import React, { useState } from 'react';
import { useStore, useCollaborators, useConnectionStatus } from '../../../store';
import { useCollaboration } from '../../../features/collaboration';
import { Button } from '../../common/Button';
import styles from './CollaboratorList.module.css';

export const CollaboratorList: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const collaborators = useCollaborators();
  const connectionStatus = useConnectionStatus();
  const isOpen = useStore((state) => state.ui.isCollaborationPanelOpen);
  const showToast = useStore((state) => state.showToast);

  const { roomId, joinRoom, leaveRoom, createRoom, isConnected } =
    useCollaboration();

  if (!isOpen) return null;

  const handleCreateRoom = () => {
    if (!userName.trim()) {
      showToast('Please enter your name', 'warning');
      return;
    }
    const newRoomId = createRoom(userName);
    showToast(`Room created: ${newRoomId}`, 'success');
  };

  const handleJoinRoom = () => {
    if (!userName.trim()) {
      showToast('Please enter your name', 'warning');
      return;
    }
    if (!roomInput.trim()) {
      showToast('Please enter room ID', 'warning');
      return;
    }
    joinRoom(roomInput, userName);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    showToast('Left the room', 'info');
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      showToast('Room ID copied!', 'success');
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Collaboration</h3>
        <span className={`${styles.status} ${styles[connectionStatus]}`}>
          {connectionStatus}
        </span>
      </div>

      {!isConnected ? (
        <div className={styles.joinForm}>
          <input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Room ID (optional)"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            className={styles.input}
          />
          <div className={styles.buttons}>
            <Button variant="primary" size="sm" onClick={handleCreateRoom}>
              Create Room
            </Button>
            <Button variant="outline" size="sm" onClick={handleJoinRoom}>
              Join Room
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.roomInfo}>
          <div className={styles.roomId}>
            <span>Room: {roomId}</span>
            <button className={styles.copyBtn} onClick={copyRoomId}>
              📋
            </button>
          </div>

          <div className={styles.collaborators}>
            <h4>Online ({collaborators.length + 1})</h4>
            <div className={styles.userList}>
              <div className={styles.user}>
                <span
                  className={styles.avatar}
                  style={{ background: '#667eea' }}
                >
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span>{userName} (you)</span>
              </div>
              {collaborators.map((collab) => (
                <div key={collab.id} className={styles.user}>
                  <span
                    className={styles.avatar}
                    style={{ background: collab.color }}
                  >
                    {collab.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{collab.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeaveRoom}
            className={styles.leaveBtn}
          >
            Leave Room
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
