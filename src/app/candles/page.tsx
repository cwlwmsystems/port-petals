import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  candleCollections,
  candleProducts,
  type CandleProduct,
} from "@/data/candles";

export const metadata: Metadata = {
  title: "Candle Tarts & Candle Tart Bouquets",
  description:
    "Shop candle tarts and handmade candle tart bouquets from Port Petals in Port Allegany, Pennsylvania.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

function getStartingPrice(product: CandleProduct) {
  return Math.min(...product.options.map((option) => option.price));
}

export default function CandlesPage() {
  const activeProducts = candleProducts.filter(
    (product) => product.active
  );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#f2eadb_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
                Candles
              </p>
              <span className="h-px w-12 bg-[#e76d61]" />
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Cozy scents with a creative twist.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Shop scented candle tarts and handcrafted candle tart
              bouquets for gifts, celebrations, holidays, or a little
              something special for home.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/collections/candles.jpg"
                alt="Candle products from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#284239]/10 bg-white/40">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {candleCollections.map((collection) => (
              <a
                key={collection.slug}
                href={`#${collection.slug}`}
                className="rounded-full border border-[#284239]/15 bg-[#fffdf9] px-5 py-2.5 text-sm font-semibold text-[#284239] shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                {collection.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-10">
        {candleCollections.map((collection, index) => {
          const products = activeProducts.filter(
            (product) => product.category === collection.slug
          );

          return (
            <section
              key={collection.slug}
              id={collection.slug}
              className={
                index === 0
                  ? "scroll-mt-32"
                  : "mt-16 scroll-mt-32 border-t border-[#284239]/10 pt-16"
              }
            >
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
                  Port Petals
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#153f32]">
                  {collection.name}
                </h2>

                <p className="mt-4 leading-7 text-[#607068]">
                  {collection.description}
                </p>
              </div>

              <div className="mt-9 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const startingPrice = getStartingPrice(product);

                  return (
                    <article
                      key={product.id}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white/70 shadow-[0_12px_35px_rgba(42,66,57,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(42,66,57,0.13)]"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />

                        {product.featured && (
                          <span className="absolute left-4 top-4 rounded-full bg-[#fffaf3]/95 px-3 py-1.5 text-xs font-semibold text-[#e76d61] shadow-sm">
                            Port Petals Favorite
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                          {product.name}
                        </h3>

                        <p className="mt-3 leading-6 text-[#607068]">
                          {product.shortDescription}
                        </p>

                        <div className="mt-5">
                          {product.options.length > 1 && (
                            <p className="text-sm text-[#718078]">
                              Starting at
                            </p>
                          )}

                          <p className="mt-1 text-lg font-semibold text-[#e76d61]">
                            {formatPrice(startingPrice)}
                          </p>
                        </div>

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
            </section>
          );
        })}
      </div>
    </main>
  );
}
