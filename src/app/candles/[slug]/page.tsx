import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CandleOrderConfigurator from "@/components/CandleOrderConfigurator";
import CandleProductInfoTabs from "@/components/CandleProductInfoTabs";
import { candleProducts } from "@/data/candles";

type CandleProductPageProps = {
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
  return candleProducts
    .filter((product) => product.active)
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({
  params,
}: CandleProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = candleProducts.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    return {
      title: "Candle Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function CandleProductPage({
  params,
}: CandleProductPageProps) {
  const { slug } = await params;

  const product = candleProducts.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    notFound();
  }

  const startingPrice = Math.min(
    ...product.options.map((option) => option.price)
  );

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
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 44vw"
                  className="object-cover"
                />
              </div>
            </div>

            {product.leadTime && (
              <div className="mt-5 rounded-2xl border border-[#284239]/10 bg-[#edf3e7] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#36594c]">
                  Advance Notice
                </p>

                <p className="mt-3 text-sm font-semibold leading-6 text-[#153f32]">
                  {product.leadTime}
                </p>
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

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52655d]">
              {product.description}
            </p>

            <div className="mt-7 border-b border-[#284239]/10 pb-7">
              <p className="text-sm text-[#718078]">
                {product.options.length > 1 ? "Starting at" : "Price"}
              </p>

              <p className="mt-1 text-3xl font-semibold text-[#e76d61]">
                {formatPrice(startingPrice)}
              </p>
            </div>

            <CandleOrderConfigurator
              productName={product.name}
              options={product.options}
              allowsGiftMessage={product.allowsGiftMessage}
              pickupAvailable={product.pickupAvailable}
              deliveryAvailable={product.deliveryAvailable}
            />
          </div>
        </div>
      </section>

      <CandleProductInfoTabs
        description={product.description}
      />
    </main>
  );
}
