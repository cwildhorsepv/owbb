"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Quote, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import VisualHeader from "@components/VisualHeader";
import PodcastSpotlight from "@components/PodcastSpotlight";
import AweberForm from "@components/AweberForm";
import BookHero from "@components/BookHero";

// ⚠️ Replace this with your hosted image URL
const COVER_IMG =
    "https://images.unsplash.com/photo-1517036632971-9c29740c0f29?q=80&w=1600&auto=format&fit=crop";

export default function BeeBetterLanding() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        try {
            await new Promise((r) => setTimeout(r, 900));
            setStatus("success");
            setMessage("You're in! Check your inbox for a welcome message.");
            setEmail("");
        } catch (err) {
            setStatus("error");
            setMessage("Hmm, something went wrong. Please try again.");
        }
    }

    return (
        <div
            className="min-h-screen text-slate-800"
            style={{
                backgroundImage:
                    "url('https://www.transparenttextures.com/patterns/hexellence.png')",
                backgroundRepeat: "repeat",
                backgroundAttachment: "fixed",
                backgroundColor: "#f2dc83",
            }}
        >
            {/* Header */}
            <VisualHeader />
            {/* HERO HEADLINE (animated, ascending sizes, logo last) */}

            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.18 } },
                }}
                className="text-center pt-10 sm:pt-16 md:pt-24 lg:pt-[110px] pb-6 sm:pb-8 md:pb-12"
            >
                {[
                    {
                        text: "one word can change your life.",
                        size: "text-xl md:text-3xl",
                    },
                    {
                        text: "one word can change your world.",
                        size: "text-2xl md:text-4xl",
                    },
                    {
                        text: "one word can change everything.",
                        size: "text-3xl md:text-5xl",
                    },
                    {
                        text: "Are you ready to discover the one word to",
                        size: "text-3xl md:text-5xl",
                    },
                ].map((line, i) => (
                    <motion.p
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
                            show: {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                                transition: { duration: 0.55, ease: "easeOut" },
                            },
                        }}
                        className={`${line.size} font-extrabold leading-tight text-slate-900`}
                        style={{
                            letterSpacing: i === 3 ? "-0.01em" : "-0.015em",
                            marginBottom: "0.35rem",
                        }}
                    >
                        {line.text}
                    </motion.p>
                ))}

                {/* Logo line — biggest, centered, lands last */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.96, y: 10 },
                        show: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { duration: 0.6, ease: "easeOut" },
                        },
                    }}
                    className="mt-4 flex items-center justify-center"
                >
                    {/* keep file name exactly as you uploaded; swap path if different */}
                    <Image
                        src="/bbword.png"
                        alt="beebetter"
                        width={240} // pick something close to your intended size
                        height={96} // maintain the aspect ratio
                        priority // tells Next.js to preload this important image
                        className="w-auto h-auto max-h-24 md:max-h-28 xl:max-h-32"
                        style={{ transformOrigin: "center" }}
                    />
                </motion.div>
            </motion.div>

            {/* CTA button */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, delay: 0.8 },
                    },
                }}
                className="mt-1 text-center justify-center pb-[50px]"
            >
                <Link
                    href="https://beebettermovement.aweb.page/p/ee24e734-deb0-42b3-a606-a93f42ea7fd0"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg bg-[var(--owbb-blue)] hover:opacity-90 transition !text-white"
                    target="_blank"
                >
                    Join the beebetter movement
                </Link>
            </motion.div>

            {/* Book hero (slightly tighter top spacing) */}
            <BookHero className="pt-6 md:pt-8" />

            {/* WHY JOIN */}
            <section id="why" className="py-16 md:py-24">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Why join the{" "}
                        <span style={{ color: "#004AAD" }}>bee</span>
                        <span style={{ color: "#000000" }}>better</span>
                        <sub className="ml-0.5 text-xs text-black">®</sub>{" "}
                        community?
                    </h2>
                    <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">
                        {[
                            {
                                title: "Cut through the noise",
                                text: "Forget resolutions that fade by February. One word keeps you focused when life gets messy.",
                            },
                            {
                                title: "Honest and simple",
                                text: "No gimmicks. No overwhelm. Just a single word guiding every choice you make.",
                            },
                            {
                                title: "Shared journey",
                                text: "Grow alongside a global community that celebrates progress—not perfection.",
                            },
                        ].map((b, i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-6 border border-slate-200 shadow-sm bg-white"
                            >
                                <h3 className="text-xl font-semibold mb-2">
                                    {b.title}
                                </h3>
                                <p className="text-slate-600">{b.text}</p>
                            </div>
                        ))}
                    </div>
                    {/* CTA button */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.5, delay: 0.8 },
                            },
                        }}
                        className="mt-8 text-center justify-center pb-[50px]"
                    >
                        <Link
                            href="https://beebettermovement.aweb.page/p/ee24e734-deb0-42b3-a606-a93f42ea7fd0"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg bg-[var(--owbb-blue)] hover:opacity-90 transition !text-white"
                            target="_blank"
                        >
                            Join the beebetter movement
                        </Link>
                    </motion.div>
                    {/*Facebook */}
                    <div className="mt-1 pt-2">
                        <a
                            href="https://www.facebook.com/beebettermovement"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-sm font-semibold !text-white drop-shadow hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                            aria-label="Follow BeeBetter on Facebook (opens in new tab)"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-4 w-4"
                            >
                                <path
                                    d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5 3.66 9.14 8.44 9.94v-7.03H7.9V12.1h2.54V9.93c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.87h-2.34v7.03C18.34 21.2 22 17.06 22 12.06Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span className="!text-white">
                                Follow us on Facebook
                            </span>
                        </a>
                    </div>
                    {/* Youtube button */}
                    <div className="mt-3">
                        {(() => {
                            // set your channel URL once (ID or @handle works)
                            const youtubeChannelUrl =
                                "https://www.youtube.com/@beebettermovement";
                            // or: "https://www.youtube.com/@beebettermovement"
                            const subscribeUrl = `${youtubeChannelUrl}?sub_confirmation=1`;

                            return (
                                <a
                                    href={subscribeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#FF0000] px-5 py-2.5 text-sm font-semibold !text-white drop-shadow hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                    aria-label="Subscribe to our YouTube channel (opens in new tab)"
                                >
                                    {/* minimal YouTube play icon */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M9.5 16.5v-9l7 4.5-7 4.5z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="!text-white">
                                        Subscribe on YouTube
                                    </span>
                                </a>
                            );
                        })()}
                    </div>
                    {/* Instagram button */}
                    <div className="mt-3">
                        {(() => {
                            // set your channel URL once (ID or @handle works)
                            const youtubeChannelUrl =
                                "https://www.instagram.com/onewordtobeebetter/";
                            // or: "https://www.youtube.com/@beebettermovement"
                            const subscribeUrl = `${youtubeChannelUrl}?sub_confirmation=1`;

                            return (
                                <a
                                    href={subscribeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#E4405F] px-5 py-2.5 text-sm font-semibold !text-white drop-shadow hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                    aria-label="Subscribe to our YouTube channel (opens in new tab)"
                                >
                                    {/* minimal YouTube play icon */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M9.5 16.5v-9l7 4.5-7 4.5z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="!text-white">
                                        Subscribe on Instagram
                                    </span>
                                </a>
                            );
                        })()}
                    </div>
                    {/*tiktok button */}
                    <div className="mt-3">
                        {(() => {
                            // set your channel URL once (ID or @handle works)
                            const youtubeChannelUrl =
                                "https://www.tiktok.com/@onewordtobeebetter";
                            // or: "https://www.youtube.com/@beebettermovement"
                            const subscribeUrl = `${youtubeChannelUrl}?sub_confirmation=1`;

                            return (
                                <a
                                    href={subscribeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#000000] px-5 py-2.5 text-sm font-semibold !text-white drop-shadow hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                    aria-label="Subscribe to our YouTube channel (opens in new tab)"
                                >
                                    {/* minimal YouTube play icon */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M9.5 16.5v-9l7 4.5-7 4.5z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="!text-white">
                                        Subscribe on tiktok
                                    </span>
                                </a>
                            );
                        })()}
                    </div>
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section className="py-16 bg-white border-t border-b border-amber-100">
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Thousands already picked their word this year
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Don’t get left behind. Start today and see how one
                        simple word can reshape your focus, habits, and results.
                    </p>
                </div>
            </section>
            {/* TESTIMONIALS */}
            <section className="py-16 bg-amber-50 border-t border-b border-amber-100">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <h2 className="text-3xl font-bold">
                        What people are saying
                    </h2>
                    <div className="mt-8 grid md:grid-cols-3 gap-6 text-left">
                        {[
                            {
                                q: "My word was COURAGE, and it changed how I showed up at work.",
                                name: "– Sarah L.",
                            },
                            {
                                q: "GRATITUDE reminded me to slow down and appreciate my family.",
                                name: "– James R.",
                            },
                            {
                                q: "FOCUS kept me from burning out chasing too many goals.",
                                name: "– Priya K.",
                            },
                        ].map((t, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm"
                            >
                                <Quote className="h-6 w-6 text-amber-600 mb-3" />
                                <p className="text-slate-700 italic">“{t.q}”</p>
                                <p className="mt-2 text-slate-500 text-sm">
                                    {t.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="px-4 md:px-6 lg:px-8 my-10">
                    <PodcastSpotlight
                        // optional fallback IDs if API key isn’t set yet:
                        fallbackVideoIds={[
                            "dQw4w9WgXcQ",
                            "3JZ_D3ELwOQ",
                            "9bZkp7q19f0",
                        ]}
                        mode="random"
                        backgroundSrc="/bb-podcast-hero.png"
                        title="BeeBetter Podcast"
                    />
                </div>
            </section>

            {/* JOIN CTA */}
            <section
                id="join"
                className="py-20 bg-slate-900 text-white text-center"
            >
                <div className="mx-auto max-w-3xl px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to go from Good to Great?
                    </h2>

                    <p className="mt-6 text-lg text-slate-300">
                        Join the beebetter community today. It&apos;s free,
                        simple, and could transform your year.
                    </p>
                    <AweberForm />
                    {status !== "idle" && (
                        <p
                            className={`mt-3 text-center ${status === "success" ? "text-emerald-300" : status === "error" ? "text-rose-300" : "text-slate-300"}`}
                        >
                            {message}
                        </p>
                    )}
                    <ul className="mt-6 grid sm:grid-cols-3 gap-3 text-sm text-slate-300">
                        {[
                            "Weekly prompts",
                            "Private community",
                            "Word-tracking toolkit",
                        ].map((t, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-2 justify-center"
                            >
                                <CheckCircle className="h-4 w-4 text-emerald-400" />{" "}
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

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
