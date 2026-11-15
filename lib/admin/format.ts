// Every admin time is shown in America/New_York.
export const TZ = "America/New_York";

const dtFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
const dFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short", day: "numeric", year: "numeric" });
const ymdFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });

function toDate(v: string | number | Date | null | undefined): Date | null {
  if (v === null || v === undefined || v === "") return null;
  if (v instanceof Date) return v;
  if (typeof v === "number" || /^\d{10,}$/.test(v)) {
    const n = Number(v);
    return new Date(n < 1e12 ? n * 1000 : n); // seconds or ms epoch (Retell uses ms)
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function fmtDateTime(v: string | number | null | undefined): string {
  const d = toDate(v);
  return d ? dtFmt.format(d) : "—";
}

export function fmtDate(v: string | number | null | undefined): string {
  const d = toDate(v);
  return d ? dFmt.format(d) : "—";
}

/** Date-only DB values ("YYYY-MM-DD") are calendar dates, not instants: format without shifting. */
export function fmtDay(v: string | null | undefined): string {
  if (!v) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (!m) return v;
  return dayFmt.format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])));
}

/** Today's calendar date in New York (YYYY-MM-DD), optionally shifted by whole days. */
export function todayNY(offsetDays = 0): string {
  return ymdFmt.format(new Date(Date.now() + offsetDays * 86400000));
}

function tzOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second")) - utcMs;
}

/** Current New York wall time for a datetime-local input ("YYYY-MM-DDTHH:mm"). */
export function nyLocalNow(): string {
  const now = Date.now();
  return new Date(now + tzOffsetMs(now)).toISOString().slice(0, 16);
}

/** A datetime-local value typed in New York time -> ISO instant. */
export function nyLocalToIso(local: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) return null;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  let utc = wall - tzOffsetMs(wall);
  utc = wall - tzOffsetMs(utc); // second pass settles DST edges
  return new Date(utc).toISOString();
}

export function fmtDuration(sec: number | string | null | undefined): string {
  if (sec === null || sec === undefined || sec === "") return "—";
  const s = Math.round(Number(sec));
  if (Number.isNaN(s)) return "—";
  const m = Math.floor(s / 60);
  return m ? `${m}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`;
}

export function fmtMoney(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: n % 1 ? 2 : 0 });
}

export function fmtBytes(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function telHref(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const d = phone.replace(/[^\d+]/g, "");
  if (!d) return null;
  if (d.startsWith("+")) return `tel:${d}`;
  if (d.length === 10) return `tel:+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `tel:+${d}`;
  return `tel:${d}`;
}

export function externalHref(url: string | null | undefined): string | null {
  const u = url?.trim();
  if (!u) return null;
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}
