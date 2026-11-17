"use client";

import { useEffect } from "react";
import { createClient as createSessionClient } from "@/lib/supabase/browser";

const BOT = /bot|crawler|spider|preview/i;
const SESSION_KEY = "ol-demo-session";
const sent = new Set<string>(); // one insert per page load, even under React Strict Mode's double effects

function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID(); // storage blocked: still count the view, just not as a repeat session
  }
}

function device(): "mobile" | "tablet" | "desktop" {
  const w = Math.min(window.screen?.width || window.innerWidth, window.innerWidth || Infinity);
  return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

/**
 * Records one anonymous view of a private demo in public.demo_views.
 * Skips our own views (?preview=1 or a signed-in admin session) and obvious bots. Fails silently.
 */
export default function DemoViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (sent.has(slug)) return;
    sent.add(slug);
    (async () => {
      try {
        if (new URLSearchParams(window.location.search).get("preview") === "1") return;
        const ua = navigator.userAgent || "";
        if (BOT.test(ua)) return;
        // Signed in to /admin in this browser? Then it's us. (Local check only; nothing is sent.)
        // One client for both steps (a second auth client on the page triggers Supabase's
        // "multiple GoTrueClient instances" warning). With no session it sends the public anon key.
        const supabase = createSessionClient();
        const { data } = await supabase.auth.getSession();
        if (data.session) return;
        // Plain insert, no .select(): anon can INSERT but not read back.
        await supabase
          .from("demo_views")
          .insert({
            slug,
            session_id: sessionId(),
            referrer: (document.referrer || "").slice(0, 500) || null,
            user_agent: ua.slice(0, 500) || null,
            device: device(),
          });
      } catch {
        /* never break the demo over analytics */
      }
    })();
  }, [slug]);
  return null;
}
