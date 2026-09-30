import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CandleOrderConfigurator from "@/components/CandleOrderConfigurator";
import CandleProductInfoTabs from "@/components/CandleProductInfoTabs";
import { getPublishedCandleBySlug } from "@/lib/candles";

type CandlePageProps = {
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

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

export async function generateMetadata({
  params,
}: CandlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getPublishedCandleBySlug(slug);

  if (!product) {
    return {
      title: "Candle Not Found",
    };
  }

  return {
    title: product.name,
    description:
      product.short_description ??
      product.description ??
      "Candle product from Port Petals.",
  };
}

export default async function CandlePage({
  params,
}: CandlePageProps) {
  const { slug } = await params;

  const product = await getPublishedCandleBySlug(slug);

  if (!product) {
    notFound();
  }

  const primaryImage =
    product.images[0]?.publicUrl ?? "/collections/candles.jpg";

  const startingPrice = getStartingPrice(
    product.base_price,
    product.variants
  );

  const configuratorOptions = [
    {
      name: "Standard",
      price: product.base_price ?? 0,
      quantity: product.quantity,
      trackInventory: product.track_inventory,
    },
    ...product.variants.map((variant) => ({
      name: variant.name,
      price: variant.price ?? product.base_price ?? 0,
      quantity: variant.quantity,
      trackInventory: variant.track_inventory,
    })),
  ];

  const leadTime =
    product.lead_time_days !== null
      ? `Please allow at least ${product.lead_time_days} days for this item.`
      : undefined;

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href="/candles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
        >
          ← Back to Candles
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
            {product.featured && (
              <span className="inline-flex rounded-full bg-[#f3d8d2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b94f45]">
                Port Petals Favorite
              </span>
            )}

            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52655d]">
                {product.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-3 border-b border-[#284239]/10 pb-7">
              <div>
                <p className="text-sm text-[#718078]">
                  {product.variants.length > 1 ? "Starting at" : "Price"}
                </p>

                <p className="mt-1 text-3xl font-semibold text-[#e76d61]">
                  {formatPrice(startingPrice)}
                </p>
              </div>

              <div className="max-w-md text-sm leading-6 text-[#607068]">
                {leadTime && <p>{leadTime}</p>}

                {product.track_inventory &&
                  product.quantity !== null && (
                    <p>
                      {product.quantity > 0
                        ? `${product.quantity} currently available`
                        : "Currently sold out"}
                    </p>
                  )}
              </div>
            </div>

            <CandleOrderConfigurator
              productName={product.name}
              options={configuratorOptions}
              pickupAvailable={product.pickup_available}
              deliveryAvailable={product.delivery_available}
              allowsGiftMessage={true}
            />
          </div>
        </div>
      </section>

      <CandleProductInfoTabs
        description={
          product.description ??
          product.short_description ??
          product.name
        }
      />
    </main>
  );
}
