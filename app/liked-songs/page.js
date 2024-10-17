'use client';

import { useState, useEffect } from 'react';
import { useLikedSongs } from '../context/LikedSongContext';
import { useAudioPlayer } from '../context/AudioPlyerContext';
import { PlayIcon, PauseIcon, HeartIcon } from '@heroicons/react/24/solid';
import ServiceProvider from '../lib/ServiceProvider';

export default function LikedSongsPage() {
  const { likedSongs, toggleLikedSong } = useLikedSongs();
  const { play, currentTrack, isPlaying } = useAudioPlayer();
  const serviceProvider = new ServiceProvider();

  const playSong = async (song) => {
    try {
      const songDetails = await serviceProvider.playById(song.id);
      play({ ...song, ...songDetails });
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Liked Songs</h1>
      <ul className="space-y-4">
        {likedSongs.map((song) => (
          <li key={song.id} className="flex items-center bg-white shadow rounded-lg p-4">
            <img src={song.image} alt={song.title} className="w-16 h-16 object-cover rounded mr-4" />
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">{song.title}</h2>
              <p className="text-gray-600">{song.subtitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => playSong(song)}
                className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors duration-300"
              >
                {currentTrack && currentTrack.id === song.id && isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={() => toggleLikedSong(song)}
                className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-300"
              >
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}