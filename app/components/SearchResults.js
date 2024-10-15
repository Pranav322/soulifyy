'use client';

import { useState, useEffect } from 'react';
import ServiceProvider from '../lib/ServiceProvider';
import { useAudioPlayer } from '../context/AudioPlyerContext';
import Link from 'next/link';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

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
  const serviceProvider = new ServiceProvider();

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
      <div className="flex space-x-2 mb-4">
        <TabButton label="All" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <TabButton label="Songs" isActive={activeTab === 'songs'} onClick={() => setActiveTab('songs')} />
        <TabButton label="Albums" isActive={activeTab === 'albums'} onClick={() => setActiveTab('albums')} />
        <TabButton label="Artists" isActive={activeTab === 'artists'} onClick={() => setActiveTab('artists')} />
      </div>
      <div className="space-y-2">
        {displayResults.map((item) => (
          <div key={item.id} className="bg-white rounded-md shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex items-center h-16">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
            <div className="flex-grow px-4 flex items-center justify-between min-w-0">
              <div className="truncate">
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
              </div>
              <div>
                {item.type === 'song' && (
                  <button
                    onClick={() => handlePlay(item)}
                    className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors duration-300"
                    aria-label={currentTrack && currentTrack.id === item.id && isPlaying ? 'Pause' : 'Play'}
                  >
                    {currentTrack && currentTrack.id === item.id && isPlaying ? (
                      <PauseIcon className="h-5 w-5" />
                    ) : (
                      <PlayIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
                {item.type === 'album' && (
                  <Link href={`/album/${item.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors duration-300 inline-block">
                    View Album
                  </Link>
                )}
                {item.type === 'artist' && (
                  <Link href={`/artist/${item.id}`} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-red-600 transition-colors duration-300 inline-block">
                    View Artist
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}