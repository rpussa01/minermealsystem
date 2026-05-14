"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-3">
      Print / Save PDF
    </button>
  );
}
