import type { ReactElement } from "react";
import { ClothingRecommendations } from "@/components/ClothingRecommendations";
import { SearchInput } from "@/components/SearchInput";
import { Sidebar } from "@/components/Sidebar";
import { WeatherMain } from "@/components/WeatherMain";

const TITLE_TEXT = "Weather";
const DESCRIPTION_TEXT = "Search by city — data from the server via your API.";

export default function Home(): ReactElement {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {TITLE_TEXT}
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {DESCRIPTION_TEXT}
          </p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <SearchInput />
            <WeatherMain />
            <ClothingRecommendations />
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
