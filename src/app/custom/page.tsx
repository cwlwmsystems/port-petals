import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedCustomItems } from "@/lib/custom-items";
import StoreProductCard from "@/components/StoreProductCard";

export const metadata: Metadata = {
  title: "Custom Items",
  description:
    "Browse personalized signs, sports designs, seasonal decor, tumblers, woodcrafts, and custom items from Port Petals in Port Allegany, Pennsylvania.",
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

function formatCollection(collection: string) {
  const labels: Record<string, string> = {
    sports: "Sports & Team Designs",
    "personalized-signs": "Personalized Signs",
    seasonal: "Seasonal & Holiday",
    "door-decor": "Door & Wall Decor",
    tumblers: "Custom Tumblers",
    woodcrafts: "Custom Woodcrafts",
  };

  return labels[collection] ?? collection.replaceAll("-", " ");
}

export default async function CustomItemsPage() {
  const products = await getPublishedCustomItems();

  const collections = Array.from(
    new Set(products.map((product) => product.collection))
  );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Custom Items
            </p>

            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Personalized pieces made just for you.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Browse currently available custom pieces, personalized gifts,
              seasonal decor, tumblers, sports designs, and woodcrafts.
            </p>

            <Link
              href="/custom/request"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Request Something Custom
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_55px_rgba(42,66,57,0.15)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/heroes/custom.jpg"
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

      {collections.length > 0 && (
        <section className="border-y border-[#284239]/10 bg-white/40">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-wrap justify-center gap-3">
              {collections.map((collection) => (
                <a
                  key={collection}
                  href={`#${collection}`}
                  className="rounded-full border border-[#284239]/15 bg-[#fffdf9] px-5 py-2.5 text-sm font-semibold text-[#284239]"
                >
                  {formatCollection(collection)}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {products.length === 0 ? (
          <div className="rounded-[1.8rem] border border-[#284239]/10 bg-white/70 p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[#153f32]">
              New custom creations are coming soon
            </h2>

            <p className="mt-4 text-[#607068]">
              Have something specific in mind? Send Port Petals a custom
              request.
            </p>

            <Link
              href="/custom/request"
              className="mt-6 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
            >
              Start a Custom Request
            </Link>
          </div>
        ) : (
          collections.map((collection, index) => {
            const collectionProducts = products.filter(
              (product) => product.collection === collection
            );

            return (
              <section
                key={collection}
                id={collection}
                className={
                  index === 0
                    ? "scroll-mt-32"
                    : "mt-16 scroll-mt-32 border-t border-[#284239]/10 pt-16"
                }
              >
                <h2 className="font-serif text-4xl font-semibold text-[#153f32]">
                  {formatCollection(collection)}
                </h2>

                <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                  {collectionProducts.map((product) => {
                    const startingPrice = getStartingPrice(
                      product.base_price,
                      product.variants
                    );

                    const primaryImage =
                      product.images[0]?.publicUrl ??
                      "/collections/customized-items.jpg";

                    return (
                        <StoreProductCard
                          key={product.id}
                          href={`/custom/${product.slug}`}
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
                            "maker" in product
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
              </section>
            );
          })
        )}
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
              Send a custom request if you have a different design, theme,
              personalization, or project in mind.
            </p>
          </div>

          <Link
            href="/custom/request"
            className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white"
          >
            Start a Custom Request
          </Link>
        </div>
      </section>
    </main>
  );
}
