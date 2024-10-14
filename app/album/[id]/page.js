'use client';

import { useState, useEffect } from 'react';
import ServiceProvider from '../../lib/ServiceProvider';
// import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useAudioPlayer } from '@/app/context/AudioPlyerContext';
import { PlayIcon, PauseIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { decodeHtmlEntities } from '@/app/helper/decodeHtmlEntities';
export default function AlbumPage({ params }) {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentTrack, isPlaying, play } = useAudioPlayer();
  const serviceProvider = new ServiceProvider();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const result = await serviceProvider.getAlbumById(params.id);
        setAlbum(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [params.id]);

  const playSong = async (song) => {
    try {
      const songDetails = await serviceProvider.playById(song.id);
      play({ ...song, ...songDetails });
    } catch (err) {
      console.error("Error playing song:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  if (!album) return <div className="flex justify-center items-center h-screen">Album not found</div>;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <img src={album.image} alt={album.title} className="w-64 h-64 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8" />
          <div>
            <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
            <p className="text-xl mb-2">{album.subtitle}</p>
            <p className="text-gray-400 mb-4">{album.year} • {album.list.length} songs</p>
            <div className="flex space-x-4">
              <button className="bg-green-500 text-white px-6 py-2 rounded-full flex items-center">
                <PlayIcon className="h-5 w-5 mr-2" /> Play All
              </button>
              <button className="text-white p-2 rounded-full border border-white">
                <HeartIcon className="h-5 w-5" />
              </button>
              <button className="text-white p-2 rounded-full border border-white">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Songs</h2>
          <ul>
            {album.list.map((song, index) => (
              <li key={song.id} className="flex items-center py-2 hover:bg-gray-800 rounded">
                <button onClick={() => playSong(song)} className="mr-4">
                  {currentTrack && currentTrack.id === song.id && isPlaying ? (
                    <PauseIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <PlayIcon className="h-5 w-5" />
                  )}
                </button>
                <span className="w-8 text-right mr-4 text-gray-400">{index + 1}</span>
                <img src={song.image} alt={song.title} className="w-10 h-10 object-cover rounded mr-4" />
                <div className="flex-grow">
                  <p className="font-medium">{decodeHtmlEntities(song.title)}</p>
                  <p className="text-sm text-gray-400">{song.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
