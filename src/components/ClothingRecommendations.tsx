"use client";

import { useMemo, type ReactElement } from "react";
import { useWeatherStore } from "@/store/useWeatherStore";

const SECTION_TITLE = "What to wear";
const CLOTHING_LABEL = "Clothing & layers";
const ACCESSORIES_LABEL = "Accessories";
const TIPS_LABEL = "Tips";

type RecommendationGroup = "clothing" | "accessories" | "tips";

function categorizeRecommendation(text: string): RecommendationGroup {
  const lower = text.toLowerCase();
  const isStayIndoors =
    lower.startsWith("stay ") ||
    lower.includes("hydrated") ||
    lower.includes("indoors");

  const isAccessories =
    lower.includes("umbrella") ||
    lower.includes("sun hat") ||
    /\b(hat|gloves|scarf|cap|boots|socks)\b/.test(lower);

  switch (true) {
    case isAccessories:
      return "accessories";
    case isStayIndoors:
      return "tips";
    default:
      return "clothing";
  }
}

const GROUP_META: Record<
  RecommendationGroup,
  { label: string; icon: string; ariaLabel: string }
> = {
  clothing: {
    label: CLOTHING_LABEL,
    icon: "🧥",
    ariaLabel: "Clothing",
  },
  accessories: {
    label: ACCESSORIES_LABEL,
    icon: "🧣",
    ariaLabel: "Accessories",
  },
  tips: {
    label: TIPS_LABEL,
    icon: "💡",
    ariaLabel: "Tips",
  },
};

function RecommendationList({ items }: { items: string[] }): ReactElement {
  return (
    <ul className="space-y-2" role="list">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-zinc-100 bg-zinc-50/90 px-3 py-2.5 text-sm leading-snug text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-200"
        >
          <span
            className="mt-0.5 shrink-0 text-zinc-400 dark:text-zinc-500"
            aria-hidden
          >
            ·
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function GroupBlock({
  group,
  items,
}: {
  group: RecommendationGroup;
  items: string[];
}): ReactElement {
  const meta = GROUP_META[group];
  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      aria-labelledby={`clothing-group-${group}`}
    >
      <h3
        id={`clothing-group-${group}`}
        className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        <span aria-hidden className="text-lg">
          {meta.icon}
        </span>
        <span className="sr-only">{meta.ariaLabel}: </span>
        {meta.label}
      </h3>
      <RecommendationList items={items} />
    </section>
  );
}

export function ClothingRecommendations(): ReactElement | null {
  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const isLoading = useWeatherStore((state) => state.isLoading);

  const grouped = useMemo(() => {
    if (isLoading || !currentWeather?.clothingRecommendations?.length) {
      return null;
    }
    const clothing: string[] = [];
    const accessories: string[] = [];
    const tips: string[] = [];
    for (const recommendation of currentWeather.clothingRecommendations) {
      switch (categorizeRecommendation(recommendation)) {
        case "accessories":
          accessories.push(recommendation);
          break;
        case "tips":
          tips.push(recommendation);
          break;
        default:
          clothing.push(recommendation);
      }
    }
    return { clothing, accessories, tips };
  }, [currentWeather, isLoading]);

  if (!grouped) {
    return null;
  }

  const blocks: { group: RecommendationGroup; items: string[] }[] = (
    [
      { group: "clothing" as const, items: grouped.clothing },
      { group: "accessories" as const, items: grouped.accessories },
      { group: "tips" as const, items: grouped.tips },
    ] as const
  ).filter((block) => block.items.length > 0);

  const isBlocksEmpty = blocks.length === 0;
  const isBlocksMedium = blocks.length === 2;
  const isBlocksLarge = blocks.length >= 3;

  if (isBlocksEmpty) {
    return null;
  }

  return (
    <aside
      className="w-full max-w-xl"
      aria-label="Clothing recommendations for current weather"
    >
      <h2 className="mb-3 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {SECTION_TITLE}
      </h2>
      <div
        className={`grid gap-4 ${
          isBlocksLarge
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : isBlocksMedium
            ? "sm:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {blocks.map(({ group, items }) => (
          <GroupBlock key={group} group={group} items={items} />
        ))}
      </div>
    </aside>
  );
}
