'use client';
import Link from 'next/link';
import { MagnifyingGlassIcon, MusicalNoteIcon, UserCircleIcon, HeartIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ServiceProvider from './lib/ServiceProvider';
import SearchResultsDropdown from './components/SearchDropDown';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [liveResults, setLiveResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const serviceProvider = new ServiceProvider();

  useEffect(() => {
    const fetchLiveResults = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await serviceProvider.getSearch(searchQuery, 1, 1);
          setLiveResults(results.results);
        } catch (error) {
          console.error('Error fetching live results:', error);
        }
      } else {
        setLiveResults([]);
      }
    };

    const debounceTimer = setTimeout(fetchLiveResults, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleClickOutside = useCallback((event) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsExpanded(false);
    }
  };

  const toggleSearch = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => document.getElementById('search-input').focus(), 100);
    }
  };

  const handleSelect = (item) => {
    if (item.type === 'song') {
      router.push(`/song/${item.id}`);
    } else if (item.type === 'album') {
      router.push(`/album/${item.id}`);
    } else if (item.type === 'playlist') {
      router.push(`/playlist/${item.id}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(item.title)}`);
    }
    setIsExpanded(false);
  };

  const handlePlay = () => {
    setIsExpanded(true);
  };

  return (
    <header className="bg-white text-gray-800 py-4 px-6 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
          <MusicalNoteIcon className="h-8 w-8 text-red-400" />
          <span className="text-red-400">Soulify</span>
        </Link>

        <div ref={searchContainerRef} className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-1/2' : 'w-64'}`}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search"
                className="w-full py-2 px-4 pr-10 rounded-full bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsExpanded(true);
                  setLiveResults([]);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
          {isExpanded && liveResults.length > 0 && (
            <SearchResultsDropdown 
              results={liveResults} 
              onSelect={handleSelect}
              onPlay={handlePlay}
            />
          )}
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <UserCircleIcon className="h-8 w-8" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Link
                href="/liked-songs"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <HeartIcon className="h-5 w-5 inline-block mr-2" />
                Liked Songs
              </Link>
              {/* Add more profile options here */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}