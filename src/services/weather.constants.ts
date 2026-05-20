import type { WeatherServiceErrorCode } from "@/services/weather.errors";

export const DEFAULT_OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";

export const PRECIPITATION_CONDITIONS = new Set([
  "Rain",
  "Drizzle",
  "Thunderstorm",
]);

export const SNOW_CONDITIONS = new Set(["Snow", "Squall"]);

export type OwmHttpErrorDefinition = {
  code: WeatherServiceErrorCode;
  message: string;
};

export const OWM_HTTP_ERRORS = new Map<number, OwmHttpErrorDefinition>([
  [404, { code: "NOT_FOUND", message: "City not found" }],
  [401, { code: "CONFIG", message: "Invalid OpenWeatherMap API key" }],
  [429, { code: "RATE_LIMIT", message: "OpenWeatherMap rate limit exceeded" }],
]);
