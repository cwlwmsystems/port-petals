"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedInterests = [
  "flowers",
  "gifts-decor",
  "apparel",
  "gator-gear",
  "seasonal",
  "weddings-events",
] as const;

type MarketingInterest =
  (typeof allowedInterests)[number];

type ContactUpdate = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type ConsentChannel =
  | "email"
  | "sms";

type ConsentAction =
  | "opted_in"
  | "opted_out";

function cleanText(
  value: string,
  maxLength = 250
) {
  return value
    .trim()
    .slice(0, maxLength);
}

function normalizeEmail(
  value: string
) {
  return cleanText(
    value,
    200
  ).toLowerCase();
}

function normalizePhone(
  value: string
) {
  const cleaned =
    cleanText(
      value,
      50
    );

  if (!cleaned) {
    return "";
  }

  const digits =
    cleaned.replace(
      /\D/g,
      ""
    );

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (
    digits.length === 11 &&
    digits.startsWith("1")
  ) {
    return `+${digits}`;
  }

  return cleaned;
}

async function requireAdmin() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const {
    data: adminUser,
  } =
    await supabase
      .from("admin_users")
      .select(
        "id, auth_user_id"
      )
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
    redirect("/admin/login");
  }

  return {
    supabase,
    adminUser,
    userId,
  };
}

function revalidateCustomer(
  contactId: string
) {
  revalidatePath(
    `/admin/customers/${contactId}`
  );

  revalidatePath(
    "/admin/customers"
  );

  revalidatePath(
    "/admin"
  );
}

export async function updateCustomerContact(
  contactId: string,
  values: ContactUpdate
) {
  if (!contactId) {
    throw new Error(
      "Customer contact ID is required."
    );
  }

  const firstName =
    cleanText(
      values.firstName,
      100
    ) || null;

  const lastName =
    cleanText(
      values.lastName,
      100
    ) || null;

  const email =
    normalizeEmail(
      values.email
    ) || null;

  const phone =
    normalizePhone(
      values.phone
    ) || null;

  if (!email && !phone) {
    throw new Error(
      "A customer must have an email address or phone number."
    );
  }

  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    throw new Error(
      "Enter a valid email address."
    );
  }

  const {
    supabase,
  } =
    await requireAdmin();

  const {
    data: current,
    error: currentError,
  } =
    await supabase
      .from(
        "marketing_contacts"
      )
      .select("id")
      .eq(
        "id",
        contactId
      )
      .maybeSingle();

  if (
    currentError ||
    !current
  ) {
    throw new Error(
      currentError?.message ??
        "Customer contact not found."
    );
  }

  const {
    error: updateError,
  } =
    await supabase
      .from(
        "marketing_contacts"
      )
      .update({
        first_name:
          firstName,

        last_name:
          lastName,

        email,

        phone,
      })
      .eq(
        "id",
        contactId
      );

  if (updateError) {
    if (
      updateError.code ===
      "23505"
    ) {
      throw new Error(
        "That email address or phone number is already assigned to another CRM contact."
      );
    }

    throw new Error(
      updateError.message
    );
  }

  revalidateCustomer(
    contactId
  );
}

export async function updateCustomerInterests(
  contactId: string,
  interests: string[]
) {
  if (!contactId) {
    throw new Error(
      "Customer contact ID is required."
    );
  }

  const selected =
    Array.from(
      new Set(
        interests.filter(
          (
            interest
          ): interest is MarketingInterest =>
            allowedInterests.includes(
              interest as MarketingInterest
            )
        )
      )
    );

  const {
    supabase,
  } =
    await requireAdmin();

  const {
    data: current,
    error: currentError,
  } =
    await supabase
      .from(
        "marketing_contact_interests"
      )
      .select(
        "interest"
      )
      .eq(
        "contact_id",
        contactId
      );

  if (currentError) {
    throw new Error(
      currentError.message
    );
  }

  const existing =
    new Set(
      (
        current ?? []
      ).map(
        (row) =>
          row.interest
      )
    );

  const toAdd =
    selected.filter(
      (interest) =>
        !existing.has(
          interest
        )
    );

  const toRemove =
    Array.from(
      existing
    ).filter(
      (interest) =>
        !selected.includes(
          interest as MarketingInterest
        )
    );

  if (toAdd.length > 0) {
    const {
      error: insertError,
    } =
      await supabase
        .from(
          "marketing_contact_interests"
        )
        .insert(
          toAdd.map(
            (interest) => ({
              contact_id:
                contactId,

              interest,

              source:
                "admin_manual",
            })
          )
        );

    if (insertError) {
      throw new Error(
        insertError.message
      );
    }
  }

  for (
    const interest
    of toRemove
  ) {
    const {
      error: deleteError,
    } =
      await supabase
        .from(
          "marketing_contact_interests"
        )
        .delete()
        .eq(
          "contact_id",
          contactId
        )
        .eq(
          "interest",
          interest
        );

    if (deleteError) {
      throw new Error(
        deleteError.message
      );
    }
  }

  revalidateCustomer(
    contactId
  );
}

export async function changeMarketingConsent(
  contactId: string,
  channel: ConsentChannel,
  action: ConsentAction
) {
  if (!contactId) {
    throw new Error(
      "Customer contact ID is required."
    );
  }

  if (
    channel !== "email" &&
    channel !== "sms"
  ) {
    throw new Error(
      "Invalid marketing channel."
    );
  }

  if (
    action !== "opted_in" &&
    action !== "opted_out"
  ) {
    throw new Error(
      "Invalid consent action."
    );
  }

  const {
    supabase,
    adminUser,
    userId,
  } =
    await requireAdmin();

  const {
    data: contact,
    error: contactError,
  } =
    await supabase
      .from(
        "marketing_contacts"
      )
      .select(`
        id,
        email,
        phone,
        email_marketing_consent,
        email_unsubscribed_at,
        sms_marketing_consent,
        sms_unsubscribed_at
      `)
      .eq(
        "id",
        contactId
      )
      .maybeSingle();

  if (
    contactError ||
    !contact
  ) {
    throw new Error(
      contactError?.message ??
        "Customer contact not found."
    );
  }

  if (
    channel === "email" &&
    !contact.email
  ) {
    throw new Error(
      "This contact does not have an email address."
    );
  }

  if (
    channel === "sms" &&
    !contact.phone
  ) {
    throw new Error(
      "This contact does not have a phone number."
    );
  }

  const currentlyActive =
    channel === "email"
      ? (
          contact.email_marketing_consent &&
          !contact.email_unsubscribed_at
        )
      : (
          contact.sms_marketing_consent &&
          !contact.sms_unsubscribed_at
        );

  if (
    action === "opted_in" &&
    currentlyActive
  ) {
    return;
  }

  if (
    action === "opted_out" &&
    !currentlyActive
  ) {
    return;
  }

  const now =
    new Date().toISOString();

  const updates =
    channel === "email"
      ? action === "opted_in"
        ? {
            email_marketing_consent:
              true,

            email_consent_at:
              now,

            email_consent_source:
              "admin_manual",

            email_unsubscribed_at:
              null,
          }
        : {
            email_marketing_consent:
              false,

            email_unsubscribed_at:
              now,
          }
      : action === "opted_in"
        ? {
            sms_marketing_consent:
              true,

            sms_consent_at:
              now,

            sms_consent_source:
              "admin_manual",

            sms_unsubscribed_at:
              null,
          }
        : {
            sms_marketing_consent:
              false,

            sms_unsubscribed_at:
              now,
          };

  const {
    error: updateError,
  } =
    await supabase
      .from(
        "marketing_contacts"
      )
      .update(
        updates
      )
      .eq(
        "id",
        contactId
      );

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  const {
    error: eventError,
  } =
    await supabase
      .from(
        "marketing_consent_events"
      )
      .insert({
        contact_id:
          contactId,

        channel,

        action,

        source:
          "admin_manual",

        occurred_at:
          now,

        metadata: {
          admin_user_id:
            adminUser.id,

          actor_auth_user_id:
            userId,

          recorded_by:
            "port_petals_admin",
        },
      });

  if (eventError) {
    /*
     * Consent history is important enough that a failed audit
     * insert should be visible rather than silently ignored.
     *
     * We intentionally do not mask this error.
     */
    throw new Error(
      `Consent was updated, but the audit event could not be recorded: ${eventError.message}`
    );
  }

  revalidateCustomer(
    contactId
  );
}
