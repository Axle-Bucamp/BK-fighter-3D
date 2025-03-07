import React, { useState, useEffect, useCallback } from 'react';

const MultiplayerManager = ({ userId, onStateUpdate }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = new WebSocket('ws://your-websocket-server-url');

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      // Send initial connection message with user ID
      newSocket.send(JSON.stringify({ type: 'connect', userId }));
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleIncomingMessage(data);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  // Handle incoming messages
  const handleIncomingMessage = useCallback((data) => {
    switch (data.type) {
      case 'gameState':
        onStateUpdate(data.state);
        break;
      case 'playerJoined':
        console.log(`Player ${data.userId} joined the game`);
        break;
      case 'playerLeft':
        console.log(`Player ${data.userId} left the game`);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }, [onStateUpdate]);

  // Send game state update to server
  const sendGameStateUpdate = useCallback((gameState) => {
    if (socket && connected) {
      socket.send(JSON.stringify({
        type: 'gameStateUpdate',
        userId,
        state: gameState
      }));
    }
  }, [socket, connected, userId]);

  // Send player action to server
  const sendPlayerAction = useCallback((action) => {
    if (socket && connected) {
      socket.send(JSON.stringify({
        type: 'playerAction',
        userId,
        action
      }));
    }
  }, [socket, connected, userId]);

  return (
    <div>
      {connected ? (
        <p>Connected to game server</p>
      ) : (
        <p>Connecting to game server...</p>
      )}
    </div>
  );
};

export default MultiplayerManager;