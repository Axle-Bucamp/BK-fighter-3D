import React, { useState, useEffect } from 'react';
import styles from '../styles/OptionsMenu.module.css';
import { setMasterVolume, setSFXVolume, setMusicVolume, isMuted, toggleMute } from '../lib/audioManager';

const OptionsMenu = ({ isOpen, onClose }) => {
  const [masterVolume, setMasterVolumeState] = useState(100);
  const [sfxVolume, setSFXVolumeState] = useState(100);
  const [musicVolume, setMusicVolumeState] = useState(100);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  const handleMasterVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setMasterVolumeState(volume);
    setMasterVolume(volume / 100);
  };

  const handleSFXVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setSFXVolumeState(volume);
    setSFXVolume(volume / 100);
  };

  const handleMusicVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setMusicVolumeState(volume);
    setMusicVolume(volume / 100);
  };

  const handleMuteToggle = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    toggleMute();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.optionsMenu}>
      <h2>Audio Options</h2>
      <div className={styles.volumeControl}>
        <label htmlFor="masterVolume">Master Volume: {masterVolume}%</label>
        <input
          type="range"
          id="masterVolume"
          min="0"
          max="100"
          value={masterVolume}
          onChange={handleMasterVolumeChange}
        />
      </div>
      <div className={styles.volumeControl}>
        <label htmlFor="sfxVolume">SFX Volume: {sfxVolume}%</label>
        <input
          type="range"
          id="sfxVolume"
          min="0"
          max="100"
          value={sfxVolume}
          onChange={handleSFXVolumeChange}
        />
      </div>
      <div className={styles.volumeControl}>
        <label htmlFor="musicVolume">Music Volume: {musicVolume}%</label>
        <input
          type="range"
          id="musicVolume"
          min="0"
          max="100"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
        />
      </div>
      <div className={styles.muteToggle}>
        <label htmlFor="muteToggle">Mute All Audio</label>
        <input
          type="checkbox"
          id="muteToggle"
          checked={muted}
          onChange={handleMuteToggle}
        />
      </div>
      <button className={styles.closeButton} onClick={onClose}>Close</button>
    </div>
  );
};

export default OptionsMenu;