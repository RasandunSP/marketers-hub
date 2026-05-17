import { NextRequest, NextResponse } from "next/server";
import { parseCsv } from "@/lib/csv";
import { fetchSheetCsv } from "@/lib/sheet-fetch";
import { NO_CACHE_HEADERS } from "@/lib/sheet-config";
import { enrichResourcesMedia } from "@/lib/enrich-resources";
import {
  fetchResourcesFromSheet,
  getSkippedSheetRows,
  rowsToResources,
} from "@/lib/sheet";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const debug = request.nextUrl.searchParams.get("debug") === "1";

    if (debug) {
      const csv = await fetchSheetCsv();
      const rows = parseCsv(csv);
      const parsed = rowsToResources(rows);
      const data = {
        resources: await enrichResourcesMedia(parsed),
        fetchedAt: new Date().toISOString(),
        skipped: getSkippedSheetRows(rows),
      };
      return NextResponse.json(data, {
        headers: {
          ...NO_CACHE_HEADERS,
          "X-Resources-Fetched-At": data.fetchedAt,
        },
      });
    }

    const data = await fetchResourcesFromSheet();

    return NextResponse.json(data, {
      headers: {
        ...NO_CACHE_HEADERS,
        "X-Resources-Fetched-At": data.fetchedAt,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load resources";
    return NextResponse.json(
      { error: message },
      {
        status: 502,
        headers: NO_CACHE_HEADERS,
      },
    );
  }
}
