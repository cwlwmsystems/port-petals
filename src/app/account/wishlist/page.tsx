import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductHref } from "@/lib/product-href";
import WishlistButton from "@/components/WishlistButton";

export const metadata: Metadata = {
  title: "My Wishlist",
  description:
    "View your saved Port Petals favorites.",
};

function formatPrice(
  value: number | null
) {
  if (value === null) {
    return "Contact for price";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  ).format(value);
}

export default async function WishlistPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect(
      "/account/login"
    );
  }

  const {
    data: wishlistRows,
    error: wishlistError,
  } =
    await supabase
      .from(
        "customer_wishlist_items"
      )
      .select(`
        product_id,
        created_at
      `)
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (wishlistError) {
    throw new Error(
      "Unable to load your wishlist."
    );
  }

  const productIds =
    (wishlistRows ?? []).map(
      (row) =>
        row.product_id
    );

  let products: any[] = [];

  if (productIds.length > 0) {
    const {
      data,
      error,
    } =
      await supabase
        .from("products")
        .select(`
          id,
          slug,
          name,
          category,
          department,
          short_description,
          base_price,
          status,
          product_images (
            storage_path,
            alt_text,
            is_primary,
            sort_order
          )
        `)
        .in(
          "id",
          productIds
        )
        .eq(
          "status",
          "published"
        );

    if (error) {
      throw new Error(
        "Unable to load saved products."
      );
    }

    const byId =
      new Map(
        (data ?? []).map(
          (product) => [
            product.id,
            product,
          ]
        )
      );

    products =
      productIds
        .map(
          (id) =>
            byId.get(id)
        )
        .filter(Boolean);
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <Link
          href="/account"
          className="text-sm font-semibold text-[#36594c] underline underline-offset-4"
        >
          ← Back to My Account
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            My Port Petals
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#153f32] sm:text-5xl">
            Wishlist
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
            Keep your favorite
            Port Petals finds
            together until
            you&apos;re ready
            for them.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(
              (product) => {
                const images =
                  Array.isArray(
                    product.product_images
                  )
                    ? [
                        ...product.product_images,
                      ].sort(
                        (
                          a,
                          b
                        ) => {
                          if (
                            a.is_primary &&
                            !b.is_primary
                          ) {
                            return -1;
                          }

                          if (
                            !a.is_primary &&
                            b.is_primary
                          ) {
                            return 1;
                          }

                          return (
                            Number(
                              a.sort_order ??
                                0
                            ) -
                            Number(
                              b.sort_order ??
                                0
                            )
                          );
                        }
                      )
                    : [];

                const image =
                  images[0] ??
                  null;

                const imageUrl =
                  image?.storage_path
                    ? supabase.storage
                        .from(
                          "product-images"
                        )
                        .getPublicUrl(
                          image.storage_path
                        ).data
                        .publicUrl
                    : "/collections/custom.jpg";

                const href =
                  getProductHref(
                    product
                  );

                return (
                  <article
                    key={
                      product.id
                    }
                    className="relative overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white shadow-sm"
                  >
                    <div className="absolute right-4 top-4 z-20">
                      <WishlistButton
                        productId={
                          product.id
                        }
                        compact
                      />
                    </div>

                    <Link
                      href={
                        href
                      }
                      className="block"
                    >
                      <div className="relative h-60 bg-[#faf7f1]">
                        <Image
                          src={
                            imageUrl
                          }
                          alt={
                            image?.alt_text ??
                            product.name
                          }
                          fill
                          unoptimized
                          className="object-contain p-3"
                        />
                      </div>

                      <div className="p-5">
                        <h2 className="font-serif text-xl font-semibold text-[#153f32]">
                          {
                            product.name
                          }
                        </h2>

                        {product.short_description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#607068]">
                            {
                              product.short_description
                            }
                          </p>
                        )}

                        <p className="mt-4 font-semibold text-[#e76d61]">
                          {formatPrice(
                            product.base_price ===
                              null
                              ? null
                              : Number(
                                  product.base_price
                                )
                          )}
                        </p>

                        <span className="mt-4 inline-flex text-sm font-semibold text-[#36594c]">
                          View product →
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-[#284239]/10 bg-white p-8 text-center shadow-sm">
            <p className="text-4xl">
              ♡
            </p>

            <h2 className="mt-4 font-serif text-2xl font-semibold text-[#153f32]">
              Nothing saved yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#607068]">
              Tap the heart on
              a product whenever
              something catches
              your eye. It&apos;ll
              appear here.
            </p>

            <Link
              href="/gifts"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
