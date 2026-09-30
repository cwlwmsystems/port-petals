import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { flowerProducts } from "@/data/flowers";

type FlowerProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export async function generateStaticParams() {
  return flowerProducts
    .filter((product) => product.active)
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({
  params,
}: FlowerProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = flowerProducts.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    return {
      title: "Flower Not Found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function FlowerProductPage({
  params,
}: FlowerProductPageProps) {
  const { slug } = await params;

  const product = flowerProducts.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    notFound();
  }

  const startingPrice = Math.min(
    ...product.sizes.map((size) => size.price)
  );

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href="/flowers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
        >
          ← Back to Fresh Flowers
        </Link>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pb-20">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(42,66,57,0.12)]">
            <div className="relative aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#284239]/10 bg-white/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
              Fresh Flower Notice
            </p>

            <p className="mt-3 text-sm leading-6 text-[#607068]">
              {product.substitutionNote}
            </p>
          </div>
        </div>

        <div className="lg:py-4">
          {product.featured && (
            <span className="inline-flex rounded-full bg-[#f3d8d2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b94f45]">
              Port Petals Favorite
            </span>
          )}

          <h1 className="mt-5 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
            {product.name}
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#52655d]">
            {product.description}
          </p>

          <div className="mt-7">
            {product.sizes.length > 1 ? (
              <>
                <p className="text-sm text-[#718078]">Starting at</p>
                <p className="mt-1 text-3xl font-semibold text-[#e76d61]">
                  {formatPrice(startingPrice)}
                </p>
              </>
            ) : (
              <p className="text-3xl font-semibold text-[#e76d61]">
                {formatPrice(product.sizes[0].price)}
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
              Available Options
            </h2>

            <div className="mt-4 grid gap-3">
              {product.sizes.map((size) => (
                <div
                  key={size.name}
                  className="flex items-center justify-between rounded-xl border border-[#284239]/10 bg-white/70 px-5 py-4"
                >
                  <span className="font-semibold text-[#52655d]">
                    {size.name}
                  </span>

                  <span className="text-lg font-semibold text-[#153f32]">
                    {formatPrice(size.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#edf3e7] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#36594c]">
              Advance Notice
            </p>

            <p className="mt-2 font-semibold text-[#153f32]">
              {product.leadTime}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.pickupAvailable && (
              <div className="rounded-xl border border-[#284239]/10 bg-white/65 p-4">
                <p className="text-sm font-semibold text-[#153f32]">
                  Pickup Available
                </p>

                <p className="mt-1 text-sm leading-6 text-[#607068]">
                  430 E Arnold Avenue
                  <br />
                  Port Allegany, PA 16743
                </p>
              </div>
            )}

            {product.deliveryAvailable && (
              <div className="rounded-xl border border-[#284239]/10 bg-white/65 p-4">
                <p className="text-sm font-semibold text-[#153f32]">
                  Local Delivery
                </p>

                <p className="mt-1 text-sm leading-6 text-[#607068]">
                  Free within 3 miles, $10 over 3 miles and up to 8 miles,
                  and $15 to Smethport or Eldred.
                </p>
              </div>
            )}
          </div>

          {product.allowsCardMessage && (
            <div className="mt-6 rounded-xl border border-[#284239]/10 bg-white/65 p-4">
              <p className="text-sm font-semibold text-[#153f32]">
                Complimentary Card Message
              </p>

              <p className="mt-1 text-sm leading-6 text-[#607068]">
                A short personal card message can be included with this
                arrangement.
              </p>
            </div>
          )}

          <div className="mt-9">
            <a
              href="tel:+18146421253"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#e76d61] px-7 py-4 text-base font-semibold text-white shadow-md shadow-[#e76d61]/15 transition hover:bg-[#d85b50]"
            >
              Call to Order · 814-642-1253
            </a>

            <a
              href="mailto:PortPetals@yahoo.com"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#284239]/15 bg-white/70 px-7 py-4 text-base font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Email Port Petals
            </a>

            <p className="mt-4 text-center text-xs leading-5 text-[#718078]">
              Online ordering and payment will be added after the final catalog
              and Square setup are completed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
