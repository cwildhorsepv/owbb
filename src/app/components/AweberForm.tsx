"use client";

import Script from "next/script";

export default function AweberForm() {
    return (
        <>
            {/* AWeber injects the form into this div */}
            <div className="AW-Form-530303105" />
            <Script
                id="aweber-wjs-lunzhtnf8"
                src="https://forms.aweber.com/form/05/530303105.js"
                strategy="afterInteractive"
            />
        </>
    );
}
