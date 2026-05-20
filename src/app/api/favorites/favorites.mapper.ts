import type { FavoriteCity } from "@prisma/client";
import type { FavoriteCityDto } from "@/types";

export function toFavoriteCityDto(record: FavoriteCity): FavoriteCityDto {
  return {
    id: record.id,
    userId: record.userId,
    cityName: record.cityName,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
