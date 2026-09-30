import { createClient } from "@/lib/supabase/server";

export type ShirtVariant = {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number | null;
  quantity: number | null;
  track_inventory: boolean;
  active: boolean;
};

export type ShirtImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  is_primary: boolean;
  publicUrl: string;
};

export type ShirtProduct = {
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
  maker: string | null;
  pickup_available: boolean;
  delivery_available: boolean;
  variants: ShirtVariant[];
  images: ShirtImage[];
};

function mapProduct(
  supabase: Awaited<ReturnType<typeof createClient>>,
  product: any
): ShirtProduct {
  return {
    ...product,
    variants: (product.product_variants ?? []).filter(
      (variant: ShirtVariant) => variant.active
    ),
    images: (product.product_images ?? [])
      .map((image: Omit<ShirtImage, "publicUrl">) => {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(image.storage_path);

        return {
          ...image,
          publicUrl: data.publicUrl,
        };
      })
      .sort(
        (a: ShirtImage, b: ShirtImage) =>
          Number(b.is_primary) - Number(a.is_primary)
      ),
  };
}

export async function getPublishedShirts(): Promise<ShirtProduct[]> {
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
      maker,
      pickup_available,
      delivery_available,
      product_variants (
        id,
        name,
        size,
        color,
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
    .eq("category", "shirts")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((product) =>
    mapProduct(supabase, product)
  );
}

export async function getPublishedShirtBySlug(
  slug: string
): Promise<ShirtProduct | null> {
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
      maker,
      pickup_available,
      delivery_available,
      product_variants (
        id,
        name,
        size,
        color,
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
    .eq("category", "shirts")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapProduct(supabase, data);
}
