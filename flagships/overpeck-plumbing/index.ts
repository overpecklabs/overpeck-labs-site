import type { Demo } from "@/lib/demo-types";
import { data } from "./demo/data";

/** Overpeck Labs' flagship showcase (fictional brand): shows the "Sample site by Overpeck Labs" banner. */
const demo: Demo = {
  slug: data.slug,
  businessName: data.businessName,
  banner: "showcase",
  icon: "/demos/overpeck-plumbing/icon.svg",
  load: () => import("./demo/page-content"),
};

export default demo;
