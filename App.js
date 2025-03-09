import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './components/Game';
import MainMenu from './components/MainMenu';
import OptionsMenu from './components/OptionsMenu';
import LobbyRoom from './components/LobbyRoom';
import './styles/globals.css';

function App({ gameEngine, multiplayerManager }) {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <MainMenu multiplayerManager={multiplayerManager} />
          </Route>
          <Route path="/game">
            <Game gameEngine={gameEngine} multiplayerManager={multiplayerManager} />
          </Route>
          <Route path="/options">
            <OptionsMenu />
          </Route>
          <Route path="/lobby">
            <LobbyRoom
              multiplayerManager={multiplayerManager}
              onStartGame={() => {
                // Handle start game logic
              }}
              onLeaveLobby={() => {
                // Handle leave lobby logic
              }}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;