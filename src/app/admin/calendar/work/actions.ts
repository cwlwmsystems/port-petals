"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedSources = [
  "walk-in",
  "phone",
  "facebook",
  "email",
  "other",
] as const;

const allowedWorkTypes = [
  "flowers",
  "apparel",
  "custom-gift",
  "gator-gear",
  "other",
] as const;

const allowedFulfillmentTypes = [
  "pickup",
  "delivery",
  "other",
] as const;

const allowedStatuses = [
  "scheduled",
  "in_production",
  "ready",
  "completed",
  "cancelled",
] as const;

function cleanText(
  value: FormDataEntryValue | null,
  maxLength = 5000
) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function requireDate(
  value: FormDataEntryValue | null,
  label: string
) {
  const cleaned = cleanText(value, 20);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(cleaned)
  ) {
    throw new Error(`${label} is required.`);
  }

  return cleaned;
}

async function requireAdmin() {
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
      .eq("auth_user_id", userId)
      .eq("active", true)
      .maybeSingle();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return {
    userId,
    admin:
      createAdminClient(),
  };
}

function parseForm(
  formData: FormData
) {
  const title =
    cleanText(
      formData.get("title"),
      200
    );

  const customerName =
    cleanText(
      formData.get("customer_name"),
      200
    );

  const customerPhone =
    cleanText(
      formData.get("customer_phone"),
      50
    );

  const source =
    cleanText(
      formData.get("source"),
      50
    );

  const workType =
    cleanText(
      formData.get("work_type"),
      50
    );

  const productionStartDate =
    requireDate(
      formData.get(
        "production_start_date"
      ),
      "Production start date"
    );

  const dueDate =
    requireDate(
      formData.get("due_date"),
      "Due date"
    );

  const dueTime =
    cleanText(
      formData.get("due_time"),
      20
    );

  const fulfillmentType =
    cleanText(
      formData.get(
        "fulfillment_type"
      ),
      50
    );

  const status =
    cleanText(
      formData.get("status"),
      50
    );

  const notes =
    cleanText(
      formData.get("notes"),
      10000
    );

  if (!title) {
    throw new Error(
      "Work title is required."
    );
  }

  if (
    !allowedSources.includes(
      source as
        (typeof allowedSources)[number]
    )
  ) {
    throw new Error(
      "Invalid work source."
    );
  }

  if (
    !allowedWorkTypes.includes(
      workType as
        (typeof allowedWorkTypes)[number]
    )
  ) {
    throw new Error(
      "Invalid work type."
    );
  }

  if (
    !allowedFulfillmentTypes.includes(
      fulfillmentType as
        (typeof allowedFulfillmentTypes)[number]
    )
  ) {
    throw new Error(
      "Invalid fulfillment type."
    );
  }

  if (
    !allowedStatuses.includes(
      status as
        (typeof allowedStatuses)[number]
    )
  ) {
    throw new Error(
      "Invalid work status."
    );
  }

  if (
    dueDate <
    productionStartDate
  ) {
    throw new Error(
      "Due date cannot be before the production start date."
    );
  }

  if (
    dueTime &&
    !/^\d{2}:\d{2}$/.test(dueTime)
  ) {
    throw new Error(
      "Due time is invalid."
    );
  }

  return {
    title,
    customer_name:
      customerName || null,
    customer_phone:
      customerPhone || null,
    source,
    work_type: workType,
    production_start_date:
      productionStartDate,
    due_date: dueDate,
    due_time:
      dueTime || null,
    fulfillment_type:
      fulfillmentType,
    status,
    notes:
      notes || null,
    updated_at:
      new Date().toISOString(),
  };
}

export async function createManualWork(
  formData: FormData
) {
  const {
    userId,
    admin,
  } =
    await requireAdmin();

  const values =
    parseForm(formData);

  const {
    data,
    error,
  } =
    await admin
      .from(
        "manual_work_items"
      )
      .insert({
        ...values,
        created_by:
          userId,
      })
      .select("id")
      .single();

  if (
    error ||
    !data
  ) {
    throw new Error(
      error?.message ??
        "Unable to create manual work."
    );
  }

  revalidatePath(
    "/admin/calendar"
  );

  redirect(
    `/admin/calendar/work/${data.id}`
  );
}

export async function updateManualWork(
  id: string,
  formData: FormData
) {
  if (!id) {
    throw new Error(
      "Work ID is required."
    );
  }

  const {
    admin,
  } =
    await requireAdmin();

  const values =
    parseForm(formData);

  const {
    error,
  } =
    await admin
      .from(
        "manual_work_items"
      )
      .update(values)
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/calendar"
  );

  revalidatePath(
    `/admin/calendar/work/${id}`
  );
}

export async function deleteManualWork(
  id: string
) {
  if (!id) {
    throw new Error(
      "Work ID is required."
    );
  }

  const {
    admin,
  } =
    await requireAdmin();

  const {
    error,
  } =
    await admin
      .from(
        "manual_work_items"
      )
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/calendar"
  );

  redirect(
    "/admin/calendar"
  );
}
