// =============================================
// 4) API: create a pick
// =============================================
// Place in: src/app/api/pick/route.ts
import { NextResponse } from "next/server";
import { sql } from "@lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, word, mood, note, tags } = body ?? {};

        if (!sessionId || !word) {
            return NextResponse.json(
                { error: "sessionId and word are required" },
                { status: 400 },
            );
        }

        // Ensure session exists (idempotent)
        await sql`INSERT INTO player_session (id) VALUES (${sessionId}) ON CONFLICT (id) DO NOTHING`;

        const [row] = await sql<{ id: number }[]>`
INSERT INTO pick (session_id, word, mood, note, tags)
VALUES (${sessionId}, ${word}, ${mood ?? null}, ${note ?? null}, ${tags ?? null})
RETURNING id
`;

        return NextResponse.json({ ok: true, id: row?.id });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message ?? "pick error" },
            { status: 500 },
        );
    }
}

// =============================================
// 11) API: capture geo/language + optional member
// =============================================
// Update /api/pick to read Netlify geo headers + Accept-Language and optional user token.
// Place in: src/app/api/pick/route.ts (replace body)
/*
export async function POST(req: Request) {
try {
const body = await req.json();
const { sessionId, word, mood, note, tags, userId } = body ?? {};
if (!sessionId || !word) return NextResponse.json({ error: 'sessionId and word are required' }, { status: 400 });


const headers = Object.fromEntries(req.headers);
const country = headers['x-nf-geo'] ? (() => {
try { return JSON.parse(String(headers['x-nf-geo'])).country?.code ?? null; } catch { return null; }
})() : null;
const language = (headers['accept-language'] || '').split(',')[0] || null;


await sql`INSERT INTO player_session (id) VALUES (${sessionId}) ON CONFLICT (id) DO NOTHING`;
if (userId) {
// upsert lightweight user row (email can come later)
await sql`INSERT INTO app_user (id) VALUES (${userId}) ON CONFLICT (id) DO NOTHING`;
}


const [row] = await sql<{ id: number }[]>`
INSERT INTO pick (session_id, user_id, word, mood, note, tags, country, language)
VALUES (${sessionId}, ${userId ?? null}, ${word}, ${mood ?? null}, ${note ?? null}, ${tags ?? null}, ${country}, ${language})
RETURNING id
`;


return NextResponse.json({ ok: true, id: row?.id, country, language });
} catch (e: any) {
// 23505 unique_violation can signal 'already picked today' (free tier lock)
const msg = e?.code === '23505' ? 'You already locked a word today. Join to unlock more.' : (e.message ?? 'pick error');
return NextResponse.json({ error: msg }, { status: 400 });
}
}
*/

// =============================================
// 14) Membership gates (free vs member)
// =============================================
// Frontend strategy now, plug Identity later:
// - Free users (no userId): 1 pick/day; appear on wall anonymously; no outbound content.
// - Members (userId present): show highlight on wall; enable content targeting by word; future email.
// - CTA: After pick, if no userId, show banner: "Want custom content for ‘FOCUS’? Join free in 10s."

/* Example banner drop-in for pick-your-word page:
{!userId && lastWord && (
<div className="mt-4 rounded-2xl border px-4 py-3 bg-amber-50">
Unlock tailored tips for “{lastWord}”. <button className="underline">Join free</button>
</div>
)}
*/

// =============================================
// 15) (Future) Netlify Identity wiring
// =============================================
// Add netlify-identity-widget to get userId (sub) + email.
/*
// app/providers.tsx
'use client';
import netlifyIdentity from 'netlify-identity-widget';
import { useEffect, createContext, useContext, useState } from 'react';


export const AuthCtx = createContext<{ user: any | null }>({ user: null });
export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<any | null>(null);
useEffect(() => {
netlifyIdentity.init();
netlifyIdentity.on('login', u => setUser(u));
netlifyIdentity.on('logout', () => setUser(null));
}, []);
return <AuthCtx.Provider value={{ user }}>{children}</AuthCtx.Provider>;
}


// usage in page
const { user } = useContext(AuthCtx);
const userId = user?.id; // send in /api/pick body
*/
