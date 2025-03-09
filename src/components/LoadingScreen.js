import React from 'react';

const LoadingScreen = ({ progress }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontSize: '24px'
    }}>
      <h1>Loading Burger vs Jean</h1>
      <div style={{
        width: '300px',
        height: '20px',
        backgroundColor: '#333',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '20px 0'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#0f0',
          transition: 'width 0.3s ease-in-out'
        }}></div>
      </div>
      <p>{Math.round(progress)}% loaded</p>
    </div>
  );
};

export default LoadingScreen;