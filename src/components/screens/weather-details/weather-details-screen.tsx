"use client";

import { useEffect, type ReactElement } from "react";
import { AppShell } from "@/components/AppShell";
import { ClothingRecommendations } from "@/components/ClothingRecommendations";
import { WeatherMain } from "@/components/WeatherMain";
import type { WeatherDetailsScreenProps } from "@/components/screens/weather-details/weather-details.props";
import { slugToCity } from "@/lib/city-url";
import { useWeatherStore } from "@/store/useWeatherStore";

const TITLE = "Weather details";
const DESCRIPTION =
  "Wind, humidity, local time, and personalized clothing recommendations.";

export function WeatherDetailsScreen({
  citySlug,
}: WeatherDetailsScreenProps): ReactElement {
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);
  const cityName = slugToCity(citySlug);

  useEffect(() => {
    if (cityName) {
      void fetchWeather(cityName);
    }
  }, [cityName, fetchWeather]);

  const heading = cityName
    ? cityName.charAt(0).toLocaleUpperCase() + cityName.slice(1)
    : TITLE;

  return (
    <AppShell title={heading} description={DESCRIPTION}>
      <div className="flex max-w-xl flex-col gap-8">
        <WeatherMain variant="full" />
        <ClothingRecommendations />
      </div>
    </AppShell>
  );
}
