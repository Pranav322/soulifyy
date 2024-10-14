'use client';

import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const play = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentTrack(track);
      audioRef.current.src = track.streamurl.auth_url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (value) => {
    const seekTo = (value / 100) * duration;
    audioRef.current.currentTime = seekTo;
  };

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, play, duration, currentTime, seekTo }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}