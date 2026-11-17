// Second admin gate: ADMIN_EMAILS (comma-separated, server env). A user must be in this list AND in public.admin_users.
// RLS still enforces data access through admin_users / private.is_admin(); this only decides who may open /admin.
const DEFAULT_ADMIN_EMAILS = "markqsai@gmail.com,quis.abassi@gmail.com";

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS?.trim() || DEFAULT_ADMIN_EMAILS)
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminEmails().includes(email.trim().toLowerCase());
}
