import React from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  SunSnow as Snow,
  Wind,
  Droplets,
  Eye,
  Thermometer,
} from "lucide-react";

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  icon: "sun" | "cloud" | "rain" | "snow";
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: "sun" | "cloud" | "rain" | "snow";
}

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: Snow,
};

const WeatherCard: React.FC<{
  weather: WeatherData;
  forecast: ForecastDay[];
}> = ({ weather, forecast }) => {
  const WeatherIcon = weatherIcons[weather.icon];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Main Weather Card */}
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Location and Main Weather */}
          <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {weather.location}
            </h1>
            <p className="text-white/80 text-lg mb-4">{weather.country}</p>
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <WeatherIcon className="w-16 h-16 text-white mr-4" />
              <div>
                <span className="text-6xl lg:text-7xl font-light text-white">
                  {weather.temperature}°
                </span>
                <p className="text-xl text-white/90 mt-2">
                  {weather.condition}
                </p>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-6 lg:ml-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Droplets className="w-5 h-5 text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Humidity</span>
              </div>
              <span className="text-2xl font-semibold text-white">
                {weather.humidity}%
              </span>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Wind className="w-5 h-5 text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Wind</span>
              </div>
              <span className="text-2xl font-semibold text-white">
                {weather.windSpeed} km/h
              </span>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Eye className="w-5 h-5 text-white/80 mr-2" />
                <span className="text-white/80 text-sm">Visibility</span>
              </div>
              <span className="text-2xl font-semibold text-white">
                {weather.visibility} km
              </span>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Thermometer className="w-5 h-5 text-white/80 mr-2" />
                <span className="text-white/80 text-sm">UV Index</span>
              </div>
              <span className="text-2xl font-semibold text-white">
                {weather.uvIndex}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 border border-white/30 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {forecast.map((day, index) => {
            const DayIcon = weatherIcons[day.icon];
            return (
              <div
                key={index}
                className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <p className="text-white/80 text-sm mb-3 font-medium">
                  {day.day}
                </p>
                <DayIcon className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-white/90 text-sm mb-2">{day.condition}</p>
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-white font-semibold text-lg">
                    {day.high}°
                  </span>
                  <span className="text-white/60 text-sm">{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
