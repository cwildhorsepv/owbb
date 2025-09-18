// =============================================
// 13) UI: Word Wall component (simple cloud)
// =============================================

// Place in: src/app/components/WordWall.tsx
"use client";
import { useEffect, useState } from "react";

export default function WordWall({ highlight }: { highlight?: string }) {
    const [items, setItems] = useState<
        { word: string; weight: number; isHighlight?: boolean }[]
    >([]);
    useEffect(() => {
        const q = highlight
            ? `?highlight=${encodeURIComponent(highlight)}`
            : "";
        fetch(`/api/wordwall${q}`)
            .then((r) => r.json())
            .then((j) => setItems(j.words || []));
    }, [highlight]);

    return (
        <div className="flex flex-wrap gap-3 items-center">
            {items.map((it) => (
                <span
                    key={it.word}
                    className={[
                        "rounded-xl px-3 py-1 border",
                        `text-${Math.min(8, Math.max(1, it.weight))}xl`,
                        it.isHighlight
                            ? "bg-yellow-200 border-yellow-400"
                            : "bg-white",
                    ].join(" ")}
                >
                    {it.word}
                </span>
            ))}
        </div>
    );
}
