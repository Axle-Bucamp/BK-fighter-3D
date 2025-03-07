class SoundEffects {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;
  }

  loadSound(name, src) {
    this.sounds[name] = new Audio(src);
    this.sounds[name].preload = 'auto';
  }

  playSound(name) {
    if (this.sounds[name] && !this.isMuted) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play().catch(error => console.error('Error playing sound:', error));
    }
  }

  loadMusic(src) {
    this.music = new Audio(src);
    this.music.loop = true;
    this.music.volume = 0.5; // Set music volume to 50%
  }

  playMusic() {
    if (this.music && !this.isMuted) {
      this.music.play().catch(error => console.error('Error playing music:', error));
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  setVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = clampedVolume;
    });
    if (this.music) {
      this.music.volume = clampedVolume * 0.5; // Keep music at half the effects volume
    }
  }

  mute() {
    this.isMuted = true;
    this.stopMusic();
  }

  unmute() {
    this.isMuted = false;
    this.playMusic();
  }
}

const soundEffects = new SoundEffects();

// Load sound effects
soundEffects.loadSound('attack', '/sounds/attack.mp3');
soundEffects.loadSound('jump', '/sounds/jump.mp3');
soundEffects.loadSound('gameStart', '/sounds/game-start.mp3');
soundEffects.loadSound('gameOver', '/sounds/game-over.mp3');
soundEffects.loadSound('burgerAttack', '/sounds/burger-attack.mp3');
soundEffects.loadSound('jeanAttack', '/sounds/jean-attack.mp3');
soundEffects.loadSound('hit', '/sounds/hit.mp3');
soundEffects.loadSound('buttonClick', '/sounds/button-click.mp3');

// Load background music
soundEffects.loadMusic('/sounds/background-music.mp3');

export default soundEffects;