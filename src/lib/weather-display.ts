export function weatherEmoji(main: string): string {
  const key = main.toLowerCase();
  switch (true) {
    case key.includes("clear"):
      return "☀️";
    case key.includes("cloud"):
      return "☁️";
    case key.includes("rain") || key.includes("drizzle"):
      return "🌧️";
    case key.includes("snow"):
      return "❄️";
    case key.includes("thunder"):
      return "⛈️";
    case key.includes("mist") || key.includes("fog") || key.includes("haze"):
      return "🌫️";
    default:
      return "🌤️";
  }
}

export function formatOneDecimal(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
