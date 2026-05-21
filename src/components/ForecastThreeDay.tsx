"use client";

import type { ReactElement } from "react";
import { formatOneDecimal, weatherEmoji } from "@/lib/weather-display";
import { useWeatherStore } from "@/store/useWeatherStore";

const SECTION_TITLE = "3-day forecast";
const MIN_MAX_SEPARATOR = "–";

export function ForecastThreeDay(): ReactElement | null {
  const currentWeather = useWeatherStore((s) => s.currentWeather);
  const isLoading = useWeatherStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <section
        className="w-full max-w-xl animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
        aria-busy="true"
        aria-label={SECTION_TITLE}
      >
        <div className="mb-4 h-5 w-36 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="h-24 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-24 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-24 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </section>
    );
  }

  const days = currentWeather?.forecastDays;
  if (!days?.length) {
    return null;
  }

  return (
    <section
      className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      aria-label={SECTION_TITLE}
    >
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {SECTION_TITLE}
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {days.map((day) => (
          <li
            key={day.date}
            className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40"
          >
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {day.dayLabel}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl" aria-hidden>
                {weatherEmoji(day.weatherMain)}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                {day.weatherMain}
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatOneDecimal(day.minTemperatureC)}
              {MIN_MAX_SEPARATOR}
              {formatOneDecimal(day.maxTemperatureC)}°C
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
