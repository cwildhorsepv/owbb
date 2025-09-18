// Word Wall placeholder using wordcloud2.js (client-only)
// ------------------------------------------------------
// Install deps:
//   npm i wordcloud
// or: pnpm add wordcloud
//
// Drop the component below into src/components/WordWallCloud.tsx
// Then add the sample page at src/app/word-wall/page.tsx
// Visit /word-wall to see it render.

// ================================
// src/components/WordWallCloud.tsx
// ================================
"use client";

import React, { useEffect, useRef, useState } from "react";

type WallItem = { word: string; weight: number; isHighlight?: boolean };

export default function WordWallCloud({
    highlight,
    dataUrl = "/api/wordwall",
    height = 380,
}: {
    highlight?: string;
    dataUrl?: string;
    height?: number;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [items, setItems] = useState<WallItem[]>([]);
    const [err, setErr] = useState<string | null>(null);

    // fetch data (with a simple fallback)
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const url = highlight
                    ? `${dataUrl}?highlight=${encodeURIComponent(highlight)}`
                    : dataUrl;
                const r = await fetch(url, { cache: "no-store" });
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const j = await r.json();
                if (!ignore) setItems((j.words || []) as WallItem[]);
            } catch (e: any) {
                console.warn("WordWall fallback →", e?.message || e);
                if (!ignore)
                    setItems([
                        { word: "Calm", weight: 6 },
                        {
                            word: "Focus",
                            weight: 7,
                            isHighlight: highlight?.toLowerCase() === "focus",
                        },
                        { word: "Gratitude", weight: 6 },
                        { word: "Momentum", weight: 8 },
                        { word: "Courage", weight: 7 },
                        { word: "Nourish", weight: 5 },
                        { word: "Clarity", weight: 5 },
                        { word: "Play", weight: 7 },
                    ]);
                if (!ignore) setErr("Using fallback data");
            }
        })();
        return () => {
            ignore = true;
        };
    }, [dataUrl, highlight]);

    // render the cloud on mount/update & on resize
    useEffect(() => {
        if (!containerRef.current || items.length === 0) return;

        let stopped = false;
        let cleanup: (() => void) | undefined;

        (async () => {
            // dynamic import to keep SSR happy
            const WordCloud = (await import("wordcloud"))
                .default as unknown as (
                el: HTMLElement | HTMLCanvasElement,
                opts: any,
            ) => void;

            const host = containerRef.current!;
            const canvas = document.createElement("canvas");
            canvas.width = host.clientWidth;
            canvas.height = height;
            host.innerHTML = "";
            host.appendChild(canvas);

            const list: [string, number][] = items.map((it) => [
                it.word,
                Math.max(1, it.weight || 1),
            ]);

            const colorFor = (w: string) => {
                if (highlight && w.toLowerCase() === highlight.toLowerCase())
                    return "#f59e0b"; // amber highlight
                return "#111827"; // neutral ink
            };

            WordCloud(canvas, {
                list,
                gridSize: Math.max(8, Math.floor(canvas.width / 64)),
                weightFactor: (w: number) => 6 + w * 3, // scale word size
                rotateRatio: 0.06,
                rotationSteps: 2,
                backgroundColor: "transparent",
                color: (word: string) => colorFor(word),
                click: (item: [string, number]) => {
                    // placeholder click — swap this for navigation or selection
                    // eslint-disable-next-line no-alert
                    alert(`Selected “${item[0]}”`);
                },
                drawOutOfBound: false,
                shuffle: true,
                // Called when finished
                hover: (item: [string, number]) => {
                    if (!item) return;
                    host.style.cursor = "pointer";
                },
            });

            // basic resize: re-render after a small debounce
            let resizeTimer: any;
            const onResize = () => {
                if (stopped) return;
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (!containerRef.current) return;
                    const c = containerRef.current.querySelector("canvas");
                    if (c) c.remove();
                    // trigger effect by updating a tiny state — or just call the block again
                    // simplest: call ourselves again
                    if (!stopped) {
                        host.dispatchEvent(new Event("rebuild"));
                    }
                }, 200);
            };

            const rebuild = () => {
                if (stopped) return;
                // trigger a new render by resetting items (no-op for consumers)
                setItems((prev) => [...prev]);
            };

            window.addEventListener("resize", onResize);
            host.addEventListener("rebuild", rebuild as any);

            cleanup = () => {
                stopped = true;
                window.removeEventListener("resize", onResize);
                host.removeEventListener("rebuild", rebuild as any);
            };
        })();

        return () => {
            cleanup?.();
        };
    }, [items, highlight, height]);

    return (
        <div className="w-full">
            {err && <div className="mb-2 text-xs text-amber-600">{err}</div>}
            <div
                ref={containerRef}
                className="w-full border rounded-2xl p-2"
                style={{ height }}
            />
        </div>
    );
}
