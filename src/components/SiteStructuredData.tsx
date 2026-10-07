import JsonLd from "@/components/JsonLd";
import {
  absoluteUrl,
  siteConfig,
} from "@/lib/seo/site";

export default function SiteStructuredData() {
  const florist = {
    "@context":
      "https://schema.org",

    "@type":
      "Florist",

    "@id":
      `${siteConfig.url}/#business`,

    name:
      siteConfig.name,

    url:
      siteConfig.url,

    description:
      siteConfig.description,

    telephone:
      siteConfig.phone,

    email:
      siteConfig.email,

    image:
      absoluteUrl(
        "/port-petals-logo-transparent.png"
      ),

    logo:
      absoluteUrl(
        "/port-petals-logo-transparent.png"
      ),

    address: {
      "@type":
        "PostalAddress",

      streetAddress:
        siteConfig.address
          .streetAddress,

      addressLocality:
        siteConfig.address
          .addressLocality,

      addressRegion:
        siteConfig.address
          .addressRegion,

      postalCode:
        siteConfig.address
          .postalCode,

      addressCountry:
        siteConfig.address
          .addressCountry,
    },

    areaServed: {
      "@type":
        "City",

      name:
        "Port Allegany",
    },

    currenciesAccepted:
      "USD",

    paymentAccepted:
      "Credit Card",
  };

  const website = {
    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    "@id":
      `${siteConfig.url}/#website`,

    url:
      siteConfig.url,

    name:
      siteConfig.name,

    description:
      siteConfig.description,

    publisher: {
      "@id":
        `${siteConfig.url}/#business`,
    },

    inLanguage:
      "en-US",
  };

  return (
    <>
      <JsonLd
        data={florist}
      />

      <JsonLd
        data={website}
      />
    </>
  );
}
