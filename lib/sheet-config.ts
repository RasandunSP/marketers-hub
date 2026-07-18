/** Published CSV export for the AIESEC Link Hub sheet (gid=1902037334). */
export const GOOGLE_SHEET_CSV_URL =
  process.env.GOOGLE_SHEET_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnL5Ke3akHEJ5hrMCfUyZouD1eXn9RNQ0an3X1qqwCm5fJ49STP-btEJIVAM0COvAt1nyree_gGVci/pub?gid=1902037334&single=true&output=csv";

/** How often the browser re-fetches /api/resources (ms). Default: 1 minute. */
export const SHEET_POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_SHEET_POLL_INTERVAL_MS ?? 60_000,
);

/** Response headers so CDNs/browsers do not cache API or sheet data. */
export const NO_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};
