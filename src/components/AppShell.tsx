import type { ReactElement, ReactNode } from "react";
import { AppNav } from "@/components/AppNav";

export type AppShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AppShell({
  title,
  description,
  children,
}: AppShellProps): ReactElement {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <AppNav />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
