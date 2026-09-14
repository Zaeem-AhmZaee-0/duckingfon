import React, { createContext, useContext, useState, useEffect } from 'react';
import { proceduralAudio } from '../engine/proceduralAudioEngine';
import { getAudioMutedPreference, saveAudioMutedPreference } from '../services/storage';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(getAudioMutedPreference);
  const [volume, setVolumeState] = useState(0.35);
  const [currentSoundscape, setCurrentSoundscape] = useState('gentle_breeze');

  useEffect(() => {
    proceduralAudio.setMuted(isMuted);
    saveAudioMutedPreference(isMuted);
  }, [isMuted]);

  useEffect(() => {
    proceduralAudio.setVolume(volume);
  }, [volume]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const setSoundscape = (type) => {
    setCurrentSoundscape(type);
    proceduralAudio.setSoundscape(type);
  };

  const setVolume = (val) => {
    setVolumeState(val);
  };

  return (
    <AudioContext.Provider value={{
      isMuted,
      toggleMute,
      volume,
      setVolume,
      currentSoundscape,
      setSoundscape
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}
