export const APP_ROUTES = {
  home: "/",
  favorites: "/favorites",
  weather: (citySlug: string) => `/weather/${citySlug}`,
} as const;

export function buildWeatherCityPath(cityName: string): string {
  return APP_ROUTES.weather(encodeURIComponent(cityName.trim().toLowerCase()));
}
