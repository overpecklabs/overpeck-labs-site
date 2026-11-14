"use client";

import { scrollToId } from "@/lib/journey";

const links = [
  { id: "process", label: "Process" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }} className="font-display text-lg font-bold tracking-tight">
          Overpeck<span className="text-teal"> Labs</span>
        </a>
        <ul className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.id} className="hidden sm:block">
              <a href={`#${l.id}`} onClick={go(l.id)} className="rounded-full px-3 py-1.5 text-white/70 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" onClick={go("contact")} className="rounded-full bg-white/10 px-4 py-1.5 font-semibold hover:bg-white/20">
              Free mockup
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
