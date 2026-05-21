"use client";

import {
  type FormEvent,
  useCallback,
  useState,
  type ReactElement,
} from "react";
import { useWeatherStore } from "@/store/useWeatherStore";

const VALIDATION_ERROR_MESSAGE = "Enter the city name";
const PLACEHOLDER_TEXT = "For example, London";
const LABEL_TEXT = "City";
const BUTTON_TEXT = "Search";

export function SearchInput(): ReactElement {
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        setValidationError(VALIDATION_ERROR_MESSAGE);
        return;
      }
      setValidationError(null);
      void fetchWeather(trimmedValue);
    },
    [fetchWeather, value]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-start"
      noValidate
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label htmlFor="city-search" className="sr-only">
          {LABEL_TEXT}
        </label>
        <input
          id="city-search"
          type="text"
          name="city"
          autoComplete="off"
          placeholder={PLACEHOLDER_TEXT}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (validationError) setValidationError(null);
          }}
          className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-none ring-sky-500/40 placeholder:text-zinc-400 focus:border-sky-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          aria-invalid={!!validationError}
          aria-describedby={validationError ? "city-search-error" : undefined}
        />
        {validationError && (
          <p
            id="city-search-error"
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {validationError}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-lg bg-sky-600 px-6 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400"
      >
        {BUTTON_TEXT}
      </button>
    </form>
  );
}
