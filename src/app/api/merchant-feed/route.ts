import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const HEADERS = [
  "id",
  "title",
  "description",
  "availability",
  "availability_date",
  "expiration_date",
  "link",
  "mobile_link",
  "image_link",
  "price",
  "sale_price",
  "sale_price_effective_date",
  "identifier_exists",
  "gtin",
  "mpn",
  "brand",
  "product_highlight",
  "product_detail",
  "additional_image_link",
  "condition",
  "adult",
  "color",
  "size",
  "size_type",
  "size_system",
  "gender",
  "material",
  "pattern",
  "age_group",
  "multipack",
  "is bundle",
  "unit_pricing_measure",
  "unit_pricing_base_measure",
  "energy_efficiency_class",
  "min_energy_efficiency_class",
  "max_energy_efficiency",
  "item_group_id",
  "video_link",
  "virtual_model_link",
  "cost_of_goods_sold",
];

const SITE_URL =
  "https://www.portpetals.com";

function cleanText(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(
  value: unknown,
  length: number
) {
  const text = cleanText(value);

  if (text.length <= length) {
    return text;
  }

  return (
    text
      .slice(0, length - 1)
      .trimEnd() + "…"
  );
}

function csvEscape(value: unknown) {
  const text =
    String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }

  return text;
}

function formatPrice(
  value: unknown
) {
  return `${Number(value).toFixed(2)} USD`;
}

function getProductHref(
  product: {
    slug: string;
    category?: string | null;
    department?: string | null;
  }
) {
  switch (product.category) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "candles":
      return `/candles/${product.slug}`;

    case "shirts":
      return `/apparel/${product.slug}`;

    case "gators":
      return `/gators/${product.slug}`;

    case "custom":
      return `/custom/${product.slug}`;
  }

  switch (product.department) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "apparel":
      return `/apparel/${product.slug}`;

    case "gator-gear":
      return `/gators/${product.slug}`;

    default:
      return `/custom/${product.slug}`;
  }
}

function getAvailability(
  trackInventory: boolean | null,
  quantity: number | null
) {
  if (!trackInventory) {
    return "in_stock";
  }

  return Number(quantity ?? 0) > 0
    ? "in_stock"
    : "out_of_stock";
}

type Variant = {
  id: string;
  name: string | null;
  sku: string | null;
  garment_type: string | null;
  size: string | null;
  color: string | null;
  price: number | string | null;
  track_inventory: boolean | null;
  quantity: number | null;
  active: boolean;
};

function chooseRepresentativeVariant(
  product: {
    category?: string | null;
    product_variants?: Variant[] | null;
  }
) {
  const variants = [
    ...(product.product_variants ?? []),
  ]
    .filter(
      (variant) =>
        variant.active &&
        variant.price !== null
    )
    .sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );

  if (variants.length === 0) {
    return null;
  }

  if (
    product.category === "shirts"
  ) {
    const preferred =
      variants.find(
        (variant) =>
          String(
            variant.garment_type ?? ""
          ).toLowerCase() ===
            "t-shirt" &&
          String(
            variant.size ?? ""
          ).toUpperCase() === "S" &&
          String(
            variant.color ?? ""
          ).toLowerCase() ===
            "black"
      );

    if (preferred) {
      return preferred;
    }

    const tShirt =
      variants.find(
        (variant) =>
          String(
            variant.garment_type ?? ""
          ).toLowerCase() ===
          "t-shirt"
      );

    if (tShirt) {
      return tShirt;
    }
  }

  return variants[0];
}

function titleCaseGarment(
  value: string | null
) {
  return String(value ?? "")
    .split("-")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export async function GET(request: Request) {
  try {
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      throw new Error(
        "Supabase configuration is unavailable."
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

    const STORAGE_BASE =
      `${supabaseUrl}/storage/v1/object/public/product-images/`;

    const {
      data: products,
      error,
    } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        category,
        department,
        collection,
        short_description,
        description,
        base_price,
        status,
        featured,
        track_inventory,
        quantity,
        made_to_order,
        customizable,
        ready_made,
        lead_time_days,
        maker,
        pickup_available,
        delivery_available,
        product_type,
        purchase_mode,
        product_variants (
          id,
          name,
          sku,
          garment_type,
          size,
          color,
          price,
          track_inventory,
          quantity,
          active
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          sort_order,
          is_primary
        )
      `)
      .eq(
        "status",
        "published"
      )
      .order("department")
      .order("name");

    if (error) {
      throw new Error(
        error.message
      );
    }

    const rows: string[][] = [];

    for (
      const product of
        products ?? []
    ) {
      const images = [
        ...(product.product_images ??
          []),
      ].sort((a, b) => {
        if (
          a.is_primary &&
          !b.is_primary
        ) {
          return -1;
        }

        if (
          !a.is_primary &&
          b.is_primary
        ) {
          return 1;
        }

        return (
          Number(
            a.sort_order ?? 0
          ) -
          Number(
            b.sort_order ?? 0
          )
        );
      });

      if (
        images.length === 0
      ) {
        continue;
      }

      const variant =
        chooseRepresentativeVariant(
          product
        );

      let price:
        | number
        | null = null;

      let merchantId =
        product.id;

      let availability =
        getAvailability(
          product.track_inventory,
          product.quantity
        );

      if (
        product.base_price !== null
      ) {
        price =
          Number(
            product.base_price
          );
      } else if (variant) {
        price =
          Number(
            variant.price
          );

        merchantId =
          variant.id;

        availability =
          getAvailability(
            variant.track_inventory,
            variant.quantity
          );
      }

      if (
        price === null ||
        Number.isNaN(price)
      ) {
        continue;
      }

      const isShirt =
        product.category ===
        "shirts";

      let title =
        product.name;

      if (
        isShirt &&
        variant
      ) {
        title = [
          product.name,
          variant.garment_type
            ? titleCaseGarment(
                variant.garment_type
              )
            : null,
          variant.color,
          variant.size,
        ]
          .filter(Boolean)
          .join(" - ");
      }

      const primaryImage =
        `${STORAGE_BASE}${images[0].storage_path}`;

      const additionalImages =
        images
          .slice(1, 11)
          .map(
            (image) =>
              `${STORAGE_BASE}${image.storage_path}`
          )
          .join(",");

      const row: Record<
        string,
        string
      > = {
        id: merchantId,

        title:
          truncate(
            title,
            150
          ),

        description:
          truncate(
            product.description ??
              product.short_description ??
              product.name,
            200
          ),

        availability,

        availability_date:
          "",

        expiration_date:
          "",

        link:
          isShirt && variant
            ? `${SITE_URL}${getProductHref(
                product
              )}?variant=${encodeURIComponent(
                variant.id
              )}`
            : `${SITE_URL}${getProductHref(
                product
              )}`,

        mobile_link:
          "",

        image_link:
          primaryImage,

        price:
          formatPrice(price),

        sale_price:
          "",

        sale_price_effective_date:
          "",

        identifier_exists:
          "no",

        gtin:
          "",

        mpn:
          "",

        brand:
          product.maker ?? "",

        product_highlight:
          "",

        product_detail:
          "",

        additional_image_link:
          additionalImages,

        condition:
          "new",

        adult:
          "no",

        color:
          isShirt
            ? variant?.color ?? ""
            : "",

        size:
          isShirt
            ? variant?.size ?? ""
            : "",

        size_type:
          isShirt
            ? "regular"
            : "",

        size_system:
          isShirt
            ? "US"
            : "",

        gender:
          isShirt
            ? "unisex"
            : "",

        material:
          "",

        pattern:
          "",

        age_group:
          isShirt
            ? "adult"
            : "",

        multipack:
          "",

        "is bundle":
          "",

        unit_pricing_measure:
          "",

        unit_pricing_base_measure:
          "",

        energy_efficiency_class:
          "",

        min_energy_efficiency_class:
          "",

        max_energy_efficiency:
          "",

        item_group_id:
          isShirt
            ? product.id
            : "",

        video_link:
          "",

        virtual_model_link:
          "",

        cost_of_goods_sold:
          "",
      };

      rows.push(
        HEADERS.map(
          (header) =>
            row[header] ?? ""
        )
      );
    }

    const url =
      new URL(request.url);

    const format =
      url.searchParams.get("format");

    if (format === "tsv") {
      const cleanTsvValue = (
        value: unknown
      ) =>
        String(value ?? "")
          .replace(/\\t/g, " ")
          .replace(/\\r?\\n/g, " ")
          .trim();

      const tsv = [
        HEADERS
          .map(cleanTsvValue)
          .join("\t"),

        ...rows.map(
          (row) =>
            row
              .map(cleanTsvValue)
              .join("\t")
        ),
      ].join("\n");

      return new NextResponse(
        `${tsv}\n`,
        {
          status: 200,

          headers: {
            "Content-Type":
              "text/tab-separated-values; charset=utf-8",

            "Content-Disposition":
              'inline; filename="merchant-center-feed.tsv"',

            "Cache-Control":
              "no-store, max-age=0",
          },
        }
      );
    }

    const csv = [
      HEADERS
        .map(csvEscape)
        .join(","),

      ...rows.map(
        (row) =>
          row
            .map(csvEscape)
            .join(",")
      ),
    ].join("\n");

    return new NextResponse(
      `${csv}\n`,
      {
        status: 200,

        headers: {
          "Content-Type":
            "text/csv; charset=utf-8",

          "Content-Disposition":
            'inline; filename="merchant-center-feed.csv"',

          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Merchant feed error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Merchant feed unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}
