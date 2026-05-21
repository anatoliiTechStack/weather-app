import type { ForecastDayDto } from "@/types";
import type { OwmForecastListItem } from "@/services/schemas/owm.schema";

export const FORECAST_DAY_COUNT = 3;

type DayBucket = {
  temps: number[];
  mains: string[];
};

function localDateKey(epochMs: number, timezoneOffsetSeconds: number): string {
  const localMs = epochMs + timezoneOffsetSeconds * 1000;
  const date = new Date(localMs);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const [yearPart, monthPart, dayPart] = dateKey.split("-").map(Number);
  const utcMs = Date.UTC(yearPart, monthPart - 1, dayPart + days, 12, 0, 0);
  const shiftedDate = new Date(utcMs);
  const year = shiftedDate.getUTCFullYear();
  const month = String(shiftedDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shiftedDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildDayLabel(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) {
    return "Today";
  }
  if (dateKey === addDaysToDateKey(todayKey, 1)) {
    return "Tomorrow";
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const weekdayMs = Date.UTC(year, month - 1, day, 12, 0, 0);
  const weekday = new Date(weekdayMs).toLocaleDateString("en-US", {
    weekday: "short",
  });
  return weekday;
}

function dominantWeatherMain(mains: string[]): string {
  const counts = new Map<string, number>();
  for (const weatherMain of mains) {
    counts.set(weatherMain, (counts.get(weatherMain) ?? 0) + 1);
  }

  let winner = mains[0] ?? "Unknown";
  let maxCount = 0;
  for (const [weatherMain, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      winner = weatherMain;
    }
  }
  return winner;
}

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function buildForecastDays(
  items: OwmForecastListItem[],
  timezoneOffsetSeconds: number,
  dayCount: number = FORECAST_DAY_COUNT,
): ForecastDayDto[] {
  const todayKey = localDateKey(Date.now(), timezoneOffsetSeconds);
  const buckets = new Map<string, DayBucket>();

  for (const forecastSlot of items) {
    const dateKey = localDateKey(
      forecastSlot.dt * 1000,
      timezoneOffsetSeconds,
    );
    if (dateKey < todayKey) {
      continue;
    }

    const bucket = buckets.get(dateKey) ?? { temps: [], mains: [] };
    bucket.temps.push(forecastSlot.main.temp);
    bucket.mains.push(forecastSlot.weather[0]?.main ?? "Unknown");
    buckets.set(dateKey, bucket);
  }

  const dateKeys = [...buckets.keys()].sort().slice(0, dayCount);

  return dateKeys.map((dateKey) => {
    const bucket = buckets.get(dateKey);
    if (!bucket || bucket.temps.length === 0) {
      return {
        date: dateKey,
        dayLabel: buildDayLabel(dateKey, todayKey),
        minTemperatureC: 0,
        maxTemperatureC: 0,
        weatherMain: "Unknown",
      };
    }

    return {
      date: dateKey,
      dayLabel: buildDayLabel(dateKey, todayKey),
      minTemperatureC: roundOneDecimal(Math.min(...bucket.temps)),
      maxTemperatureC: roundOneDecimal(Math.max(...bucket.temps)),
      weatherMain: dominantWeatherMain(bucket.mains),
    };
  });
}
