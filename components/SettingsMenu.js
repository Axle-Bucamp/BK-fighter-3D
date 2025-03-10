import React, { useState } from 'react';
import styles from '../styles/OptionsMenu.module.css';

const SettingsMenu = ({ onBack }) => {
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [graphicsQuality, setGraphicsQuality] = useState('medium');

  const handleMusicVolumeChange = (e) => setMusicVolume(e.target.value);
  const handleSfxVolumeChange = (e) => setSfxVolume(e.target.value);
  const handleGraphicsQualityChange = (e) => setGraphicsQuality(e.target.value);

  return (
    <div className={styles.optionsMenu}>
      <h2>Settings</h2>
      
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

      <div className={styles.volumeControl}>
        <label htmlFor="sfxVolume">SFX Volume: {sfxVolume}%</label>
        <input
          type="range"
          id="sfxVolume"
          min="0"
          max="100"
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
        />
      </div>

      <div className={styles.graphicsControl}>
        <label htmlFor="graphicsQuality">Graphics Quality:</label>
        <select
          id="graphicsQuality"
          value={graphicsQuality}
          onChange={handleGraphicsQualityChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button className={styles.backButton} onClick={onBack}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default SettingsMenu;