"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Mode = "latest" | "random" | "grid";

type Video = {
    id: string;
    title?: string;
    thumb?: string;
    publishedAt?: string;
};

interface PodcastSpotlightProps {
    backgroundSrc?: string;
    logoSrc?: string;
    title?: string;
    subtitle?: string;
    /** Optional fallback IDs when API isn't configured or returns nothing */
    fallbackVideoIds?: string[];
    /** Display behavior */
    mode?: Mode; // "latest" | "random" | "grid"
}

export default function PodcastSpotlight({
    backgroundSrc = "/bb-podcast-hero.png",
    logoSrc = "/bb-podcast-hero.png",
    title = "BeeBetter Podcast",
    subtitle = "Latest from our channel",
    fallbackVideoIds = [],
    mode = "latest",
}: PodcastSpotlightProps) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/youtube", { cache: "no-store" });
                if (res.ok) {
                    const data: { videos?: Video[] } = await res.json();
                    if (data.videos?.length) {
                        setVideos(data.videos);
                        return;
                    }
                }
            } catch {
                // fall through to fallback
            }
            // no API videos? use fallback ids if provided
            if (fallbackVideoIds.length) {
                setVideos(fallbackVideoIds.map((id) => ({ id })));
            }
        })();
    }, [fallbackVideoIds]);

    useEffect(() => {
        if (!videos.length) return;
        if (mode === "random") {
            const idx = Math.floor(Math.random() * videos.length);
            setActive(videos[idx].id);
        } else {
            setActive(videos[0].id); // newest first (API already sorted)
        }
    }, [videos, mode]);

    const iframeSrc = useMemo(
        () =>
            active
                ? `https://www.youtube-nocookie.com/embed/${active}?rel=0&modestbranding=1`
                : null,
        [active],
    );

    return (
        <section className="relative w-full overflow-hidden rounded-2xl shadow-xl">
            <div className="absolute inset-0">
                <Image
                    src={backgroundSrc}
                    alt="BeeBetter Podcast"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-shrink-0">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden ring-2 ring-white/40 shadow-md">
                            <Image
                                src={logoSrc}
                                alt="Podcast Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-semibold text-white drop-shadow">
                            {title}
                        </h2>
                        <p className="mt-2 text-white/80">{subtitle}</p>

                        <div className="mt-6 w-full md:w-3/5 aspect-video rounded-lg overflow-hidden ring-1 ring-white/10 bg-black/70">
                            {iframeSrc ? (
                                <iframe
                                    className="h-full w-full"
                                    src={iframeSrc}
                                    title="BeeBetter Podcast Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-white/70">
                                    Loading…
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
