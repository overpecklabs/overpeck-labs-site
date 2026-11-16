import type { Demo } from "@/lib/demo-types";
import { data } from "./demo/data";

/** Overpeck Labs' second flagship showcase (fictional brand): "Sample site by Overpeck Labs" banner. */
const demo: Demo = {
  slug: data.slug,
  businessName: data.businessName,
  banner: "showcase",
  icon: "/demos/overpeck-exterior-care/icon.svg",
  description: "Overpeck Exterior Care is a fictional Bergen County window washing, power washing and soft washing company: a sample site by Overpeck Labs.",
  ogImage: "/demos/overpeck-exterior-care/og.jpg",
  load: () => import("./demo/page-content"),
};

export default demo;
