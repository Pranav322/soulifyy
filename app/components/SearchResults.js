'use client';

import { useState, useEffect } from 'react';
import ServiceProvider from '../lib/ServiceProvider';
// import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useAudioPlayer } from '../context/AudioPlyerContext';
import Link from 'next/link';
import { PlayIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';

export default function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { play } = useAudioPlayer();
  const serviceProvider = new ServiceProvider();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await serviceProvider.getSearch(query, 1, 1);
        setResults(data.results);
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



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Search Results for "{query}"</h2>
      <div className="bg-white">
        {results.map((item, index) => (
          <div key={item.id} className={`flex items-center py-4 ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
            <div className="w-16 h-16 flex-shrink-0 mr-4">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <MusicalNoteIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 truncate">{item.subtitle}</p>
            </div>
            <div>
              {item.type === 'song' && (
                <button
                  onClick={() => handlePlay(item)}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300 flex items-center"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Play
                </button>
              )}
              {item.type === 'album' && (
                <Link href={`/album/${item.id}`} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
                  View Album
                </Link>
              )}
              {item.type === 'playlist' && (
                <Link href={`/playlist/${item.id}`} className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors duration-300">
                  View Playlist
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}