export type FavoriteCityDto = {
  id: string;
  userId: string;
  cityName: string;
  createdAt: string;
  updatedAt: string;
};

export type SearchHistoryEntryDto = {
  id: string;
  userId: string;
  cityName: string;
  createdAt: string;
};

export type CreateFavoriteCityInput = {
  userId: string;
  cityName: string;
};

export type RecordSearchInput = {
  userId: string;
  cityName: string;
};

export type ForecastDayDto = {
  date: string;
  dayLabel: string;
  minTemperatureC: number;
  maxTemperatureC: number;
  weatherMain: string;
};

export type WeatherResponseDto = {
  cityName: string;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  windSpeedMs: number;
  weatherMain: string;
  localTime: string;
  sunriseLocal: string;
  sunsetLocal: string;
  uvIndex: number | null;
  clothingRecommendations: string[];
  forecastDays: ForecastDayDto[];
};
