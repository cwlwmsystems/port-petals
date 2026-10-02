import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId")?.trim();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        fulfillment_type,
        subtotal,
        delivery_fee,
        tax_amount,
        total,
        paid_at
      `)
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      console.error(
        "Unable to load order confirmation:",
        error
      );

      return NextResponse.json(
        { error: "Unable to load order." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        fulfillmentType: order.fulfillment_type,
        subtotal: Number(order.subtotal ?? 0),
        deliveryFee: Number(order.delivery_fee ?? 0),
        taxAmount: Number(order.tax_amount ?? 0),
        total: Number(order.total ?? 0),
        paidAt: order.paid_at,
      },
    });
  } catch (error) {
    console.error(
      "Order-status endpoint failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load order.",
      },
      { status: 500 }
    );
  }
}
