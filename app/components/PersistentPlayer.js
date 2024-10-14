'use client';

import { useAudioPlayer } from '../context/AudioPlyerContext';
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function PersistentPlayer() {
  const { currentTrack, isPlaying, play, duration, currentTime, seekTo } = useAudioPlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center w-1/4">
          <img src={currentTrack.image} alt={currentTrack.title} className="w-16 h-16 object-cover rounded-lg shadow-md mr-4" />
          <div className="truncate">
            <p className="font-semibold text-lg truncate">{currentTrack.title}</p>
            <p className="text-sm text-gray-400 truncate">{currentTrack.subtitle || currentTrack.primary_artists}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center space-x-4 mb-2">
            <button className="text-gray-400 hover:text-white transition-colors">
              <BackwardIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => play(currentTrack)} 
              className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-8 w-8 text-white" />
              ) : (
                <PlayIcon className="h-8 w-8 text-white" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <ForwardIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
              }}
            />
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="w-1/4 flex justify-end">
          {/* Add volume control or additional buttons here */}
        </div>
      </div>
    </div>
  );
}