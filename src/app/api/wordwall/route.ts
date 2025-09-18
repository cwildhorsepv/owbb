// =============================================
// 12) API: Word Wall (cloud) + personal highlight
// =============================================
// Place in: src/app/api/wordwall/route.ts
/*
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const highlight = (searchParams.get("highlight") || "").toLowerCase(); // the user’s chosen word
        const rows = await sql<
            { word: string; total: number; last_seen: string }[]
        >`
SELECT word, total::int, last_seen FROM word_cloud ORDER BY total DESC, last_seen DESC LIMIT 100
`;

        const result = rows.map((r) => ({
            word: r.word,
            weight: Math.max(1, Math.round(Math.log10(r.total + 1) * 8)), // 1..8 size buckets
            isHighlight: highlight && r.word === highlight,
        }));

        return NextResponse.json({ words: result });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message ?? "word wall error" },
            { status: 500 },
        );
    }
}
*/

// =============================================
// (Optional) Simple stub API if /api/wordwall isn't ready yet
// =============================================
// File: src/app/api/wordwall/route.ts
// Uncomment to use this stub server response instead of the DB view.

import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const hl = (searchParams.get("highlight") || "").toLowerCase();
    const words = [
        { word: "Calm", weight: 5 },
        { word: "Focus", weight: 7, isHighlight: hl === "focus" },
        { word: "Gratitude", weight: 6 },
        { word: "Momentum", weight: 8 },
        { word: "Courage", weight: 7 },
        { word: "Nourish", weight: 5 },
        { word: "Clarity", weight: 5 },
        { word: "Play", weight: 7 },
    ];
    return NextResponse.json({ words });
}
