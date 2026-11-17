/** @type {import('next').NextConfig} */
const nextConfig = {
  // Runs natively on Vercel (no static export) so /admin can use the proxy, cookies,
  // route handlers and server actions. Public pages are still prerendered as static HTML.
  images: { unoptimized: true },
  transpilePackages: ["three"],
  reactStrictMode: true,
  // The blog reads content/blog/*.md at request time when it revalidates; make sure the files ship with those routes.
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/*.md"],
    "/blog/*": ["./content/blog/*.md"],
    "/sitemap.xml": ["./content/blog/*.md"],
  },
  async redirects() {
    return [
      // No public index of demos: /demo alone goes home.
      { source: "/demo", destination: "/", permanent: false },
      // Old demo URLs -> /demo/[slug] (308).
      ...LEGACY_DEMO_REDIRECTS.map(([source, slug]) => ({ source, destination: `/demo/${slug}`, permanent: true })),
    ];
  },
};

/** [old path, demo slug]. Add one line per URL a demo was previously shared at. */
const LEGACY_DEMO_REDIRECTS = [
  // ["/mockups/mains-and-drains", "mains-and-drains"],
];

export default nextConfig;
