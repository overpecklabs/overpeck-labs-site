type AnyErr = { message: string; code?: string; statusCode?: string | number; status?: number };

/** RLS / permission failures (Postgres 42501, PostgREST JWT errors, storage 401/403). */
export function isNotAuthorized(e: AnyErr | null | undefined): boolean {
  if (!e) return false;
  const code = String(e.code ?? "");
  const status = String(e.statusCode ?? e.status ?? "");
  return (
    code === "42501" ||
    code.startsWith("PGRST3") ||
    status === "401" ||
    status === "403" ||
    /row-level security|permission denied|not authorized|unauthorized|jwt/i.test(e.message ?? "")
  );
}

export function friendlyError(e: AnyErr | null | undefined, fallback = "Something went wrong. Please try again."): string {
  if (!e) return fallback;
  if (isNotAuthorized(e)) return "Not authorized.";
  if (e.code === "23514") return "One of the values isn't allowed. Please pick from the list.";
  if (e.code === "23505") return "That already exists.";
  if (e.code === "23503") return "A linked record is missing. Refresh and try again.";
  if (e.code === "22P02" || e.code === "22007" || e.code === "22008") return "One of the values is in the wrong format.";
  return fallback;
}
