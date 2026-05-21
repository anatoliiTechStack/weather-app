import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cache } from "@/lib/cache";
import { db } from "@/lib/db";
import { HttpStatus } from "@/constants/http-status";
import {
  weatherService,
  WeatherServiceError,
} from "@/services/weather.service";
import type { WeatherResponseDto } from "@/types";

export const runtime = "nodejs";

const DEFAULT_USER_ID = "user_default";

const weatherQuerySchema = z.object({
  city: z
    .string()
    .trim()
    .min(1, "City name is required")
    .transform((value) => value.toLowerCase()),
});

function buildWeatherCacheKey(normalizedCity: string): string {
  return `weather:city:${normalizedCity}`;
}

function parseWeatherQuery(request: NextRequest): z.infer<typeof weatherQuerySchema> {
  const result = weatherQuerySchema.safeParse({
    city: request.nextUrl.searchParams.get("city") ?? "",
  });

  if (!result.success) {
    throw WeatherServiceError.create(
      "VALIDATION",
      result.error.issues[0]?.message ?? "Invalid query",
    );
  }

  return result.data;
}

async function recordSearchHistory(cityName: string): Promise<void> {
  await db.searchHistory.create({
    data: {
      userId: DEFAULT_USER_ID,
      cityName,
    },
  });
}

function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof WeatherServiceError) {
    switch (error.code) {
      case "NOT_FOUND":
        return NextResponse.json(
          { error: error.message },
          { status: HttpStatus.NotFound },
        );
      case "VALIDATION":
      case "INVALID_PAYLOAD":
        return NextResponse.json(
          { error: error.message },
          { status: HttpStatus.BadRequest },
        );
      case "RATE_LIMIT":
        return NextResponse.json(
          { error: error.message },
          { status: HttpStatus.ServiceUnavailable },
        );
      case "UPSTREAM":
      case "CONFIG":
        return NextResponse.json(
          { error: error.message },
          { status: HttpStatus.BadGateway },
        );
    }
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: HttpStatus.InternalServerError },
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { city: normalizedCity } = parseWeatherQuery(request);
    const cacheKey = buildWeatherCacheKey(normalizedCity);

    const weather = await cache.getOrSet<WeatherResponseDto>(cacheKey, () =>
      weatherService.fetchWeatherByCity(normalizedCity),
    );

    await recordSearchHistory(normalizedCity);

    return NextResponse.json(weather);
  } catch (error) {
    return toErrorResponse(error);
  }
}
