"use client";

import { useEffect, useRef, useState } from "react";

export default function AweberForm() {
    const hostRef = useRef<HTMLDivElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const SCRIPT_ID = "aweber-wjs-lunzhtnf8";
        const SRC = "https://forms.aweber.com/form/05/530303105.js";

        // ensure the host div exists before loading the script
        const ensure = () => {
            if (!hostRef.current) return false;
            // If a form was already injected (e.g., hot reload), keep it
            if (hostRef.current.querySelector("form")) {
                setLoaded(true);
                return true;
            }
            return true;
        };

        const load = () => {
            if (!ensure()) return;

            // Already loaded?
            if (document.getElementById(SCRIPT_ID)) {
                setLoaded(true);
                return;
            }

            const s = document.createElement("script");
            s.id = SCRIPT_ID;
            s.src = SRC;
            s.async = true;
            s.onload = () => setLoaded(true);
            // put it late in the body so our host div is definitely in the DOM
            (document.body || document.head).appendChild(s);
        };

        // microtask delay to let React commit the hostRef div first
        const t = setTimeout(load, 0);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="mt-6">
            {/* AWeber injects into this element by class name */}
            <div ref={hostRef} className="AW-Form-530303105" />
            {!loaded && (
                <div className="text-sm text-slate-400 mt-2">Loading…</div>
            )}
        </div>
    );
}
