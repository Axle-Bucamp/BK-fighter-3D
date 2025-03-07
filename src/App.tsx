import React from 'react';
import Game from './components/Game';
import Menu from './components/Menu';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className="App">
      {isPlaying ? (
        <Game />
      ) : (
        <Menu onStartGame={() => setIsPlaying(true)} />
      )}
    </div>
  );
};

export default App;