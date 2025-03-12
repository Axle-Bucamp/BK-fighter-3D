class AudioManager {
    constructor() {
      this.masterVolume = 1.0;
      this.sfxVolume = 1.0;
      this.musicVolume = 1.0;
      this.isMuted = false;
      this.sfxPlayers = [];
      
      // Check if window is defined (client-side)
      if (typeof window !== "undefined") {
        this.musicPlayer = new Audio();
      } else {
        this.musicPlayer = null; // Avoid issues on server-side rendering
      }
    }
  
    setMasterVolume(volume) {
      this.masterVolume = volume;
      this.updateVolumes();
    }
  
    setSFXVolume(volume) {
      this.sfxVolume = volume;
      this.updateVolumes();
    }
  
    setMusicVolume(volume) {
      this.musicVolume = volume;
      if (this.musicPlayer) {
        this.musicPlayer.volume = this.isMuted ? 0 : this.musicVolume * this.masterVolume;
      }
    }
  
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.updateVolumes();
    }
  
    updateVolumes() {
      this.sfxPlayers.forEach((player) => {
        player.volume = this.isMuted ? 0 : this.sfxVolume * this.masterVolume;
      });
  
      if (this.musicPlayer) {
        this.musicPlayer.volume = this.isMuted ? 0 : this.musicVolume * this.masterVolume;
      }
    }
  
    playSFX(soundUrl) {
      if (typeof window === "undefined" || this.isMuted) return;
      const sfx = new Audio(soundUrl);
      sfx.volume = this.sfxVolume * this.masterVolume;
      this.sfxPlayers.push(sfx);
      sfx.play();
    }
  
    playMusic(musicUrl, loop = true) {
      if (typeof window === "undefined") return;
      if (!this.musicPlayer) this.musicPlayer = new Audio(musicUrl);
  
      if (this.musicPlayer.src !== musicUrl) {
        this.musicPlayer.src = musicUrl;
        this.musicPlayer.loop = loop;
      }
      if (!this.isMuted) {
        this.musicPlayer.volume = this.musicVolume * this.masterVolume;
        this.musicPlayer.play();
      }
    }
  
    stopMusic() {
      if (this.musicPlayer) {
        this.musicPlayer.pause();
        this.musicPlayer.currentTime = 0;
      }
    }
  }
  
  export default new AudioManager();
  