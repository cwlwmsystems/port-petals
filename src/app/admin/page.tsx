import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function formatPrice(value: number | string | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value ?? 0));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(
  status: string,
  fulfillmentType: string
) {
  if (
    status === "ready" &&
    fulfillmentType === "pickup"
  ) {
    return "Ready for Pickup";
  }

  if (status === "out_for_delivery") {
    return "Out for Delivery";
  }

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function statusClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "preparing":
      return "bg-[#fff0d9] text-[#7a5725]";
    case "ready":
      return "bg-[#dfeff4] text-[#315b68]";
    case "out_for_delivery":
      return "bg-[#e6edf7] text-[#365b7a]";
    case "completed":
      return "bg-[#e5ebe7] text-[#3f584b]";
    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

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

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const [
    productCountResult,
    paidCountResult,
    preparingCountResult,
    readyCountResult,
    deliveryCountResult,
    todayPaidOrdersResult,
    activeOrdersResult,
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

    supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "out_for_delivery"),

    supabase
      .from("orders")
      .select("id, total, paid_at")
      .eq("payment_status", "paid")
      .gte(
        "paid_at",
        startOfToday.toISOString()
      )
      .lt(
        "paid_at",
        startOfTomorrow.toISOString()
      ),

    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        fulfillment_type,
        status,
        total,
        created_at
      `)
      .in("status", [
        "paid",
        "preparing",
        "ready",
        "out_for_delivery",
      ])
      .order("created_at", {
        ascending: true,
      })
      .limit(12),
  ]);

  const productCount =
    productCountResult.count ?? 0;

  const paidCount =
    paidCountResult.count ?? 0;

  const preparingCount =
    preparingCountResult.count ?? 0;

  const readyCount =
    readyCountResult.count ?? 0;

  const outForDeliveryCount =
    deliveryCountResult.count ?? 0;

  const activeOrderCount =
    paidCount +
    preparingCount +
    readyCount +
    outForDeliveryCount;

  const todayPaidOrders =
    todayPaidOrdersResult.data ?? [];

  const todayOrderCount =
    todayPaidOrders.length;

  const todayRevenue =
    todayPaidOrders.reduce(
      (sum, order) =>
        sum + Number(order.total ?? 0),
      0
    );

  const activeOrders =
    activeOrdersResult.data ?? [];

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Port Petals Admin
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
              Today
            </h1>

            <p className="mt-3 text-[#607068]">
              Welcome,{" "}
              {adminUser.display_name ??
                "Port Petals Owner"}
              . Here is what needs attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-full bg-[#284239] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
            >
              Manage Orders
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              View Storefront
            </Link>

            <LogoutButton />
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Needs Attention
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {activeOrderCount}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Active orders
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Paid Today
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {todayOrderCount}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Confirmed orders today
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Revenue Today
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {formatPrice(todayRevenue)}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Paid order revenue
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30"
          >
            <p className="text-sm font-semibold text-[#607068]">
              Products
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {productCount}
            </p>

            <p className="mt-1 text-sm text-[#e76d61]">
              Manage catalog →
            </p>
          </Link>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Workflow
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Orders Requiring Attention
              </h2>
            </div>

            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-[#e76d61]"
            >
              View all orders →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/orders?status=paid"
              className="rounded-xl bg-[#e6f2e3] p-4"
            >
              <p className="text-3xl font-semibold text-[#31583b]">
                {paidCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#31583b]">
                New / Paid
              </p>
            </Link>

            <Link
              href="/admin/orders?status=preparing"
              className="rounded-xl bg-[#fff0d9] p-4"
            >
              <p className="text-3xl font-semibold text-[#7a5725]">
                {preparingCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#7a5725]">
                Preparing
              </p>
            </Link>

            <Link
              href="/admin/orders?status=ready"
              className="rounded-xl bg-[#dfeff4] p-4"
            >
              <p className="text-3xl font-semibold text-[#315b68]">
                {readyCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#315b68]">
                Ready for Pickup
              </p>
            </Link>

            <Link
              href="/admin/orders?status=out_for_delivery"
              className="rounded-xl bg-[#e6edf7] p-4"
            >
              <p className="text-3xl font-semibold text-[#365b7a]">
                {outForDeliveryCount}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#365b7a]">
                Out for Delivery
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
          <div className="border-b border-[#284239]/10 px-6 py-5">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Active Order Queue
            </h2>

            <p className="mt-1 text-sm text-[#718078]">
              Oldest active orders are shown first.
            </p>
          </div>

          {activeOrders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-[#153f32]">
                No active orders.
              </p>

              <p className="mt-2 text-sm text-[#718078]">
                New paid orders will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#284239]/10">
              {activeOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="grid gap-4 p-5 transition hover:bg-[#faf7f1] sm:grid-cols-[1.2fr_1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-[#153f32]">
                      {order.order_number}
                    </p>

                    <p className="mt-1 text-sm text-[#607068]">
                      {order.customer_name}
                    </p>

                    <p className="mt-1 text-xs text-[#718078]">
                      Created{" "}
                      {formatDate(
                        order.created_at
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                        order.status
                      )}`}
                    >
                      {statusLabel(
                        order.status,
                        order.fulfillment_type
                      )}
                    </span>

                    <span className="rounded-full bg-[#edf1f6] px-3 py-1 text-xs font-semibold capitalize text-[#536578]">
                      {order.fulfillment_type}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-semibold text-[#153f32]">
                      {formatPrice(order.total)}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#e76d61]">
                      Open →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
