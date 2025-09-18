// =============================================
// 15) DB health-check endpoint (quick verify)
// =============================================

// Place in: src/app/api/dbcheck/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function GET() {
    try {
        const rows = await sql<{ now: string; db: string; user: string }[]>`
      SELECT now()::text as now, current_database() as db, current_user as user
    `;
        return NextResponse.json({ ok: true, ...rows[0] });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e.message ?? "dbcheck failed" },
            { status: 500 },
        );
    }
}
