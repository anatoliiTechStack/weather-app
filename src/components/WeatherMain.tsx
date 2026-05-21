"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { buildWeatherCityPath } from "@/constants/app-routes";
import { formatOneDecimal, weatherEmoji } from "@/lib/weather-display";
import { useWeatherStore } from "@/store/useWeatherStore";

export type WeatherMainVariant = "summary" | "full";

export type WeatherMainProps = {
  variant?: WeatherMainVariant;
};

const SKELETON_LOADING_MESSAGE = "Loading weather…";
const ERROR_MESSAGE = "Failed to load weather";
const EMPTY_MESSAGE =
  "Enter the city name and press «Search» to see current weather.";
const FEELS_LIKE_MESSAGE = "Feels like:";
const LOCAL_TIME_MESSAGE = "Local time:";
const HUMIDITY_MESSAGE = "Humidity:";
const WIND_SPEED_MESSAGE = "Wind speed:";
const WIND_SPEED_UNIT = "m/s";
const ADD_FAVORITE_LABEL = "Add to favorites";
const IN_FAVORITES_LABEL = "In favorites";
const DETAILS_LINK_LABEL = "View full details";

function WeatherSkeleton(): ReactElement {
  return (
    <div
      className="w-full max-w-xl animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{SKELETON_LOADING_MESSAGE}</span>
      <div className="mb-4 h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-6 h-4 w-56 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-2 h-14 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-6 h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function WeatherMain({
  variant = "full",
}: WeatherMainProps): ReactElement {
  const currentWeather = useWeatherStore((s) => s.currentWeather);
  const isLoading = useWeatherStore((s) => s.isLoading);
  const error = useWeatherStore((s) => s.error);
  const favorites = useWeatherStore((s) => s.favorites);
  const addFavorite = useWeatherStore((s) => s.addFavorite);
  const isSummary = variant === "summary";

  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return (
      <div
        className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
        role="alert"
      >
        <p className="font-medium">{ERROR_MESSAGE}</p>
        <p className="mt-1 text-sm opacity-90">{error}</p>
      </div>
    );
  }

  if (!currentWeather) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 px-4 py-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400">
        {EMPTY_MESSAGE}
      </div>
    );
  }

  const w = currentWeather;
  const isInFavorites = favorites.some(
    (f) => f.cityName.toLowerCase() === w.cityName.trim().toLowerCase()
  );
  const detailsHref = buildWeatherCityPath(w.cityName);

  return (
    <article className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-6 border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {w.cityName}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {LOCAL_TIME_MESSAGE} {w.localTime}
            </p>
          </div>
          {!isSummary ? (
            <button
              type="button"
              disabled={isInFavorites}
              aria-pressed={isInFavorites}
              aria-label={
                isInFavorites ? IN_FAVORITES_LABEL : ADD_FAVORITE_LABEL
              }
              title={isInFavorites ? IN_FAVORITES_LABEL : ADD_FAVORITE_LABEL}
              onClick={() => {
                void addFavorite(w.cityName);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-default ${
                isInFavorites
                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <StarIcon filled={isInFavorites} />
              <span className="hidden sm:inline">
                {isInFavorites ? IN_FAVORITES_LABEL : ADD_FAVORITE_LABEL}
              </span>
            </button>
          ) : null}
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <p className="text-5xl font-light tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatOneDecimal(w.temperatureC)}
            <span className="text-3xl font-normal text-zinc-400 dark:text-zinc-500">
              °C
            </span>
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {FEELS_LIKE_MESSAGE}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {formatOneDecimal(w.feelsLikeC)}°C
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800/80">
          <span className="text-3xl" aria-hidden>
            {weatherEmoji(w.weatherMain)}
          </span>
          <span className="text-sm font-medium uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
            {w.weatherMain}
          </span>
        </div>
      </div>

      {isSummary ? (
        <Link
          href={detailsHref}
          className="inline-flex items-center text-sm font-medium text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          {DETAILS_LINK_LABEL} →
        </Link>
      ) : (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
            <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {HUMIDITY_MESSAGE}
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {w.humidity}%
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
            <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {WIND_SPEED_MESSAGE}
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {formatOneDecimal(w.windSpeedMs)} {WIND_SPEED_UNIT}
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}
