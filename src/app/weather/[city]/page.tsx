import type { ReactElement } from "react";
import { WeatherDetailsScreen } from "@/components/screens/weather-details";

type WeatherCityPageProps = {
  params: Promise<{ city: string }>;
};

export default async function WeatherCityPage({
  params,
}: WeatherCityPageProps): Promise<ReactElement> {
  const { city } = await params;
  return <WeatherDetailsScreen citySlug={city} />;
}
