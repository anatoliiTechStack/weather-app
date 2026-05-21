"use client";

import Link from "next/link";
import { useEffect, type ReactElement } from "react";
import { AppShell } from "@/components/AppShell";
import { buildWeatherCityPath } from "@/constants/app-routes";
import { useWeatherStore } from "@/store/useWeatherStore";

const TITLE = "Favorite cities";
const DESCRIPTION = "Quick access to weather details for saved cities.";
const EMPTY_MESSAGE = "No favorites yet. Search for a city and add it from the details page.";
const REMOVE_LABEL = "Remove from favorites";
const VIEW_WEATHER_PREFIX = "View weather for";

function formatCityLabel(cityName: string): string {
  const trimmedCityName = cityName.trim();
  if (!trimmedCityName) return trimmedCityName;
  return (
    trimmedCityName.charAt(0).toLocaleUpperCase() + trimmedCityName.slice(1)
  );
}

function TrashIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export function FavoritesScreen(): ReactElement {
  const favorites = useWeatherStore((state) => state.favorites);
  const sidebarError = useWeatherStore((state) => state.sidebarError);
  const loadFavorites = useWeatherStore((state) => state.loadFavorites);
  const removeFavorite = useWeatherStore((state) => state.removeFavorite);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  return (
    <AppShell title={TITLE} description={DESCRIPTION}>
      {sidebarError ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          {sidebarError}
        </div>
      ) : null}

      {favorites.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">{EMPTY_MESSAGE}</p>
      ) : (
        <ul className="max-w-xl space-y-2">
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <Link
                  href={buildWeatherCityPath(favorite.cityName)}
                  className="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  <span className="sr-only">
                    {VIEW_WEATHER_PREFIX} {formatCityLabel(favorite.cityName)}
                  </span>
                  {formatCityLabel(favorite.cityName)}
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  aria-label={`${REMOVE_LABEL}: ${formatCityLabel(favorite.cityName)}`}
                  onClick={() => {
                    void removeFavorite(favorite.id);
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
