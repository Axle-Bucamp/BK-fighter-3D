// Audio context
let audioContext;

// Sound effect buffers
const soundEffects = {
  jump: null,
  attack: null,
  damage: null,
};

// Background music
let backgroundMusic = null;

// Initialize audio context
const initAudio = () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
};

// Load all audio assets
export const loadAudioAssets = async () => {
  if (!audioContext) initAudio();

  const audioFiles = {
    jump: '/audio/jump.mp3',
    attack: '/audio/attack.mp3',
    damage: '/audio/damage.mp3',
    backgroundMusic: '/audio/background.mp3',
  };

  const loadAudio = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  };

  for (const [key, url] of Object.entries(audioFiles)) {
    if (key === 'backgroundMusic') {
      backgroundMusic = await loadAudio(url);
    } else {
      soundEffects[key] = await loadAudio(url);
    }
  }
};

// Play a sound effect
const playSoundEffect = (buffer) => {
  if (!audioContext) initAudio();
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
};

// Play specific sound effects
export const playJumpSound = () => playSoundEffect(soundEffects.jump);
export const playAttackSound = () => playSoundEffect(soundEffects.attack);
export const playDamageSound = () => playSoundEffect(soundEffects.damage);

// Background music control
let bgMusicSource = null;

export const playBackgroundMusic = () => {
  if (!audioContext) initAudio();
  if (bgMusicSource) bgMusicSource.stop();

  bgMusicSource = audioContext.createBufferSource();
  bgMusicSource.buffer = backgroundMusic;
  bgMusicSource.loop = true;
  bgMusicSource.connect(audioContext.destination);
  bgMusicSource.start();
};

export const stopBackgroundMusic = () => {
  if (bgMusicSource) {
    bgMusicSource.stop();
    bgMusicSource = null;
  }
};

// Stop all sounds
export const stopAllSounds = () => {
  if (audioContext) {
    audioContext.close().then(() => {
      audioContext = null;
      bgMusicSource = null;
    });
  }
};