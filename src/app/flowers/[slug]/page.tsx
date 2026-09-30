import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FlowerOrderConfigurator from "@/components/FlowerOrderConfigurator";
import FlowerProductInfoTabs from "@/components/FlowerProductInfoTabs";
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

          <FlowerOrderConfigurator
            productName={product.name}
            sizes={product.sizes}
            allowsCardMessage={product.allowsCardMessage}
            pickupAvailable={product.pickupAvailable}
            deliveryAvailable={product.deliveryAvailable}
          />
        </div>
      </section>

      <FlowerProductInfoTabs
        description={product.description}
        substitutionNote={product.substitutionNote}
      />
    </main>
  );
}
