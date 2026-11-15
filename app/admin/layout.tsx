import type { Metadata } from "next";
import "./admin.css";

// Nothing under /admin is statically generated.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin · Overpeck Labs", template: "%s · Overpeck Labs Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100svh] bg-board text-ink">{children}</div>;
}
