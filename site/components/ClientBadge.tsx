import Image from "next/image";
import clsx from "clsx";

import { resolveClientLogoSrc } from "@/lib/site-data/clientLogos";

export interface ClientBadgeData {
  name: string;
  sector: string;
  location?: string;
  /** Optional explicit logo path under /images/client-logos/ */
  logoSrc?: string;
}

interface ClientBadgeProps extends ClientBadgeData {
  featured?: boolean;
}

function monogramFromName(name: string): string {
  const parts = name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function ClientBadge({
  name,
  sector,
  location,
  logoSrc: explicitLogoSrc,
  featured = false,
}: ClientBadgeProps) {
  const logoSrc = resolveClientLogoSrc(name, explicitLogoSrc);

  return (
    <div className={clsx("client-badge group", featured && "client-badge--featured")}>
      <div className="flex items-start justify-between gap-2">
        <span className="client-badge__sector">{sector}</span>
      </div>

      <div className="client-badge__mark">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt=""
            width={140}
            height={40}
            className="client-badge__logo"
          />
        ) : (
          <span className="client-badge__monogram" aria-hidden="true">
            {monogramFromName(name)}
          </span>
        )}
      </div>

      <div className="client-badge__body">
        <h3 className="client-badge__name">{name}</h3>
        {location ? <p className="client-badge__location">{location}</p> : null}
      </div>
    </div>
  );
}
