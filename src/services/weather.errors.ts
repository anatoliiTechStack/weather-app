export type WeatherServiceErrorCode =
  | "CONFIG"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "UPSTREAM"
  | "INVALID_PAYLOAD"
  | "VALIDATION";

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public readonly code: WeatherServiceErrorCode,
  ) {
    super(message);
    this.name = "WeatherServiceError";
  }

  static create(
    code: WeatherServiceErrorCode,
    message: string,
  ): WeatherServiceError {
    return new WeatherServiceError(message, code);
  }
}
