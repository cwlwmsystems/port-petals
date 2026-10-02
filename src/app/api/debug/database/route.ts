import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: product, error } = await supabase
      .from("products")
      .select("id, name, status")
      .eq(
        "id",
        "44d61185-24c6-445d-aee1-3f2624f96db6"
      )
      .maybeSingle();

    if (error) {
      console.error("Supabase diagnostic error:", error);

      return NextResponse.json(
        {
          connected: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      connected: true,
      productFound: Boolean(product),
      product: product
        ? {
            id: product.id,
            name: product.name,
            status: product.status,
          }
        : null,
    });
  } catch (error) {
    console.error("Database diagnostic failed:", error);

    return NextResponse.json(
      {
        connected: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown database error",
      },
      { status: 500 }
    );
  }
}
