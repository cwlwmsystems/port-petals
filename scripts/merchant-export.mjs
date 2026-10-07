import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const contents = fs.readFileSync(filePath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      !trimmed.includes("=")
    ) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();

    let value = trimmed
      .slice(separator + 1)
      .trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(
  path.join(process.cwd(), ".env.local")
);

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is not configured."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not configured."
  );
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const SITE_URL =
  "https://www.portpetals.com";

const STORAGE_BASE =
  `${supabaseUrl}/storage/v1/object/public/product-images/`;

const OUTPUT_PATH =
  path.join(
    process.cwd(),
    "exports",
    "merchant-center-feed.csv"
  );

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

function cleanText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, length) {
  const text = cleanText(value);

  if (text.length <= length) {
    return text;
  }

  return (
    text.slice(0, length - 1).trimEnd() +
    "…"
  );
}

function csvEscape(value) {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} USD`;
}

function getProductHref(product) {
  switch (product.category) {
    case "flowers":
      return `/flowers/${product.slug}`;
    case "candles":
      return `/candles/${product.slug}`;
    case "shirts":
      return `/shirts/${product.slug}`;
    case "gators":
      return `/gators/${product.slug}`;
    case "custom":
      return `/custom/${product.slug}`;
  }

  switch (product.department) {
    case "flowers":
      return `/flowers/${product.slug}`;
    case "apparel":
      return `/shirts/${product.slug}`;
    case "gator-gear":
      return `/gators/${product.slug}`;
    default:
      return `/custom/${product.slug}`;
  }
}

function getAvailability(
  trackInventory,
  quantity
) {
  if (!trackInventory) {
    return "in_stock";
  }

  return Number(quantity ?? 0) > 0
    ? "in_stock"
    : "out_of_stock";
}

function sortImages(images = []) {
  return [...images].sort((a, b) => {
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
      Number(a.sort_order ?? 0) -
      Number(b.sort_order ?? 0)
    );
  });
}

function chooseRepresentativeVariant(
  product
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

  if (product.category === "shirts") {
    const preferred =
      variants.find(
        (variant) =>
          String(
            variant.garment_type ?? ""
          ).toLowerCase() === "t-shirt" &&
          String(
            variant.size ?? ""
          ).toUpperCase() === "S" &&
          String(
            variant.color ?? ""
          ).toLowerCase() === "black"
      );

    if (preferred) {
      return preferred;
    }

    const tShirt =
      variants.find(
        (variant) =>
          String(
            variant.garment_type ?? ""
          ).toLowerCase() === "t-shirt"
      );

    if (tShirt) {
      return tShirt;
    }
  }

  return variants[0];
}

function titleCaseGarment(value) {
  return String(value ?? "")
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

console.log(
  "Reading published Port Petals catalog..."
);

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
  .eq("status", "published")
  .order("department")
  .order("name");

if (error) {
  throw new Error(error.message);
}

const rows = [];

for (const product of products ?? []) {
  const images =
    sortImages(
      product.product_images ?? []
    );

  if (images.length === 0) {
    console.warn(
      `Skipping ${product.name}: no image.`
    );
    continue;
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

  const variant =
    chooseRepresentativeVariant(
      product
    );

  let price = null;
  let merchantId = product.id;

  let availability =
    getAvailability(
      product.track_inventory,
      product.quantity
    );

  if (product.base_price !== null) {
    price = Number(product.base_price);
  } else if (variant) {
    price = Number(variant.price);
    merchantId = variant.id;

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
    console.warn(
      `Skipping ${product.name}: no usable price.`
    );
    continue;
  }

  const isShirt =
    product.category === "shirts";

  let title = product.name;

  if (isShirt && variant) {
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

  const row = {
    id: merchantId,

    title:
      truncate(title, 150),

    description:
      truncate(
        product.description ??
          product.short_description ??
          product.name,
        200
      ),

    availability,

    availability_date: "",
    expiration_date: "",

    link:
      isShirt && variant
        ? `${SITE_URL}${getProductHref(product)}?variant=${encodeURIComponent(
            variant.id
          )}`
        : `${SITE_URL}${getProductHref(product)}`,

    mobile_link: "",

    image_link:
      primaryImage,

    price:
      formatPrice(price),

    sale_price: "",
    sale_price_effective_date: "",

    identifier_exists:
      "no",

    gtin: "",
    mpn: "",

    brand:
      product.maker ?? "",

    product_highlight: "",
    product_detail: "",

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

    material: "",
    pattern: "",

    age_group:
      isShirt
        ? "adult"
        : "",

    multipack: "",
    "is bundle": "",
    unit_pricing_measure: "",
    unit_pricing_base_measure: "",
    energy_efficiency_class: "",
    min_energy_efficiency_class: "",
    max_energy_efficiency: "",

    item_group_id:
      isShirt
        ? product.id
        : "",

    video_link: "",
    virtual_model_link: "",
    cost_of_goods_sold: "",
  };

  rows.push(
    HEADERS.map(
      (header) =>
        row[header] ?? ""
    )
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

fs.writeFileSync(
  OUTPUT_PATH,
  `${csv}\n`,
  "utf8"
);

console.log("");
console.log(
  "Merchant Center export complete."
);
console.log(
  `Published products read: ${
    products?.length ?? 0
  }`
);
console.log(
  `Merchant rows written: ${rows.length}`
);
console.log(
  `Output: ${OUTPUT_PATH}`
);
