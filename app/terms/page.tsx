import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/services";

export const metadata: Metadata = {
  title: "Terms of Use | Overpeck Labs",
  description: "Terms for using the Overpeck Labs website and requesting a free website mockup.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="November 14, 2026">
      <p>By using this website, you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.</p>

      <h2>Information on this site</h2>
      <p>
        The content on this website is for general information about our services. Sample designs, dashboards, chat and call demos, and example numbers are illustrations only. The businesses shown in sample designs are fictional, and example figures are not results from real clients.
      </p>

      <h2>Free mockups and quotes</h2>
      <p>
        A free website mockup is a design preview with no cost and no obligation. Listed prices are starting points; final pricing depends on the size and features of your project and is confirmed with you in writing before any work begins.
      </p>

      <h2>Your submissions</h2>
      <p>
        When you send us information through a form, you confirm it&apos;s accurate and that you&apos;re allowed to share it, including any logo you upload. See our <a href="/privacy" className="font-semibold text-teal-ink underline">Privacy Policy</a> for how we handle it.
      </p>

      <h2>No guarantees</h2>
      <p>
        We work hard to help your business grow, but we can&apos;t guarantee specific results such as rankings, lead volume or revenue. This website is provided &ldquo;as is&rdquo;.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Call us at{" "}
        <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-ink underline">
          {PHONE_DISPLAY}
        </a>
        .
      </p>
    </LegalPage>
  );
}
