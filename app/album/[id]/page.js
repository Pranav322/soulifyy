'use client';

import { useState, useEffect } from 'react';
import ServiceProvider from '../../lib/ServiceProvider';
// import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useAudioPlayer } from '@/app/context/AudioPlyerContext';
import { PlayIcon, PauseIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { decodeHtmlEntities } from '@/app/helper/decodeHtmlEntities';
import { useLikedSongs } from '@/app/context/LikedSongContext';
export default function AlbumPage({ params }) {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentTrack, isPlaying, play } = useAudioPlayer();
  const serviceProvider = new ServiceProvider();
  const { toggleLikedSong, isLiked } = useLikedSongs();
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
    <div className=" min-h-screen">
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row items-center md:items-start mb-8 space-y-4 md:space-y-0 md:space-x-8">
      <img src={album.image} alt={album.title} className="w-64 h-64 object-cover rounded-lg shadow-lg" />
      <div className="text-center md:text-left">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{album.title}</h1>
<p className="text-xl mb-2 text-gray-800">{album.subtitle}</p>
<p className="text-gray-600 mb-4">{album.year} • {album.list.length} songs</p>
<div className="flex flex-wrap justify-center md:justify-start space-x-4">
  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center mb-2">
    <PlayIcon className="h-5 w-5 mr-2" /> Play All
  </button>
  <button className="text-gray-900 p-2 rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors mb-2">
    <HeartIcon className="h-5 w-5" />
  </button>
  <button className="text-gray-900 p-2 rounded-full border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors mb-2">
    <ShareIcon className="h-5 w-5" />
  </button>
</div>
</div>
</div>
<div>
<h2 className="text-2xl font-semibold mb-4 text-gray-900">Songs</h2>
<ul className="space-y-2">
  {album.list.map((song, index) => (
    <li key={song.id} className="flex items-center py-2 hover:bg-gray-200 rounded px-2">
      <button onClick={() => playSong(song)} className="mr-4">
        {currentTrack && currentTrack.id === song.id && isPlaying ? (
          <PauseIcon className="h-5 w-5 text-green-500" />
        ) : (
          <PlayIcon className="h-5 w-5 text-gray-900" />
        )}
      </button>
      <span className="w-8 text-right mr-4 text-gray-600">{index + 1}</span>
      <img src={song.image} alt={song.title} className="w-10 h-10 object-cover rounded mr-4" />
      <div className="flex-grow min-w-0">
        <p className="font-medium truncate text-gray-900">{decodeHtmlEntities(song.title)}</p>
        <p className="text-sm text-gray-600 truncate">{song.subtitle}</p>
      </div>
      <button
        onClick={() => toggleLikedSong(song)}
        className={`p-2 rounded-full ${isLiked(song.id) ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-300 transition-colors duration-300`}
      >
        <HeartIcon className="h-5 w-5" />
      </button>
    </li>
  ))}
</ul>
    </div>
  </div>
</div>
  );
}
