import { NextResponse } from "next/server";
import { fetchResourcesFromSheet } from "@/lib/sheet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchResourcesFromSheet();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load resources";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
