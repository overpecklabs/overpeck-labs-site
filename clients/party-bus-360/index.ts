import type { Demo } from "@/lib/demo-types";
import { data } from "./demo/data";

const demo: Demo = {
  slug: data.slug,
  businessName: data.businessName,
  load: () => import("./demo/page-content"),
};

export default demo;
