"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WordWallCloud from "@components/WordWallCloud";

function Inner() {
    const params = useSearchParams();
    const highlight = params.get("highlight") || undefined;
    return (
        <main className="max-w-5xl mx-auto p-6 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Word Wall (placeholder)</h1>
            <p className="opacity-70 text-sm">
                This uses <code>wordcloud2.js</code> in the browser. Pass{" "}
                <code>?highlight=Focus</code>.
            </p>
            <WordWallCloud highlight={highlight} />
        </main>
    );
}

export default function WordWallPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading…</div>}>
            <Inner />
        </Suspense>
    );
}
