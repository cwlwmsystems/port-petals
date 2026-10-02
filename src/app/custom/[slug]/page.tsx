import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CustomItemConfigurator from "@/components/CustomItemConfigurator";
import CustomItemInfoTabs from "@/components/CustomItemInfoTabs";
import ProductImageGallery from "@/components/ProductImageGallery";
import { getPublishedCustomItemBySlug } from "@/lib/custom-items";

type CustomItemPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(price: number | null) {
  if (price === null) {
    return "Contact for price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getStartingPrice(
  basePrice: number | null,
  variants: { price: number | null }[]
) {
  const prices = [
    ...(basePrice !== null ? [basePrice] : []),
    ...variants
      .map((variant) => variant.price)
      .filter((price): price is number => price !== null),
  ];

  return prices.length > 0 ? Math.min(...prices) : null;
}

function getLeadTimeText(days: number | null) {
  if (days === null) {
    return undefined;
  }

  return `Please allow at least ${days} day${days === 1 ? "" : "s"} for this item.`;
}

export async function generateMetadata({
  params,
}: CustomItemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedCustomItemBySlug(slug);

  if (!product) {
    return {
      title: "Custom Item Not Found",
    };
  }

  return {
    title: product.name,
    description:
      product.short_description ??
      product.description ??
      "Custom item from Port Petals.",
  };
}

export default async function CustomItemPage({
  params,
}: CustomItemPageProps) {
  const { slug } = await params;
  const product = await getPublishedCustomItemBySlug(slug);

  if (!product) {
    notFound();
  }

  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const leadTime = getLeadTimeText(product.lead_time_days);

  const customVariants = product.variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    size: variant.size,
    color: variant.color,
    price: variant.price ?? product.base_price ?? 0,
    quantity: variant.quantity,
    trackInventory: variant.track_inventory,
  }));

  const trackedVariantQuantity = product.variants
    .filter(
      (variant) =>
        variant.active &&
        variant.track_inventory &&
        variant.quantity !== null
    )
    .reduce(
      (total, variant) => total + (variant.quantity ?? 0),
      0
    );

  const hasTrackedVariants = product.variants.some(
    (variant) =>
      variant.active &&
      variant.track_inventory
  );

  const totalAvailable = hasTrackedVariants
    ? trackedVariantQuantity
    : product.quantity;

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href="/custom"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
        >
          ← Back to Custom Items
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-14">
          <div className="lg:sticky lg:top-8">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              fallbackImage="/collections/customized-items.jpg"
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {product.featured && (
                <span className="inline-flex rounded-full bg-[#f3d8d2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b94f45]">
                  Port Petals Favorite
                </span>
              )}

              {product.ready_made && (
                <span className="inline-flex rounded-full bg-[#edf1f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#536578]">
                  Ready-Made
                </span>
              )}

              {product.made_to_order && (
                <span className="inline-flex rounded-full bg-[#edf3e7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#36594c]">
                  Made to Order
                </span>
              )}

              {product.customizable && (
                <span className="inline-flex rounded-full bg-[#f8e1dc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b9564c]">
                  Customizable
                </span>
              )}
            </div>

            {product.maker && (
              <p className="mt-4 text-sm font-semibold text-[#36594c]">
                Made by {product.maker}
              </p>
            )}

            <h1 className="mt-4 max-w-2xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              {product.name}
            </h1>

            {(product.description || product.short_description) && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52655d]">
                {product.description ?? product.short_description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-3 border-b border-[#284239]/10 pb-7">
              <div>
                <p className="text-sm text-[#718078]">
                  {product.variants.length > 0
                    ? "Starting at"
                    : "Price"}
                </p>

                <p className="mt-1 text-3xl font-semibold text-[#e76d61]">
                  {formatPrice(startingPrice)}
                </p>
              </div>

              <div className="max-w-md text-sm leading-6 text-[#607068]">
                {leadTime && <p>{leadTime}</p>}

                {totalAvailable !== null && (
                  <p>
                    {totalAvailable > 0
                      ? `${totalAvailable} currently available`
                      : "Currently sold out"}
                  </p>
                )}
              </div>
            </div>

            <CustomItemConfigurator
              productId={product.id}
              productSlug={product.slug}
              productName={product.name}
              imageUrl={
                product.images.find((image) => image.is_primary)?.publicUrl ??
                product.images[0]?.publicUrl ??
                null
              }
              basePrice={product.base_price ?? 0}
              baseQuantity={product.quantity}
              baseTrackInventory={product.track_inventory}
              variants={customVariants}
              personalizationAvailable={product.customizable}
              pickupAvailable={product.pickup_available}
              deliveryAvailable={product.delivery_available}
            />
          </div>
        </div>
      </section>

      <CustomItemInfoTabs
        description={
          product.description ??
          product.short_description ??
          product.name
        }
        leadTime={
          leadTime ??
          "Timing depends on the requested design and material availability."
        }
      />
    </main>
  );
}
