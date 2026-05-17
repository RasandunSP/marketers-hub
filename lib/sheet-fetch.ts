import { GOOGLE_SHEET_CSV_URL, NO_CACHE_HEADERS } from "./sheet-config";

/** Published Google CSV URLs are heavily cached — bust on every request. */
export function getSheetCsvFetchUrl(): string {
  const separator = GOOGLE_SHEET_CSV_URL.includes("?") ? "&" : "?";
  return `${GOOGLE_SHEET_CSV_URL}${separator}_=${Date.now()}`;
}

export async function fetchSheetCsv(): Promise<string> {
  const response = await fetch(getSheetCsvFetchUrl(), {
    cache: "no-store",
    next: { revalidate: 0 },
    headers: {
      Accept: "text/csv",
      ...NO_CACHE_HEADERS,
    },
  });

  if (!response.ok) {
    throw new Error(`Sheet fetch failed (${response.status})`);
  }

  return response.text();
}
