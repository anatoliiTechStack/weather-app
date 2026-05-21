"use client";

import { create } from "zustand";
import {
  API_ROUTES,
  buildFavoriteByIdUrl,
  buildWeatherQueryUrl,
  HttpStatus,
} from "@/constants";
import type {
  FavoriteCityDto as FavoriteCity,
  SearchHistoryEntryDto,
  WeatherResponseDto,
} from "@/types";

const NETWORK_ERROR_MESSAGE = "Network error";

type WeatherStore = {
  currentWeather: WeatherResponseDto | null;
  favorites: FavoriteCity[];
  searchHistory: SearchHistoryEntryDto[];
  isLoading: boolean;
  error: string | null;
  sidebarError: string | null;
  fetchWeather: (city: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  loadSearchHistory: () => Promise<void>;
  addFavorite: (cityName: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
};

async function readApiErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    const isDataObject = typeof data === "object" && data !== null;
    const isErrorProperty = isDataObject && "error" in data;
    const isErrorString =
      isErrorProperty && typeof (data as { error: unknown }).error === "string";
    if (isErrorProperty && isErrorString) {
      return (data as { error: string }).error;
    }
  } catch {
    console.error("Failed to read API error message");
  }
  return response.statusText || NETWORK_ERROR_MESSAGE;
}

function upsertFavorite(
  favorites: FavoriteCity[],
  favorite: FavoriteCity
): FavoriteCity[] {
  const rest = favorites.filter(
    (existing) => existing.id !== favorite.id,
  );
  return [favorite, ...rest];
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentWeather: null,
  favorites: [],
  searchHistory: [],
  isLoading: false,
  error: null,
  sidebarError: null,

  fetchWeather: async (city: string) => {
    set({ isLoading: true, error: null });
    try {
      const query = city.trim();
      const res = await fetch(buildWeatherQueryUrl(query));

      if (!res.ok) {
        set({
          currentWeather: null,
          error: await readApiErrorMessage(res),
        });
        return;
      }

      const data = (await res.json()) as WeatherResponseDto;
      set({ currentWeather: data, error: null });
      void useWeatherStore.getState().loadSearchHistory();
    } catch {
      set({ currentWeather: null, error: NETWORK_ERROR_MESSAGE });
    } finally {
      set({ isLoading: false });
    }
  },

  loadFavorites: async () => {
    try {
      const res = await fetch(API_ROUTES.favorites);

      if (!res.ok) {
        set({ sidebarError: await readApiErrorMessage(res) });
        return;
      }

      const data = (await res.json()) as FavoriteCity[];
      set({ favorites: data, sidebarError: null });
    } catch {
      set({ sidebarError: NETWORK_ERROR_MESSAGE });
    }
  },

  loadSearchHistory: async () => {
    try {
      const res = await fetch(API_ROUTES.searchHistory);

      if (!res.ok) {
        set({ sidebarError: await readApiErrorMessage(res) });
        return;
      }

      const data = (await res.json()) as SearchHistoryEntryDto[];
      set({ searchHistory: data, sidebarError: null });
    } catch {
      set({ sidebarError: NETWORK_ERROR_MESSAGE });
    }
  },

  addFavorite: async (cityName: string) => {
    try {
      const res = await fetch(API_ROUTES.favorites, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName: cityName.trim() }),
      });

      if (res.status === HttpStatus.Created) {
        const favorite = (await res.json()) as FavoriteCity;
        set((state) => ({
          favorites: upsertFavorite(state.favorites, favorite),
          sidebarError: null,
        }));
        return;
      }

      if (res.status === HttpStatus.Conflict) {
        const listRes = await fetch(API_ROUTES.favorites);
        if (!listRes.ok) {
          set({ sidebarError: await readApiErrorMessage(listRes) });
          return;
        }
        const list = (await listRes.json()) as FavoriteCity[];
        set({ favorites: list, sidebarError: null });
        return;
      }

      set({ sidebarError: await readApiErrorMessage(res) });
    } catch {
      set({ sidebarError: NETWORK_ERROR_MESSAGE });
    }
  },

  removeFavorite: async (id: string) => {
    try {
      const res = await fetch(buildFavoriteByIdUrl(id), {
        method: "DELETE",
      });

      if (res.status === HttpStatus.NoContent) {
        set((state) => ({
          favorites: state.favorites.filter(
            (existing) => existing.id !== id,
          ),
          sidebarError: null,
        }));
        return;
      }

      set({ sidebarError: await readApiErrorMessage(res) });
    } catch {
      set({ sidebarError: NETWORK_ERROR_MESSAGE });
    }
  },
}));
