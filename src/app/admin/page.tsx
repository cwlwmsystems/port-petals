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

  const [
    productCountResult,
    paidCountResult,
    preparingCountResult,
    readyCountResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "paid"),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "preparing"),

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "ready"),
  ]);

  const productCount =
    productCountResult.count ?? 0;

  const paidCount =
    paidCountResult.count ?? 0;

  const preparingCount =
    preparingCountResult.count ?? 0;

  const readyCount =
    readyCountResult.count ?? 0;

  const activeOrderCount =
    paidCount + preparingCount + readyCount;

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-12 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Port Petals Admin
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Store Manager
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
            href="/admin/orders"
            className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30"
          >
            <p className="text-sm font-semibold text-[#607068]">
              Orders
            </p>

            <p className="mt-3 text-4xl font-semibold text-[#153f32]">
              {activeOrderCount}
            </p>

            <p className="mt-2 text-sm text-[#718078]">
              Active orders requiring attention
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#e6f2e3] px-3 py-3 text-center">
                <p className="text-xl font-semibold text-[#31583b]">
                  {paidCount}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#31583b]">
                  Paid
                </p>
              </div>

              <div className="rounded-xl bg-[#fff0d9] px-3 py-3 text-center">
                <p className="text-xl font-semibold text-[#7a5725]">
                  {preparingCount}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#7a5725]">
                  Preparing
                </p>
              </div>

              <div className="rounded-xl bg-[#dfeff4] px-3 py-3 text-center">
                <p className="text-xl font-semibold text-[#315b68]">
                  {readyCount}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#315b68]">
                  Ready
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold text-[#e76d61]">
              Manage Orders →
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30"
          >
            <p className="text-sm font-semibold text-[#607068]">
              Products
            </p>

            <p className="mt-3 text-4xl font-semibold text-[#153f32]">
              {productCount}
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
              Storefront
            </p>

            <p className="mt-3 font-serif text-2xl font-semibold text-[#153f32]">
              Catalog Control
            </p>

            <p className="mt-2 text-sm leading-6 text-[#718078]">
              Published products automatically appear on the website.
            </p>

            <p className="mt-5 text-sm font-semibold text-[#607068]">
              Product publishing controls the live catalog.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
