import { PlayIcon } from '@heroicons/react/24/solid';

export default function SearchResultsDropdown({ results, onSelect }) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
      {results.map((item) => (
        <div
          key={item.id}
          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md mr-3" />
          <div className="flex-grow">
            <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
            <p className="text-xs text-gray-600">{item.subtitle}</p>
          </div>
          {item.type === 'song' && (
            <PlayIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
      ))}
    </div>
  );
}