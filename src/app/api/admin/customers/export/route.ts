import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const allowedInterests = new Set([
  "flowers",
  "gifts-decor",
  "apparel",
  "gator-gear",
  "seasonal",
  "weddings-events",
]);

function csvValue(
  value:
    | string
    | number
    | boolean
    | null
    | undefined
) {
  const text =
    value === null ||
    value === undefined
      ? ""
      : String(value);

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
}

export async function GET(
  request: Request
) {
  const url =
    new URL(request.url);

  const search =
    url.searchParams
      .get("search")
      ?.trim() ?? "";

  const type =
    url.searchParams
      .get("type")
      ?.trim() ?? "";

  const email =
    url.searchParams
      .get("email")
      ?.trim() ?? "";

  const sms =
    url.searchParams
      .get("sms")
      ?.trim() ?? "";

  const interest =
    url.searchParams
      .get("interest")
      ?.trim() ?? "";

  const segment =
    url.searchParams
      .get("segment")
      ?.trim() ?? "";

  const channel =
    url.searchParams
      .get("channel")
      ?.trim() ?? "all";

  if (
    channel !== "all" &&
    channel !== "email" &&
    channel !== "sms"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid export channel.",
      },
      {
        status: 400,
      }
    );
  }

  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    return NextResponse.json(
      {
        error:
          "Authentication required.",
      },
      {
        status: 401,
      }
    );
  }

  const {
    data: adminUser,
  } =
    await supabase
      .from("admin_users")
      .select("id")
      .eq(
        "auth_user_id",
        userId
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

  if (!adminUser) {
    return NextResponse.json(
      {
        error:
          "Admin access required.",
      },
      {
        status: 403,
      }
    );
  }

  let interestContactIds:
    string[] | null = null;

  if (
    interest &&
    allowedInterests.has(
      interest
    )
  ) {
    const {
      data: interestRows,
      error: interestError,
    } =
      await supabase
        .from(
          "marketing_contact_interests"
        )
        .select(
          "contact_id"
        )
        .eq(
          "interest",
          interest
        );

    if (interestError) {
      return NextResponse.json(
        {
          error:
            interestError.message,
        },
        {
          status: 500,
        }
      );
    }

    interestContactIds =
      Array.from(
        new Set(
          (
            interestRows ??
            []
          ).map(
            (row) =>
              row.contact_id
          )
        )
      );
  }

  let query =
    supabase
      .from(
        "marketing_contacts"
      )
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        contact_type,
        source,
        order_count,
        lifetime_value,
        first_order_at,
        last_order_at,
        email_marketing_consent,
        email_unsubscribed_at,
        sms_marketing_consent,
        sms_unsubscribed_at,
        created_at
      `)
      .order(
        "last_order_at",
        {
          ascending: false,
          nullsFirst: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (search) {
    const safeSearch =
      search.replace(
        /[,()]/g,
        " "
      );

    query =
      query.or(
        `first_name.ilike.%${safeSearch}%,last_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`
      );
  }

  if (
    type === "customer" ||
    type === "prospect"
  ) {
    query =
      query.eq(
        "contact_type",
        type
      );
  }

  if (email === "yes") {
    query =
      query
        .eq(
          "email_marketing_consent",
          true
        )
        .is(
          "email_unsubscribed_at",
          null
        );
  }

  if (email === "no") {
    query =
      query.eq(
        "email_marketing_consent",
        false
      );
  }

  if (sms === "yes") {
    query =
      query
        .eq(
          "sms_marketing_consent",
          true
        )
        .is(
          "sms_unsubscribed_at",
          null
        );
  }

  if (sms === "no") {
    query =
      query.eq(
        "sms_marketing_consent",
        false
      );
  }

  if (
    interestContactIds !==
    null
  ) {
    if (
      interestContactIds.length ===
      0
    ) {
      query =
        query.eq(
          "id",
          "00000000-0000-0000-0000-000000000000"
        );
    } else {
      query =
        query.in(
          "id",
          interestContactIds
        );
    }
  }

  if (
    segment ===
    "no-purchases"
  ) {
    query =
      query.eq(
        "order_count",
        0
      );
  }

  if (
    segment ===
    "first-time"
  ) {
    query =
      query.eq(
        "order_count",
        1
      );
  }

  if (
    segment ===
    "repeat"
  ) {
    query =
      query.gte(
        "order_count",
        2
      );
  }

  if (
    channel === "email"
  ) {
    query =
      query
        .eq(
          "email_marketing_consent",
          true
        )
        .is(
          "email_unsubscribed_at",
          null
        )
        .not(
          "email",
          "is",
          null
        );
  }

  if (
    channel === "sms"
  ) {
    query =
      query
        .eq(
          "sms_marketing_consent",
          true
        )
        .is(
          "sms_unsubscribed_at",
          null
        )
        .not(
          "phone",
          "is",
          null
        );
  }

  const {
    data: contacts,
    error: contactsError,
  } =
    await query;

  if (contactsError) {
    return NextResponse.json(
      {
        error:
          contactsError.message,
      },
      {
        status: 500,
      }
    );
  }

  const contactIds =
    (
      contacts ?? []
    ).map(
      (contact) =>
        contact.id
    );

  const interestMap =
    new Map<
      string,
      string[]
    >();

  if (
    contactIds.length >
    0
  ) {
    const {
      data: interestRows,
      error: interestsError,
    } =
      await supabase
        .from(
          "marketing_contact_interests"
        )
        .select(`
          contact_id,
          interest
        `)
        .in(
          "contact_id",
          contactIds
        )
        .order(
          "interest",
          {
            ascending: true,
          }
        );

    if (interestsError) {
      return NextResponse.json(
        {
          error:
            interestsError.message,
        },
        {
          status: 500,
        }
      );
    }

    for (
      const row
      of interestRows ?? []
    ) {
      const current =
        interestMap.get(
          row.contact_id
        ) ?? [];

      current.push(
        row.interest
      );

      interestMap.set(
        row.contact_id,
        current
      );
    }
  }

  const header = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Contact Type",
    "Order Count",
    "Lifetime Value",
    "Interests",
    "Email Marketing Eligible",
    "SMS Marketing Eligible",
    "First Order",
    "Last Order",
    "Source",
  ];

  const rows =
    (
      contacts ?? []
    ).map(
      (contact) => {
        const emailEligible =
          Boolean(
            contact.email &&
            contact.email_marketing_consent &&
            !contact.email_unsubscribed_at
          );

        const smsEligible =
          Boolean(
            contact.phone &&
            contact.sms_marketing_consent &&
            !contact.sms_unsubscribed_at
          );

        return [
          contact.first_name,
          contact.last_name,
          contact.email,
          contact.phone,
          contact.contact_type,
          contact.order_count,
          Number(
            contact.lifetime_value ??
              0
          ).toFixed(2),
          (
            interestMap.get(
              contact.id
            ) ?? []
          ).join("; "),
          emailEligible
            ? "Yes"
            : "No",
          smsEligible
            ? "Yes"
            : "No",
          contact.first_order_at,
          contact.last_order_at,
          contact.source,
        ];
      }
    );

  const csv =
    [
      header.map(
        csvValue
      ).join(","),

      ...rows.map(
        (row) =>
          row.map(
            csvValue
          ).join(",")
      ),
    ].join("\r\n");

  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  const filename =
    channel === "email"
      ? `port-petals-email-audience-${date}.csv`
      : channel === "sms"
        ? `port-petals-sms-audience-${date}.csv`
        : `port-petals-customer-segment-${date}.csv`;

  return new NextResponse(
    csv,
    {
      status: 200,

      headers: {
        "Content-Type":
          "text/csv; charset=utf-8",

        "Content-Disposition":
          `attachment; filename="${filename}"`,

        "Cache-Control":
          "no-store",
      },
    }
  );
}
