import React from 'react';

const LoadingScreen = ({ progress }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '24px'
    }}>
      <h2>Loading Game Assets</h2>
      <div style={{
        width: '300px',
        height: '30px',
        border: '2px solid white',
        borderRadius: '15px',
        overflow: 'hidden',
        marginTop: '20px'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: 'white',
          transition: 'width 0.3s ease-in-out'
        }} />
      </div>
      <p style={{ marginTop: '10px' }}>{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;