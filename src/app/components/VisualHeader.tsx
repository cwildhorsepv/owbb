"use client";
import Image from "next/image";

type Props = {
    tight?: boolean; // optional: smaller gap below the blue line
};

export default function VisualHeader({ tight = false }: Props) {
    return (
        <div className="relative w-full isolate">
            {/* ---- GLOBAL THEME (applies site-wide once header is mounted) ---- */}
            <style jsx global>{`
                :root {
                    --owbb-blue: #004aad;
                }
                /* Headings use League Spartan (via next/font variable) */
                h1,
                h2,
                h3,
                .owbb-heading {
                    font-family: var(
                        --font-league,
                        ui-sans-serif,
                        system-ui,
                        -apple-system,
                        Segoe UI,
                        Roboto,
                        Arial,
                        "Noto Sans",
                        "Apple Color Emoji",
                        "Segoe UI Emoji"
                    );
                    letter-spacing: -0.01em;
                    font-weight: 700;
                }
                /* Links + accents */
                a {
                    color: var(--owbb-blue);
                    text-underline-offset: 3px;
                }
                a:hover {
                    opacity: 0.9;
                }
                /* Horizontal rules styled like the brand line */
                hr.owbb {
                    border: 0;
                    height: 6px;
                    background: var(--owbb-blue);
                    box-shadow: 0 6px 14px rgba(0, 74, 173, 0.35);
                    border-radius: 9999px;
                }
                /* Utility for buttons if you want it */
                .btn-owbb {
                    background: var(--owbb-blue);
                    color: #fff;
                    border-radius: 1rem;
                    font-weight: 700;
                }
            `}</style>

            {/* ---- HEADER LAYERS ---- */}
            <div
                className="relative h-[260px] md:h-[360px] w-full"
                style={{
                    backgroundImage: "url('/honeycomb-fade.png')", // bottom layer
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                }}
            >
                {/* soften honeycomb */}
                <div className="absolute inset-0 bg-white/25 pointer-events-none" />

                {/* honey drip overlay */}
                <Image
                    src="/honey-drip.png"
                    alt=""
                    fill
                    priority
                    className="pointer-events-none select-none object-contain object-top z-10"
                />

                {/* centered logo */}
                <div className="absolute inset-0 flex items-start justify-center pt-6 md:pt-8">
                    <Image
                        src="/owbblogo.png"
                        alt="One Word to beebetter"
                        width={680}
                        height={180}
                        priority
                        className="w-[72%] max-w-[820px] h-auto drop-shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
                    />
                </div>

                {/* full-width brand line at the exact bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-[var(--owbb-blue)] shadow-[0_6px_14px_rgba(0,74,173,0.35)] z-20" />
            </div>

            {/* breathing room under the line (toggle with `tight`) */}
            <div className={tight ? "h-3 md:h-5" : "h-4 md:h-6"} />
        </div>
    );
}
