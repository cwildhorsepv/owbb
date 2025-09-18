// =============================================
// 15) DB health-check endpoint (quick verify)
// =============================================

// Place in: src/app/api/dbcheck/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    const rows = await sql`
    SELECT now()::text AS now, current_database() AS db, current_user AS user
  `;
    const row = (rows as Array<{ now: string; db: string; user: string }>)[0];
    return NextResponse.json({ ok: true, ...row });
}
