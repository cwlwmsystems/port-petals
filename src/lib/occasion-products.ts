import { createClient } from "@/lib/supabase/server";
import {
  type OccasionDefinition,
  productMatchesOccasion,
} from "@/lib/occasions";

export type OccasionVariant = {
  id: string;
  price: number | null;
  quantity: number | null;
  track_inventory: boolean;
  active: boolean;
};

export type OccasionImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_primary: boolean;
  publicUrl: string;
};

export type OccasionProduct = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  department: string | null;
  product_type: string | null;
  collection: string | null;
  short_description: string | null;
  base_price: number | null;
  featured: boolean;
  track_inventory: boolean;
  quantity: number | null;
  made_to_order: boolean;
  customizable: boolean;
  ready_made: boolean;
  lead_time_days: number | null;
  maker: string | null;
  variants: OccasionVariant[];
  images: OccasionImage[];
};

export async function getPublishedProductsForOccasion(
  occasion: OccasionDefinition
): Promise<OccasionProduct[]> {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        category,
        department,
        product_type,
        collection,
        short_description,
        base_price,
        featured,
        track_inventory,
        quantity,
        made_to_order,
        customizable,
        ready_made,
        lead_time_days,
        maker,
        product_variants (
          id,
          price,
          quantity,
          track_inventory,
          active
        ),
        product_images (
          id,
          storage_path,
          alt_text,
          is_primary
        )
      `)
      .in(
        "department",
        [
          "flowers",
          "gifts-decor",
          "apparel",
          "gator-gear",
          "seasonal",
        ]
      )
      .eq(
        "status",
        "published"
      )
      .order(
        "featured",
        {
          ascending: false,
        }
      )
      .order(
        "updated_at",
        {
          ascending: false,
        }
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (data ?? [])
    .map(
      (product: any) => {
        const images = (
          product.product_images ??
          []
        )
          .map(
            (
              image: Omit<
                OccasionImage,
                "publicUrl"
              >
            ) => {
              const { data } =
                supabase.storage
                  .from(
                    "product-images"
                  )
                  .getPublicUrl(
                    image.storage_path
                  );

              return {
                ...image,
                publicUrl:
                  data.publicUrl,
              };
            }
          )
          .sort(
            (
              a: OccasionImage,
              b: OccasionImage
            ) =>
              Number(
                b.is_primary
              ) -
              Number(
                a.is_primary
              )
          );

        return {
          ...product,
          variants: (
            product.product_variants ??
            []
          ).filter(
            (
              variant: OccasionVariant
            ) =>
              variant.active
          ),
          images,
        } as OccasionProduct;
      }
    )
    .filter(
      (product) =>
        productMatchesOccasion(
          product,
          occasion
        )
    );
}
