import React from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean | null;
};

export function MockNextLink({ children, href, prefetch: _prefetch, ...rest }: LinkProps) {
  // Prefer an explicit data-testid; ignore undefined so callers that pass
  // data-testid={optional} do not wipe the default mock attribute.
  const testId =
    typeof rest["data-testid"] === "string" && rest["data-testid"].length > 0
      ? rest["data-testid"]
      : "next-link";
  return (
    <a href={href} {...rest} data-testid={testId}>
      {children}
    </a>
  );
}

export function installNextLinkMock() {
  // Registered globally from tests/setup.ts via vi.mock.
}
