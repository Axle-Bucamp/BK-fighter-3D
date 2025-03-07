import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAudioStore from '../lib/audioManager';

export default function Options() {
  const router = useRouter();
  const { audioManager, setMusicVolume, setSFXVolume } = useAudioStore();
  const [musicVol, setMusicVol] = useState(0.5);
  const [sfxVol, setSfxVol] = useState(0.5);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setMusicVol(audioManager.musicVolume);
    setSfxVol(audioManager.sfxVolume);
  }, []);

  const handleMusicVolume = (e) => {
    const volume = parseFloat(e.target.value);
    setMusicVol(volume);
    setMusicVolume(volume);
  };

  const handleSFXVolume = (e) => {
    const volume = parseFloat(e.target.value);
    setSfxVol(volume);
    setSFXVolume(volume);
  };

  const goBack = () => {
    router.push('/');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Options</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="music-volume">
          Music Volume
        </label>
        <input
          id="music-volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={musicVol}
          onChange={handleMusicVolume}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sfx-volume">
          SFX Volume
        </label>
        <input
          id="sfx-volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={sfxVol}
          onChange={handleSFXVolume}
          className="w-full"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={goBack}
      >
        Back to Main Menu
      </button>
    </div>
  );
}