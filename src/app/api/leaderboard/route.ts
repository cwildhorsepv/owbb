// =============================================
// 6) API: leaderboard (today / week / all)
// =============================================
// Place in: src/app/api/leaderboard/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "today"; // 'today' | 'week' | 'all'

        let rows: { word: string; picks: number }[] = [];
        if (period === "all") {
            rows =
                await sql`SELECT word, COUNT(*)::int AS picks FROM pick GROUP BY word ORDER BY picks DESC LIMIT 10`;
        } else if (period === "week") {
            rows =
                await sql`SELECT word, COUNT(*)::int AS picks FROM pick WHERE created_at >= now() - interval '7 days' GROUP BY word ORDER BY picks DESC LIMIT 10`;
        } else {
            rows =
                await sql`SELECT word, COUNT(*)::int AS picks FROM pick WHERE created_at::date = now()::date GROUP BY word ORDER BY picks DESC LIMIT 10`;
        }

        return NextResponse.json({ period, rows });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message ?? "leaderboard error" },
            { status: 500 },
        );
    }
}
