export const siteConfig = {
  name: "Port Petals",

  url:
    "https://www.portpetals.com",

  description:
    "Port Petals is a local flower, gift, apparel, and custom creation shop in Port Allegany, Pennsylvania offering fresh flowers, gifts, wedding florals, seasonal favorites, custom apparel, and Port Allegany Gator gear.",

  email:
    "stacy@portpetals.com",

  phone:
    "+18146421253",

  phoneDisplay:
    "814-642-1253",

  address: {
    streetAddress:
      "430 E Arnold Avenue",

    addressLocality:
      "Port Allegany",

    addressRegion:
      "PA",

    postalCode:
      "16743",

    addressCountry:
      "US",
  },
} as const;

export function absoluteUrl(
  path = ""
) {
  if (
    path.startsWith(
      "http://"
    ) ||
    path.startsWith(
      "https://"
    )
  ) {
    return path;
  }

  if (!path) {
    return siteConfig.url;
  }

  return `${siteConfig.url}${
    path.startsWith("/")
      ? path
      : `/${path}`
  }`;
}
