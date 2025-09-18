// =============================================
// 5) API: stats for a session (streak, last pick, count)
// =============================================
// Place in: src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");
        if (!sessionId)
            return NextResponse.json(
                { error: "Missing sessionId" },
                { status: 400 },
            );

        const picks = await sql<
            {
                word: string;
                created_at: string;
            }[]
        >`SELECT word, created_at FROM pick WHERE session_id = ${sessionId} ORDER BY created_at DESC LIMIT 50`;

        // compute simple daily streak from most recent backwards
        const days = new Set(
            picks.map((p) => new Date(p.created_at).toDateString()),
        );
        let streak = 0;
        let cursor = new Date();
        const todayKey = cursor.toDateString();
        // If no pick today, streak is 0; else count contiguous days
        if (days.has(todayKey)) {
            while (days.has(cursor.toDateString())) {
                streak += 1;
                cursor.setDate(cursor.getDate() - 1);
            }
        }

        return NextResponse.json({
            total: Number(
                (
                    await sql`SELECT COUNT(*) FROM pick WHERE session_id = ${sessionId}`
                )[0].count || 0,
            ),
            lastPick: picks[0] ?? null,
            streak,
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message ?? "stats error" },
            { status: 500 },
        );
    }
}
