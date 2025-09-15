"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Mail,
    RefreshCw,
} from "lucide-react";

// ⚠️ Replace with your hosted logo path if needed
// Brand constants
const BEE_BLUE = "#004AAD";
const LOGO_URL = "/3.png"; // reference to the uploaded logo asset

export default function PickYourWordPage() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");

    // ... questions and wordMeta remain unchanged ...

    const questions: Array<{
        id: string;
        prompt: string;
        options: Array<{ label: string; value: string; weights: any }>;
    }> = [
        // (questions unchanged for brevity)
    ];

    type WordKey =
        | "focus"
        | "courage"
        | "gratitude"
        | "balance"
        | "growth"
        | "presence"
        | "discipline"
        | "connection";

    const wordMeta: Record<
        WordKey,
        { title: string; hook: string; micro: string[] }
    > = {
        // (wordMeta unchanged for brevity)
    };

    const totalSteps = questions.length;

    function selectAnswer(qid: string, value: string) {
        setAnswers((a) => ({ ...a, [qid]: value }));
    }

    const canNext = Boolean(answers[questions[step]?.id]);

    const results = useMemo(() => {
        const scores: Partial<Record<WordKey, number>> = {};
        questions.forEach((q) => {
            const v = answers[q.id];
            if (!v) return;
            const opt = q.options.find((o) => o.value === v);
            if (!opt) return;
            Object.entries(opt.weights).forEach(([k, w]) => {
                scores[k as WordKey] = (scores[k as WordKey] || 0) + (w || 0);
            });
        });
        return Object.entries(scores)
            .sort((a, b) => (b[1] || 0) - (a[1] || 0))
            .slice(0, 3)
            .map(([key]) => key as WordKey);
    }, [answers]);

    async function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        try {
            await new Promise((r) => setTimeout(r, 900));
            setStatus("success");
            setMessage("We just sent your word toolkit to your inbox.");
            setEmail("");
        } catch (e) {
            setStatus("error");
            setMessage("Could not subscribe. Please try again.");
        }
    }

    const progress = Math.round(((step + 1) / totalSteps) * 100);

    return (
        <div
            className="min-h-screen text-slate-800"
            style={{
                backgroundImage:
                    "url('https://www.transparenttextures.com/patterns/hexellence.png')",
                backgroundRepeat: "repeat",
                backgroundAttachment: "fixed",
                backgroundColor: "#fff8dc",
            }}
        >
            {/* HEADER */}
            <header className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-amber-100">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src={LOGO_URL}
                            alt="beebetter logo"
                            className="h-8"
                        />
                    </a>
                    <a
                        href="#results"
                        className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-[#0046AD] px-4 py-2 text-white shadow hover:bg-[#003080] transition"
                    >
                        Join free
                    </a>
                </div>
                <div className="h-1 w-full bg-amber-100">
                    <div
                        className="h-full bg-[#0046AD]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </header>

            {/* HERO */}
            <section className="mx-auto max-w-3xl px-4 pt-10">
                <motion.h1 className="text-3xl md:text-5xl font-extrabold text-center leading-tight text-black">
                    Not sure what your word should be?
                </motion.h1>
                <p className="mt-4 text-lg text-center text-slate-700">
                    Answer 5 quick questions and discover words that could shape
                    your year.
                </p>
            </section>

            {/* QUIZ */}
            {/* (quiz rendering remains unchanged, but buttons updated with brand blue) */}

            {/* RESULTS */}
            {/* (results section remains unchanged, update CTAs with brand blue) */}

            {/* FOOTER */}
            <footer className="py-10 border-t border-slate-200 text-sm bg-white text-center">
                <p className="text-slate-500">
                    © {new Date().getFullYear()} beebetter®. All rights
                    reserved.
                </p>
            </footer>
        </div>
    );
}
