import React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';
import { TouristSpot } from '@/types/publickChatType';

interface TouristSpotHeaderProps {
  spots: TouristSpot[];
  activeSpot: string | null;
  onSpotSelect: (spotId: string) => void;
  messageCount: number;
}

const TouristSpotHeader: React.FC<TouristSpotHeaderProps> = ({
  spots,
  activeSpot,
  onSpotSelect,
  messageCount,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gabaldon Tourist Spots
              </h1>
              <p className="text-sm text-gray-500">
                Discover and share experiences
              </p>
            </div>
          </div>

          {activeSpot && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle size={18} />
              <span className="text-sm font-medium">
                {messageCount} messages
              </span>
            </div>
          )}
        </div>

        {/* Tourist Spots Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => onSpotSelect("")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all ${
              !activeSpot
                ? "bg-gradient-primary text-white shadow-md"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All Spots
          </button>
          {spots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSpotSelect(spot.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSpot === spot.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {spot.name}
            </button>
          ))}
        </div>

        {/* Active Spot Info */}
        {activeSpot && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
            {(() => {
              const spot = spots.find((s) => s.id === activeSpot);
              return spot ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                    <p className="text-sm text-gray-600">{spot.description}</p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </header>
  );
};

export default TouristSpotHeader;