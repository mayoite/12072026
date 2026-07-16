"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CookieConsent() {
    const [show, setShow] = useState(() => {
        if (typeof window === "undefined") return false;
        return !localStorage.getItem("oando-cookie-consent");
    });

    const handleAccept = () => {
        localStorage.setItem("oando-cookie-consent", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div
            role="region"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-4 scheme-panel-dark p-6 shadow-theme-float md:flex-row"
        >
            <div className="max-w-2xl text-sm font-light">
                <p>
                    We use cookies to optimize our website and our service.
                    <Link href="/privacy" className="ml-1 underline focus-ring-theme hover:text-inverse-muted">
                        Privacy Policy
                    </Link>
                </p>
            </div>
            <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => setShow(false)} className="btn-outline-light min-h-11">
                    Decline
                </Button>
                <Button onClick={handleAccept} className="btn-primary min-h-11">
                    Accept All
                </Button>
            </div>
        </div>
    );
}
