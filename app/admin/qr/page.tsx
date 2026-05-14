"use client";

import Link from "next/link";
import QRCode from "react-qr-code";

export default function AdminQRPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://minermealsystem.vercel.app";
  const orderUrl = `${baseUrl}/order/today`;

  return (
    <main className="min-h-screen bg-gray-100 p-6 print:bg-white">
      <div className="print-hidden mx-auto mb-4 max-w-xl">
        <Link href="/admin" className="text-sm text-gray-600">← Back to admin</Link>
      </div>

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow print:shadow-none">
        <h1 className="text-3xl font-bold">Miner Meal Ordering</h1>
        <p className="mt-3 text-gray-600">Scan this QR code to submit your breakfast and lunch order before 8 PM.</p>

        <div className="mt-8 flex justify-center">
          <div className="rounded-xl bg-white p-6">
            <QRCode value={orderUrl} size={260} />
          </div>
        </div>

        <p className="mt-6 break-all text-sm text-gray-500">{orderUrl}</p>

        <button onClick={() => window.print()} className="print-hidden mt-8 w-full rounded-xl bg-black px-4 py-3 font-semibold text-white">
          Print QR Poster
        </button>
      </div>
    </main>
  );
}
