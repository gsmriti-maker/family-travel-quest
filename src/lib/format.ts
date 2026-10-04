export function formatDuration(minutes: number | null): string {
  if (minutes == null || Number.isNaN(minutes)) return "Time not ready";
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h <= 0) return `${rem} min`;
  if (rem === 0) return h === 1 ? "1 hour" : `${h} hours`;
  return `${h} hr ${rem} min`;
}

export function formatDistance(meters: number | null): string {
  if (meters == null) return "";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function youtubeIntroUrl(city: string): string {
  const q = `${city} short introduction for children`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export function normalizeCity(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
