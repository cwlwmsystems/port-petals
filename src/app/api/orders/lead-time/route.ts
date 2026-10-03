import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEarliestFulfillmentDate } from "@/lib/orders/fulfillment-date";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const productIds = Array.isArray(
      body.productIds
    )
      ? [
          ...new Set(
            body.productIds.filter(
              (value: unknown) =>
                typeof value === "string" &&
                value.trim()
            )
          ),
        ]
      : [];

    if (
      productIds.length === 0 ||
      productIds.length > 50
    ) {
      return NextResponse.json(
        {
          error:
            "A valid cart is required.",
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: products, error } =
      await supabase
        .from("products")
        .select(`
          id,
          lead_time_days
        `)
        .in("id", productIds)
        .eq("status", "published");

    if (error) {
      throw new Error(error.message);
    }

    if (
      !products ||
      products.length !== productIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "A product in your cart is no longer available.",
        },
        { status: 400 }
      );
    }

    const requiredLeadTimeDays =
      products.reduce(
        (maximum, product) =>
          Math.max(
            maximum,
            Number(
              product.lead_time_days ?? 0
            )
          ),
        0
      );

    return NextResponse.json({
      requiredLeadTimeDays,
      earliestFulfillmentDate:
        getEarliestFulfillmentDate(
          requiredLeadTimeDays
        ),
    });
  } catch (error) {
    console.error(
      "Lead-time lookup failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to determine the earliest available date.",
      },
      { status: 500 }
    );
  }
}
