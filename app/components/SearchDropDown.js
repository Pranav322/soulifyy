import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useAudioPlayer } from '../context/AudioPlyerContext';
import ServiceProvider from '../lib/ServiceProvider';

export default function SearchResultsDropdown({ results, onSelect, onPlay }) {
  const { play, currentTrack, isPlaying } = useAudioPlayer();
  const serviceProvider = new ServiceProvider();

  const handlePlay = async (e, item) => {
    e.stopPropagation();
    if (item.type === 'song') {
      try {
        const songDetails = await serviceProvider.playById(item.id);
        play({ ...item, ...songDetails });
        if (onPlay) onPlay(item);
      } catch (error) {
        console.error('Error playing song:', error);
      }
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
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
            <button
              onClick={(e) => handlePlay(e, item)}
              className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors duration-300"
            >
              {currentTrack && currentTrack.id === item.id && isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}