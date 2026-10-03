"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendCustomerOrderStatusEmail } from "@/lib/email/order-notifications";

const allowedStatuses = [
  "paid",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;

type AllowedStatus =
  (typeof allowedStatuses)[number];

function getExpectedNextStatus({
  currentStatus,
  fulfillmentType,
}: {
  currentStatus: string;
  fulfillmentType: string;
}): AllowedStatus | null {
  switch (currentStatus) {
    case "paid":
      return "preparing";

    case "preparing":
      return fulfillmentType === "delivery"
        ? "out_for_delivery"
        : "ready";

    case "ready":
      return fulfillmentType === "pickup"
        ? "completed"
        : null;

    case "out_for_delivery":
      return fulfillmentType === "delivery"
        ? "completed"
        : null;

    default:
      return null;
  }
}

async function sendStatusEmailSafely({
  orderId,
  status,
}: {
  orderId: string;
  status:
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "completed"
    | "cancelled";
}) {
  try {
    const notification =
      await sendCustomerOrderStatusEmail({
        orderId,
        status,
      });

    if (
      !notification.sent &&
      !notification.duplicate
    ) {
      console.error(
        "Order-status email was not sent:",
        notification.error ??
          "Unknown email error."
      );
    }
  } catch (notificationError) {
    console.error(
      "Order-status notification failed:",
      notificationError
    );
  }
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: AllowedStatus
) {
  if (
    !orderId ||
    !allowedStatuses.includes(nextStatus)
  ) {
    throw new Error("Invalid order update.");
  }

  const supabase = await createClient();

  const { data: claimsData } =
    await supabase.auth.getClaims();

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

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select(
        "id, status, payment_status, fulfillment_type"
      )
      .eq("id", orderId)
      .maybeSingle();

  if (orderError || !order) {
    throw new Error(
      orderError?.message ?? "Order not found."
    );
  }

  if (
    nextStatus !== "cancelled" &&
    order.payment_status !== "paid"
  ) {
    throw new Error(
      "Unpaid orders cannot move into fulfillment."
    );
  }

  if (
    order.status === "completed" ||
    order.status === "cancelled" ||
    order.status === "refunded"
  ) {
    throw new Error(
      "This order can no longer be changed."
    );
  }

  if (nextStatus === "cancelled") {
    const { data, error } = await supabase.rpc(
      "cancel_order_and_restore_inventory",
      {
        p_order_id: orderId,
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.ok) {
      switch (data?.error) {
        case "order_completed":
          throw new Error(
            "Completed orders cannot be cancelled."
          );

        case "order_refunded":
          throw new Error(
            "Refunded orders cannot be cancelled."
          );

        case "order_not_found":
          throw new Error("Order not found.");

        default:
          throw new Error(
            "Unable to cancel this order."
          );
      }
    }

    await sendStatusEmailSafely({
      orderId,
      status: "cancelled",
    });

    revalidatePath(
      `/admin/orders/${orderId}`
    );
    revalidatePath("/admin/orders");

    return;
  }

  const expectedNextStatus =
    getExpectedNextStatus({
      currentStatus: order.status,
      fulfillmentType:
        order.fulfillment_type,
    });

  if (nextStatus !== expectedNextStatus) {
    throw new Error(
      "That status change is not valid for this order."
    );
  }

  const updates: {
    status: AllowedStatus;
    completed_at?: string;
  } = {
    status: nextStatus,
  };

  if (nextStatus === "completed") {
    updates.completed_at =
      new Date().toISOString();
  }

  const { error: updateError } =
    await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: eventError } =
    await supabase
      .from("order_events")
      .insert({
        order_id: orderId,
        event_type: `order_${nextStatus}`,
        message: `Order status changed to ${nextStatus.replaceAll(
          "_",
          " "
        )}.`,
        metadata: {
          previous_status: order.status,
          new_status: nextStatus,
          fulfillment_type:
            order.fulfillment_type,
        },
      });

  if (eventError) {
    console.error(
      "Unable to create order status event:",
      eventError
    );
  }

  if (
    nextStatus === "preparing" ||
    nextStatus === "ready" ||
    nextStatus === "out_for_delivery" ||
    nextStatus === "completed"
  ) {
    await sendStatusEmailSafely({
      orderId,
      status: nextStatus,
    });
  }

  revalidatePath(
    `/admin/orders/${orderId}`
  );
  revalidatePath("/admin/orders");
}
