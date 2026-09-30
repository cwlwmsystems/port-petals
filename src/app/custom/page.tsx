import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  customItemCollections,
  customItemProducts,
  type CustomItemProduct,
} from "@/data/customItems";

export const metadata: Metadata = {
  title: "Custom Items",
  description:
    "Browse personalized sports signs, seasonal decor, custom tumblers, woodcrafts, and other custom items from Port Petals in Port Allegany, Pennsylvania.",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

function getStartingPrice(product: CustomItemProduct) {
  return Math.min(...product.options.map((option) => option.price));
}

export default function CustomItemsPage() {
  const activeProducts = customItemProducts.filter(
    (product) => product.active
  );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-24 top-16 -z-20 h-80 w-80 rounded-full bg-[#efa99f]/35 blur-[95px]" />
        <div className="absolute -right-20 top-0 -z-20 h-96 w-96 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
                Custom Items
              </p>
              <span className="h-px w-12 bg-[#e76d61]" />
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Personalized pieces made just for you.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              From sports keepsakes and personalized signs to tumblers,
              seasonal decor, and custom woodcrafts, Port Petals creates
              one-of-a-kind pieces built around your ideas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/custom/request"
                className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#e76d61]/20 transition hover:-translate-y-0.5 hover:bg-[#d85b50]"
              >
                Request Something Custom
              </Link>

              <a
                href="tel:+18146421253"
                className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-7 py-3.5 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Call 814-642-1253
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/collections/customized-items.jpg"
                alt="Custom items from Port Petals"
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
            {customItemCollections.map((collection) => (
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

      <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-10">
        <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Custom Work
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
            Every piece can be different.
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-[#607068]">
            Product photos and catalog examples represent the type of work
            Port Petals can create. Final colors, materials, names, numbers,
            designs, and details may vary based on your request and available
            supplies.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-10">
        {customItemCollections.map((collection, index) => {
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
                          <p className="text-sm text-[#718078]">
                            Starting at
                          </p>

                          <p className="mt-1 text-lg font-semibold text-[#e76d61]">
                            {formatPrice(startingPrice)}
                          </p>
                        </div>

                        <p className="mt-4 text-xs leading-5 text-[#718078]">
                          {product.leadTime}
                        </p>

                        <div className="mt-auto pt-6">
                          <Link
                            href={`/custom/${product.slug}`}
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

      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a8e69a]">
              Have Another Idea?
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold">
              Port Petals can create more than what you see here.
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#e7dedc]">
              If you have a design, theme, name, occasion, or project idea
              that is not listed in the catalog, send a custom request and
              describe what you have in mind.
            </p>
          </div>

          <Link
            href="/custom/request"
            className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Start a Custom Request
          </Link>
        </div>
      </section>
    </main>
  );
}
