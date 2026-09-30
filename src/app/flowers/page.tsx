import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  flowerCollections,
  flowerProducts,
  type FlowerProduct,
} from "@/data/flowers";

export const metadata: Metadata = {
  title: "Fresh Flowers",
  description:
    "Browse occasion arrangements, seasonal flowers, hand-tied bouquets, and prom and homecoming flowers from Port Petals in Port Allegany, Pennsylvania.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

function getStartingPrice(product: FlowerProduct) {
  return Math.min(...product.sizes.map((size) => size.price));
}

export default function FlowersPage() {
  const activeProducts = flowerProducts.filter((product) => product.active);

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-24 top-16 -z-20 h-80 w-80 rounded-full bg-[#efa99f]/35 blur-[95px]" />
        <div className="absolute -right-20 top-0 -z-20 h-96 w-96 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
                Fresh Flowers
              </p>
              <span className="h-px w-12 bg-[#e76d61]" />
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Flowers for every kind of moment.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              From birthdays and anniversaries to seasonal bouquets and
              school dances, Port Petals creates fresh floral designs for the
              moments that matter.
            </p>

            <div className="mt-8 rounded-2xl border border-[#e76d61]/20 bg-white/55 p-5 backdrop-blur">
              <p className="font-semibold text-[#153f32]">
                Please order at least 7 days in advance.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#607068]">
                Flower varieties and colors depend on seasonal availability.
                Comparable substitutions may be made while preserving the
                requested style, color palette, and value.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/collections/fresh-flowers.jpg"
                alt="Fresh flowers from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION NAVIGATION */}
      <section className="border-y border-[#284239]/10 bg-white/40">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {flowerCollections.map((collection) => (
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

      {/* DELIVERY SUMMARY */}
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#284239]/10 bg-white/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Pickup
            </p>
            <p className="mt-2 font-semibold text-[#153f32]">
              430 E Arnold Avenue
            </p>
            <p className="mt-1 text-sm text-[#607068]">
              Port Allegany, PA 16743
            </p>
          </div>

          <div className="rounded-2xl border border-[#284239]/10 bg-white/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Local Delivery
            </p>
            <p className="mt-2 font-semibold text-[#153f32]">
              Free within 3 miles
            </p>
            <p className="mt-1 text-sm text-[#607068]">
              $10 over 3 miles and up to 8 miles
            </p>
          </div>

          <div className="rounded-2xl border border-[#284239]/10 bg-white/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Smethport & Eldred
            </p>
            <p className="mt-2 font-semibold text-[#153f32]">
              $15 delivery
            </p>
            <p className="mt-1 text-sm text-[#607068]">
              Subject to scheduling and availability
            </p>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-10">
        {flowerCollections.map((collection, collectionIndex) => {
          const products = activeProducts.filter(
            (product) => product.category === collection.slug
          );

          return (
            <section
              key={collection.slug}
              id={collection.slug}
              className={
                collectionIndex === 0
                  ? "scroll-mt-32"
                  : "scroll-mt-32 border-t border-[#284239]/10 pt-16 mt-16"
              }
            >
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
                  Fresh Flowers
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
                        <div>
                          <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                            {product.name}
                          </h3>

                          <p className="mt-3 leading-6 text-[#607068]">
                            {product.shortDescription}
                          </p>
                        </div>

                        <div className="mt-6">
                          {product.sizes.length === 1 ? (
                            <p className="text-lg font-semibold text-[#e76d61]">
                              {formatPrice(product.sizes[0].price)}
                            </p>
                          ) : (
                            <>
                              <p className="text-sm text-[#718078]">
                                Starting at
                              </p>
                              <p className="mt-1 text-lg font-semibold text-[#e76d61]">
                                {formatPrice(startingPrice)}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="mt-5 space-y-2 border-t border-[#284239]/10 pt-5">
                          {product.sizes.map((size) => (
                            <div
                              key={`${product.id}-${size.name}`}
                              className="flex items-center justify-between gap-4 text-sm"
                            >
                              <span className="font-medium text-[#52655d]">
                                {size.name}
                              </span>

                              <span className="font-semibold text-[#153f32]">
                                {formatPrice(size.price)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 rounded-xl bg-[#f7f1e8] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#36594c]">
                            Advance Notice
                          </p>

                          <p className="mt-1 text-sm leading-6 text-[#607068]">
                            {product.leadTime}
                          </p>
                        </div>

                        <div className="mt-auto pt-6">
                          <Link
                            href={`/flowers/${product.slug}`}
                            className="inline-flex w-full items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
                          >
                            View Details
                          </Link>

                          <a
                            href="tel:+18146421253"
                            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#d85b50]"
                          >
                            Call to Order · 814-642-1253
                          </a>

                          <p className="mt-3 text-center text-xs leading-5 text-[#718078]">
                            Online flower ordering will be added after the final
                            catalog and payment setup are completed.
                          </p>
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

      {/* SUBSTITUTION POLICY */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a8e69a]">
              Fresh & Seasonal
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold">
              Every arrangement is uniquely made.
            </h2>
          </div>

          <div>
            <p className="leading-7 text-[#e7dedc]">
              Because fresh flowers are seasonal, exact varieties and colors
              may vary. When necessary, Port Petals may substitute flowers of
              comparable style and value while keeping the overall look and
              requested color palette as close as possible.
            </p>

            <p className="mt-4 leading-7 text-[#e7dedc]">
              For specific flower or color requests, call Port Petals when
              placing the order so availability can be confirmed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
