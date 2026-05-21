"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { APP_ROUTES } from "@/constants/app-routes";

const NAV_HOME_LABEL = "Home";
const NAV_FAVORITES_LABEL = "Favorites";
const NAV_ARIA_LABEL = "Main navigation";

const NAV_ITEMS = [
  { href: APP_ROUTES.home, label: NAV_HOME_LABEL, match: (path: string) => path === APP_ROUTES.home },
  {
    href: APP_ROUTES.favorites,
    label: NAV_FAVORITES_LABEL,
    match: (path: string) => path.startsWith(APP_ROUTES.favorites),
  },
] as const;

export function AppNav(): ReactElement {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800"
      aria-label={NAV_ARIA_LABEL}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
              isActive
                ? "bg-sky-600 text-white dark:bg-sky-500"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
