// =============================================
// 4) /api/words/search — substring search
// =============================================

// Place in: src/app/api/words/search/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    if (!q) return NextResponse.json({ words: [] });

    const rows = await sql<{ word: string }[]>`
SELECT word FROM word_bank
WHERE lower(word) LIKE ${"%" + q + "%"}
ORDER BY word ASC
LIMIT 25
`;

    return NextResponse.json({ words: rows.map((r) => r.word) });
}
