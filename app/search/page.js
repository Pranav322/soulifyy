import SearchResults from '../../components/SearchResults';

export default function SearchPage({ searchParams }) {
  const query = searchParams.q;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Search Results for "{query}"</h2>
      <SearchResults query={query} />
    </div>
  );
}

// This tells Next.js to generate this page dynamically
export const dynamic = 'force-dynamic';