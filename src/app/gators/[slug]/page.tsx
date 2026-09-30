import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GatorOrderConfigurator from "@/components/GatorOrderConfigurator";
import { getPublishedGatorBySlug } from "@/lib/gators";

type GatorPageProps = {
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
    return null;
  }

  return `Please allow at least ${days} day${days === 1 ? "" : "s"} for this item.`;
}

export async function generateMetadata({
  params,
}: GatorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedGatorBySlug(slug);

  if (!product) {
    return {
      title: "Gator Gear Not Found",
    };
  }

  return {
    title: product.name,
    description:
      product.short_description ??
      product.description ??
      "Port Allegany Gator gear from Port Petals.",
  };
}

export default async function GatorProductPage({
  params,
}: GatorPageProps) {
  const { slug } = await params;
  const product = await getPublishedGatorBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images[0]?.publicUrl ??
    "/collections/gators.jpg";

  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const leadTime = getLeadTimeText(product.lead_time_days);

  const gatorVariants = product.variants.map((variant) => ({
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
          href="/gators"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
        >
          ← Back to Gator Gear
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-14">
          <div className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(42,66,57,0.12)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src={primaryImage}
                  alt={product.images[0]?.alt_text ?? product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1023px) 100vw, 44vw"
                  className="object-cover"
                />
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {product.images.slice(1, 4).map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-xl border border-[#284239]/10 bg-white"
                  >
                    <Image
                      src={image.publicUrl}
                      alt={image.alt_text ?? product.name}
                      fill
                      unoptimized
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
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

            <GatorOrderConfigurator
              productName={product.name}
              basePrice={product.base_price ?? 0}
              baseQuantity={product.quantity}
              baseTrackInventory={product.track_inventory}
              variants={gatorVariants}
              customizable={product.customizable}
              pickupAvailable={product.pickup_available}
              deliveryAvailable={product.delivery_available}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[#284239]/10 bg-white/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Product Details
            </p>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              {product.description ??
                product.short_description ??
                product.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Fulfillment
            </p>

            <div className="mt-3 space-y-1 text-sm leading-6 text-[#607068]">
              {product.pickup_available && (
                <p>Pickup available in Port Allegany.</p>
              )}

              {product.delivery_available && (
                <p>Local delivery available.</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Availability
            </p>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              {leadTime ??
                "Availability depends on current inventory and product options."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
