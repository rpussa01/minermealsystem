export const dynamic = "force-dynamic";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function addMiner(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const mobile = String(formData.get("mobile") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const roomNumber = String(formData.get("roomNumber") || "").trim();

  if (!name || !mobile) return;

  const existing = await prisma.miner.findUnique({ where: { mobile } });

  if (existing) {
    await prisma.miner.update({
      where: { mobile },
      data: { active: true, name, company: company || null, roomNumber: roomNumber || null },
    });
  } else {
    await prisma.miner.create({
      data: { name, mobile, company: company || null, roomNumber: roomNumber || null, active: true },
    });
  }

  revalidatePath("/admin/miners");
}

async function toggleMiner(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";

  await prisma.miner.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/miners");
}

export default async function MinersPage() {
  const miners = await prisma.miner.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm text-gray-600">← Back to admin</Link>
        <h1 className="mt-3 text-3xl font-bold">Miner Management</h1>
        <p className="mt-2 text-gray-600">Mobile number is unique. If an existing inactive miner is added again, they are reactivated.</p>

        <form action={addMiner} className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Add Miner</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input name="name" placeholder="Full name" className="rounded border p-3" required />
            <input name="mobile" placeholder="Mobile number" className="rounded border p-3" required />
            <input name="company" placeholder="Company" className="rounded border p-3" />
            <input name="roomNumber" placeholder="Room number" className="rounded border p-3" />
          </div>
          <button className="mt-4 rounded-xl bg-black px-4 py-3 font-semibold text-white">Add / Reactivate Miner</button>
        </form>

        <div className="mt-8 grid gap-4">
          {miners.map((miner) => (
            <div key={miner.id} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-lg font-bold">{miner.name}</p>
                  <p className="text-gray-600">{miner.mobile}</p>
                  <p className="text-sm text-gray-500">{miner.company || "No company"} · Room {miner.roomNumber || "-"}</p>
                  <p className={miner.active ? "text-green-600" : "text-red-600"}>{miner.active ? "Active" : "Gone / Inactive"}</p>
                </div>
                <form action={toggleMiner}>
                  <input type="hidden" name="id" value={miner.id} />
                  <input type="hidden" name="active" value={String(miner.active)} />
                  <button className="rounded-xl border px-4 py-2">{miner.active ? "Mark Gone" : "Reactivate"}</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
