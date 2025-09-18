// =============================================
// 7) UI: Punchier Pick-Your-Word page
// =============================================
// - Animated choices, search + custom word, mood slider, instant feedback
// - Confetti burst, streak chip, share button, tiny leaderboard
// Place in: src/app/pick-your-word/page.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import VisualHeader from "@components/VisualHeader";

// lightweight confetti (no deps)
function burstConfetti(canvas: HTMLCanvasElement, duration = 800) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const pieces = Array.from({ length: 80 }, () => ({
        x: W / 2,
        y: H / 3,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 6 - 3,
        r: Math.random() * 2 + 2,
        life: Math.random() * 0.8 + 0.4,
    }));
    const start = performance.now();
    function tick(t: number) {
        const dt = 16 / 1000;
        ctx.clearRect(0, 0, W, H);
        pieces.forEach((p) => {
            p.vy += 9.8 * dt * 0.6;
            p.x += p.vx;
            p.y += p.vy;
            ctx.globalAlpha = Math.max(
                0,
                p.life - (t - start) / (duration * 1000),
            );
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        if (t - start < duration) requestAnimationFrame(tick);
        else ctx.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(tick);
}

function useSessionId() {
    const [id, setId] = useState<string | null>(null);
    useEffect(() => {
        let s = localStorage.getItem("pyw_session");
        if (!s) {
            s = Math.random().toString(36).slice(2) + Date.now().toString(36);
            localStorage.setItem("pyw_session", s);
        }
        setId(s);
        // touch session server-side (fire-and-forget)
        fetch("/api/session", {
            method: "POST",
            body: JSON.stringify({ sessionId: s }),
        });
    }, []);
    return id;
}

const DEFAULT_WORDS = [
    "Focus",
    "Courage",
    "Grace",
    "Health",
    "Build",
    "Learn",
    "Create",
    "Serve",
    "Lead",
    "Calm",
    "Momentum",
    "Family",
    "Discipline",
    "Gratitude",
];

export default function PickYourWordPage() {
    const sessionId = useSessionId();
    const [query, setQuery] = useState("");
    const [custom, setCustom] = useState("");
    const [mood, setMood] = useState(3); // 1-5
    const [note, setNote] = useState("");
    const [streak, setStreak] = useState(0);
    const [total, setTotal] = useState(0);
    const [lastWord, setLastWord] = useState<string | null>(null);
    const [leader, setLeader] = useState<{ word: string; picks: number }[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [busy, setBusy] = useState(false);

    const words = useMemo(() => {
        const q = query.trim().toLowerCase();
        return DEFAULT_WORDS.filter((w) => w.toLowerCase().includes(q));
    }, [query]);

    useEffect(() => {
        if (!sessionId) return;
        const load = async () => {
            const r = await fetch(`/api/stats?sessionId=${sessionId}`);
            const j = await r.json();
            if (!("error" in j)) {
                setStreak(j.streak ?? 0);
                setTotal(j.total ?? 0);
                setLastWord(j.lastPick?.word ?? null);
            }
            const lb = await fetch(`/api/leaderboard?period=today`).then((r) =>
                r.json(),
            );
            if (!("error" in lb)) setLeader(lb.rows ?? []);
        };
        load();
    }, [sessionId]);

    async function choose(word: string) {
        if (!sessionId || busy) return;
        setBusy(true);
        try {
            const res = await fetch("/api/pick", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    word,
                    mood,
                    note,
                    tags: null,
                }),
            });
            const j = await res.json();
            if (!("error" in j)) {
                // optimistic updates
                setTotal((t) => t + 1);
                setStreak((s) => (lastWord ? s + 1 : Math.max(1, s)));
                setLastWord(word);
                setNote("");
                // confetti!
                if (canvasRef.current) burstConfetti(canvasRef.current);
            }
        } finally {
            setBusy(false);
        }
    }

    const canPickCustom = custom.trim().length >= 2;

    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center gap-6 px-4 py-8">
            {/* Header */}
            <VisualHeader />
            <div className="w-full max-w-3xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-black/80 text-white px-3 py-1 text-sm shadow">
                        Streak: {streak} 🔥
                    </div>
                    <div className="rounded-2xl bg-black/5 px-3 py-1 text-sm shadow">
                        Total picks: {total}
                    </div>
                </div>
                <Link
                    href="/"
                    className="text-sm underline opacity-80 hover:opacity-100"
                >
                    Home
                </Link>
            </div>

            <div className="relative w-full max-w-3xl rounded-3xl border border-black/10 p-6 shadow-sm">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none"
                />
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                    Pick your word 🎯
                </h1>
                <p className="text-sm opacity-80 mb-4">
                    Search or tap a word. Add a quick note and mood. Lock it in
                    to grow your streak.
                </p>

                <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search words…"
                        className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring"
                    />
                    <input
                        value={custom}
                        onChange={(e) => setCustom(e.target.value)}
                        placeholder="Or add your own…"
                        className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring"
                    />
                    <button
                        disabled={!canPickCustom || busy}
                        onClick={() => canPickCustom && choose(custom.trim())}
                        className={`rounded-xl px-4 py-2 text-white ${canPickCustom && !busy ? "bg-black hover:opacity-90" : "bg-black/40"}`}
                    >
                        Add
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
                    {words.map((w) => (
                        <button
                            key={w}
                            disabled={busy}
                            onClick={() => choose(w)}
                            className="rounded-2xl border px-4 py-3 text-left hover:translate-y-[-1px] hover:shadow transition-transform"
                        >
                            <div className="text-base font-medium">{w}</div>
                            <div className="text-xs opacity-60">
                                Lock it for today
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <label className="text-sm opacity-80">Mood</label>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        value={mood}
                        onChange={(e) => setMood(parseInt(e.target.value))}
                    />
                    <div className="text-sm">{mood}/5</div>
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Optional: a tiny note for future-you"
                        className="flex-1 rounded-xl border px-3 py-2 outline-none focus:ring"
                    />
                    <button
                        disabled={!lastWord || busy}
                        onClick={async () => {
                            // quick share of last word
                            if (navigator.share && lastWord) {
                                try {
                                    await navigator.share({
                                        title: "My word today",
                                        text: `I picked "${lastWord}" for my day 💪`,
                                    });
                                } catch {}
                            }
                        }}
                        className="rounded-xl border px-4 py-2"
                    >
                        Share
                    </button>
                </div>
            </div>

            <div className="w-full max-w-3xl">
                <h2 className="font-semibold mb-2">Today’s top words</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {leader.map((r) => (
                        <div
                            key={r.word}
                            className="rounded-2xl border px-4 py-3 flex items-center justify-between"
                        >
                            <span>{r.word}</span>
                            <span className="text-sm opacity-70">
                                {r.picks}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
