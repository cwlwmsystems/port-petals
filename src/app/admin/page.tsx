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

function formatFulfillmentDate(
  value: string | null
) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(
    new Date(`${value}T12:00:00Z`)
  );
}

function getEasternDateKey(date: Date) {
  const parts =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) =>
        ["year", "month", "day"].includes(
          part.type
        )
      )
      .map((part) => [
        part.type,
        part.value,
      ])
  );

  return `${values.year}-${values.month}-${values.day}`;
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

type ActiveOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  fulfillment_type: string;
  requested_fulfillment_date: string | null;
  status: string;
  total: number | string | null;
  created_at: string;
};

function OrderRow({
  order,
}: {
  order: ActiveOrder;
}) {
  return (
    <Link
      href={`/admin/orders/${order.id}`}
      className="grid gap-4 p-5 transition hover:bg-[#faf7f1] sm:grid-cols-[1.25fr_1fr_auto] sm:items-center"
    >
      <div>
        <p className="font-semibold text-[#153f32]">
          {order.order_number}
        </p>

        <p className="mt-1 text-sm text-[#607068]">
          {order.customer_name}
        </p>

        <p className="mt-1 text-xs text-[#718078]">
          Ordered {formatDate(order.created_at)}
        </p>
      </div>

      <div>
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

        <p className="mt-2 text-xs font-medium text-[#607068]">
          {formatFulfillmentDate(
            order.requested_fulfillment_date
          )}
        </p>
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
  );
}


type DashboardWeddingLead = {
  id: string;
  inquiry_number: string;
  contact_name: string;
  partner_name: string | null;
  wedding_date: string;
  status: string;
  follow_up_at: string | null;
};

const weddingStatusLabels: Record<
  string,
  string
> = {
  new: "New",
  contacted: "Contacted",
  consultation_scheduled:
    "Consultation Scheduled",
  quote_sent: "Quote Sent",
  booked: "Booked",
  declined: "Declined",
  completed: "Completed",
};

function weddingStatusClasses(
  status: string
) {
  switch (status) {
    case "new":
      return "bg-[#fff0d9] text-[#7a5725]";
    case "contacted":
      return "bg-[#e6edf7] text-[#365b7a]";
    case "consultation_scheduled":
      return "bg-[#e8e3f4] text-[#5f4f7d]";
    case "quote_sent":
      return "bg-[#f4ead8] text-[#775d2f]";
    case "booked":
      return "bg-[#e6f2e3] text-[#31583b]";
    case "declined":
      return "bg-[#f8e1dc] text-[#a7473f]";
    case "completed":
      return "bg-[#e5ebe7] text-[#3f584b]";
    default:
      return "bg-[#edf1f6] text-[#536578]";
  }
}

function formatWeddingDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      `${value}T12:00:00Z`
    )
  );
}

function formatWeddingDateTime(
  value: string | null
) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone:
        "America/New_York",
    }
  ).format(new Date(value));
}

function WeddingLeadRow({
  inquiry,
}: {
  inquiry: DashboardWeddingLead;
}) {
  const coupleName =
    inquiry.partner_name
      ? `${inquiry.contact_name} & ${inquiry.partner_name}`
      : inquiry.contact_name;

  return (
    <Link
      href={`/admin/weddings/${inquiry.id}`}
      className="grid gap-4 p-5 transition hover:bg-[#faf7f1] sm:grid-cols-[1.25fr_1fr_auto] sm:items-center"
    >
      <div>
        <p className="font-semibold text-[#153f32]">
          {inquiry.inquiry_number}
        </p>

        <p className="mt-1 text-sm text-[#607068]">
          {coupleName}
        </p>

        <p className="mt-1 text-xs text-[#718078]">
          Wedding{" "}
          {formatWeddingDate(
            inquiry.wedding_date
          )}
        </p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${weddingStatusClasses(
            inquiry.status
          )}`}
        >
          {weddingStatusLabels[
            inquiry.status
          ] ?? inquiry.status}
        </span>

        <p className="mt-2 text-xs font-medium text-[#607068]">
          Follow-up:{" "}
          {formatWeddingDateTime(
            inquiry.follow_up_at
          )}
        </p>
      </div>

      <div className="sm:text-right">
        <p className="text-sm font-semibold text-[#e76d61]">
          Open →
        </p>
      </div>
    </Link>
  );
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

  const todayKey = getEasternDateKey(now);

  const tomorrowDate = new Date(
    now.getTime() + 24 * 60 * 60 * 1000
  );

  const tomorrowKey =
    getEasternDateKey(tomorrowDate);

  // Pull a narrow recent payment window, then determine
  // "today" using America/New_York below. This avoids
  // hard-coding EDT/EST offsets.
  const recentPaymentCutoff = new Date(
    now.getTime() - 48 * 60 * 60 * 1000
  );

  const [
    productCountResult,
    paidCountResult,
    preparingCountResult,
    readyCountResult,
    deliveryCountResult,
    todayPaidOrdersResult,
    activeOrdersResult,
    newWeddingLeadsResult,
    activeWeddingLeadsResult,
    weddingFollowUpsResult,
    upcomingBookedWeddingsResult,
    dashboardWeddingLeadsResult,
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
        recentPaymentCutoff.toISOString()
      ),

    supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        fulfillment_type,
        requested_fulfillment_date,
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
      .order(
        "requested_fulfillment_date",
        {
          ascending: true,
          nullsFirst: false,
        }
      )
      .order("created_at", {
        ascending: true,
      }),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "new"),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .in("status", [
        "new",
        "contacted",
        "consultation_scheduled",
        "quote_sent",
      ]),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .lte(
        "follow_up_at",
        now.toISOString()
      )
      .in("status", [
        "new",
        "contacted",
        "consultation_scheduled",
        "quote_sent",
        "booked",
      ]),

    supabase
      .from("wedding_inquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "booked")
      .gte(
        "wedding_date",
        todayKey
      ),

    supabase
      .from("wedding_inquiries")
      .select(`
        id,
        inquiry_number,
        contact_name,
        partner_name,
        wedding_date,
        status,
        follow_up_at
      `)
      .in("status", [
        "new",
        "contacted",
        "consultation_scheduled",
        "quote_sent",
        "booked",
      ])
      .gte(
        "wedding_date",
        todayKey
      )
      .order(
        "wedding_date",
        {
          ascending: true,
        }
      )
      .limit(6),
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
    (todayPaidOrdersResult.data ?? []).filter(
      (order) =>
        Boolean(order.paid_at) &&
        getEasternDateKey(
          new Date(order.paid_at)
        ) === todayKey
    );

  const todayOrderCount =
    todayPaidOrders.length;

  const todayRevenue =
    todayPaidOrders.reduce(
      (sum, order) =>
        sum + Number(order.total ?? 0),
      0
    );

  const activeOrders =
    (activeOrdersResult.data ??
      []) as ActiveOrder[];

  const newWeddingLeadCount =
    newWeddingLeadsResult.count ??
    0;

  const activeWeddingLeadCount =
    activeWeddingLeadsResult.count ??
    0;

  const weddingFollowUpCount =
    weddingFollowUpsResult.count ??
    0;

  const upcomingBookedWeddingCount =
    upcomingBookedWeddingsResult.count ??
    0;

  const dashboardWeddingLeads =
    (dashboardWeddingLeadsResult.data ??
      []) as DashboardWeddingLead[];

  const todayOrders = activeOrders.filter(
    (order) =>
      order.requested_fulfillment_date ===
      todayKey
  );

  const todayPickups = todayOrders.filter(
    (order) =>
      order.fulfillment_type === "pickup"
  );

  const todayDeliveries =
    todayOrders.filter(
      (order) =>
        order.fulfillment_type ===
        "delivery"
    );

  const overdueOrders = activeOrders.filter(
    (order) =>
      Boolean(
        order.requested_fulfillment_date
      ) &&
      order.requested_fulfillment_date! <
        todayKey
  );

  const tomorrowOrders =
    activeOrders.filter(
      (order) =>
        order.requested_fulfillment_date ===
        tomorrowKey
    );

  const upcomingOrders =
    activeOrders.filter(
      (order) =>
        Boolean(
          order.requested_fulfillment_date
        ) &&
        order.requested_fulfillment_date! >
          tomorrowKey
    );

  const undatedOrders =
    activeOrders.filter(
      (order) =>
        !order.requested_fulfillment_date
    );

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
              href="/admin/weddings"
              className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Wedding Leads
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

        {overdueOrders.length > 0 && (
          <section className="mt-8 rounded-[1.75rem] border border-[#a7473f]/20 bg-[#fff0ed] p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a7473f]">
                  Needs Immediate Attention
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#7e332e]">
                  {overdueOrders.length}{" "}
                  {overdueOrders.length === 1
                    ? "overdue order"
                    : "overdue orders"}
                </h2>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-white">
              <div className="divide-y divide-[#284239]/10">
                {overdueOrders.map(
                  (order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                    />
                  )
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Pickups Today
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {todayPickups.length}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Scheduled for today
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#284239]/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#607068]">
              Deliveries Today
            </p>

            <p className="mt-2 text-4xl font-semibold text-[#153f32]">
              {todayDeliveries.length}
            </p>

            <p className="mt-1 text-sm text-[#718078]">
              Scheduled for today
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
              New confirmed orders
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
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Today
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
              Today's Fulfillment
            </h2>
          </div>

          {todayOrders.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-[#f7f1e8] p-6 text-center">
              <p className="font-semibold text-[#153f32]">
                Nothing scheduled for today.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#284239]/10">
              <div className="divide-y divide-[#284239]/10">
                {todayOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
            <div className="border-b border-[#284239]/10 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Next
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Tomorrow
              </h2>
            </div>

            {tomorrowOrders.length === 0 ? (
              <div className="p-6 text-sm text-[#718078]">
                No orders scheduled for tomorrow.
              </div>
            ) : (
              <div className="divide-y divide-[#284239]/10">
                {tomorrowOrders.map(
                  (order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                    />
                  )
                )}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
            <div className="border-b border-[#284239]/10 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                Planning
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Upcoming
              </h2>
            </div>

            {upcomingOrders.length === 0 ? (
              <div className="p-6 text-sm text-[#718078]">
                No later orders currently scheduled.
              </div>
            ) : (
              <div className="divide-y divide-[#284239]/10">
                {upcomingOrders
                  .slice(0, 8)
                  .map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                    />
                  ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Workflow
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Active Orders
              </h2>

              <p className="mt-1 text-sm text-[#718078]">
                {activeOrderCount} currently in fulfillment.
              </p>
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

        <section className="mt-6 rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Wedding CRM
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                Wedding Leads
              </h2>

              <p className="mt-1 text-sm text-[#718078]">
                Consultations, quotes, follow-ups, and booked weddings.
              </p>
            </div>

            <Link
              href="/admin/weddings"
              className="text-sm font-semibold text-[#e76d61] transition hover:text-[#c95349]"
            >
              Manage Wedding Leads →
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/weddings?status=new"
              className="rounded-xl bg-[#fff0d9] p-4 transition hover:-translate-y-0.5"
            >
              <p className="text-3xl font-semibold text-[#7a5725]">
                {newWeddingLeadCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#7a5725]">
                New Leads
              </p>
            </Link>

            <Link
              href="/admin/weddings"
              className="rounded-xl bg-[#e6edf7] p-4 transition hover:-translate-y-0.5"
            >
              <p className="text-3xl font-semibold text-[#365b7a]">
                {activeWeddingLeadCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#365b7a]">
                Active Leads
              </p>
            </Link>

            <Link
              href="/admin/weddings"
              className="rounded-xl bg-[#f8e1dc] p-4 transition hover:-translate-y-0.5"
            >
              <p className="text-3xl font-semibold text-[#a7473f]">
                {weddingFollowUpCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#a7473f]">
                Follow-Ups Due
              </p>
            </Link>

            <Link
              href="/admin/weddings?status=booked"
              className="rounded-xl bg-[#e6f2e3] p-4 transition hover:-translate-y-0.5"
            >
              <p className="text-3xl font-semibold text-[#31583b]">
                {upcomingBookedWeddingCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#31583b]">
                Upcoming Booked
              </p>
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[#284239]/10">
            <div className="border-b border-[#284239]/10 bg-[#faf7f1] px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#153f32]">
                    Next Wedding Leads
                  </p>

                  <p className="mt-1 text-xs text-[#718078]">
                    Active and booked weddings ordered by event date.
                  </p>
                </div>

                <Link
                  href="/admin/weddings"
                  className="shrink-0 text-sm font-semibold text-[#e76d61]"
                >
                  View all →
                </Link>
              </div>
            </div>

            {dashboardWeddingLeads.length === 0 ? (
              <div className="p-6 text-sm text-[#718078]">
                No active upcoming wedding leads.
              </div>
            ) : (
              <div className="divide-y divide-[#284239]/10">
                {dashboardWeddingLeads.map(
                  (inquiry) => (
                    <WeddingLeadRow
                      key={inquiry.id}
                      inquiry={inquiry}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {undatedOrders.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[#284239]/10 bg-white shadow-sm">
            <div className="border-b border-[#284239]/10 px-6 py-5">
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Active Orders Without a Date
              </h2>

              <p className="mt-1 text-sm text-[#718078]">
                These were created before fulfillment-date scheduling was added.
              </p>
            </div>

            <div className="divide-y divide-[#284239]/10">
              {undatedOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <Link
            href="/admin/products"
            className="flex items-center justify-between rounded-[1.5rem] border border-[#284239]/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/30"
          >
            <div>
              <p className="text-sm font-semibold text-[#607068]">
                Products
              </p>

              <p className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                {productCount} catalog records
              </p>
            </div>

            <span className="font-semibold text-[#e76d61]">
              Manage Products →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
