/** Formats a UTC Unix timestamp into HH:MM in the city's OWM timezone offset. */
export function formatUnixUtcToLocalTime(
  unixUtcSeconds: number,
  timezoneOffsetSeconds: number,
): string {
  const localMs = unixUtcSeconds * 1000 + timezoneOffsetSeconds * 1000;
  const localDate = new Date(localMs);
  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
