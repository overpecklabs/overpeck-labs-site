# Client portal: Supabase dashboard setup

Do this once per Supabase project, after applying the two `20261117140*` migrations. None of it needs a service role key.

## Auth settings

1. **Authentication → Sign In / Providers → "Allow new users to sign up": ON.** The first magic link for a client creates their auth user. RLS gives a new user nothing until they claim a valid invite, and `/portal/login` sends links with `shouldCreateUser: false`.
2. **Authentication → SMTP**: enable custom SMTP so links come from support@.
   - Host `smtppro.zoho.com`, port `465`, sender `support@overpecklabs.com`, sender name `Overpeck Labs`
   - Username/password: the same Zoho mailbox used by `ZOHO_SMTP_USER` / `ZOHO_SMTP_PASS`
3. **Authentication → URL Configuration → Redirect URLs** (wildcards so the `?next=` query is allowed):
   - `https://overpecklabs.com/auth/callback**`
   - `https://*-<your-vercel-team>.vercel.app/auth/callback**` (Preview deployments)
   - `http://localhost:3000/auth/callback**` (local)
   - Site URL: `https://overpecklabs.com`

## Email templates (Authentication → Emails)

Edit **both** "Magic Link" and "Confirm signup". A client's first sign-in is a signup (new user); later ones are magic links.
The link uses `token_hash` so it also works when the email is opened on a different device or browser than the one that asked for it.

Subject: `Your Overpeck Labs sign-in link`

```html
<h2>Sign in to your Overpeck Labs client portal</h2>
<p>Tap the button to sign in. The link works once and expires soon. If you didn't ask for it, you can ignore this email.</p>
<p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email" style="display:inline-block;background:#19f0d2;color:#06201c;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:999px">Sign in</a></p>
<p>Questions? Call (201) 949-7695.</p>
<p>Overpeck Labs</p>
```

`{{ .RedirectTo }}` is the `emailRedirectTo` the site sets, which is always `…/auth/callback?next=<path>`, so appending `&token_hash=…&type=email` is correct. `/auth/callback` verifies it with `verifyOtp`.

## Environment variables (Vercel, Production + Preview)

- `ADMIN_EMAILS` (optional; defaults to `markqsai@gmail.com,quis.abassi@gmail.com`)
- `NEXT_PUBLIC_SITE_URL` (must be the deployment's own origin on Preview if you want links in test emails to point there)
- Existing, reused: `BILLING_RPC_SECRET`, `NOTIFY_EMAIL`, `ZOHO_SMTP_*`, Supabase URL and anon key.
