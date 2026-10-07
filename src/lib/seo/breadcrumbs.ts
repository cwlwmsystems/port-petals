import { absoluteUrl } from "@/lib/seo/site";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbStructuredData(
  items: BreadcrumbItem[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: items.map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })
    ),
  };
}
