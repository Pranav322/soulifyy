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
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <Section title="Trending Now" items={launchData.newTrending} />
      <Section title="Top Playlists" items={launchData.topPlaylists} />
      <Section title="New Albums" items={launchData.newAlbums} />
      <Section title="Browse & Discover" items={launchData.browseDiscover} />
    </div>
  );
}

function Section({ title, items }) {
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollLeft += scrollOffset;
  };

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll(-200)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-1 sm:p-2 rounded-full shadow-md z-10 transition-all duration-300"
        >
          <ChevronLeftIcon className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
        </button>
        <div
          ref={scrollRef}
          className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((item) => (
            <TrendingItem key={item.id} item={item} />
          ))}
        </div>
        <button
          onClick={() => scroll(200)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-100 p-1 sm:p-2 rounded-full shadow-md z-10 transition-all duration-300"
        >
          <ChevronRightIcon className="h-4 w-4 sm:h-6 sm:w-6 text-gray-600" />
        </button>
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
      <div className="w-32 sm:w-48 flex-shrink-0 cursor-pointer">
        <img src={item.image} alt={item.title} className="w-full h-32 sm:h-48 object-cover rounded-lg shadow-md" />
        <h3 className="font-semibold text-xs sm:text-sm mt-2 truncate">{item.title}</h3>
        <p className="text-xs text-gray-600 truncate">{item.subtitle || item.description || ''}</p>
      </div>
    </Link>
  );
}


const styles = `
@media (max-width: 640px) {
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
`;

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'JioSaavn Home',
};