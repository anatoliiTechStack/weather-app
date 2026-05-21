"use client";

import type { ReactElement } from "react";
import { AppShell } from "@/components/AppShell";
import { SearchHistoryPanel } from "@/components/SearchHistoryPanel";
import { ForecastThreeDay } from "@/components/ForecastThreeDay";
import { SearchInput } from "@/components/SearchInput";
import { WeatherMain } from "@/components/WeatherMain";

const TITLE = "Weather";
const DESCRIPTION =
  "Search by city for current conditions and a 3-day forecast. Open a city for full details and outfit tips.";

export function HomeScreen(): ReactElement {
  return (
    <AppShell title={TITLE} description={DESCRIPTION}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <SearchInput />
          <WeatherMain variant="summary" />
          <ForecastThreeDay />
        </div>
        <SearchHistoryPanel />
      </div>
    </AppShell>
  );
}
