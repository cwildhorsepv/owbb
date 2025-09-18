// Word Trainer — upload CSV and bulk upsert into word_bank
// ========================================================
// What you get:
// 1) API: POST /api/words/bulk — upserts rows into word_bank
// 2) API: GET /api/words/bulk — export latest rows (optional)
// 3) Page: /train — CSV upload/paste UI with preview + validation
// 4) Template CSV header and sample rows
//
// Requires:
// - Table word_bank (see earlier schema)
// - npm i papaparse (client-side CSV parser)
//
// Notes:
// - We parse client-side and send JSON, so no server file storage needed.
// - Accepts fields: word, valence, energy, tags, domains, types, synonyms, lang
// - For list fields, both JSON arrays and comma/semicolon-separated strings are accepted.

// =============================================
// 1) API — /api/words/bulk (upsert + export)
// =============================================
// File: src/app/api/words/bulk/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export const dynamic = "force-dynamic"; // ensure fresh during dev

// Helpers
function splitList(v: unknown): string[] | null {
    if (v == null) return null;
    if (Array.isArray(v))
        return v
            .map(String)
            .map((s) => s.trim())
            .filter(Boolean);
    const s = String(v).trim();
    if (!s) return null;
    return s
        .split(/[,;|]/g)
        .map((x) => x.trim())
        .filter(Boolean);
}

function normRow(row: any) {
    const word = String(row.word || row.Word || "").trim();
    const lang = String(row.lang || row.language || "en").trim() || "en";
    const valence = Number(row.valence ?? 1);
    const energy = Number(row.energy ?? 3);
    const types = splitList(row.types) ?? [];
    const domains = splitList(row.domains) ?? [];
    const tags = splitList(row.tags) ?? [];
    const synonyms = splitList(row.synonyms) ?? [];
    return { word, lang, valence, energy, types, domains, tags, synonyms };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const rows = Array.isArray(body?.rows) ? body.rows : [];
        if (!rows.length)
            return NextResponse.json(
                { error: "rows[] required" },
                { status: 400 },
            );

        const cleaned = rows.map(normRow).filter((r) => r.word);
        if (!cleaned.length)
            return NextResponse.json(
                { error: "no valid rows" },
                { status: 400 },
            );

        // Validate ranges (non-fatal: clamp)
        cleaned.forEach((r) => {
            r.valence = Math.max(-2, Math.min(2, Math.round(r.valence)));
            r.energy = Math.max(1, Math.min(5, Math.round(r.energy)));
        });

        // Upsert sequentially (simple & safe for small batches). For larger sets, chunk.
        let inserted = 0;
        let updated = 0;
        for (const r of cleaned) {
            const res = await sql<{ x: "INSERT" | "UPDATE" }[]>`
INSERT INTO word_bank (word, lang, valence, energy, types, domains, tags, synonyms)
VALUES (${r.word}, ${r.lang}, ${r.valence}, ${r.energy}, ${r.types}, ${r.domains}, ${r.tags}, ${r.synonyms})
ON CONFLICT (word) DO UPDATE SET
lang = EXCLUDED.lang,
valence = EXCLUDED.valence,
energy = EXCLUDED.energy,
types = EXCLUDED.types,
domains = EXCLUDED.domains,
tags = EXCLUDED.tags,
synonyms = EXCLUDED.synonyms
RETURNING (xmax = 0)::int::text::"char" AS x
`;
            // Postgres trick: xmax=0 indicates INSERT
            if (res[0]?.x === "0") inserted++;
            else updated++;
        }

        return NextResponse.json({
            ok: true,
            inserted,
            updated,
            total: cleaned.length,
        });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "bulk error" },
            { status: 500 },
        );
    }
}
