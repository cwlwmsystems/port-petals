import { createClient } from "@/lib/supabase/server";

export type CandleVariant = {
  id: string;
  name: string;
  price: number | null;
  quantity: number | null;
  track_inventory: boolean;
  active: boolean;
};

export type CandleImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_primary: boolean;
  publicUrl: string;
};

export type CandleProduct = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  short_description: string | null;
  description: string | null;
  base_price: number | null;
  featured: boolean;
  track_inventory: boolean;
  quantity: number | null;
  made_to_order: boolean;
  customizable: boolean;
  ready_made: boolean;
  lead_time_days: number | null;
  pickup_available: boolean;
  delivery_available: boolean;
  variants: CandleVariant[];
  images: CandleImage[];
};

export async function getPublishedCandles(): Promise<CandleProduct[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      collection,
      short_description,
      description,
      base_price,
      featured,
      track_inventory,
      quantity,
      made_to_order,
      customizable,
      ready_made,
      lead_time_days,
      pickup_available,
      delivery_available,
      product_variants (
        id,
        name,
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
    .eq("category", "candles")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((product) => ({
    ...product,
    variants: (product.product_variants ?? []).filter(
      (variant) => variant.active
    ),
    images: (product.product_images ?? [])
      .map((image) => {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(image.storage_path);

        return {
          ...image,
          publicUrl: publicUrlData.publicUrl,
        };
      })
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary)),
  }));
}

export async function getPublishedCandleBySlug(
  slug: string
): Promise<CandleProduct | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      collection,
      short_description,
      description,
      base_price,
      featured,
      track_inventory,
      quantity,
      made_to_order,
      customizable,
      ready_made,
      lead_time_days,
      pickup_available,
      delivery_available,
      product_variants (
        id,
        name,
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
    .eq("category", "candles")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const variants = (data.product_variants ?? []).filter(
    (variant) => variant.active
  );

  const images = (data.product_images ?? [])
    .map((image) => {
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(image.storage_path);

      return {
        ...image,
        publicUrl: publicUrlData.publicUrl,
      };
    })
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary));

  return {
    ...data,
    variants,
    images,
  };
}
