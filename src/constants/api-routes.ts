export const API_ROUTES = {
  weather: "/api/weather",
  favorites: "/api/favorites",
} as const;

export function buildWeatherQueryUrl(city: string): string {
  return `${API_ROUTES.weather}?city=${encodeURIComponent(city)}`;
}

export function buildFavoriteByIdUrl(id: string): string {
  return `${API_ROUTES.favorites}/${encodeURIComponent(id)}`;
}
