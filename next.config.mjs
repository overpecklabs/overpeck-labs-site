/** @type {import('next').NextConfig} */
const nextConfig = {
  // Runs natively on Vercel (no static export) so /admin can use the proxy, cookies,
  // route handlers and server actions. Public pages are still prerendered as static HTML.
  images: { unoptimized: true },
  transpilePackages: ["three"],
  reactStrictMode: true,
};

export default nextConfig;
