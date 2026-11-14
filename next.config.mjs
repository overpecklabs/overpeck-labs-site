/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static export -> ./out
  images: { unoptimized: true },
  transpilePackages: ["three"],
  reactStrictMode: true,
};

export default nextConfig;
