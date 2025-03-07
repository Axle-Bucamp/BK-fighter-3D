let audioContext;
let sounds = {};
let backgroundMusic;
let masterGainNode;
let sfxGainNode;
let musicGainNode;
let muted = false;

export const initAudio = () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGainNode = audioContext.createGain();
  sfxGainNode = audioContext.createGain();
  musicGainNode = audioContext.createGain();

  sfxGainNode.connect(masterGainNode);
  musicGainNode.connect(masterGainNode);
  masterGainNode.connect(audioContext.destination);
};

export const loadAudioAssets = async () => {
  const audioFiles = {
    jump: '/audio/jump.mp3',
    attack: '/audio/attack.mp3',
    damage: '/audio/damage.mp3',
    background: '/audio/background.mp3',
  };

  for (const [name, url] of Object.entries(audioFiles)) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    sounds[name] = audioBuffer;
  }

  backgroundMusic = audioContext.createBufferSource();
  backgroundMusic.buffer = sounds.background;
  backgroundMusic.loop = true;
  backgroundMusic.connect(musicGainNode);
};

const playSoundEffect = (soundName) => {
  if (!muted) {
    const source = audioContext.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(sfxGainNode);
    source.start();
  }
};

export const playJumpSound = () => playSoundEffect('jump');
export const playAttackSound = () => playSoundEffect('attack');
export const playDamageSound = () => playSoundEffect('damage');

export const playBackgroundMusic = () => {
  if (!muted) {
    backgroundMusic.start();
  }
};

export const stopBackgroundMusic = () => {
  backgroundMusic.stop();
};

export const stopAllSounds = () => {
  stopBackgroundMusic();
  audioContext.close();
};

export const setMasterVolume = (volume) => {
  masterGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
};

export const setSFXVolume = (volume) => {
  sfxGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
};

export const setMusicVolume = (volume) => {
  musicGainNode.gain.setValueAtTime(volume, audioContext.currentTime);
};

export const toggleMute = () => {
  muted = !muted;
  if (muted) {
    masterGainNode.gain.setValueAtTime(0, audioContext.currentTime);
  } else {
    masterGainNode.gain.setValueAtTime(1, audioContext.currentTime);
  }
};

export const isMuted = () => muted;

// Initialize audio when the module is imported
initAudio();