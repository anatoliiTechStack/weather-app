import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { DEFAULT_USER_ID } from "@/app/api/favorites/constants";
import { HttpStatus } from "@/constants/http-status";
import { toFavoriteCityDto } from "@/app/api/favorites/favorites.mapper";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const createFavoriteSchema = z.object({
  cityName: z
    .string()
    .trim()
    .min(1, "City name is required")
    .transform((value) => value.toLowerCase()),
});

export async function GET(): Promise<NextResponse> {
  try {
    const favorites = await db.favoriteCity.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites.map(toFavoriteCityDto));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.InternalServerError },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = createFavoriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
        { status: HttpStatus.BadRequest },
      );
    }

    const favorite = await db.favoriteCity.create({
      data: {
        userId: DEFAULT_USER_ID,
        cityName: parsed.data.cityName,
      },
    });

    return NextResponse.json(toFavoriteCityDto(favorite), {
      status: HttpStatus.Created,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "City is already in favorites" },
        { status: HttpStatus.Conflict },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.InternalServerError },
    );
  }
}
