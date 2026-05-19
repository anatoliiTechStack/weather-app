export type FavoriteCityDto = {
  id: string;
  userId: string;
  cityName: string;
  createdAt: string;
  updatedAt: string;
};

export type SearchHistoryEntryDto = {
  id: string;
  userId: string;
  cityName: string;
  createdAt: string;
};

export type CreateFavoriteCityInput = {
  userId: string;
  cityName: string;
};

export type RecordSearchInput = {
  userId: string;
  cityName: string;
};
