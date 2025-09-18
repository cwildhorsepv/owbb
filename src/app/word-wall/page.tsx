// ==============================
// src/app/word-wall/page.tsx
// ==============================
"use client";

import { useSearchParams } from "next/navigation";
import WordWallCloud from "@components/WordWallCloud";

export default function WordWallPage() {
    const params = useSearchParams();
    const highlight = params.get("highlight") || undefined;
    return (
        <main className="max-w-5xl mx-auto p-6 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Word Wall (placeholder)</h1>
            <p className="opacity-70 text-sm">
                This uses <code>wordcloud2.js</code> in the browser. Pass{" "}
                <code>?highlight=Focus</code> in the URL to see the highlight
                color.
            </p>
            <WordWallCloud highlight={highlight} />
        </main>
    );
}
