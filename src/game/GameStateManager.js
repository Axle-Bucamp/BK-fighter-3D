import { GAME_STATES } from './constants';

class GameStateManager {
  constructor() {
    this.state = GAME_STATES.MENU;
    this.listeners = [];
  }

  setState(newState) {
    this.state = newState;
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export default new GameStateManager();