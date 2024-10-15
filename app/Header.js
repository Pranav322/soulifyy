'use client';
import Link from 'next/link';
import { MagnifyingGlassIcon, MusicalNoteIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ServiceProvider from './lib/ServiceProvider';
import SearchResultsDropdown from './components/SearchDropDown';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [liveResults, setLiveResults] = useState([]);
  const router = useRouter();
  const serviceProvider = new ServiceProvider();

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length > 1) {
        serviceProvider.getSearch(query, 1, 1).then((data) => {
          setLiveResults(data.results.slice(0, 5));
        });
      } else {
        setLiveResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => document.getElementById('search-input').focus(), 100);
    }
  };

  return (
    <header className="bg-white text-gray-800 py-4 px-6 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
          <MusicalNoteIcon className="h-8 w-8 text-red-400" />
          <span className="text-red-400">Soulify</span>
        </Link>

        <div className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-1/2' : 'w-64'}`}>
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search"
                className={`w-full py-2 px-4 pr-10 rounded-full bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300 ease-in-out`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => setIsExpanded(false)}
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
            <SearchResultsDropdown results={liveResults} onSelect={(item) => router.push(`/search?q=${encodeURIComponent(item.title)}`)} />
          )}
        </div>

        <div className="flex items-center">
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <UserCircleIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </header>
  );
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}