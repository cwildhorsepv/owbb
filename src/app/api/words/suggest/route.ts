// =============================================
// 3) /api/words/suggest — mood-based finder
// =============================================

// Place in: src/app/api/words/suggest/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

// Map simple states to filters
const MOOD = {
    sad: {
        valenceMin: 1,
        energyMin: 1,
        energyMax: 2,
        tagsAny: ["soothe", "ground", "care"],
    },
    anxious: {
        valenceMin: 1,
        energyMin: 1,
        energyMax: 2,
        tagsAny: ["soothe", "focus", "simplify"],
    },
    tired: {
        valenceMin: 1,
        energyMin: 1,
        energyMax: 2,
        tagsAny: ["recover", "soothe"],
    },
    stuck: {
        valenceMin: 1,
        energyMin: 2,
        energyMax: 3,
        tagsAny: ["start", "progress", "activate"],
    },
    happy_more: {
        valenceMin: 2,
        energyMin: 3,
        energyMax: 5,
        tagsAny: ["elevate", "celebrate", "joy"],
    },
    focus: {
        valenceMin: 1,
        energyMin: 2,
        energyMax: 3,
        tagsAny: ["focus", "simplify"],
    },
} as const;

type MoodKey = keyof typeof MOOD;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const state = (searchParams.get("state") || "sad").toLowerCase() as MoodKey;
    const n = Math.min(
        24,
        Math.max(1, parseInt(searchParams.get("n") || "12", 10)),
    );

    const m = MOOD[state] || MOOD.sad;
    const tagsAny = `{${(m.tagsAny || []).join(",")}}`;

    const rows = await sql<{ word: string }[]>`
SELECT word
FROM word_bank
WHERE valence >= ${m.valenceMin}
AND energy BETWEEN ${m.energyMin} AND ${m.energyMax}
AND (tags && ${tagsAny}::text[] OR ${tagsAny} = '{}')
ORDER BY random()
LIMIT ${n}
`;

    return NextResponse.json({ state, words: rows.map((r) => r.word) });
}
