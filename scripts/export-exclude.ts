// =============================================
// 4) Script — export EXCLUDE_LIST from DB (prompt-ready)
// =============================================
// File: scripts/export-exclude.ts
// Run: NETLIFY_DATABASE_URL=... npx tsx scripts/export-exclude.ts
/*
import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.NETLIFY_DATABASE_URL!);


async function main() {
const lang = process.argv[2] || 'en';
const rows = await sql<{ word: string }[]>`
SELECT word FROM word_bank WHERE lang = ${lang} ORDER BY lower(word)
`;
const list = rows.map(r => r.word).join(',');
console.log(list);
}


main().catch((e) => { console.error(e); process.exit(1); });
*/
// Shell one-liner (psql):
// psql "$DBURL" -t -A -c "SELECT string_agg(word, ',') FROM word_bank WHERE lang='en'"
