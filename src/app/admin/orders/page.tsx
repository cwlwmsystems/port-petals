import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    payment?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  awaiting_payment: "Awaiting Payment",
  paid: "Paid",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const paymentLabels: Record<string, string> = {
  unpaid: "Unpaid",
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

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
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
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
    case "awaiting_payment":
    case "pending":
      return "bg-[#f4ead8] text-[#775d2f]";
    case "cancelled":
    case "refunded":
      return "bg-[#f8e1dc] text-[#a7473f]";
    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

function paymentClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "pending":
      return "bg-[#f4ead8] text-[#775d2f]";
    case "failed":
      return "bg-[#f8e1dc] text-[#a7473f]";
    case "refunded":
    case "partially_refunded":
      return "bg-[#edf1f6] text-[#536578]";
    default:
      return "bg-[#fff4f1] text-[#8c433b]";
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const payment = params.payment?.trim() ?? "";

  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      customer_name,
      customer_email,
      customer_phone,
      fulfillment_type,
      total,
      created_at,
      paid_at
    `)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
    );
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (payment) {
    query = query.eq("payment_status", payment);
  }

  const { data: orders, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const hasFilters = Boolean(search || status || payment);

  return (
    <main className="min-h-screen bg-[#f7f1e8] px-5 py-10 text-[#284239] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
          >
            ← Back to Dashboard
          </Link>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
            Port Petals Admin
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
            Orders
          </h1>

          <p className="mt-3 max-w-2xl text-[#607068]">
            Review customer orders, payment status, fulfillment, and order
            progress.
          </p>
        </div>

        <section className="mt-8 rounded-[1.75rem] border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-6">
          <form
            method="GET"
            className="grid gap-4 md:grid-cols-[1fr_220px_220px_auto]"
          >
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Search Orders
              </span>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Order #, customer, email, phone..."
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Order Status
              </span>

              <select
                name="status"
                defaultValue={status}
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              >
                <option value="">All Statuses</option>
                <option value="awaiting_payment">Awaiting Payment</option>
                <option value="paid">Paid</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="out_for_delivery">
                  Out for Delivery
                </option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Payment
              </span>

              <select
                name="payment"
                defaultValue={payment}
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 outline-none transition focus:border-[#e76d61]"
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="partially_refunded">
                  Partially Refunded
                </option>
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#284239] px-5 py-3 font-semibold text-white transition hover:bg-[#1d332b]"
              >
                Apply
              </button>

              {hasFilters && (
                <Link
                  href="/admin/orders"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#284239]/15 px-4 py-3 text-sm font-semibold transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
          {!orders || orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                No orders found
              </h2>

              <p className="mt-2 text-[#607068]">
                {hasFilters
                  ? "Try changing or clearing the current filters."
                  : "Customer orders will appear here after checkout."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="border-b border-[#284239]/10 bg-[#faf7f1] text-xs uppercase tracking-[0.12em] text-[#607068]">
                    <tr>
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Fulfillment</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#284239]/10">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-[#faf7f1]"
                      >
                        <td className="px-6 py-5">
                          <div className="font-semibold text-[#153f32]">
                            {order.order_number}
                          </div>

                          <div className="mt-1 text-xs text-[#718078]">
                            {formatDate(order.created_at)}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-medium">
                            {order.customer_name}
                          </div>

                          <div className="mt-1 text-sm text-[#607068]">
                            {order.customer_email}
                          </div>
                        </td>

                        <td className="px-6 py-5 capitalize">
                          {order.fulfillment_type}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                              order.status
                            )}`}
                          >
                            {statusLabels[order.status] ?? order.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentClasses(
                              order.payment_status
                            )}`}
                          >
                            {paymentLabels[order.payment_status] ??
                              order.payment_status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right font-semibold">
                          {formatPrice(order.total)}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-semibold text-[#e76d61] transition hover:text-[#c95349]"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#284239]/10 lg:hidden">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block p-5 transition hover:bg-[#faf7f1]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[#153f32]">
                          {order.order_number}
                        </div>

                        <div className="mt-1 text-sm text-[#607068]">
                          {order.customer_name}
                        </div>
                      </div>

                      <div className="font-semibold text-[#153f32]">
                        {formatPrice(order.total)}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                          order.status
                        )}`}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentClasses(
                          order.payment_status
                        )}`}
                      >
                        {paymentLabels[order.payment_status] ??
                          order.payment_status}
                      </span>

                      <span className="rounded-full bg-[#edf1f6] px-3 py-1 text-xs font-semibold capitalize text-[#536578]">
                        {order.fulfillment_type}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-[#718078]">
                      {formatDate(order.created_at)}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
