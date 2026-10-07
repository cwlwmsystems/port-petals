import type {
  MetadataRoute,
} from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    "https://www.portpetals.com";

  return {
    rules: {
      userAgent: "*",

      allow: "/",

      disallow: [
        "/admin/",
        "/account/",
        "/cart",
        "/checkout",
        "/payment/",
        "/unsubscribe",
        "/api/",
      ],
    },

    sitemap:
      `${baseUrl}/sitemap.xml`,

    host:
      baseUrl,
  };
}
