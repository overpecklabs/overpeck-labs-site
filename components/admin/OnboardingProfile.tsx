import { stepRows } from "@/lib/portal/format";
import type { Answers, PortalFile, WizardDef } from "@/lib/portal/types";

/** All answers grouped by step, with uploads as thumbnails and signed downloads. Used by the admin tab and the print page. */
export default function OnboardingProfile({ wizard, answers, files, showLinks = true }: { wizard: WizardDef; answers: Answers; files: PortalFile[]; showLinks?: boolean }) {
  const logos = files.filter((f) => f.label === "Onboarding: logo");
  const photos = files.filter((f) => f.label === "Onboarding: photo");
  return (
    <div className="space-y-4">
      {wizard.steps
        .filter((s) => !s.review)
        .map((s) => {
          const rows = stepRows(s, answers);
          const uploads = s.id === "brand" ? logos : s.id === "photos" ? photos : [];
          return (
            <section key={s.id} className="break-inside-avoid rounded-xl border border-ink/[0.09] bg-white/70 p-4">
              <h3 className="font-display text-base font-bold">{s.title}</h3>
              <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {rows.map((r) => (
                  <div key={r.label} className={r.value.includes("\n") || r.value.length > 90 ? "sm:col-span-2" : ""}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">{r.label}</dt>
                    <dd className={`mt-0.5 whitespace-pre-line break-words text-sm ${r.empty ? "text-ink/35" : ""}`}>{r.empty ? "—" : r.value}</dd>
                  </div>
                ))}
              </dl>
              {(s.id === "brand" || s.id === "photos") && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{s.id === "brand" ? "Logo" : `Photos (${photos.length})`}</p>
                  {uploads.length === 0 ? (
                    <p className="mt-1 text-sm text-ink/35">None uploaded</p>
                  ) : (
                    <ul className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                      {uploads.map((f) => (
                        <li key={f.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white">
                          {f.url && f.mime_type?.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={f.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="flex aspect-square items-center justify-center bg-ink/5 text-xs font-semibold text-ink/60">File</div>
                          )}
                          {showLinks && (
                            <div className="flex justify-between gap-2 px-2 py-1 text-xs print:hidden">
                              {f.url && (
                                <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-ink hover:underline">
                                  Open
                                </a>
                              )}
                              {f.downloadUrl && (
                                <a href={f.downloadUrl} className="font-semibold text-teal-ink hover:underline">
                                  Download
                                </a>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
    </div>
  );
}
