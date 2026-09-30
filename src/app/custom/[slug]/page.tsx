import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CustomItemConfigurator from "@/components/CustomItemConfigurator";
import CustomItemInfoTabs from "@/components/CustomItemInfoTabs";
import { customItemProducts } from "@/data/customItems";

type CustomItemPageProps = {
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
  return customItemProducts
    .filter((product) => product.active)
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({
  params,
}: CustomItemPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = customItemProducts.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    return {
      title: "Custom Item Not Found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function CustomItemPage({
  params,
}: CustomItemPageProps) {
  const { slug } = await params;

  const product = customItemProducts.find(
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
          href="/custom"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
        >
          ← Back to Custom Items
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

            <div className="mt-5 rounded-2xl border border-[#284239]/10 bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e76d61]">
                Custom Item Notice
              </p>

              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Photos and catalog examples represent the type of work
                Port Petals can create. Final colors, materials, wording,
                and design details may vary based on the approved request.
              </p>
            </div>
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

            <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-3 border-b border-[#284239]/10 pb-7">
              <div>
                <p className="text-sm text-[#718078]">
                  Starting at
                </p>

                <p className="mt-1 text-3xl font-semibold text-[#e76d61]">
                  {formatPrice(startingPrice)}
                </p>
              </div>

              <div className="max-w-md text-sm leading-6 text-[#607068]">
                <p>{product.leadTime}</p>
                <p>Final pricing is confirmed after the design is reviewed.</p>
              </div>
            </div>

            <CustomItemConfigurator
              productName={product.name}
              options={product.options}
              personalizationAvailable={
                product.personalizationAvailable
              }
              pickupAvailable={product.pickupAvailable}
              deliveryAvailable={product.deliveryAvailable}
            />
          </div>
        </div>
      </section>

      <CustomItemInfoTabs
        description={product.description}
        leadTime={product.leadTime}
      />
    </main>
  );
}
