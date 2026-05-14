export const dynamic = "force-dynamic";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function addMenuItem(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();

  if (!name || !category) return;

  await prisma.menuItem.create({
    data: { name, description: description || null, category, active: true },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/order/today");
}

async function toggleMenuItem(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";

  await prisma.menuItem.update({ where: { id }, data: { active: !active } });

  revalidatePath("/admin/menu");
  revalidatePath("/order/today");
}

export default async function MenuPage() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm text-gray-600">← Back to admin</Link>
        <h1 className="mt-3 text-3xl font-bold">Menu Management</h1>
        <p className="mt-2 text-gray-600">Add meals with descriptions. Remove means deactivate, not delete.</p>

        <form action={addMenuItem} className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Add New Meal</h2>

          <div className="mt-4 grid gap-4">
            <input name="name" placeholder="Meal name" className="rounded border p-3" required />
            <textarea
              name="description"
              placeholder="Meal description e.g. Eggs of your choice, tomato, mushroom, spinach and sourdough bread"
              className="rounded border p-3"
              rows={3}
            />
            <select name="category" className="rounded border p-3" required>
              <option value="">Select category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Fruit">Fruit</option>
              <option value="Drink">Drink</option>
              <option value="Sweet">Sweet</option>
            </select>
            <button className="rounded-xl bg-black px-4 py-3 font-semibold text-white">Add Meal</button>
          </div>
        </form>

        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-lg font-bold">{item.name}</p>
                  <p className="text-sm font-medium text-gray-500">{item.category}</p>
                  {item.description && <p className="mt-2 text-gray-700">{item.description}</p>}
                  <p className="mt-2 text-sm">
                    Status: <span className={item.active ? "text-green-600" : "text-red-600"}>{item.active ? "Active" : "Inactive"}</span>
                  </p>
                </div>

                <form action={toggleMenuItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="active" value={String(item.active)} />
                  <button className="rounded-xl border px-4 py-2">{item.active ? "Remove" : "Reactivate"}</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
