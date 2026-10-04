import type { MetadataRoute } from "next";
import { getPublishedFlowers } from "@/lib/flowers";
import { getPublishedCandles } from "@/lib/candles";
import { getPublishedCustomItems } from "@/lib/custom-items";
import { getPublishedShirts } from "@/lib/shirts";
import { getPublishedGatorGear } from "@/lib/gators";

const baseUrl = "https://www.portpetals.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/flowers`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gifts`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apparel`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gators`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seasonal`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/weddings`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    /*
     * Legacy category storefronts remain indexed because their
     * product-detail routes are still active and customer-facing.
     */
    {
      url: `${baseUrl}/candles`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/custom`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shirts`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/fulfillment`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/custom/request`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/journal`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/journal/seasonal-ideas`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/journal/flower-care`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/journal/gift-guides`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/journal/shop-news`,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const productPages: MetadataRoute.Sitemap = [
    ...flowers.map((product) => ({
      url: `${baseUrl}/flowers/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...candles.map((product) => ({
      url: `${baseUrl}/candles/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...customItems.map((product) => ({
      url: `${baseUrl}/custom/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...shirts.map((product) => ({
      url: `${baseUrl}/shirts/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...gators.map((product) => ({
      url: `${baseUrl}/gators/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...productPages];
}
