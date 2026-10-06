import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import AccountNavigation from "@/components/account/AccountNavigation";
import WishlistButton from "@/components/WishlistButton";
import { getProductHref } from "@/lib/product-href";
import { createClient } from "@/lib/supabase/server";

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

  if (
    productIds.length >
    0
  ) {
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
      <section className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-12 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          My Port Petals
        </p>

        <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#153f32] sm:text-5xl">
              Wishlist
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#607068] sm:text-base">
              Keep flowers, gifts,
              apparel, and other Port
              Petals favorites together
              until you&apos;re ready for
              them.
            </p>
          </div>

          <div className="rounded-2xl bg-[#153f32] px-5 py-4 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f4b0a8]">
              Saved Items
            </p>

            <p className="mt-1 font-serif text-3xl font-semibold">
              {
                products.length
              }
            </p>
          </div>
        </div>
      </section>

      <AccountNavigation />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        {products.length >
        0 ? (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
                  Saved Favorites
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-[#153f32]">
                  Things you love
                </h2>
              </div>

              <p className="text-sm text-[#607068]">
                Tap the heart to remove
                an item from your
                wishlist.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    image
                      ?.storage_path
                      ? supabase.storage
                          .from(
                            "product-images"
                          )
                          .getPublicUrl(
                            image
                              .storage_path
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
                      className="group relative overflow-hidden rounded-[2rem] border border-[#284239]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#e76d61]/20 hover:shadow-md"
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
                        <div className="relative h-64 bg-[#faf7f1]">
                          <Image
                            src={
                              imageUrl
                            }
                            alt={
                              image
                                ?.alt_text ??
                              product.name
                            }
                            fill
                            unoptimized
                            className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
                          />
                        </div>

                        <div className="p-5">
                          {(product.category ||
                            product.department) && (
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e76d61]">
                              {product.category ??
                                product.department}
                            </p>
                          )}

                          <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
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

                          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#284239]/10 pt-4">
                            <p className="font-semibold text-[#e76d61]">
                              {formatPrice(
                                product.base_price ===
                                  null
                                  ? null
                                  : Number(
                                      product.base_price
                                    )
                              )}
                            </p>

                            <span className="text-sm font-semibold text-[#31583b]">
                              View →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                }
              )}
            </div>
          </>
        ) : (
          <section className="rounded-[2rem] border border-[#284239]/10 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf0f1] text-2xl text-[#a74f59]">
              ♡
            </div>

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#153f32]">
              Nothing saved yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#607068]">
              Tap the heart on any
              product that catches your
              eye and it will appear here
              for later.
            </p>

            <Link
              href="/gifts"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#153f32] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Browse Products
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
