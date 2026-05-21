import type { SearchHistory } from "@prisma/client";
import type { SearchHistoryEntryDto } from "@/types";

export function toSearchHistoryEntryDto(
  record: SearchHistory,
): SearchHistoryEntryDto {
  return {
    id: record.id,
    userId: record.userId,
    cityName: record.cityName,
    createdAt: record.createdAt.toISOString(),
  };
}
