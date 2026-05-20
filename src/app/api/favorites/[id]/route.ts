import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_USER_ID } from "@/app/api/favorites/constants";
import { db } from "@/lib/db";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const result = await db.favoriteCity.deleteMany({
      where: {
        id,
        userId: DEFAULT_USER_ID,
      },
    });

    const isResultEmpty = result.count === 0;

    if (isResultEmpty) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
