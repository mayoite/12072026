"use client";

import Image from "next/image";
import { HOMEPAGE_TRUST_CONTENT } from "@/lib/site-data/homepage";

export function FooterLogoMarquee() {
  const trackLogos = [...HOMEPAGE_TRUST_CONTENT.logos, ...HOMEPAGE_TRUST_CONTENT.logos];

  return (
    <section
      aria-hidden="true"
      className="footer-logo-marquee w-full border-y border-soft bg-panel py-4 md:py-5"
      style={{ ["--marquee-duration" as string]: "110s" }}
    >
      <div className="relative overflow-hidden">
        <div className="footer-logo-marquee__track flex w-max animate-marquee motion-reduce:animate-none">
          {trackLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="footer-logo-marquee__item relative flex h-12 w-34 shrink-0 items-center justify-center overflow-hidden md:h-16 md:w-44"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={208}
                height={72}
                className="max-h-10 w-auto max-w-full object-contain opacity-100 saturate-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 motion-reduce:hover:scale-100 md:max-h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
