import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  productId: string;
  variantId: string | null;
  quantity: number;
  playerName?: string | null;
  playerNumber?: string | null;
  customization?: Record<string, string>;
};

type CheckoutRequest = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  fulfillmentType: "pickup" | "delivery";
  requestedFulfillmentDate: string;

  deliveryArea?:
    | ""
    | "within-3"
    | "three-to-eight"
    | "smethport-eldred";

  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;

  notes?: string;

  items: CheckoutItem[];
};

function cleanText(
  value: unknown,
  maxLength = 250
) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function getDeliveryFee(
  fulfillmentType: "pickup" | "delivery",
  deliveryArea: CheckoutRequest["deliveryArea"]
) {
  if (fulfillmentType !== "delivery") {
    return 0;
  }

  switch (deliveryArea) {
    case "within-3":
      return 0;

    case "three-to-eight":
      return 10;

    case "smethport-eldred":
      return 15;

    default:
      throw new Error("Please choose a valid delivery area.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;

    const customerName = cleanText(body.customerName, 100);
    const customerEmail = cleanText(body.customerEmail, 200);
    const customerPhone = cleanText(body.customerPhone, 50);
    const notes = cleanText(body.notes, 1000);

    const requestedFulfillmentDate =
      cleanText(
        body.requestedFulfillmentDate,
        10
      );

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (
      body.fulfillmentType !== "pickup" &&
      body.fulfillmentType !== "delivery"
    ) {
      return NextResponse.json(
        { error: "Choose pickup or delivery." },
        { status: 400 }
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        requestedFulfillmentDate
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please choose a valid pickup or delivery date.",
        },
        { status: 400 }
      );
    }

    const easternToday = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    )
      .formatToParts(new Date())
      .reduce<Record<string, string>>(
        (parts, part) => {
          if (
            part.type === "year" ||
            part.type === "month" ||
            part.type === "day"
          ) {
            parts[part.type] = part.value;
          }

          return parts;
        },
        {}
      );

    const today =
      `${easternToday.year}-` +
      `${easternToday.month}-` +
      `${easternToday.day}`;

    if (requestedFulfillmentDate < today) {
      return NextResponse.json(
        {
          error:
            "Pickup or delivery date cannot be in the past.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (body.items.length > 50) {
      return NextResponse.json(
        { error: "Too many items in this order." },
        { status: 400 }
      );
    }

    const deliveryFee = getDeliveryFee(
      body.fulfillmentType,
      body.deliveryArea
    );

    const deliveryAddress = cleanText(
      body.deliveryAddress,
      250
    );

    const deliveryCity = cleanText(
      body.deliveryCity,
      100
    );

    const deliveryState = cleanText(
      body.deliveryState,
      50
    );

    const deliveryZip = cleanText(
      body.deliveryZip,
      20
    );

    if (body.fulfillmentType === "delivery") {
      if (
        !deliveryAddress ||
        !deliveryCity ||
        !deliveryState ||
        !deliveryZip
      ) {
        return NextResponse.json(
          {
            error:
              "A complete delivery address is required.",
          },
          { status: 400 }
        );
      }
    }

    const supabase = createAdminClient();

    const orderItems: Array<{
      product_id: string;
      variant_id: string | null;
      product_name: string;
      product_slug: string;
      quantity: number;
      unit_price: number;
      line_total: number;
      variant_name: string | null;
      garment_type: string | null;
      size: string | null;
      color: string | null;
      player_name: string | null;
      player_number: string | null;
      customization: Record<string, string>;
      image_url: string | null;
    }> = [];

    let subtotal = 0;

    for (const requestedItem of body.items) {
      const quantity = Number(requestedItem.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          { error: "Invalid item quantity." },
          { status: 400 }
        );
      }

      const { data: product, error: productError } =
        await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            base_price,
            status,
            track_inventory,
            quantity,
            product_images (
              storage_path,
              is_primary,
              sort_order
            )
          `)
          .eq("id", requestedItem.productId)
          .eq("status", "published")
          .maybeSingle();

      if (productError || !product) {
        return NextResponse.json(
          {
            error:
              "A product in your cart is no longer available.",
          },
          { status: 400 }
        );
      }

      let variantId: string | null = null;
      let variantName: string | null = null;
      let garmentType: string | null = null;
      let size: string | null = null;
      let color: string | null = null;

      let unitPrice: number | null =
        product.base_price === null
          ? null
          : Number(product.base_price);

      if (requestedItem.variantId) {
        const { data: variant, error: variantError } =
          await supabase
            .from("product_variants")
            .select(`
              id,
              name,
              garment_type,
              size,
              color,
              price,
              track_inventory,
              quantity,
              active
            `)
            .eq("id", requestedItem.variantId)
            .eq("product_id", product.id)
            .eq("active", true)
            .maybeSingle();

        if (variantError || !variant) {
          return NextResponse.json(
            {
              error: `${product.name}: the selected option is no longer available.`,
            },
            { status: 400 }
          );
        }

        variantId = variant.id;
        variantName = variant.name;
        garmentType = variant.garment_type;
        size = variant.size;
        color = variant.color;

        if (variant.price !== null) {
          unitPrice = Number(variant.price);
        }

        if (
          variant.track_inventory &&
          variant.quantity !== null &&
          variant.quantity < quantity
        ) {
          return NextResponse.json(
            {
              error: `${product.name}: only ${variant.quantity} of the selected option are currently available.`,
            },
            { status: 400 }
          );
        }
      } else if (
        product.track_inventory &&
        product.quantity !== null &&
        product.quantity < quantity
      ) {
        return NextResponse.json(
          {
            error: `${product.name}: only ${product.quantity} currently available.`,
          },
          { status: 400 }
        );
      }

      if (unitPrice === null || unitPrice < 0) {
        return NextResponse.json(
          {
            error: `${product.name}: a valid price could not be determined.`,
          },
          { status: 400 }
        );
      }

      const lineTotal =
        Math.round(unitPrice * quantity * 100) / 100;

      subtotal =
        Math.round((subtotal + lineTotal) * 100) / 100;

      const images = Array.isArray(product.product_images)
        ? product.product_images
        : [];

      const sortedImages = [...images].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;

        return (
          Number(a.sort_order ?? 0) -
          Number(b.sort_order ?? 0)
        );
      });

      let imageUrl: string | null = null;

      if (sortedImages[0]?.storage_path) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(sortedImages[0].storage_path);

        imageUrl = data.publicUrl;
      }

      orderItems.push({
        product_id: product.id,
        variant_id: variantId,
        product_name: product.name,
        product_slug: product.slug,
        quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
        variant_name: variantName,
        garment_type: garmentType,
        size,
        color,
        player_name:
          cleanText(requestedItem.playerName, 30) || null,
        player_number:
          cleanText(requestedItem.playerNumber, 10) || null,
        customization:
          requestedItem.customization &&
          typeof requestedItem.customization === "object"
            ? requestedItem.customization
            : {},
        image_url: imageUrl,
      });
    }

    const taxAmount = 0;

    const total =
      Math.round(
        (subtotal + deliveryFee + taxAmount) * 100
      ) / 100;

    const {
      data: orderNumber,
      error: orderNumberError,
    } = await supabase.rpc("generate_order_number");

    if (orderNumberError || !orderNumber) {
      throw new Error(
        orderNumberError?.message ??
          "Unable to generate order number."
      );
    }

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          status: "awaiting_payment",
          payment_status: "unpaid",

          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,

          fulfillment_type: body.fulfillmentType,

          requested_fulfillment_date:
            requestedFulfillmentDate,

          delivery_area:
            body.fulfillmentType === "delivery"
              ? body.deliveryArea
              : null,

          delivery_address:
            body.fulfillmentType === "delivery"
              ? deliveryAddress
              : null,

          delivery_city:
            body.fulfillmentType === "delivery"
              ? deliveryCity
              : null,

          delivery_state:
            body.fulfillmentType === "delivery"
              ? deliveryState
              : null,

          delivery_zip:
            body.fulfillmentType === "delivery"
              ? deliveryZip
              : null,

          subtotal,
          delivery_fee: deliveryFee,
          tax_amount: taxAmount,
          total,

          notes: notes || null,
        })
        .select("id, order_number")
        .single();

    if (orderError || !order) {
      throw new Error(
        orderError?.message ?? "Unable to create order."
      );
    }

    const rows = orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(rows);

    if (itemsError) {
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      throw new Error(itemsError.message);
    }

    const { error: eventError } = await supabase
      .from("order_events")
      .insert({
        order_id: order.id,
        event_type: "order_created",
        message:
          "Order created and awaiting payment.",
        metadata: {
          item_count: orderItems.reduce(
            (total, item) =>
              total + item.quantity,
            0
          ),
        },
      });

    if (eventError) {
      console.error(
        "Unable to create order event:",
        eventError
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      subtotal,
      deliveryFee,
      taxAmount,
      total,
      paymentStatus: "unpaid",
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status: 500 }
    );
  }
}
