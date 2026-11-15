import type { Metadata } from "next";

// Private previews: never indexed or followed (robots.txt does not block them, so crawlers can see this).
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
