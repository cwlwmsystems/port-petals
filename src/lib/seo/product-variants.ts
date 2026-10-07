import {
  absoluteUrl,
  siteConfig,
} from "@/lib/seo/site";

type ShirtVariantInput = {
  id: string;
  name: string;
  garment_type: string | null;
  size: string | null;
  color: string | null;
  price: number | null;
  quantity: number | null;
  track_inventory: boolean;
  active: boolean;
};

type ShirtImageInput = {
  publicUrl: string;
};

type ShirtProductInput = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  base_price: number | null;
  maker?: string | null;
  variants: ShirtVariantInput[];
  images: ShirtImageInput[];
};

function availabilityForVariant(
  variant: ShirtVariantInput
) {
  if (!variant.track_inventory) {
    return "https://schema.org/InStock";
  }

  return (variant.quantity ?? 0) > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

function variantName(
  productName: string,
  variant: ShirtVariantInput
) {
  return [
    productName,
    variant.garment_type,
    variant.color,
    variant.size,
  ]
    .filter(Boolean)
    .join(" - ");
}

export function buildShirtProductGroupStructuredData(
  product: ShirtProductInput
) {
  const baseUrl = absoluteUrl(
    `/shirts/${product.slug}`
  );

  const description =
    product.short_description ??
    product.description ??
    `${product.name} from Port Petals.`;

  const activeVariants =
    product.variants.filter(
      (variant) => variant.active
    );

  const hasSize =
    activeVariants.some(
      (variant) => Boolean(variant.size)
    );

  const hasColor =
    activeVariants.some(
      (variant) => Boolean(variant.color)
    );

  const variesBy: string[] = [];

  if (hasSize) {
    variesBy.push(
      "https://schema.org/size"
    );
  }

  if (hasColor) {
    variesBy.push(
      "https://schema.org/color"
    );
  }

  const group: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${baseUrl}#product-group`,
    productGroupID: product.id,
    name: product.name,
    description,
    url: baseUrl,
    variesBy,
    image: product.images
      .map((image) => image.publicUrl)
      .filter(Boolean),
    hasVariant: activeVariants.map(
      (variant) => {
        const price =
          variant.price ??
          product.base_price ??
          0;

        const url =
          `${baseUrl}?variant=${encodeURIComponent(
            variant.id
          )}`;

        const data: Record<
          string,
          unknown
        > = {
          "@type": "Product",
          "@id": `${url}#product`,
          sku: variant.id,
          name: variantName(
            product.name,
            variant
          ),
          description,
          url,
          inProductGroupWithID:
            product.id,
          image: product.images
            .map(
              (image) =>
                image.publicUrl
            )
            .filter(Boolean),
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            price: price.toFixed(2),
            availability:
              availabilityForVariant(
                variant
              ),
            itemCondition:
              "https://schema.org/NewCondition",
            seller: {
              "@type":
                "Organization",
              "@id":
                `${siteConfig.url}/#business`,
              name:
                siteConfig.name,
              url:
                siteConfig.url,
            },
          },
        };

        if (variant.color) {
          data.color =
            variant.color;
        }

        if (variant.size) {
          data.size =
            variant.size;
        }

        return data;
      }
    ),
  };

  if (
    product.maker &&
    product.maker.trim()
  ) {
    group.brand = {
      "@type": "Brand",
      name: product.maker.trim(),
    };
  }

  return group;
}
