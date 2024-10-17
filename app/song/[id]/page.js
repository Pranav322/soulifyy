'use client';
import { decodeHtmlEntities } from '@/app/helper/decodeHtmlEntities';
import { useState, useEffect } from 'react';
import ServiceProvider from '../../lib/ServiceProvider';
import { useAudioPlayer } from '@/app/context/AudioPlyerContext';
import { PlayIcon, PauseIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { useLikedSongs } from '@/app/context/LikedSongContext';

export default function SongPage({ params }) {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { play, currentTrack, isPlaying } = useAudioPlayer();
  const { toggleLikedSong, isLiked } = useLikedSongs();
  const serviceProvider = new ServiceProvider();

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const result = await serviceProvider.getSongById(params.id);
        setSong(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSong();
  }, [params.id]);

  const playSong = async () => {
    if (song) {
      try {
        const songDetails = await serviceProvider.playById(song.id);
        play({ ...song, ...songDetails });
      } catch (err) {
        console.error("Error playing song:", err);
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!song) return <div className="flex justify-center items-center h-screen">Song not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8 space-y-4 md:space-y-0 md:space-x-8">
        <img src={song.image} alt={song.song} className="w-64 h-64 object-cover rounded-lg shadow-lg" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{song.song}</h1>
          <p className="text-xl mb-2 text-gray-800">{song.primary_artists}</p>
          <p className="text-gray-600 mb-4">Album: {song.album} • {song.year}</p>
          <div className="flex flex-wrap justify-center md:justify-start space-x-4">
            <button onClick={playSong} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center mb-2">
              {currentTrack && currentTrack.id === song.id && isPlaying ? (
                <PauseIcon className="h-5 w-5 mr-2" />
              ) : (
                <PlayIcon className="h-5 w-5 mr-2" />
              )}
              {currentTrack && currentTrack.id === song.id && isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => toggleLikedSong(song)}
              className={`text-gray-900 p-2 rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors mb-2 ${isLiked(song.id) ? 'bg-gray-900 text-white' : ''}`}
            >
              <HeartIcon className="h-5 w-5" />
            </button>
            <button className="text-gray-900 p-2 rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors mb-2">
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}