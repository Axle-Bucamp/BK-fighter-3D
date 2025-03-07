import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAudioStore from '../lib/audioManager';

export default function MainMenu() {
  const router = useRouter();
  const { audioManager, setMusicVolume, setSFXVolume } = useAudioStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    audioManager.loadMusic('/sounds/menu_music.mp3');
    audioManager.playMusic();

    return () => {
      audioManager.stopMusic();
    };
  }, []);

  const startGame = () => {
    router.push('/character-selection');
  };

  const goToOptions = () => {
    router.push('/options');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Frostbite Fighter</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={startGame}
      >
        Start Game
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={goToOptions}
      >
        Options
      </button>
    </div>
  );
}