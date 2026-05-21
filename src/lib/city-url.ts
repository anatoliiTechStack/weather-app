export function slugToCity(slug: string): string {
  return decodeURIComponent(slug).trim();
}
