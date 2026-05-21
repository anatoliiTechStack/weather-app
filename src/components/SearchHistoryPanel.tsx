"use client";

import Link from "next/link";
import { useEffect, useMemo, type ReactElement } from "react";
import { buildWeatherCityPath } from "@/constants/app-routes";
import { useWeatherStore } from "@/store/useWeatherStore";
import type { SearchHistoryEntryDto } from "@/types";

const HISTORY_TITLE = "Search history";
const EMPTY_HISTORY = "History is empty — perform a search.";
const PANEL_ARIA_LABEL = "Recent searches";

function formatCityLabel(cityName: string): string {
  const trimmedCityName = cityName.trim();
  if (!trimmedCityName) return trimmedCityName;
  return (
    trimmedCityName.charAt(0).toLocaleUpperCase() + trimmedCityName.slice(1)
  );
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

export function SearchHistoryPanel(): ReactElement {
  const searchHistory = useWeatherStore((state) => state.searchHistory);
  const sidebarError = useWeatherStore((state) => state.sidebarError);
  const loadSearchHistory = useWeatherStore((state) => state.loadSearchHistory);

  useEffect(() => {
    void loadSearchHistory();
  }, [loadSearchHistory]);

  const historyRows = useMemo(
    () => dedupeHistoryByCity(searchHistory),
    [searchHistory]
  );

  const listLinkClass =
    "block w-full truncate rounded-md px-2 py-1.5 text-left text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800";

  return (
    <aside className="w-full shrink-0 lg:w-80" aria-label={PANEL_ARIA_LABEL}>
      {sidebarError && (
        <div
          className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          {sidebarError}
        </div>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {HISTORY_TITLE}
        </h2>
        {historyRows.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {EMPTY_HISTORY}
          </p>
        ) : (
          <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
            {historyRows.map((row) => (
              <li key={row.id}>
                <Link
                  href={buildWeatherCityPath(row.cityName)}
                  className={listLinkClass}
                >
                  {formatCityLabel(row.cityName)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
