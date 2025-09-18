// src/app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Row = { word: string; picks: number };

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") || "today").toLowerCase();

    let rows: Row[] = [];

    if (period === "all") {
        rows = await sql<Row>`
      SELECT word, COUNT(*)::int AS picks
      FROM pick
      GROUP BY word
      ORDER BY picks DESC
      LIMIT 10
    `;
    } else if (period === "week") {
        rows = await sql<Row>`
      SELECT word, COUNT(*)::int AS picks
      FROM pick
      WHERE created_at >= now() - interval '7 days'
      GROUP BY word
      ORDER BY picks DESC
      LIMIT 10
    `;
    } else {
        // "today" (default)
        rows = await sql<Row>`
      SELECT word, COUNT(*)::int AS picks
      FROM pick
      WHERE created_at >= date_trunc('day', now())
      GROUP BY word
      ORDER BY picks DESC
      LIMIT 10
    `;
    }

    return NextResponse.json({ period, rows });
}
