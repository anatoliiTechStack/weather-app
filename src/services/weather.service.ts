import type { WeatherResponseDto } from "@/types";
import {
  owmCurrentWeatherResponseSchema,
  type OwmCurrentWeatherResponse,
} from "@/services/schemas/owm.schema";
import {
  DEFAULT_OWM_BASE_URL,
  OWM_HTTP_ERRORS,
  PRECIPITATION_CONDITIONS,
  SNOW_CONDITIONS,
} from "@/services/weather.constants";
import { WeatherServiceError } from "@/services/weather.errors";
import { TemperatureBand } from "@/services/temperature-band.enum";

export type { WeatherServiceErrorCode } from "@/services/weather.errors";
export { WeatherServiceError } from "@/services/weather.errors";

export class WeatherService {
  private getApiKey(): string {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      throw WeatherServiceError.create(
        "CONFIG",
        "OPENWEATHERMAP_API_KEY is not configured",
      );
    }
    return apiKey;
  }

  private getBaseUrl(): string {
    return process.env.OWM_BASE_URL ?? DEFAULT_OWM_BASE_URL;
  }

  async fetchWeatherByCity(city: string): Promise<WeatherResponseDto> {
    const trimmedCity = this.parseCityName(city);
    const response = await fetch(this.buildWeatherRequestUrl(trimmedCity));

    this.assertOwmHttpResponse(response);

    const raw = await this.parseOwmPayload(await response.json());
    return this.mapToDto(raw);
  }

  private parseCityName(city: string): string {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      throw WeatherServiceError.create("VALIDATION", "City name is required");
    }
    return trimmedCity;
  }

  private buildWeatherRequestUrl(city: string): URL {
    const url = new URL(`${this.getBaseUrl()}/weather`);
    url.searchParams.set("q", city);
    url.searchParams.set("appid", this.getApiKey());
    url.searchParams.set("units", "metric");
    return url;
  }

  private assertOwmHttpResponse(response: Response): void {
    if (response.ok) {
      return;
    }

    const knownError = OWM_HTTP_ERRORS.get(response.status);
    if (knownError) {
      throw WeatherServiceError.create(knownError.code, knownError.message);
    }

    throw WeatherServiceError.create(
      "UPSTREAM",
      `OpenWeatherMap request failed with status ${response.status}`,
    );
  }

  private parseOwmPayload(payload: unknown): OwmCurrentWeatherResponse {
    const parsed = owmCurrentWeatherResponseSchema.safeParse(payload);

    if (!parsed.success) {
      throw WeatherServiceError.create(
        "INVALID_PAYLOAD",
        "OpenWeatherMap response failed validation",
      );
    }

    return parsed.data;
  }

  private mapToDto(raw: OwmCurrentWeatherResponse): WeatherResponseDto {
    const weatherMains = raw.weather.map((item) => item.main);

    return {
      cityName: raw.name,
      temperatureC: raw.main.temp,
      feelsLikeC: raw.main.feels_like,
      humidity: raw.main.humidity,
      windSpeedMs: raw.wind.speed,
      weatherMain: weatherMains[0] ?? "Unknown",
      localTime: this.buildLocalTime(raw.timezone),
      clothingRecommendations: this.buildClothingRecommendations(
        raw.main.temp,
        raw.main.feels_like,
        weatherMains,
      ),
    };
  }

  private buildLocalTime(timezoneOffsetSeconds: number): string {
    const localMs = Date.now() + timezoneOffsetSeconds * 1000;
    const localDate = new Date(localMs);
    const hours = localDate.getUTCHours().toString().padStart(2, "0");
    const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  private resolveTemperatureBand(tempC: number): TemperatureBand {
    switch (true) {
      case tempC < -10:
        return TemperatureBand.ExtremeCold;
      case tempC < 0:
        return TemperatureBand.Freezing;
      case tempC < 10:
        return TemperatureBand.Cold;
      case tempC < 18:
        return TemperatureBand.Cool;
      case tempC < 24:
        return TemperatureBand.Mild;
      case tempC < 30:
        return TemperatureBand.Warm;
      default:
        return TemperatureBand.Hot;
    }
  }

  private buildClothingRecommendations(
    tempC: number,
    feelsLikeC: number,
    weatherMains: string[],
  ): string[] {
    const effectiveTemp = Math.min(tempC, feelsLikeC);
    const recommendations: string[] = [];

    switch (this.resolveTemperatureBand(effectiveTemp)) {
      case TemperatureBand.ExtremeCold:
        recommendations.push("Heavy down jacket or winter coat");
        recommendations.push("Warm hat, scarf, and gloves");
        break;
      case TemperatureBand.Freezing:
        recommendations.push("Winter jacket and warm layers");
        recommendations.push("Hat and gloves");
        break;
      case TemperatureBand.Cold:
        recommendations.push("Warm coat or jacket");
        recommendations.push("Sweater and long pants");
        break;
      case TemperatureBand.Cool:
        recommendations.push("Light jacket or windbreaker");
        recommendations.push("Long-sleeve top");
        break;
      case TemperatureBand.Mild:
        recommendations.push("T-shirt and a light outer layer");
        break;
      case TemperatureBand.Warm:
        recommendations.push("Light breathable clothing");
        recommendations.push("Sun hat or cap");
        break;
      case TemperatureBand.Hot:
        recommendations.push("Very light clothing");
        recommendations.push("Stay hydrated");
        break;
    }

    const hasPrecipitation = weatherMains.some((main) =>
      PRECIPITATION_CONDITIONS.has(main),
    );
    const hasSnow = weatherMains.some((main) => SNOW_CONDITIONS.has(main));

    if (hasSnow) {
      recommendations.push("Waterproof boots and warm socks");
    }
    if (hasPrecipitation) {
      recommendations.push("Umbrella or waterproof jacket");
    }
    if (weatherMains.includes("Thunderstorm")) {
      recommendations.push("Stay indoors if possible");
    }

    return [...new Set(recommendations)];
  }
}

export const weatherService = new WeatherService();
