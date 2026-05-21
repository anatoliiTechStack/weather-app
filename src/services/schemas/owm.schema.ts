import { z } from "zod";

export const owmWeatherConditionSchema = z.object({
  main: z.string(),
});

export const owmCurrentWeatherResponseSchema = z.object({
  name: z.string(),
  timezone: z.number().int(),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({
    speed: z.number(),
  }),
  weather: z.array(owmWeatherConditionSchema).min(1),
});

export type OwmCurrentWeatherResponse = z.infer<
  typeof owmCurrentWeatherResponseSchema
>;

export const owmForecastListItemSchema = z.object({
  dt: z.number().int(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
  }),
  weather: z.array(owmWeatherConditionSchema).min(1),
});

export const owmForecastResponseSchema = z.object({
  list: z.array(owmForecastListItemSchema).min(1),
  city: z.object({
    name: z.string(),
    timezone: z.number().int(),
  }),
});

export type OwmForecastListItem = z.infer<typeof owmForecastListItemSchema>;
export type OwmForecastResponse = z.infer<typeof owmForecastResponseSchema>;
