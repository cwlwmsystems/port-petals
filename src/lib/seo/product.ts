import {
  absoluteUrl,
  siteConfig,
} from "@/lib/seo/site";

type ProductVariantInput = {
  price: number | null;
  quantity: number | null;
  track_inventory: boolean;
  active?: boolean;
};

type ProductImageInput = {
  publicUrl: string;
};

export type ProductStructuredDataInput = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  short_description: string | null;
  description: string | null;
  base_price: number | null;
  track_inventory: boolean;
  quantity: number | null;
  maker?: string | null;
  variants: ProductVariantInput[];
  images: ProductImageInput[];
};

type ProductStructuredDataOptions = {
  pathname: string;
};

function getProductPrices(
  product: ProductStructuredDataInput
) {
  const prices: number[] = [];

  if (product.base_price !== null) {
    prices.push(product.base_price);
  }

  for (const variant of product.variants) {
    if (variant.price !== null) {
      prices.push(variant.price);
    } else if (product.base_price !== null) {
      prices.push(product.base_price);
    }
  }

  return [
    ...new Set(
      prices.filter(
        (price) =>
          Number.isFinite(price) &&
          price >= 0
      )
    ),
  ].sort((a, b) => a - b);
}

function getAvailability(
  product: ProductStructuredDataInput
) {
  const activeVariants =
    product.variants.filter(
      (variant) =>
        variant.active !== false
    );

  const trackedVariants =
    activeVariants.filter(
      (variant) =>
        variant.track_inventory
    );

  if (trackedVariants.length > 0) {
    const availableQuantity =
      trackedVariants.reduce(
        (total, variant) =>
          total +
          Math.max(
            variant.quantity ?? 0,
            0
          ),
        0
      );

    return availableQuantity > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";
  }

  if (product.track_inventory) {
    return (product.quantity ?? 0) > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";
  }

  /*
   * Published products with inventory tracking disabled
   * are treated by the storefront as available to order.
   */
  return "https://schema.org/InStock";
}

function makeSeller() {
  return {
    "@type": "Organization",
    "@id":
      `${siteConfig.url}/#business`,
    name:
      siteConfig.name,
    url:
      siteConfig.url,
  };
}

export function buildProductStructuredData(
  product: ProductStructuredDataInput,
  {
    pathname,
  }: ProductStructuredDataOptions
) {
  const url =
    absoluteUrl(pathname);

  const description =
    product.short_description ??
    product.description ??
    `${product.name} from Port Petals.`;

  const prices =
    getProductPrices(product);

  const availability =
    getAvailability(product);

  let offers:
    | Record<string, unknown>
    | undefined;

  if (prices.length === 1) {
    offers = {
      "@type":
        "Offer",

      url,

      priceCurrency:
        "USD",

      price:
        prices[0].toFixed(2),

      availability,

      itemCondition:
        "https://schema.org/NewCondition",

      seller:
        makeSeller(),
    };
  } else if (prices.length > 1) {
    offers = {
      "@type":
        "AggregateOffer",

      url,

      priceCurrency:
        "USD",

      lowPrice:
        prices[0].toFixed(2),

      highPrice:
        prices[
          prices.length - 1
        ].toFixed(2),

      availability,

      seller:
        makeSeller(),
    };
  }

  const data: Record<
    string,
    unknown
  > = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    "@id":
      `${url}#product`,

    name:
      product.name,

    description,

    url,

    category:
      product.collection,

    image:
      product.images
        .map(
          (image) =>
            image.publicUrl
        )
        .filter(Boolean),

  };

  if (
    product.maker &&
    product.maker.trim()
  ) {
    data.brand = {
      "@type":
        "Brand",

      name:
        product.maker.trim(),
    };
  }

  if (offers) {
    data.offers = offers;
  }

  return data;
}
