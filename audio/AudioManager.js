import { Howl, Howler } from 'howler';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;
    this.volume = 1.0;
  }

  loadSound(key, src) {
    this.sounds[key] = new Howl({
      src: [src],
      volume: this.volume,
    });
  }

  loadMusic(src) {
    this.music = new Howl({
      src: [src],
      loop: true,
      volume: this.volume * 0.5, // Music at half volume by default
    });
  }

  playSound(key) {
    if (this.sounds[key] && !this.isMuted) {
      this.sounds[key].play();
    }
  }

  stopSound(key) {
    if (this.sounds[key]) {
      this.sounds[key].stop();
    }
  }

  playMusic() {
    if (this.music && !this.isMuted) {
      this.music.play();
    }
  }

  pauseMusic() {
    if (this.music) {
      this.music.pause();
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.stop();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
  }

  mute() {
    this.isMuted = true;
    Howler.mute(true);
  }

  unmute() {
    this.isMuted = false;
    Howler.mute(false);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
  }
}

export default new AudioManager();