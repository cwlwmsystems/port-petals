"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = [
  "new",
  "contacted",
  "consultation_scheduled",
  "quote_sent",
  "booked",
  "declined",
  "completed",
] as const;

const allowedQuoteStatuses = [
  "not_started",
  "draft",
  "sent",
  "accepted",
  "declined",
] as const;

type WeddingStatus =
  (typeof allowedStatuses)[number];

type QuoteStatus =
  (typeof allowedQuoteStatuses)[number];

type WeddingCRMUpdate = {
  status: WeddingStatus;
  quoteStatus: QuoteStatus;
  quoteAmount: string;
  consultationAt: string;
  followUpAt: string;
  lastContactedAt: string;
  internalNotes: string;
};

function cleanText(
  value: string,
  maxLength = 10000
) {
  return value
    .trim()
    .slice(0, maxLength);
}

function nullableTimestamp(
  value: string
) {
  const cleaned =
    cleanText(value, 100);

  if (!cleaned) {
    return null;
  }

  const date =
    new Date(cleaned);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "One of the selected dates or times is invalid."
    );
  }

  return date.toISOString();
}

export async function updateWeddingLead(
  inquiryId: string,
  values: WeddingCRMUpdate
) {
  if (!inquiryId) {
    throw new Error(
      "Wedding inquiry ID is required."
    );
  }

  if (
    !allowedStatuses.includes(
      values.status
    )
  ) {
    throw new Error(
      "Invalid wedding lead status."
    );
  }

  if (
    !allowedQuoteStatuses.includes(
      values.quoteStatus
    )
  ) {
    throw new Error(
      "Invalid quote status."
    );
  }

  const supabase =
    await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: adminUser } =
    await supabase
      .from("admin_users")
      .select("id")
      .eq(
        "auth_user_id",
        userId
      )
      .eq("active", true)
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  const {
    data: current,
    error: currentError,
  } = await supabase
    .from("wedding_inquiries")
    .select(
      "id, status, booked_at, closed_at"
    )
    .eq("id", inquiryId)
    .maybeSingle();

  if (
    currentError ||
    !current
  ) {
    throw new Error(
      currentError?.message ??
        "Wedding inquiry not found."
    );
  }

  const quoteAmountText =
    cleanText(
      values.quoteAmount,
      50
    );

  let quoteAmount:
    | number
    | null = null;

  if (quoteAmountText) {
    const parsed =
      Number(
        quoteAmountText
      );

    if (
      !Number.isFinite(
        parsed
      ) ||
      parsed < 0
    ) {
      throw new Error(
        "Quote amount must be a valid positive number."
      );
    }

    quoteAmount = parsed;
  }

  const now =
    new Date().toISOString();

  let bookedAt =
    current.booked_at;

  let closedAt =
    current.closed_at;

  if (
    values.status ===
      "booked" &&
    current.status !==
      "booked"
  ) {
    bookedAt = now;
  }

  if (
    values.status ===
      "declined" ||
    values.status ===
      "completed"
  ) {
    if (
      current.status !==
        "declined" &&
      current.status !==
        "completed"
    ) {
      closedAt = now;
    }
  } else {
    closedAt = null;
  }

  const {
    error: updateError,
  } = await supabase
    .from("wedding_inquiries")
    .update({
      status:
        values.status,

      quote_status:
        values.quoteStatus,

      quote_amount:
        quoteAmount,

      consultation_at:
        nullableTimestamp(
          values.consultationAt
        ),

      follow_up_at:
        nullableTimestamp(
          values.followUpAt
        ),

      last_contacted_at:
        nullableTimestamp(
          values.lastContactedAt
        ),

      internal_notes:
        cleanText(
          values.internalNotes
        ) || null,

      booked_at:
        bookedAt,

      closed_at:
        closedAt,
    })
    .eq(
      "id",
      inquiryId
    );

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  revalidatePath(
    `/admin/weddings/${inquiryId}`
  );

  revalidatePath(
    "/admin/weddings"
  );

  revalidatePath(
    "/admin"
  );
}
