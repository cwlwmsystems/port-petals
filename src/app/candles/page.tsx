import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedCandles } from "@/lib/candles";
import ProductCardCarousel from "@/components/ProductCardCarousel";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  title: "Candles",
  description:
    "Shop candle tarts and candle tart bouquets from Port Petals in Port Allegany, Pennsylvania.",
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

export default async function CandlesPage() {
  const products = await getPublishedCandles();

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Candles
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Sweet scents and giftable candle favorites.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Browse currently available candle tarts, tart bouquets, and
              other candle products from Port Petals.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/heroes/candles.jpg"
                alt="Candles from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {products.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
              New candle favorites are coming soon
            </h2>

            <p className="mt-4 text-[#607068]">
              Check back soon or call Port Petals for current availability.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const startingPrice = getStartingPrice(
                product.base_price,
                product.variants
              );

              const primaryImage =
                product.images[0]?.publicUrl ?? "/collections/candles.jpg";

              return (
                        <StoreProductCard
                          key={product.id}
                          href={`/candles/${product.slug}`}
                          productId={product.id}
                          slug={product.slug}
                          name={product.name}
                          shortDescription={product.short_description}
                          imageUrl={primaryImage}
                          imageAlt={
                            product.images[0]?.alt_text ??
                            product.name
                          }
                          startingPrice={startingPrice}
                          featured={product.featured}
                          maker={
                            "maker" in product &&
                            typeof product.maker === "string"
                              ? product.maker
                              : null
                          }
                          readyMade={product.ready_made}
                          customizable={product.customizable}
                          madeToOrder={product.made_to_order}
                          leadTimeDays={product.lead_time_days}
                          basePrice={product.base_price}
                          trackInventory={product.track_inventory}
                          quantity={product.quantity}
                          variants={
                            product.variants.map((variant) => ({
                              quantity: variant.quantity,
                              trackInventory:
                                variant.track_inventory,
                            }))
                          }
                        />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
