import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("display_name, active")
    .eq("auth_user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { count: productCount } = await supabase
    .from("products")
    .select("*", {
      count: "exact",
      head: true,
    });

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-12 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Port Petals Admin
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Product Manager
            </h1>

            <p className="mt-3 text-[#607068]">
              Welcome, {adminUser.display_name ?? "Port Petals Owner"}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              View Storefront
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30"
          >
            <p className="text-sm font-semibold text-[#607068]">
              Products
            </p>

            <p className="mt-3 text-4xl font-semibold text-[#153f32]">
              {productCount ?? 0}
            </p>

            <p className="mt-2 text-sm text-[#718078]">
              Total catalog records
            </p>

            <p className="mt-5 text-sm font-semibold text-[#e76d61]">
              Manage Products →
            </p>
          </Link>

          <section className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Inventory
            </p>

            <p className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Manage Stock
            </p>

            <p className="mt-2 text-sm leading-6 text-[#718078]">
              Product quantities and variants will be managed here.
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Storefront
            </p>

            <p className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Catalog Control
            </p>

            <p className="mt-2 text-sm leading-6 text-[#718078]">
              Published products will automatically appear on the website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
