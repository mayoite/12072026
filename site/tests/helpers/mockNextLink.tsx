import React from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean | null;
};

export function MockNextLink({ children, href, prefetch: _prefetch, ...rest }: LinkProps) {
  return (
    <a href={href} data-testid="next-link" {...rest}>
      {children}
    </a>
  );
}

export function installNextLinkMock() {
  // Registered globally from tests/setup.ts via vi.mock.
}
