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
