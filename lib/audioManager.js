/**
 * @class AudioManager
 * @description Manages audio for the game
 */
class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;
  }

  /**
   * @method loadSound
   * @description Loads a sound effect
   * @param {string} name - Name of the sound effect
   * @param {string} src - Source URL of the sound file
   */
  loadSound(name, src) {
    this.sounds[name] = new Audio(src);
  }

  /**
   * @method playSound
   * @description Plays a loaded sound effect
   * @param {string} name - Name of the sound effect to play
   */
  playSound(name) {
    if (this.sounds[name] && !this.isMuted) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
    }
  }

  /**
   * @method loadMusic
   * @description Loads background music
   * @param {string} src - Source URL of the music file
   */
  loadMusic(src) {
    this.music = new Audio(src);
    this.music.loop = true;
  }

  /**
   * @method playMusic
   * @description Plays the loaded background music
   */
  playMusic() {
    if (this.music && !this.isMuted) {
      this.music.play();
    }
  }

  /**
   * @method stopMusic
   * @description Stops the currently playing background music
   */
  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  /**
   * @method setMute
   * @description Mutes or unmutes all audio
   * @param {boolean} mute - Whether to mute (true) or unmute (false)
   */
  setMute(mute) {
    this.isMuted = mute;
    if (this.music) {
      this.music.muted = mute;
    }
    Object.values(this.sounds).forEach(sound => {
      sound.muted = mute;
    });
  }

  /**
   * @method preloadAudio
   * @description Preloads all game audio
   */
  preloadAudio() {
    this.loadSound('gameStart', '/sounds/game-start.mp3');
    this.loadSound('lightAttack', '/sounds/light-attack.mp3');
    this.loadSound('heavyAttack', '/sounds/heavy-attack.mp3');
    this.loadSound('specialAttack', '/sounds/special-attack.mp3');
    this.loadSound('hit', '/sounds/hit.mp3');
    this.loadSound('gameOver', '/sounds/game-over.mp3');
    this.loadMusic('/sounds/background-music.mp3');
  }
}

export default AudioManager;