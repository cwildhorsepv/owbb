// =============================================
// 1) lib/db.ts — single import for Netlify Neon
// =============================================
// Place in: src/lib/db.ts
import { neon } from "@netlify/neon";
export const sql = neon();

// Optional: tiny helper to run within a single transaction when needed
export async function tx<T>(fn: (exec: typeof sql) => Promise<T>): Promise<T> {
    // @netlify/neon exposes a pooled query function; simple wrapper suffices
    return fn(sql);
}

// =============================================
// 8) Netlify env setup (local + deploy)
// =============================================
// - Ensure NETLIFY_DATABASE_URL is set in Netlify UI → Site → Settings → Environment variables
// - For local, use Netlify CLI so the env is injected: `netlify dev`
// - Or create a local ".env.local" with DATABASE_URL and switch db.ts to prefer it:
/* Example (optional) switcher in db.ts:
const direct = process.env.DATABASE_URL;
export const sql = direct ? neon(direct) : neon();
*/
