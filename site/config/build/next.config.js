const path = require("path");
const { loadEnvLocal } = require(/* turbopackIgnore: true */ "../../scripts/loadEnvLocal.cjs");

loadEnvLocal();

const resolvedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const configuredAssetBaseUrl =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL || process.env.ASSET_BASE_URL || "";

const parsedAssetBaseUrl = (() => {
  try {
    return configuredAssetBaseUrl ? new URL(configuredAssetBaseUrl) : null;
  } catch {
    return null;
  }
})();

const useUnoptimizedImages = process.env.VERCEL_ENV === "production" ? false : (
  process.env.NEXT_IMAGE_UNOPTIMIZED === "1" ||
  process.env.NEXT_IMAGE_UNOPTIMIZED === "true"
);

const firstPartyAssetHost = process.env.NEXT_PUBLIC_ASSET_HOSTNAME?.trim();

const imageRemotePatterns = [
  {
    protocol: "https",
    hostname: "*.supabase.co",
    pathname: "/storage/v1/object/public/**",
  },
];

if (firstPartyAssetHost) {
  imageRemotePatterns.push({
    protocol: "https",
    hostname: firstPartyAssetHost,
    pathname: "/**",
  });
}

if (parsedAssetBaseUrl) {
  const normalizedBasePath = parsedAssetBaseUrl.pathname.replace(/\/+$/, "");
  imageRemotePatterns.push({
    protocol: parsedAssetBaseUrl.protocol.replace(":", ""),
    hostname: parsedAssetBaseUrl.hostname,
    pathname: `${normalizedBasePath || ""}/**`,
  });
}

const fs = require("fs");

const findRepoRoot = (dir) => {
  if (fs.existsSync(path.join(/* turbopackIgnore: true */ dir, "node_modules", "next"))) return dir;
  const parent = path.dirname(dir);
  return parent === dir ? dir : findRepoRoot(parent);
};

// Live plan host = features/planner/workspace + canvas-fabric-stage.
// Planner fabric `_archive` is deleted — do not reintroduce.

const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_SITE_URL: resolvedSiteUrl,
    NEXT_PUBLIC_ASSET_BASE_URL:
      process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
      process.env.ASSET_BASE_URL ||
      "",
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/results",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/results/:path*",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/workstations/configurator",
        destination: "/catalog",
        permanent: true,
      },
      {
        source: "/products/oando-chairs",
        destination: "/products/seating",
        permanent: true,
      },
      {
        source: "/products/oando-chairs/:slug",
        destination: "/products/seating/:slug",
        permanent: true,
      },
      {
        source: "/products/oando-other-seating",
        destination: "/products/seating",
        permanent: true,
      },
      {
        source: "/products/oando-other-seating/:slug",
        destination: "/products/seating/:slug",
        permanent: true,
      },
      {
        source: "/products/oando-seating",
        destination: "/products/seating",
        permanent: true,
      },
      {
        source: "/products/oando-workstations",
        destination: "/products/workstations",
        permanent: true,
      },
      {
        source: "/products/oando-tables",
        destination: "/products/tables",
        permanent: true,
      },
      {
        source: "/products/oando-storage",
        destination: "/products/storages",
        permanent: true,
      },
      {
        source: "/products/oando-soft-seating",
        destination: "/products/soft-seating",
        permanent: true,
      },
      {
        source: "/products/oando-collaborative",
        destination: "/products/soft-seating",
        permanent: true,
      },
      {
        source: "/products/oando-educational",
        destination: "/products/education",
        permanent: true,
      },
      {
        source: "/products/chairs-mesh",
        destination: "/products/seating",
        permanent: true,
      },
      {
        source: "/products/chairs-others",
        destination: "/products/seating",
        permanent: true,
      },
      {
        source: "/products/cafe-seating",
        destination: "/products/seating",
        permanent: true,
      },
      {
        source: "/products/desks-cabin-tables",
        destination: "/products/tables",
        permanent: true,
      },
      {
        source: "/products/meeting-conference-tables",
        destination: "/products/tables",
        permanent: true,
      },
      {
        source: "/products/others-1",
        destination: "/products/soft-seating",
        permanent: true,
      },
      {
        source: "/products/others-2",
        destination: "/products/seating",
        permanent: true,
      },
      // Legacy planner URLs (app/buddy-planner + app/oando-planner archived)
      { source: "/oando-planner", destination: "/planner/", permanent: true },
      { source: "/oando-planner/canvas", destination: "/planner/canvas/", permanent: true },
      { source: "/oando-planner/guest", destination: "/planner/guest/", permanent: true },
      { source: "/oando-planner/onboarding", destination: "/planner/", permanent: true },
      { source: "/oando-planner/dashboard", destination: "/dashboard/", permanent: true },
      { source: "/oando-planner/shared", destination: "/planner/canvas/", permanent: true },
      { source: "/oando-planner/login", destination: "/login/", permanent: true },
      { source: "/buddy-planner", destination: "/planner/canvas/", permanent: true },
      { source: "/buddy-planner/guest", destination: "/planner/guest/", permanent: true },
      { source: "/buddy-planner/editor", destination: "/planner/canvas/", permanent: true },
      { source: "/buddy-planner/onboarding", destination: "/planner/", permanent: true },
      { source: "/buddy-planner/dashboard", destination: "/dashboard/", permanent: true },
      { source: "/buddy-planner/login", destination: "/login/", permanent: true },
      { source: "/buddy-planner/:path*", destination: "/planner/canvas/", permanent: true },
      { source: "/oando-planner/:path*", destination: "/planner/", permanent: true },
      { source: "/planner/fabric", destination: "/planner/canvas/", permanent: true },
      { source: "/planner/fabric/:path*", destination: "/planner/canvas/", permanent: true },
      { source: "/planner/open3d", destination: "/planner/canvas/", permanent: true },
      { source: "/planner/open3d/:path*", destination: "/planner/canvas/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'"
          }
        ]
      },
      {
        source: "/tech-docs/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow"
          }
        ]
      }
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        // Tech stack docs SPA — catch-all for client-side routes
        {
          source: '/tech-docs/:path*',
          destination: '/tech-docs/index.html',
        },
      ],
    };
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: useUnoptimizedImages,
    remotePatterns: imageRemotePatterns,
    // Allow SVG only if something still points at category.svg; product paths prefer raster fallback.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "framer-motion", "three", "@react-three/fiber", "@react-three/drei"], // PERF-FIX: tree-shake heavy deps
  },
  typescript: {
    ignoreBuildErrors: false, // PERF-FIX: enforce type safety at build time
  },
  webpack: (config, { isServer }) => {
    // Client bundles must not pull node:fs (e.g. gltf-transform NodeIO via modular GLB path).
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }
    return config;
  },
  // Prefer site package.json "dev": next dev --webpack (turbo optional via dev:turbo).
  // turbopack.root at monorepo root indexes huge node_modules — memory risk.
  turbopack: {
    root: findRepoRoot(/* turbopackIgnore: true */ __dirname),
  },
};

module.exports = nextConfig;
