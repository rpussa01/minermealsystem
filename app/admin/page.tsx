import Link from "next/link";

const cards = [
  { href: "/admin/miners", title: "Manage Miners", body: "Add, edit, activate or mark miners as gone." },
  { href: "/admin/menu", title: "Manage Menu", body: "Add meals, descriptions and active status." },
  { href: "/admin/dockets", title: "Daily Dockets", body: "Generate kitchen summaries by date." },
  { href: "/admin/qr", title: "QR Poster", body: "Print the QR code miners use to order." },
  { href: "/admin/orders", title: "Orders", body: "View submitted orders." },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage miners, meals, QR ordering and kitchen dockets.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.href} className="rounded-2xl bg-white p-6 shadow hover:shadow-md" href={card.href}>
              <h2 className="text-xl font-bold">{card.title}</h2>
              <p className="mt-2 text-gray-600">{card.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
