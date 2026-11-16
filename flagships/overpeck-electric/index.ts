import type { Demo } from "@/lib/demo-types";
import { data } from "./demo/data";

/** Overpeck Labs' third flagship showcase (fictional brand): "Sample site by Overpeck Labs" banner. */
const demo: Demo = {
  slug: data.slug,
  businessName: data.businessName,
  banner: "showcase",
  icon: "/demos/overpeck-electric/icon.svg",
  description: "Overpeck Electric is a fictional Bergen County electrician (panel upgrades, EV chargers, lighting, generators): a sample site by Overpeck Labs.",
  ogImage: "/demos/overpeck-electric/og.jpg",
  load: () => import("./demo/page-content"),
};

export default demo;
