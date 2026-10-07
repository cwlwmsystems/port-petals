import fs from "node:fs";
import path from "node:path";

const FEED_PATH = path.join(
  process.cwd(),
  "exports",
  "merchant-center-feed.csv"
);

const EXPECTED_HEADERS = [
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

const VALID_AVAILABILITY = new Set([
  "in_stock",
  "out_of_stock",
  "preorder",
  "backorder",
]);

const SITE_PREFIX =
  "https://www.portpetals.com/";

const IMAGE_PREFIX =
  "https://jwzrjcfrkewcwjfnxswz.supabase.co/storage/v1/object/public/product-images/";

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if (
      (char === "\n" || char === "\r") &&
      !inQuotes
    ) {
      if (
        char === "\r" &&
        next === "\n"
      ) {
        i++;
      }

      row.push(field);

      if (
        row.length > 1 ||
        row[0] !== ""
      ) {
        rows.push(row);
      }

      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (
    field.length > 0 ||
    row.length > 0
  ) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function isValidUsd(value) {
  return /^\d+(?:\.\d{2}) USD$/.test(value);
}

function categoryFromLink(link) {
  try {
    const url = new URL(link);

    const [firstSegment] =
      url.pathname
        .split("/")
        .filter(Boolean);

    return firstSegment || "unknown";
  } catch {
    return "unknown";
  }
}

if (!fs.existsSync(FEED_PATH)) {
  console.error(
    `Feed not found: ${FEED_PATH}`
  );
  console.error(
    "Run npm run merchant:export first."
  );
  process.exit(1);
}

const raw =
  fs.readFileSync(
    FEED_PATH,
    "utf8"
  );

const parsed =
  parseCsv(raw);

if (parsed.length === 0) {
  console.error(
    "Feed is empty."
  );
  process.exit(1);
}

const header =
  parsed[0];

const dataRows =
  parsed.slice(1);

const failures = [];
const warnings = [];

console.log(
  "Validating Merchant Center feed..."
);
console.log("");

if (
  header.length !==
  EXPECTED_HEADERS.length
) {
  fail(
    `Expected ${EXPECTED_HEADERS.length} columns, found ${header.length}.`
  );
}

for (
  let i = 0;
  i <
  Math.max(
    header.length,
    EXPECTED_HEADERS.length
  );
  i++
) {
  if (
    header[i] !==
    EXPECTED_HEADERS[i]
  ) {
    fail(
      `Header mismatch at column ${
        i + 1
      }: expected "${EXPECTED_HEADERS[i] ?? "(none)"}", found "${header[i] ?? "(none)"}".`
    );
  }
}

const index = Object.fromEntries(
  EXPECTED_HEADERS.map(
    (name, i) => [
      name,
      i,
    ]
  )
);

const seenIds =
  new Set();

const categoryCounts =
  new Map();

let shirtRows = 0;

dataRows.forEach(
  (row, rowOffset) => {
    const rowNumber =
      rowOffset + 2;

    if (
      row.length !==
      EXPECTED_HEADERS.length
    ) {
      fail(
        `Row ${rowNumber}: expected ${EXPECTED_HEADERS.length} columns, found ${row.length}.`
      );
      return;
    }

    const get = (name) =>
      row[index[name]] ?? "";

    const id =
      get("id");

    const title =
      get("title");

    const link =
      get("link");

    const imageLink =
      get("image_link");

    const price =
      get("price");

    const availability =
      get("availability");

    const identifierExists =
      get("identifier_exists");

    const condition =
      get("condition");

    const adult =
      get("adult");

    if (!id) {
      fail(
        `Row ${rowNumber}: missing id.`
      );
    }

    if (seenIds.has(id)) {
      fail(
        `Row ${rowNumber}: duplicate id "${id}".`
      );
    }

    if (id) {
      seenIds.add(id);
    }

    if (!title) {
      fail(
        `Row ${rowNumber}: missing title.`
      );
    }

    if (!link) {
      fail(
        `Row ${rowNumber}: missing link.`
      );
    } else if (
      !link.startsWith(
        SITE_PREFIX
      )
    ) {
      fail(
        `Row ${rowNumber}: unexpected product URL "${link}".`
      );
    }

    if (!imageLink) {
      fail(
        `Row ${rowNumber}: missing image_link.`
      );
    } else if (
      !imageLink.startsWith(
        IMAGE_PREFIX
      )
    ) {
      fail(
        `Row ${rowNumber}: unexpected image URL "${imageLink}".`
      );
    }

    if (!price) {
      fail(
        `Row ${rowNumber}: missing price.`
      );
    } else if (
      !isValidUsd(price)
    ) {
      fail(
        `Row ${rowNumber}: invalid price format "${price}".`
      );
    }

    if (
      !VALID_AVAILABILITY.has(
        availability
      )
    ) {
      fail(
        `Row ${rowNumber}: invalid availability "${availability}".`
      );
    }

    if (
      identifierExists !== "yes" &&
      identifierExists !== "no"
    ) {
      fail(
        `Row ${rowNumber}: identifier_exists must be "yes" or "no".`
      );
    }

    if (
      condition !== "new"
    ) {
      warn(
        `Row ${rowNumber}: condition is "${condition}".`
      );
    }

    if (
      adult !== "no"
    ) {
      warn(
        `Row ${rowNumber}: adult is "${adult}".`
      );
    }

    const category =
      categoryFromLink(link);

    categoryCounts.set(
      category,
      (
        categoryCounts.get(
          category
        ) ?? 0
      ) + 1
    );

    const isShirt =
      link.includes(
        "/apparel/"
      );

    if (isShirt) {
      shirtRows++;

      const requiredApparelFields = [
        "color",
        "size",
        "size_type",
        "size_system",
        "gender",
        "age_group",
        "item_group_id",
      ];

      for (
        const fieldName
        of requiredApparelFields
      ) {
        if (!get(fieldName)) {
          fail(
            `Row ${rowNumber}: shirt row missing ${fieldName}.`
          );
        }
      }
    }

    const additionalImages =
      get(
        "additional_image_link"
      );

    if (additionalImages) {
      for (
        const url
        of additionalImages
          .split(",")
          .map(
            (value) =>
              value.trim()
          )
          .filter(Boolean)
      ) {
        if (
          !url.startsWith(
            IMAGE_PREFIX
          )
        ) {
          fail(
            `Row ${rowNumber}: unexpected additional image URL "${url}".`
          );
        }
      }
    }
  }
);

console.log(
  `Rows checked: ${dataRows.length}`
);

console.log(
  `Unique IDs: ${seenIds.size}`
);

console.log(
  `Apparel rows checked: ${shirtRows}`
);

console.log("");
console.log(
  "Category summary:"
);

for (
  const [
    category,
    count,
  ]
  of [...categoryCounts.entries()]
    .sort(
      (a, b) =>
        a[0].localeCompare(b[0])
    )
) {
  console.log(
    `  ${category}: ${count}`
  );
}

console.log("");

if (warnings.length > 0) {
  console.log(
    `Warnings: ${warnings.length}`
  );

  for (
    const message
    of warnings
  ) {
    console.log(
      `  - ${message}`
    );
  }

  console.log("");
}

if (failures.length > 0) {
  console.error(
    `FAILED: ${failures.length} validation issue(s) found.`
  );

  for (
    const message
    of failures
  ) {
    console.error(
      `  - ${message}`
    );
  }

  process.exit(1);
}

console.log(
  "PASS: Merchant Center feed validation succeeded."
);
