import type { Metadata } from "next";
import "../admin/admin.css"; // shared form/button classes (adm-*), built on the site's tokens

// Nothing under /portal is statically generated or indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Client portal · Overpeck Labs", template: "%s · Overpeck Labs" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100svh] bg-board text-ink">{children}</div>;
}
