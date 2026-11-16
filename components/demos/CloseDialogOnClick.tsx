"use client";

import type { ReactNode } from "react";

/** Closes the surrounding <dialog> before a click inside it is handled (so focus can move to the page behind it). */
export default function CloseDialogOnClick({ children }: { children: ReactNode }) {
  return <div onClickCapture={(e) => (e.currentTarget.closest("dialog") as HTMLDialogElement | null)?.close()}>{children}</div>;
}
