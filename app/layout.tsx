import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
// Only used by the sample-design cards in the Industries showcase.
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Overpeck Labs — Websites, leads & AI for Bergen County businesses",
  description:
    "Overpeck Labs, Bergen County NJ: websites that win business, workflow automation, tracking & optimization, and AI that never misses a lead. Free website mockup before you pay anything.",
};

export const viewport: Viewport = {
  themeColor: "#05060d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${playfair.variable} ${bebas.variable}`}>
      <body>{children}</body>
    </html>
  );
}
