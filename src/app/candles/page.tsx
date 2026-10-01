import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedCandles } from "@/lib/candles";
import ProductCardCarousel from "@/components/ProductCardCarousel";

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
              Candle inventory is being updated
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
                <article
                  key={product.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white/70 shadow-[0_12px_35px_rgba(42,66,57,0.08)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={primaryImage}
                      alt={product.images[0]?.alt_text ?? product.name}
                      fill
                      unoptimized
                      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                      className="object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
                    />

                    {product.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#fffaf3]/95 px-3 py-1.5 text-xs font-semibold text-[#e76d61]">
                        Port Petals Favorite
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                      {product.name}
                    </h2>

                    {product.short_description && (
                      <p className="mt-3 leading-6 text-[#607068]">
                        {product.short_description}
                      </p>
                    )}

                    <div className="mt-5">
                      <p className="text-sm text-[#718078]">
                        {product.variants.length > 1
                          ? "Starting at"
                          : "Price"}
                      </p>

                      <p className="mt-1 text-lg font-semibold text-[#e76d61]">
                        {formatPrice(startingPrice)}
                      </p>
                    </div>

                    {product.track_inventory &&
                      product.quantity !== null && (
                        <p className="mt-3 text-sm text-[#718078]">
                          {product.quantity > 0
                            ? `${product.quantity} available`
                            : "Sold out"}
                        </p>
                      )}

                    <div className="mt-auto pt-6">
                      <Link
                        href={`/candles/${product.slug}`}
                        className="inline-flex w-full items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
