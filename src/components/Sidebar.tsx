"use client";

import { useEffect, useMemo, type ReactElement } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import type { SearchHistoryEntryDto } from "@/types";

const FAVORITES_TITLE = "Favorites";
const HISTORY_TITLE = "Search history";
const EMPTY_FAVORITES = "No favorites yet.";
const EMPTY_HISTORY = "History is empty — perform a search.";
const REMOVE_FROM_FAVORITES_LABEL = "Remove from favorites";
const SIDEBAR_TITLE = "Quick access";

function formatCityLabel(cityName: string): string {
  const t = cityName.trim();
  if (!t) return t;
  return t.charAt(0).toLocaleUpperCase() + t.slice(1);
}

function dedupeHistoryByCity(
  entries: SearchHistoryEntryDto[]
): SearchHistoryEntryDto[] {
  const seen = new Set<string>();
  const result: SearchHistoryEntryDto[] = [];
  for (const entry of entries) {
    const key = entry.cityName.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(entry);
  }
  return result;
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

export function Sidebar(): ReactElement {
  const favorites = useWeatherStore((s) => s.favorites);
  const searchHistory = useWeatherStore((s) => s.searchHistory);
  const sidebarError = useWeatherStore((s) => s.sidebarError);
  const loadFavorites = useWeatherStore((s) => s.loadFavorites);
  const loadSearchHistory = useWeatherStore((s) => s.loadSearchHistory);
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);
  const removeFavorite = useWeatherStore((s) => s.removeFavorite);

  useEffect(() => {
    void loadFavorites();
    void loadSearchHistory();
  }, [loadFavorites, loadSearchHistory]);

  const historyRows = useMemo(
    () => dedupeHistoryByCity(searchHistory),
    [searchHistory]
  );

  const isFavoritesEmpty = favorites.length === 0;
  const isHistoryEmpty = historyRows.length === 0;

  const sectionClass =
    "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900";
  const listButtonClass =
    "min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800";

  const favoriteList = useMemo(() => {
    return (
      <ul className="max-h-52 space-y-1 overflow-y-auto pr-1">
        {favorites.map((favoriteItem) => (
          <li key={favoriteItem.id}>
            <div className="flex items-center gap-1 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
              <button
                type="button"
                className={listButtonClass}
                onClick={() => {
                  void fetchWeather(favoriteItem.cityName);
                }}
              >
                {formatCityLabel(favoriteItem.cityName)}
              </button>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                aria-label={REMOVE_FROM_FAVORITES_LABEL}
                onClick={() => {
                  void removeFavorite(favoriteItem.id);
                }}
              >
                <TrashIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }, [favorites, fetchWeather, removeFavorite, listButtonClass]);

  const historyList = useMemo(
    () => (
      <ul className="max-h-52 space-y-1 overflow-y-auto pr-1">
        {historyRows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              className={`${listButtonClass} w-full`}
              onClick={() => {
                void fetchWeather(row.cityName);
              }}
            >
              {formatCityLabel(row.cityName)}
            </button>
          </li>
        ))}
      </ul>
    ),
    [historyRows, fetchWeather, listButtonClass]
  );

  return (
    <aside
      className="flex w-full shrink-0 flex-col gap-4 lg:w-80"
      aria-label={SIDEBAR_TITLE}
    >
      {sidebarError && (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          {sidebarError}
        </div>
      )}

      <section
        className={sectionClass}
        aria-labelledby="sidebar-favorites-heading"
      >
        <h2
          id="sidebar-favorites-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          {FAVORITES_TITLE}
        </h2>
        {isFavoritesEmpty ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {EMPTY_FAVORITES}
          </p>
        ) : (
          favoriteList
        )}
      </section>

      <section
        className={sectionClass}
        aria-labelledby="sidebar-history-heading"
      >
        <h2
          id="sidebar-history-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          {HISTORY_TITLE}
        </h2>
        {isHistoryEmpty ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {EMPTY_HISTORY}
          </p>
        ) : (
          historyList
        )}
      </section>
    </aside>
  );
}
