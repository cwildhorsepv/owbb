"use client";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header
            className="relative w-full"
            // top-of-cover look
            style={{
                backgroundImage: "url('/honeycomb-top.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            {/* soft fade into transparent honeycomb */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "url('/honeycomb-fade.png')",
                    backgroundRepeat: "repeat-x",
                    backgroundSize: "100% auto",
                    opacity: 0.9,
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="shrink-0">
                    <Image
                        src="/owbblogo.png"
                        alt="One Word to beebetter"
                        width={220}
                        height={60}
                        priority
                    />
                </Link>

                <nav className="flex items-center gap-6 text-sm md:text-base font-semibold">
                    <Link href="/" className="hover:text-blue-700 transition">
                        Home
                    </Link>
                    <Link
                        href="/pick-your-word"
                        className="hover:text-blue-700 transition"
                    >
                        Pick Your Word
                    </Link>
                </nav>
            </div>
        </header>
    );
}
