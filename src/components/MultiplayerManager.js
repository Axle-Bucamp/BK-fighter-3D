import React, { useEffect, useRef, useCallback } from 'react';

const MultiplayerManager = ({ gameState, onStateUpdate, onPlayerJoin, onPlayerLeave }) => {
  const ws = useRef(null);

  const connectToServer = useCallback(() => {
    ws.current = new WebSocket('ws://your-server-url:port');

    ws.current.onopen = () => {
      console.log('Connected to the multiplayer server');
      // Send initial player data
      sendGameState(gameState);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'gameStateUpdate':
          onStateUpdate(data.gameState);
          break;
        case 'playerJoined':
          onPlayerJoin(data.player);
          break;
        case 'playerLeft':
          onPlayerLeave(data.playerId);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the multiplayer server');
      // Attempt to reconnect after a delay
      setTimeout(connectToServer, 5000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [gameState, onStateUpdate, onPlayerJoin, onPlayerLeave]);

  useEffect(() => {
    connectToServer();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connectToServer]);

  const sendGameState = useCallback((state) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'gameStateUpdate',
        gameState: state
      }));
    }
  }, []);

  useEffect(() => {
    sendGameState(gameState);
  }, [gameState, sendGameState]);

  const sendPlayerAction = useCallback((action) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'playerAction',
        action: action
      }));
    }
  }, []);

  return null; // This component doesn't render anything
};

export default MultiplayerManager;