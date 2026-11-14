import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

export const metadata: Metadata = {
  title: "Privacy Policy | Overpeck Labs",
  description: "How Overpeck Labs collects, stores and uses information you submit through our website forms.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 14, 2026">
      <p>
        Overpeck Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;) builds websites, automation, tracking and AI tools for businesses in Bergen County, New Jersey. This page explains what information we collect through this website and how we use it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Information you type into our forms, such as your name, phone number, email address (optional), business name, town, industry, and your answers to our questions.</li>
        <li>A logo file, if you choose to upload one with a free mockup request.</li>
        <li>The page you submitted the form from.</li>
      </ul>
      <p>
        The free mockup questionnaire saves your progress in your own browser (local storage) so a refresh doesn&apos;t lose your answers. That copy stays on your device and is cleared when you submit.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you about your request and prepare your free mockup or quote.</li>
        <li>To provide and improve the services you ask us for.</li>
      </ul>

      <h2>How it&apos;s stored and shared</h2>
      <p>
        Form submissions are stored securely with our database and hosting providers, who process data on our behalf. We never sell your information, and we don&apos;t share it with anyone except the service providers we need to run our business, or when the law requires it.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to update or delete the information you&apos;ve sent us at any time. To make a request or ask a question, call us at{" "}
        <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
          {PHONE_DISPLAY}
        </a>
        .
      </p>

      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the date at the top of this page.</p>
    </LegalPage>
  );
}
