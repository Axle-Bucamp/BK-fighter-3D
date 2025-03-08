import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './components/Game';
import MainMenu from './components/MainMenu';
import OptionsMenu from './components/OptionsMenu';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" component={MainMenu} />
          <Route path="/game" component={Game} />
          <Route path="/options" component={OptionsMenu} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;