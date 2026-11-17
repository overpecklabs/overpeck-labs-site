"use client";

export default function PrintButton() {
  return (
    <button type="button" className="adm-btn" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
