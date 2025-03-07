import { create } from 'zustand';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.5;
  }

  loadSound(key, src) {
    this.sounds[key] = new Audio(src);
  }

  playSound(key) {
    if (this.sounds[key]) {
      this.sounds[key].volume = this.sfxVolume;
      this.sounds[key].currentTime = 0;
      this.sounds[key].play();
    }
  }

  loadMusic(src) {
    this.music = new Audio(src);
    this.music.loop = true;
  }

  playMusic() {
    if (this.music) {
      this.music.volume = this.musicVolume;
      this.music.play();
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = volume;
    if (this.music) {
      this.music.volume = volume;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = volume;
  }
}

const useAudioStore = create((set) => ({
  audioManager: new AudioManager(),
  setMusicVolume: (volume) => set((state) => {
    state.audioManager.setMusicVolume(volume);
    return { audioManager: state.audioManager };
  }),
  setSFXVolume: (volume) => set((state) => {
    state.audioManager.setSFXVolume(volume);
    return { audioManager: state.audioManager };
  }),
}));

export default useAudioStore;