import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();

let pass = 0;
let warn = 0;
let fail = 0;

function ok(message) {
  pass++;
  console.log(`PASS: ${message}`);
}

function warning(message) {
  warn++;
  console.log(`WARN: ${message}`);
}

function bad(message) {
  fail++;
  console.log(`FAIL: ${message}`);
}

function section(name) {
  console.log(`\n===== ${name} =====`);
}

function read(relativePath) {
  const full = path.join(ROOT, relativePath);

  if (!fs.existsSync(full)) {
    return null;
  }

  return fs.readFileSync(full, "utf8");
}

function requireFile(relativePath) {
  if (fs.existsSync(path.join(ROOT, relativePath))) {
    ok(`File exists: ${relativePath}`);
    return true;
  }

  bad(`Missing file: ${relativePath}`);
  return false;
}

function contains(relativePath, patterns) {
  const source = read(relativePath);

  if (!source) {
    bad(`Cannot inspect missing file: ${relativePath}`);
    return;
  }

  for (const [label, pattern] of patterns) {
    if (
      typeof pattern === "string"
        ? source.includes(pattern)
        : pattern.test(source)
    ) {
      ok(`${relativePath}: ${label}`);
    } else {
      bad(`${relativePath}: missing ${label}`);
    }
  }
}

console.log("==================================================");
console.log("PORT PETALS — AUTOMATED ORDER LIFECYCLE AUDIT");
console.log("==================================================");

section("ENVIRONMENT");

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const key of requiredEnv) {
  if (process.env[key]) {
    ok(`${key} configured`);
  } else {
    bad(`${key} missing`);
  }
}

const squareEnvCandidates = [
  "SQUARE_ACCESS_TOKEN",
  "SQUARE_LOCATION_ID",
  "SQUARE_WEBHOOK_SIGNATURE_KEY",
];

for (const key of squareEnvCandidates) {
  if (process.env[key]) {
    ok(`${key} configured`);
  } else {
    warning(`${key} not found in local environment`);
  }
}

section("CRITICAL APPLICATION FILES");

[
  "src/app/api/orders/route.ts",
  "src/app/api/orders/status/route.ts",
  "src/app/api/square/checkout/route.ts",
  "src/app/api/square/webhook/route.ts",
  "src/components/CheckoutClient.tsx",
  "src/components/PaymentReturnClient.tsx",
  "src/app/admin/orders/page.tsx",
  "src/app/admin/orders/[id]/page.tsx",
  "src/app/account/orders/page.tsx",
  "src/app/account/orders/[id]/page.tsx",
  "src/app/api/cron/abandoned-checkouts/route.ts",
  "src/lib/analytics.ts",
].forEach(requireFile);

section("SQUARE PAYMENT AUTHORITY");

contains(
  "src/app/api/square/webhook/route.ts",
  [
    [
      "handles payment.updated",
      /payment\.updated/i,
    ],
    [
      "checks COMPLETED payment state",
      /COMPLETED/i,
    ],
    [
      "updates payment status",
      /payment_status/i,
    ],
    [
      "records paid timestamp",
      /paid_at/i,
    ],
  ]
);

section("PAYMENT RETURN SAFETY");

contains(
  "src/components/PaymentReturnClient.tsx",
  [
    [
      "polls server order status",
      /\/api\/orders\/status/,
    ],
    [
      "requires paid confirmation",
      /paymentConfirmed/,
    ],
    [
      "clears cart after confirmation",
      /clearCart/,
    ],
    [
      "fires GA4 purchase",
      /trackPurchase/,
    ],
  ]
);

section("ORDER CREATION");

contains(
  "src/app/api/orders/route.ts",
  [
    [
      "creates awaiting-payment order",
      /awaiting_payment/,
    ],
    [
      "writes order items",
      /order_items/,
    ],
    [
      "uses server-calculated pricing",
      /unit_price/,
    ],
    [
      "supports fulfillment",
      /fulfillment_type/,
    ],
  ]
);

section("GA4 PURCHASE SAFETY");

contains(
  "src/lib/analytics.ts",
  [
    [
      "purchase event exists",
      /"purchase"/,
    ],
    [
      "transaction ID exists",
      /transaction_id/,
    ],
    [
      "currency is USD",
      /currency:\s*"USD"/,
    ],
  ]
);

section("SUPABASE CONNECTIVITY");

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && serviceRole) {
  supabase = createClient(
    supabaseUrl,
    serviceRole,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  ok("Admin Supabase client created");
} else {
  bad("Cannot run database audit without Supabase admin credentials");
}

if (supabase) {
  section("DATABASE TABLES");

  const tables = [
    "orders",
    "order_items",
    "order_events",
    "order_notifications",
  ];

  for (const table of tables) {
    const {
      count,
      error,
    } = await supabase
      .from(table)
      .select("*", {
        count: "exact",
        head: true,
      });

    if (error) {
      bad(`${table}: ${error.message}`);
    } else {
      ok(`${table} reachable (${count ?? 0} rows)`);
    }
  }

  section("ORDER STATUS DISTRIBUTION");

  const {
    data: orders,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      paid_at,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(1000);

  if (orderError) {
    bad(`Unable to read orders: ${orderError.message}`);
  } else {
    const allOrders = orders ?? [];

    console.log(`Orders found: ${allOrders.length}`);

    const statusCounts = new Map();
    const paymentCounts = new Map();

    for (const order of allOrders) {
      statusCounts.set(
        order.status ?? "(null)",
        (statusCounts.get(order.status ?? "(null)") ?? 0) + 1
      );

      paymentCounts.set(
        order.payment_status ?? "(null)",
        (paymentCounts.get(order.payment_status ?? "(null)") ?? 0) + 1
      );
    }

    console.log("\nOrder statuses:");

    for (const [status, count] of statusCounts) {
      console.log(`  ${status}: ${count}`);
    }

    console.log("\nPayment statuses:");

    for (const [status, count] of paymentCounts) {
      console.log(`  ${status}: ${count}`);
    }

    const paidOrders = allOrders.filter(
      (order) =>
        String(order.payment_status).toLowerCase() === "paid" ||
        String(order.status).toLowerCase() === "paid" ||
        Boolean(order.paid_at)
    );

    if (paidOrders.length > 0) {
      ok(`${paidOrders.length} paid order(s) found`);
    } else {
      warning(
        "No paid production order exists yet; real payment lifecycle remains unproven"
      );
    }
  }

  section("ORDER ITEM INTEGRITY");

  const {
    data: items,
    error: itemError,
  } = await supabase
    .from("order_items")
    .select(`
      id,
      order_id,
      product_id,
      quantity,
      unit_price,
      line_total
    `)
    .limit(5000);

  if (itemError) {
    bad(`Unable to inspect order_items: ${itemError.message}`);
  } else {
    const rows = items ?? [];

    const orderIds = [
      ...new Set(
        rows
          .map((item) => item.order_id)
          .filter(Boolean)
      ),
    ];

    if (orderIds.length === 0) {
      warning("No order items exist yet");
    } else {
      const {
        data: parentOrders,
        error: parentError,
      } = await supabase
        .from("orders")
        .select("id")
        .in("id", orderIds);

      if (parentError) {
        bad(
          `Unable to validate order-item parents: ${parentError.message}`
        );
      } else {
        const validOrderIds =
          new Set(
            (parentOrders ?? []).map(
              (order) => order.id
            )
          );

        const orphaned = rows.filter(
          (item) =>
            item.order_id &&
            !validOrderIds.has(item.order_id)
        );

        if (orphaned.length === 0) {
          ok("No orphaned order_items detected");
        } else {
          bad(
            `${orphaned.length} orphaned order_items detected`
          );
        }
      }
    }
  }

  section("EVENTS / NOTIFICATIONS");

  for (const table of [
    "order_events",
    "order_notifications",
  ]) {
    const {
      data,
      error,
    } = await supabase
      .from(table)
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (error) {
      bad(`${table}: ${error.message}`);
      continue;
    }

    if ((data ?? []).length > 0) {
      ok(`${table} contains lifecycle records`);
    } else {
      warning(`${table} currently has no records`);
    }
  }

  section("REWARDS / REFERRALS");

  const optionalTables = [
    "customer_reward_redemptions",
    "customer_referral_rewards",
    "customer_referrals",
  ];

  for (const table of optionalTables) {
    const {
      count,
      error,
    } = await supabase
      .from(table)
      .select("*", {
        count: "exact",
        head: true,
      });

    if (error) {
      warning(`${table}: ${error.message}`);
    } else {
      ok(`${table} reachable (${count ?? 0} rows)`);
    }
  }
}

section("PRODUCTION HTTP CHECK");

const URLs = [
  "https://www.portpetals.com",
  "https://www.portpetals.com/cart",
  "https://www.portpetals.com/checkout",
  "https://www.portpetals.com/account/orders",
  "https://www.portpetals.com/admin/orders",
];

for (const url of URLs) {
  try {
    const response =
      await fetch(url, {
        redirect: "manual",
        headers: {
          "User-Agent":
            "Port-Petals-Order-Lifecycle-Audit/1.0",
        },
      });

    if (
      response.status >= 200 &&
      response.status < 400
    ) {
      ok(
        `${new URL(url).pathname || "/"} -> ${response.status}`
      );
    } else {
      warning(
        `${new URL(url).pathname || "/"} -> ${response.status}`
      );
    }
  } catch (error) {
    bad(`${url}: request failed`);
  }
}

section("FINAL RESULT");

console.log(`PASS: ${pass}`);
console.log(`WARN: ${warn}`);
console.log(`FAIL: ${fail}`);

if (fail === 0) {
  console.log(
    "\nRESULT: AUTOMATED ORDER LIFECYCLE AUDIT PASSED"
  );

  if (warn > 0) {
    console.log(
      "Review warnings before the production payment test."
    );
  }
} else {
  console.log(
    "\nRESULT: ORDER LIFECYCLE AUDIT REQUIRES ATTENTION"
  );

  process.exitCode = 1;
}
