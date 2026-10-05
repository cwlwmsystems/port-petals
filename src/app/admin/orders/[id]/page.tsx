import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrderStatusActions from "./OrderStatusActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: number | string | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value ?? 0));
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatLabel(value: string | null) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;

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

  const { data: order, error } = await supabase
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
      requested_fulfillment_date,
      delivery_area,
      delivery_address,
      delivery_city,
      delivery_state,
      delivery_zip,
      subtotal,
      delivery_fee,
      tax_amount,
      total,
      notes,
      square_order_id,
      square_payment_id,
      abandoned_checkout_reminder_sent_at,
      abandoned_checkout_reminder_count,
      checkout_recovered_at,
      created_at,
      paid_at,
      completed_at,
      cancelled_at,
      order_items (
        id,
        product_name,
        product_slug,
        quantity,
        unit_price,
        line_total,
        variant_name,
        garment_type,
        size,
        color,
        player_name,
        player_number,
        customization,
        image_url
      ),
      order_events (
        id,
        event_type,
        message,
        metadata,
        created_at
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!order) {
    notFound();
  }

  const items = [...(order.order_items ?? [])];

  const events = [...(order.order_events ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  return (
    <main className="min-h-screen bg-transparent px-5 py-6 text-[#284239] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Order Detail"
          title={order.order_number}
          description={`Created ${formatDate(order.created_at)}`}
          backHref="/admin/orders"
          backLabel="Back to Orders"
          actions={
            <>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
                  order.status
                )}`}
              >
                {formatLabel(order.status)}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  order.payment_status === "paid"
                    ? "bg-[#e6f2e3] text-[#31583b]"
                    : "bg-[#f4ead8] text-[#775d2f]"
                }`}
              >
                Payment: {formatLabel(order.payment_status)}
              </span>
            </>
          }
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Order Items
              </h2>

              <div className="mt-6 divide-y divide-[#284239]/10">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 py-5 sm:grid-cols-[96px_1fr_auto]"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#f7f1e8]">
                      {item.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#718078]">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#153f32]">
                        {item.product_name}
                      </h3>

                      <div className="mt-2 space-y-1 text-sm text-[#607068]">
                        {item.variant_name && (
                          <p>{item.variant_name}</p>
                        )}

                        {item.garment_type && (
                          <p>
                            Garment:{" "}
                            {formatLabel(item.garment_type)}
                          </p>
                        )}

                        {item.color && (
                          <p>Color: {item.color}</p>
                        )}

                        {item.size && (
                          <p>Size: {item.size}</p>
                        )}

                        {item.player_name && (
                          <p>
                            Player Name: {item.player_name}
                          </p>
                        )}

                        {item.player_number && (
                          <p>
                            Player Number: {item.player_number}
                          </p>
                        )}

                        {item.customization &&
                          Object.keys(
                            item.customization
                          ).length > 0 && (
                            <div className="pt-2">
                              <p className="font-semibold text-[#284239]">
                                Customization
                              </p>

                              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-[#f7f1e8] p-3 text-xs">
                                {JSON.stringify(
                                  item.customization,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="font-semibold text-[#153f32]">
                        {formatPrice(item.line_total)}
                      </div>

                      <div className="mt-1 text-sm text-[#607068]">
                        {item.quantity} ×{" "}
                        {formatPrice(item.unit_price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Customer
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
                    Name
                  </p>
                  <p className="mt-1 font-medium">
                    {order.customer_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
                    Phone
                  </p>
                  <p className="mt-1">
                    {order.customer_phone}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
                    Email
                  </p>
                  <p className="mt-1 break-all">
                    {order.customer_email}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Fulfillment
              </h2>

              <div className="mt-5">
                <p className="font-semibold capitalize">
                  {order.fulfillment_type}
                </p>

                {order.fulfillment_type === "delivery" ? (
                  <div className="mt-3 leading-7 text-[#607068]">
                    <p>
                      Area: {formatLabel(order.delivery_area)}
                    </p>
                    <p>{order.delivery_address}</p>
                    <p>
                      {order.delivery_city},{" "}
                      {order.delivery_state}{" "}
                      {order.delivery_zip}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-[#607068]">
                    Pickup at 430 E Arnold Avenue, Port
                    Allegany, PA 16743.
                  </p>
                )}
              </div>

              {order.notes && (
                <div className="mt-6 rounded-xl bg-[#f7f1e8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
                    Customer Notes
                  </p>

                  <p className="mt-2 whitespace-pre-wrap leading-6">
                    {order.notes}
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Order History
              </h2>

              <div className="mt-6 space-y-4">
                {events.length === 0 ? (
                  <p className="text-[#607068]">
                    No order events recorded.
                  </p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="border-l-2 border-[#e76d61]/30 pl-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-semibold text-[#153f32]">
                          {formatLabel(event.event_type)}
                        </p>

                        <p className="text-xs text-[#718078]">
                          {formatDate(event.created_at)}
                        </p>
                      </div>

                      {event.message && (
                        <p className="mt-1 text-sm leading-6 text-[#607068]">
                          {event.message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <OrderStatusActions
              orderId={order.id}
              currentStatus={order.status}
              paymentStatus={order.payment_status}
              fulfillmentType={order.fulfillment_type}
            />

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Order Total
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <span>Merchandise</span>
                  <strong>
                    {formatPrice(order.subtotal)}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <strong>
                    {formatPrice(order.delivery_fee)}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <strong>
                    {formatPrice(order.tax_amount)}
                  </strong>
                </div>

                <div className="flex justify-between border-t border-[#284239]/10 pt-4 text-lg">
                  <span>Total</span>
                  <strong className="text-[#e76d61]">
                    {formatPrice(order.total)}
                  </strong>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Payment
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Status
                  </dt>
                  <dd className="mt-1 text-[#607068]">
                    {formatLabel(order.payment_status)}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Paid
                  </dt>
                  <dd className="mt-1 text-[#607068]">
                    {formatDate(order.paid_at)}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Square Order ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-[#607068]">
                    {order.square_order_id ?? "—"}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Square Payment ID
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs text-[#607068]">
                    {order.square_payment_id ?? "—"}
                  </dd>
                </div>
              </dl>
            </section>

            {(order.abandoned_checkout_reminder_count > 0 ||
              order.abandoned_checkout_reminder_sent_at ||
              order.checkout_recovered_at) && (
              <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                      Checkout Recovery
                    </p>

                    <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
                      Abandoned Checkout
                    </h2>
                  </div>

                  {order.checkout_recovered_at ? (
                    <span className="rounded-full bg-[#e6f2e3] px-3 py-1.5 text-xs font-semibold text-[#31583b]">
                      Recovered
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#f4ead8] px-3 py-1.5 text-xs font-semibold text-[#775d2f]">
                      Reminder Sent
                    </span>
                  )}
                </div>

                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="font-semibold text-[#153f32]">
                      Reminder Sent
                    </dt>

                    <dd className="mt-1 text-[#607068]">
                      {formatDate(
                        order.abandoned_checkout_reminder_sent_at
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-[#153f32]">
                      Reminders
                    </dt>

                    <dd className="mt-1 text-[#607068]">
                      {order.abandoned_checkout_reminder_count ?? 0}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-[#153f32]">
                      Recovered
                    </dt>

                    <dd className="mt-1 text-[#607068]">
                      {formatDate(
                        order.checkout_recovered_at
                      )}
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)]">
              <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                Timeline
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Created
                  </dt>
                  <dd className="mt-1 text-[#607068]">
                    {formatDate(order.created_at)}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Paid
                  </dt>
                  <dd className="mt-1 text-[#607068]">
                    {formatDate(order.paid_at)}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Completed
                  </dt>
                  <dd className="mt-1 text-[#607068]">
                    {formatDate(order.completed_at)}
                  </dd>
                </div>

                <div>
                  <dt className="font-semibold text-[#153f32]">
                    Cancelled
                  </dt>
                  <dd className="mt-1 text-[#607068]">
                    {formatDate(order.cancelled_at)}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
