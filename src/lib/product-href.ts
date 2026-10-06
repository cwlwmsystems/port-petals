type ProductHrefInput = {
  slug: string;
  category?: string | null;
  department?: string | null;
};

export function getProductHref(
  product: ProductHrefInput
) {
  switch (product.category) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "candles":
      return `/candles/${product.slug}`;

    case "shirts":
      return `/shirts/${product.slug}`;

    case "gators":
      return `/gators/${product.slug}`;

    case "custom":
      return `/custom/${product.slug}`;
  }

  switch (product.department) {
    case "flowers":
      return `/flowers/${product.slug}`;

    case "apparel":
      return `/shirts/${product.slug}`;

    case "gator-gear":
      return `/gators/${product.slug}`;

    default:
      return `/custom/${product.slug}`;
  }
}
