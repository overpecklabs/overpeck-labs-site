import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-white/60 sm:flex-row sm:items-center">
        <div>
          <div className="font-display text-lg font-bold text-white">
            Overpeck<span className="text-teal"> Labs</span>
          </div>
          <div>Bergen County, NJ</div>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          <a href={`tel:${PHONE_TEL}`} className="hover:text-teal">
            {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="hover:text-teal">
            {EMAIL}
          </a>
        </div>
        <div className="text-xs text-white/40">© {new Date().getFullYear()} Overpeck Labs</div>
      </div>
    </footer>
  );
}
