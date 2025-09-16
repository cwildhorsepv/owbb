"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Option = { value: string; label: string };
type Question = { id: string; prompt: string; options: Option[] };

const questions: Question[] = [
    {
        id: "q1",
        prompt: "Which theme resonates most with your year?",
        options: [
            { value: "Courage", label: "Courage" },
            { value: "Focus", label: "Focus" },
            { value: "Gratitude", label: "Gratitude" },
        ],
    },
    {
        id: "q2",
        prompt: "What do you want more of in daily life?",
        options: [
            { value: "Clarity", label: "Clarity" },
            { value: "Discipline", label: "Discipline" },
            { value: "Joy", label: "Joy" },
        ],
    },
];

const RESONANCE_MAP: Record<string, string[]> = {
    Courage: ["Bold", "Brave", "Rise", "Fearless", "Grit", "Dare", "Resolve"],
    Focus: ["Discipline", "Clarity", "Priority", "Commit", "Deepen", "Zero-In"],
    Gratitude: [
        "Grace",
        "Appreciate",
        "Presence",
        "Kindness",
        "Light",
        "Receive",
    ],
    Clarity: ["Simplicity", "Essence", "Refine", "Truth", "See", "Define"],
    Discipline: [
        "Consistency",
        "Habit",
        "Ritual",
        "Structure",
        "Mastery",
        "Train",
    ],
    Joy: ["Play", "Delight", "Wonder", "Alive", "Bloom", "Radiance"],
};

export default function PickYourWord() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const totalSteps = questions.length;
    const isDone = step >= totalSteps;
    const current = step < totalSteps ? questions[step] : null;

    const canNext = useMemo(
        () => Boolean(current && answers[current.id]),
        [answers, current],
    );

    const onChoose = (qid: string, value: string) =>
        setAnswers((a) => ({ ...a, [qid]: value }));
    const next = () => setStep((s) => Math.min(s + 1, totalSteps));
    const back = () => setStep((s) => Math.max(0, s - 1));
    const restart = () => {
        setAnswers({});
        setStep(0);
    };

    const progressPct = totalSteps
        ? Math.min(
              100,
              Math.round((Math.min(step, totalSteps) / totalSteps) * 100),
          )
        : 0;

    const pickedValues = useMemo(
        () => questions.map((q) => answers[q.id]).filter(Boolean) as string[],
        [answers],
    );

    const resonantWords = useMemo(() => {
        const counts = new Map<string, number>();
        for (const val of pickedValues)
            for (const w of RESONANCE_MAP[val] || [])
                counts.set(w, (counts.get(w) ?? 0) + 1);
        for (const val of pickedValues) counts.delete(val);
        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(([w]) => w)
            .slice(0, 18);
    }, [pickedValues]);

    return (
        <main
            className="min-h-screen bg-fixed bg-repeat text-slate-900"
            style={{
                backgroundImage:
                    "url('https://www.transparenttextures.com/patterns/hexellence.png')",
                backgroundColor: "#f2dc83",
            }}
        >
            <div className="mx-auto max-w-3xl px-4 py-10">
                {/* HEADER */}
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Pick Your Word to{" "}
                        <span style={{ color: "#004AAD" }}>bee</span>
                        <span style={{ color: "#000000" }}>better</span>
                        <sub className="ml-0.5 text-xs text-black">®</sub>{" "}
                    </h1>

                    <Link
                        href="/"
                        className="text-sm font-semibold rounded-xl px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50"
                    >
                        ← Home
                    </Link>
                </header>

                {/* PROGRESS */}
                <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>
                            {isDone
                                ? "Completed"
                                : `Step ${Math.min(step + 1, totalSteps)} of ${totalSteps}`}
                        </span>
                        {!isDone && current ? (
                            <span className="font-medium">
                                {current.id.toUpperCase()}
                            </span>
                        ) : null}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-amber-200 bg-amber-100">
                        <div
                            className="h-full"
                            style={{
                                width: `${progressPct}%`,
                                backgroundColor: "#004AAD",
                            }}
                        />
                    </div>
                </div>

                {/* CARD */}
                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {isDone ? (
                        <>
                            <h2 className="text-2xl font-semibold">
                                All set! 🎉
                            </h2>
                            <p className="mt-2 text-slate-600">
                                You finished the quiz. Here’s a recap and words
                                that pair well with your choices.
                            </p>

                            <div className="mt-5">
                                <h3 className="text-sm font-semibold text-slate-500">
                                    Your picks
                                </h3>
                                <ul className="mt-2 space-y-3">
                                    {questions.map((q) => (
                                        <li
                                            key={q.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                        >
                                            <div className="text-sm text-slate-500">
                                                {q.prompt}
                                            </div>
                                            <div className="mt-1 font-semibold">
                                                {answers[q.id] ?? "—"}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {resonantWords.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-semibold text-slate-500">
                                        Words that resonate with your selections
                                    </h3>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {resonantWords.map((w) => (
                                            <span
                                                key={w}
                                                className="inline-flex items-center rounded-xl border border-slate-200 bg-blue-50 px-3 py-1 text-sm font-medium"
                                            >
                                                {w}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    onClick={restart}
                                    className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50"
                                >
                                    Restart
                                </button>
                                <Link
                                    href="/#join"
                                    className="rounded-xl px-4 py-2 font-semibold text-white hover:opacity-90"
                                    style={{ backgroundColor: "#004AAD" }}
                                >
                                    Join the beebetter movement
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl md:text-2xl font-semibold">
                                {current?.prompt ?? ""}
                            </h3>

                            <div className="mt-5 grid gap-3">
                                {current?.options?.map((opt) => {
                                    const selected =
                                        answers[current.id] === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() =>
                                                onChoose(current.id, opt.value)
                                            }
                                            className={[
                                                "rounded-xl px-4 py-3 text-left transition border",
                                                selected
                                                    ? "border-[#004AAD] bg-blue-50"
                                                    : "border-slate-300 hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            <div className="font-medium">
                                                {opt.label}
                                            </div>
                                            {selected && (
                                                <div className="mt-1 text-xs text-slate-500">
                                                    Selected
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={back}
                                    disabled={step === 0}
                                    className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    disabled={!canNext}
                                    className="rounded-xl px-6 py-2 font-semibold text-white disabled:opacity-60"
                                    style={{ backgroundColor: "#004AAD" }}
                                >
                                    {step + 1 === totalSteps
                                        ? "Finish"
                                        : "Next"}
                                </button>
                            </div>
                        </>
                    )}
                </section>

                <footer className="py-10 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} beebetter®. All rights
                    reserved.
                </footer>
            </div>
        </main>
    );
}
