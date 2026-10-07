import Image from "next/image";
import Link from "next/link";
import { getPublishedFlowers } from "@/lib/flowers";
import { getPublishedCandles } from "@/lib/candles";
import { getPublishedCustomItems } from "@/lib/custom-items";
import { getPublishedShirts } from "@/lib/shirts";
import { getPublishedGatorGear } from "@/lib/gators";

type NormalizedProduct = {
  id: string;
  slug: string;
  name: string;
  categoryPath: string;
  shortDescription: string | null;
  imageUrl: string;
  imageAlt: string;
  startingPrice: number | null;
  featured: boolean;
  maker: string | null;
  readyMade: boolean;
  customizable: boolean;
  madeToOrder: boolean;
  leadTimeDays: number | null;
  basePrice: number | null;
  trackInventory: boolean;
  quantity: number | null;
  variants: {
    price: number | null;
    quantity: number | null;
    trackInventory: boolean;
  }[];
};

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

function formatPrice(
  price: number | null
) {
  if (price === null) {
    return "Contact for price";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(price);
}

function HomeFeaturedProductCard({
  product,
}: {
  product: NormalizedProduct;
}) {
  const href =
    `/${product.categoryPath}/${product.slug}`;

  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white/70 shadow-[0_12px_35px_rgba(42,66,57,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(42,66,57,0.14)]">
      <Link
        href={href}
        className="block h-full"
      >
        <div className="relative h-56 overflow-hidden sm:h-64">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            unoptimized
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) calc(50vw - 36px), 390px"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.035]"
          />

          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-[#fffaf3]/95 px-3 py-1.5 text-xs font-semibold text-[#e76d61]">
              Port Petals Favorite
            </span>
          )}

          {product.maker && (
            <span className="absolute bottom-4 left-4 rounded-full bg-[#284239]/90 px-3 py-1.5 text-xs font-semibold text-white">
              By {product.maker}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="font-serif text-xl font-semibold leading-snug text-[#153f32] sm:text-2xl">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#607068] sm:text-base">
              {product.shortDescription}
            </p>
          )}

          {(product.readyMade ||
            product.customizable ||
            product.madeToOrder) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.readyMade && (
                <span className="rounded-full bg-[#edf1f6] px-3 py-1 text-xs font-semibold text-[#536578]">
                  Ready-Made
                </span>
              )}

              {product.customizable && (
                <span className="rounded-full bg-[#f8e1dc] px-3 py-1 text-xs font-semibold text-[#b9564c]">
                  Customizable
                </span>
              )}

              {product.madeToOrder && (
                <span className="rounded-full bg-[#edf3e7] px-3 py-1 text-xs font-semibold text-[#36594c]">
                  Made to Order
                </span>
              )}
            </div>
          )}

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#718078]">
                {product.variants.length > 0
                  ? "Starting at"
                  : "Price"}
              </p>

              <p className="mt-1 text-lg font-semibold text-[#e76d61]">
                {formatPrice(
                  product.startingPrice
                )}
              </p>
            </div>

            <span className="text-sm font-semibold text-[#36594c]">
              View product →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function HomeFeaturedProducts() {
  const [
    flowers,
    candles,
    customItems,
    shirts,
    gators,
  ] = await Promise.all([
    getPublishedFlowers(),
    getPublishedCandles(),
    getPublishedCustomItems(),
    getPublishedShirts(),
    getPublishedGatorGear(),
  ]);

  const products: NormalizedProduct[] = [
    ...flowers.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      categoryPath: "flowers",
      shortDescription: product.short_description,
      imageUrl:
        product.images[0]?.publicUrl ??
        "/collections/fresh-flowers.jpg",
      imageAlt:
        product.images[0]?.alt_text ??
        product.name,
      startingPrice: getStartingPrice(
        product.base_price,
        product.variants
      ),
      featured: product.featured,
      maker: null,
      readyMade: product.ready_made,
      customizable: product.customizable,
      madeToOrder: product.made_to_order,
      leadTimeDays: product.lead_time_days,
      basePrice: product.base_price,
      trackInventory: product.track_inventory,
      quantity: product.quantity,
      variants: product.variants.map((variant) => ({
        price: variant.price,
        quantity: variant.quantity,
        trackInventory: variant.track_inventory,
      })),
    })),

    ...candles.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      categoryPath: "candles",
      shortDescription: product.short_description,
      imageUrl:
        product.images[0]?.publicUrl ??
        "/collections/candles.jpg",
      imageAlt:
        product.images[0]?.alt_text ??
        product.name,
      startingPrice: getStartingPrice(
        product.base_price,
        product.variants
      ),
      featured: product.featured,
      maker: null,
      readyMade: product.ready_made,
      customizable: product.customizable,
      madeToOrder: product.made_to_order,
      leadTimeDays: product.lead_time_days,
      basePrice: product.base_price,
      trackInventory: product.track_inventory,
      quantity: product.quantity,
      variants: product.variants.map((variant) => ({
        price: variant.price,
        quantity: variant.quantity,
        trackInventory: variant.track_inventory,
      })),
    })),

    ...customItems.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      categoryPath: "custom",
      shortDescription: product.short_description,
      imageUrl:
        product.images[0]?.publicUrl ??
        "/collections/customized-items.jpg",
      imageAlt:
        product.images[0]?.alt_text ??
        product.name,
      startingPrice: getStartingPrice(
        product.base_price,
        product.variants
      ),
      featured: product.featured,
      maker: product.maker,
      readyMade: product.ready_made,
      customizable: product.customizable,
      madeToOrder: product.made_to_order,
      leadTimeDays: product.lead_time_days,
      basePrice: product.base_price,
      trackInventory: product.track_inventory,
      quantity: product.quantity,
      variants: product.variants.map((variant) => ({
        price: variant.price,
        quantity: variant.quantity,
        trackInventory: variant.track_inventory,
      })),
    })),

    ...shirts.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      categoryPath: "apparel",
      shortDescription: product.short_description,
      imageUrl:
        product.images[0]?.publicUrl ??
        "/collections/shirts.jpg",
      imageAlt:
        product.images[0]?.alt_text ??
        product.name,
      startingPrice: getStartingPrice(
        product.base_price,
        product.variants
      ),
      featured: product.featured,
      maker: product.maker,
      readyMade: product.ready_made,
      customizable: product.customizable,
      madeToOrder: product.made_to_order,
      leadTimeDays: product.lead_time_days,
      basePrice: product.base_price,
      trackInventory: product.track_inventory,
      quantity: product.quantity,
      variants: product.variants.map((variant) => ({
        price: variant.price,
        quantity: variant.quantity,
        trackInventory: variant.track_inventory,
      })),
    })),

    ...gators.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      categoryPath: "gators",
      shortDescription: product.short_description,
      imageUrl:
        product.images[0]?.publicUrl ??
        "/collections/gators.jpg",
      imageAlt:
        product.images[0]?.alt_text ??
        product.name,
      startingPrice: getStartingPrice(
        product.base_price,
        product.variants
      ),
      featured: product.featured,
      maker: product.maker,
      readyMade: product.ready_made,
      customizable: product.customizable,
      madeToOrder: product.made_to_order,
      leadTimeDays: product.lead_time_days,
      basePrice: product.base_price,
      trackInventory: product.track_inventory,
      quantity: product.quantity,
      variants: product.variants.map((variant) => ({
        price: variant.price,
        quantity: variant.quantity,
        trackInventory: variant.track_inventory,
      })),
    })),
  ];

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 6);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#fffaf3]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#e76d61]" />

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
                Featured at Port Petals
              </p>
            </div>

            <h2 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.03em] text-[#163f32] sm:text-5xl">
              Fresh picks, favorites & new finds.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#617068]">
              Take a look at some of the flowers, gifts, crafts, and hometown
              favorites currently being featured at Port Petals.
            </p>
          </div>

          <Link
            href="#shop"
            className="inline-flex w-fit items-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 text-sm font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
          >
            Browse All Collections →
          </Link>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <HomeFeaturedProductCard
              key={`${product.categoryPath}-${product.id}`}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
