'use client';

import { useState, useEffect } from 'react';
import ServiceProvider from '../lib/ServiceProvider';
import { useAudioPlayer } from '../context/AudioPlyerContext';
import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/24/solid';

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
    <div className="container mx-auto px-4">
      {/* <h2 className="text-2xl font-bold mb-4 text-gray-800">Results for "{query}"</h2> */}
      <div className="space-y-2">
        {results.map((item) => (
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
                    className="p-2 rounded-full text-green-500 text-white bg-green-500 transition-colors duration-300"
                    aria-label="Play"
                  >
                    <PlayIcon className="h-5 w-5" />
                  </button>
                )}
                {item.type === 'album' && (
                  <Link href={`/album/${item.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors duration-300 inline-block">
                    View Album
                  </Link>
                )}
                {item.type === 'playlist' && (
                  <Link href={`/playlist/${item.id}`} className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-600 transition-colors duration-300 inline-block">
                    View Playlist
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