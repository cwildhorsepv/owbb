// =============================================
// 3) API: register or touch a session
// =============================================
// Place in: src/app/api/session/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json();
        if (!sessionId)
            return NextResponse.json(
                { error: "Missing sessionId" },
                { status: 400 },
            );
        await sql`INSERT INTO player_session (id) VALUES (${sessionId}) ON CONFLICT (id) DO NOTHING`;
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message ?? "session error" },
            { status: 500 },
        );
    }
}
