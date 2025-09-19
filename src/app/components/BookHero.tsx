// src/components/BookHero.tsx
import Link from "next/link";

export default function BookHero({ className = "" }: { className?: string }) {
    return (
        <section className={`px-0 ${className}`}>
            {/* Full-bleed image spans the viewport width */}
            <div className="relative left-1/2 -ml-[50vw] w-screen">
                <img
                    src="/book-ioed-hero.png"
                    alt="" // decorative only
                    role="presentation"
                    className="block w-full h-auto"
                    loading="eager"
                />
            </div>
        </section>
    );
}
