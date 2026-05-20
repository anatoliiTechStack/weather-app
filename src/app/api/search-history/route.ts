import { NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/app/api/favorites/constants";
import { toSearchHistoryEntryDto } from "@/app/api/search-history/search-history.mapper";
import { HttpStatus } from "@/constants/http-status";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const HISTORY_PAGE_SIZE = 50;

export async function GET(): Promise<NextResponse> {
  try {
    const entries = await db.searchHistory.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
      take: HISTORY_PAGE_SIZE,
    });

    return NextResponse.json(entries.map(toSearchHistoryEntryDto));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.InternalServerError },
    );
  }
}
