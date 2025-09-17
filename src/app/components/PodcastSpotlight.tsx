"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

type Video = {
    id: string;
    title?: string;
    thumb?: string;
    publishedAt?: string;
};

export default function PodcastSpotlight({
    backgroundSrc = "/bb-podcast-hero.png",
    logoSrc = "/bb-podcast-hero.png",
    title = "BeeBetter Podcast",
    subtitle = "Latest from our channel",
}: {
    backgroundSrc?: string;
    logoSrc?: string;
    title?: string;
    subtitle?: string;
}) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/youtube", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                if (data.videos?.length) {
                    setVideos(data.videos);
                    setActive(data.videos[0].id);
                }
            }
        })();
    }, []);

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
                        <div className="mt-4">
                            <a
                                href="https://www.facebook.com/beebettermovement"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                aria-label="Follow BeeBetter on Facebook (opens in new tab)"
                            >
                                {/* simple FB “f” mark (inline SVG) */}
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
                                Follow us on Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
