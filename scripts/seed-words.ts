// scripts/seed-words.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NETLIFY_DATABASE_URL!);

type WB = {
    word: string;
    valence: number; // -2..+2
    energy: number; // 1..5
    types: string[];
    domains: string[];
    tags: string[];
    synonyms?: string[];
};

const SEED: WB[] = [
    {
        word: "Calm",
        valence: 1,
        energy: 1,
        types: ["state"],
        domains: ["mindfulness"],
        tags: ["soothe", "ground"],
        synonyms: ["Soothe", "Steady"],
    },
    {
        word: "Focus",
        valence: 1,
        energy: 2,
        types: ["action"],
        domains: ["productivity"],
        tags: ["focus"],
    },
    {
        word: "Gratitude",
        valence: 2,
        energy: 2,
        types: ["virtue"],
        domains: ["self", "relationships"],
        tags: ["lift", "reframe"],
    },
    {
        word: "Courage",
        valence: 2,
        energy: 4,
        types: ["virtue"],
        domains: ["self", "leadership"],
        tags: ["elevate", "stretch"],
    },
    {
        word: "Momentum",
        valence: 2,
        energy: 4,
        types: ["state"],
        domains: ["productivity"],
        tags: ["elevate", "build"],
    },
    {
        word: "Nourish",
        valence: 2,
        energy: 2,
        types: ["action"],
        domains: ["health", "self"],
        tags: ["soothe", "care"],
    },
];

async function main() {
    for (const w of SEED) {
        await sql`
      INSERT INTO word_bank (word, valence, energy, types, domains, tags, synonyms)
      VALUES (${w.word}, ${w.valence}, ${w.energy}, ${w.types}, ${w.domains}, ${w.tags}, ${w.synonyms ?? []})
      ON CONFLICT (word) DO UPDATE
      SET valence=EXCLUDED.valence, energy=EXCLUDED.energy,
          types=EXCLUDED.types, domains=EXCLUDED.domains,
          tags=EXCLUDED.tags, synonyms=EXCLUDED.synonyms
    `;
    }
    console.log("Seeded word_bank ✅");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
