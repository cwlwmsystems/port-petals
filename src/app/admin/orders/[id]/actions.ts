"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = [
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

type AllowedStatus =
  (typeof allowedStatuses)[number];

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
      .select("id, status, payment_status")
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

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return;
  }

  const updates: {
    status: AllowedStatus;
    completed_at?: string;
  } = {
    status: nextStatus,
  };

  if (nextStatus === "completed") {
    updates.completed_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: eventError } = await supabase
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
      },
    });

  if (eventError) {
    console.error(
      "Unable to create order status event:",
      eventError
    );
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}
