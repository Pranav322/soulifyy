'use client';

import { useSearchParams } from 'next/navigation';
import SearchResults from '../components/SearchResults';


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    // <div className="min-h-screen bg-gray-100 pt-20 pb-24">
      <SearchResults query={query} />
    // </div>
  );
}