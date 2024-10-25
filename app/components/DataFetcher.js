'use client';

import { useState, useEffect, useRef } from 'react';
import ServiceProvider from '../lib/ServiceProvider';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function DataFetcher() {
  const [launchData, setLaunchData] = useState({
    newTrending: [],
    topPlaylists: [],
    newAlbums: [],
    browseDiscover: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceProvider = new ServiceProvider();
        const result = await serviceProvider.getLaunchData();
        setLaunchData({
          newTrending: result.new_trending || [],
          topPlaylists: result.top_playlists || [],
          newAlbums: result.new_albums || [],
          browseDiscover: result.browse_discover || []
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">JioSaavn Home</h1> */}
      <Section title="Trending Now" items={launchData.newTrending} />
      <Section title="Top Playlists" items={launchData.topPlaylists} />
      <Section title="New Albums" items={launchData.newAlbums} />
      <Section title="Browse & Discover" items={launchData.browseDiscover} />
    </div>
  );
}

function Section({ title, items }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };

  const handleScroll = () => {
    setShowLeftArrow(scrollRef.current.scrollLeft > 0);
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>
      {showLeftArrow && (
        <button
          onClick={() => scroll(-200)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <TrendingItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function TrendingItem({ item }) {
  let href = '/';
  if (item.type === 'song') {
    href = `/song/${item.id}`;
  } else if (item.type === 'album') {
    const albumId = item.perma_url.split('/').pop().replace('_', '');
    href = `/album/${albumId}`;
  } else if (item.type === 'playlist') {
    // const playlistId = item.perma_url.split('/').pop().replace('_', '');
    href = `/playlist/${item.id }`;
  }

  return (
    <Link href={href}>
      <div className="w-36 sm:w-48 flex-shrink-0 cursor-pointer">
        <img src={item.image} alt={item.title} className="w-full h-36 sm:h-48 object-cover rounded-lg shadow-md" />
        <h3 className="font-semibold text-sm mt-2 truncate">{item.title}</h3>
        <p className="text-xs text-gray-600 truncate">{item.subtitle || item.description || ''}</p>
      </div>
    </Link>
  );
}