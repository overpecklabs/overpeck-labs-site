import type { Demo } from "@/lib/demo-types";
import { data } from "./demo/data";

/** Registered in lib/demos.ts. Nothing to change after copying: slug and name come from data.ts. */
const demo: Demo = {
  slug: data.slug,
  businessName: data.businessName,
  load: () => import("./demo/page-content"),
};

export default demo;
