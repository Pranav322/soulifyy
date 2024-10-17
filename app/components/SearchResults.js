'use client';

import { useState, useEffect } from 'react';
import ServiceProvider from '../lib/ServiceProvider';
import { useAudioPlayer } from '../context/AudioPlyerContext';
import Link from 'next/link';
import { PlayIcon, PauseIcon, HeartIcon } from '@heroicons/react/24/solid';
import { useLikedSongs } from '../context/LikedSongContext';
const TabButton = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 rounded-t-lg ${isActive ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default function SearchResults({ query }) {
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({
    all: [],
    songs: [],
    albums: [],
    artists: []
  });
  const [loading, setLoading] = useState(true);
  const { play, currentTrack, isPlaying } = useAudioPlayer();
  const { toggleLikedSong, isLiked } = useLikedSongs();

 
useEffect(() => {
  const fetchResults = async () => {
    setLoading(true);
    try {
      const songData = await serviceProvider.getSearch(query, 1, 1);
      const albumData = await serviceProvider.getSearch(query, 1, 2);
      const artistData = await serviceProvider.getSearch(query, 1, 3);

      setResults({
        all: [...songData.results, ...albumData.results, ...artistData.results],
        songs: songData.results,
        albums: albumData.results,
        artists: artistData.results
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setLoading(false);
  };

  if (query) {
    fetchResults();
  }
}, [query]);

const handlePlay = async (song) => {
  try {
    const songDetails = await serviceProvider.playById(song.id);
    play({ ...song, ...songDetails });
  } catch (error) {
    console.error('Error playing song:', error);
  }
};

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const displayResults = results[activeTab];

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center md:justify-start space-x-2 space-y-2 md:space-y-0 mb-6">
        <TabButton label="All" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <TabButton label="Songs" isActive={activeTab === 'songs'} onClick={() => setActiveTab('songs')} />
        <TabButton label="Albums" isActive={activeTab === 'albums'} onClick={() => setActiveTab('albums')} />
        <TabButton label="Artists" isActive={activeTab === 'artists'} onClick={() => setActiveTab('artists')} />
      </div>
      <div className="space-y-2">
        {displayResults.map((item, index) => (
          <div key={item.id} className="flex items-center py-2 hover:bg-gray-100 transition-colors duration-200">
            <span className="w-8 text-right mr-4 text-gray-400">{index + 1}</span>
            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-sm mr-4" />
            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-base truncate">{item.title}</h3>
              <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              {item.type === 'song' && (
                <>
                  <button
                    onClick={() => toggleLikedSong(item)}
                    className={`text-gray-400 hover:text-gray-600 ${isLiked(item.id) ? 'text-red-500' : ''}`}
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                  {item.duration && (
                    <span className="text-sm text-gray-500 w-12 text-right">{item.duration}</span>
                  )}
                  <button
                    onClick={() => handlePlay(item)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    aria-label={currentTrack && currentTrack.id === item.id && isPlaying ? 'Pause' : 'Play'}
                  >
                    {currentTrack && currentTrack.id === item.id && isPlaying ? (
                      <PauseIcon className="h-6 w-6" />
                    ) : (
                      <PlayIcon className="h-6 w-6" />
                    )}
                  </button>
                </>
              )}
              {item.type === 'album' && (
                <Link href={`/album/${item.perma_url.split('/').pop()}`} className="text-blue-500 hover:text-blue-600 text-sm font-medium px-3 py-1 rounded-full border border-blue-500 hover:bg-blue-50 transition-colors duration-300">
                  View Album
                </Link>
              )}
              {item.type === 'artist' && (
                <Link href={`/artist/${item.id}`} className="text-purple-500 hover:text-purple-600 text-sm font-medium px-3 py-1 rounded-full border border-purple-500 hover:bg-purple-50 transition-colors duration-300">
                  View Artist
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


