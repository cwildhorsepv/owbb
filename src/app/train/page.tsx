"use client";

import React, { useMemo, useState } from "react";
import Papa from "papaparse";

type Row = {
    word: string;
    valence?: any;
    energy?: any;
    types?: any;
    domains?: any;
    tags?: any;
    synonyms?: any;
    lang?: any;
};

export default function TrainPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [preview, setPreview] = useState<Row[]>([]);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    function parseCsv(text: string) {
        const parsed = Papa.parse<Row>(text.trim(), {
            header: true,
            skipEmptyLines: true,
        });
        if (parsed.errors?.length) {
            setErr(parsed.errors.map((e) => e.message).join("; "));
        }
        const data = (parsed.data || []).filter((r) => (r.word || "").trim());
        setRows(data);
        setPreview(data.slice(0, 20));
    }

    async function handleFile(file: File) {
        const text = await file.text();
        parseCsv(text);
    }

    async function handleSubmit() {
        if (!rows.length) return;
        setBusy(true);
        setMsg(null);
        setErr(null);
        try {
            const r = await fetch("/api/words/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows }),
            });
            const j = await r.json();
            if (!r.ok) throw new Error(j?.error || "bulk failed");
            setMsg(
                `Upserted ${j.total} rows (inserted ${j.inserted}, updated ${j.updated}).`,
            );
        } catch (e: any) {
            setErr(e?.message || "bulk error");
        } finally {
            setBusy(false);
        }
    }

    const templateCsv = useMemo(
        () =>
            "word,valence,energy,tags,domains,types,synonyms,lang\n" +
            "Calm,1,1,soothe|ground,mindfulness,state,Soothe|Steady,en\n" +
            "Focus,1,2,focus,productivity,action,,en\n",
        [],
    );
    // =============================================
    // 6) Train page — add Validate-only + Copy EXCLUDE_LIST
    // =============================================
    // Patch for src/app/train/page.tsx (add these bits inside the component)

    async function handleValidate() {
        if (!rows.length) return;
        setBusy(true);
        setMsg(null);
        setErr(null);
        try {
            const r = await fetch("/api/words/bulk?dry=1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows }),
            });
            const j = await r.json();
            if (!r.ok) throw new Error(j?.error || "validate failed");
            setMsg(
                `Validate: total ${j.counts.total}, new ${j.counts.new}, exact dup ${j.counts.dupExact}, near dup ${j.counts.dupNear}`,
            );
            console.log("Near duplicates", j.dupNear);
        } catch (e: any) {
            setErr(e?.message || "validate error");
        } finally {
            setBusy(false);
        }
    }

    async function handleCopyExclude() {
        try {
            const lang = "en";
            const r = await fetch(`/api/words/bulk?limit=0`, { method: "GET" });
            // prefer the script/export-exclude.ts for big lists, but this is a quick stub
            const j = await fetch("/api/words/bulk")
                .then((r) => r.json())
                .catch(() => ({ rows: [] }));
            const list = (j.rows || []).map((x: any) => x.word).join(",");
            await navigator.clipboard.writeText(list);
            setMsg("Copied EXCLUDE_LIST to clipboard");
        } catch (e) {
            setErr("Failed to copy EXCLUDE_LIST");
        }
    }

    return (
        <main className="max-w-5xl mx-auto p-6 flex flex-col gap-5">
            <h1 className="text-2xl font-semibold">Train words (CSV → DB)</h1>
            <p className="opacity-70 text-sm">
                Upload a CSV with columns:{" "}
                <code>
                    word,valence,energy,tags,domains,types,synonyms,lang
                </code>
                . Lists can be separated by commas, semicolons, or pipes.
            </p>

            <button
                className="rounded-xl border px-3 py-2"
                onClick={handleValidate}
                disabled={busy || !rows.length}
            >
                Validate only
            </button>
            <button
                className="rounded-xl border px-3 py-2"
                onClick={handleCopyExclude}
            >
                Copy EXCLUDE_LIST
            </button>

            <div className="flex items-center gap-3">
                <label className="rounded-xl border px-4 py-2 cursor-pointer">
                    <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFile(f);
                        }}
                    />
                    Choose CSV…
                </label>
                <button
                    className="rounded-xl border px-3 py-2"
                    onClick={() => {
                        navigator.clipboard.writeText(templateCsv);
                    }}
                >
                    Copy template CSV
                </button>
                <a
                    className="rounded-xl border px-3 py-2"
                    href={`data:text/csv;charset=utf-8,${encodeURIComponent(templateCsv)}`}
                    download={`word_bank_template.csv`}
                >
                    Download template
                </a>
            </div>

            <textarea
                className="w-full h-40 border rounded-xl p-3 font-mono text-sm"
                placeholder="Or paste CSV here..."
                onBlur={(e) => parseCsv(e.currentTarget.value)}
            />

            {rows.length > 0 && (
                <div className="rounded-2xl border p-3">
                    <div className="mb-2 text-sm">
                        Parsed <b>{rows.length}</b> rows. Showing first 20:
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-black/5">
                                <tr>
                                    {[
                                        "word",
                                        "valence",
                                        "energy",
                                        "tags",
                                        "domains",
                                        "types",
                                        "synonyms",
                                        "lang",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left p-2 capitalize"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((r, i) => (
                                    <tr key={i} className="border-t">
                                        <td className="p-2">{r.word}</td>
                                        <td className="p-2">
                                            {(r as any).valence}
                                        </td>
                                        <td className="p-2">
                                            {(r as any).energy}
                                        </td>
                                        <td className="p-2">
                                            {String((r as any).tags || "")}
                                        </td>
                                        <td className="p-2">
                                            {String((r as any).domains || "")}
                                        </td>
                                        <td className="p-2">
                                            {String((r as any).types || "")}
                                        </td>
                                        <td className="p-2">
                                            {String((r as any).synonyms || "")}
                                        </td>
                                        <td className="p-2">
                                            {String((r as any).lang || "")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            disabled={busy}
                            onClick={handleSubmit}
                            className={`rounded-xl px-4 py-2 text-white ${busy ? "bg-black/40" : "bg-black hover:opacity-90"}`}
                        >
                            {busy ? "Uploading…" : `Upsert ${rows.length} rows`}
                        </button>
                        {msg && (
                            <span className="text-green-700 text-sm">
                                {msg}
                            </span>
                        )}
                        {err && (
                            <span className="text-rose-700 text-sm">{err}</span>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
