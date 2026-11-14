/** Static workflow demo for the Workflows & Automation page (labeled as a demo). */
const INPUTS = ["New call", "Web form", "Booking request"];
const OUTPUTS = ["Follow-up text sent", "Invoice reminder sent", "Review requested"];

export default function WorkflowDemo() {
  return (
    <div className="paper relative rounded-md p-5 sm:p-7" role="img" aria-label="Demo workflow: new calls, web forms and booking requests flow into an automation hub that sends follow-up texts, invoice reminders and review requests.">
      <span className="absolute right-4 top-4 rounded border-2 border-mk-red/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mk-red">Demo</span>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]" aria-hidden>
        <ul className="space-y-2.5">
          {INPUTS.map((t) => (
            <li key={t} className="rounded-md border-2 border-mk-blue/60 bg-note-blue px-3 py-2 text-sm font-semibold text-ink">
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-2 py-2">
          <svg width="40" height="20" viewBox="0 0 40 20" className="rotate-90 sm:rotate-0">
            <path d="M2 10 H34 M28 4 L36 10 L28 16" fill="none" stroke="#1f6feb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="grid h-24 w-24 place-items-center rounded-full border-[3px] border-ink bg-white text-center text-xs font-bold uppercase tracking-wider text-ink shadow-[0_8px_20px_rgba(26,26,26,0.1)]">
            Auto&shy;mation
          </div>
          <svg width="40" height="20" viewBox="0 0 40 20" className="rotate-90 sm:rotate-0">
            <path d="M2 10 H34 M28 4 L36 10 L28 16" fill="none" stroke="#2f9e44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <ul className="space-y-2.5">
          {OUTPUTS.map((t) => (
            <li key={t} className="flex items-center gap-2 rounded-md border-2 border-mk-green/60 bg-note-green px-3 py-2 text-sm font-semibold text-ink">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#237a34" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 13 l5 5 L20 6" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs text-ink/75">Demo workflow for illustration. Your automations are built around your own process.</p>
    </div>
  );
}
