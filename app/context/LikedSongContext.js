"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const LikedSongsContext = createContext();

export function LikedSongsProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const storedLikedSongs = localStorage.getItem('likedSongs');
    if (storedLikedSongs) {
      setLikedSongs(JSON.parse(storedLikedSongs));
    }
  }, []);

  const toggleLikedSong = (song) => {
    setLikedSongs((prevLikedSongs) => {
      const isLiked = prevLikedSongs.some((s) => s.id === song.id);
      let newLikedSongs;
      if (isLiked) {
        newLikedSongs = prevLikedSongs.filter((s) => s.id !== song.id);
      } else {
        newLikedSongs = [...prevLikedSongs, song];
      }
      localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
      return newLikedSongs;
    });
  };

  const isLiked = (songId) => likedSongs.some((s) => s.id === songId);

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLikedSong, isLiked }}>
      {children}
    </LikedSongsContext.Provider>
  );
}

export function useLikedSongs() {
  return useContext(LikedSongsContext);
}