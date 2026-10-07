import Image from "next/image";
import Link from "next/link";

type SeasonalFeature = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  background: string;
  accent: string;
  primary: {
    label: string;
    href: string;
  };
  secondary: {
    label: string;
    href: string;
  };
  cards: {
    icon: string;
    title: string;
    description: string;
    label: string;
    href: string;
  }[];
};

type EasternDate = {
  year: number;
  month: number;
  day: number;
};

function getEasternDate(date = new Date()): EasternDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  return {
    year: Number(
      parts.find((part) => part.type === "year")?.value
    ),
    month: Number(
      parts.find((part) => part.type === "month")?.value
    ),
    day: Number(
      parts.find((part) => part.type === "day")?.value
    ),
  };
}

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  occurrence: number
) {
  const first = new Date(
    Date.UTC(year, month - 1, 1)
  );

  const firstWeekday = first.getUTCDay();

  return (
    1 +
    ((7 + weekday - firstWeekday) % 7) +
    (occurrence - 1) * 7
  );
}

function getEasterDate(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h =
    (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l =
    (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor(
    (a + 11 * h + 22 * l) / 451
  );

  const month = Math.floor(
    (h + l - 7 * m + 114) / 31
  );

  const day =
    ((h + l - 7 * m + 114) % 31) + 1;

  return { month, day };
}

function dateValue(month: number, day: number) {
  return month * 100 + day;
}

function getSeasonalFeature(
  current: EasternDate
): SeasonalFeature {
  const { year, month, day } = current;
  const today = dateValue(month, day);

  const easter = getEasterDate(year);

  const mothersDay = nthWeekdayOfMonth(
    year,
    5,
    0,
    2
  );

  const thanksgiving = nthWeekdayOfMonth(
    year,
    11,
    4,
    4
  );

  const valentine: SeasonalFeature = {
    eyebrow: "Valentine's Day at Port Petals",
    title: "Something beautiful for someone special.",
    description:
      "Celebrate Valentine's Day with flowers, thoughtful gifts, candles, personalized creations, and something made especially for the people you love.",
    note:
      "Seasonal selections can change as Valentine's Day approaches, so check back for the latest Port Petals favorites.",
    background: "bg-[#8f3f4d]",
    accent: "text-[#ffd2d9]",
    primary: {
      label: "Shop Valentine's Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Gifts",
      href: "/custom",
    },
    cards: [
      {
        icon: "♥",
        title: "Flowers for Someone Special",
        description:
          "Find fresh arrangements and bouquets for Valentine's Day and heartfelt surprises.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "✦",
        title: "Personalized Gifts",
        description:
          "Add a personal touch with gifts and custom creations made with someone special in mind.",
        label: "Browse Custom Items →",
        href: "/custom",
      },
      {
        icon: "◈",
        title: "Candles & Small Gifts",
        description:
          "Pair flowers with cozy candle favorites and simple gifts for an extra-special touch.",
        label: "Shop Candles →",
        href: "/candles",
      },
    ],
  };

  const spring: SeasonalFeature = {
    eyebrow: "Spring at Port Petals",
    title: "Fresh color for a brand-new season.",
    description:
      "Welcome spring with fresh flowers, Easter-inspired gifts, cheerful crafts, candles, and colorful creations for your home or someone special.",
    note:
      "Spring selections change throughout the season as new flowers and creations become available.",
    background: "bg-[#486a50]",
    accent: "text-[#d6efc8]",
    primary: {
      label: "Shop Spring Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Spring Gifts",
      href: "/custom",
    },
    cards: [
      {
        icon: "✿",
        title: "Spring Flowers",
        description:
          "Bright arrangements and bouquets for Easter, celebrations, and everyday spring moments.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "✦",
        title: "Seasonal Creations",
        description:
          "Discover handmade decor, gifts, and personalized pieces inspired by the season.",
        label: "Browse Custom Items →",
        href: "/custom",
      },
      {
        icon: "◈",
        title: "Fresh Seasonal Scents",
        description:
          "Bring a little spring indoors with candle favorites and giftable scents.",
        label: "Shop Candles →",
        href: "/candles",
      },
    ],
  };

  const mothersDayFeature: SeasonalFeature = {
    eyebrow: "Mother's Day at Port Petals",
    title: "Made for the moms who mean everything.",
    description:
      "Make Mother's Day special with fresh flowers, thoughtful gifts, candles, and personalized creations from Port Petals.",
    note:
      "Mother's Day favorites may be limited as the holiday approaches. Browse early for the best selection.",
    background: "bg-[#74566b]",
    accent: "text-[#f7cfda]",
    primary: {
      label: "Shop Mother's Day Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Gifts for Mom",
      href: "/custom",
    },
    cards: [
      {
        icon: "✿",
        title: "Flowers for Mom",
        description:
          "Thoughtful arrangements and bouquets for Mother's Day.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "♥",
        title: "Personalized Gifts",
        description:
          "Choose something personal and memorable made especially for Mom.",
        label: "Browse Gifts →",
        href: "/custom",
      },
      {
        icon: "◈",
        title: "Candles & Extras",
        description:
          "Add a cozy candle or small gift to make her day even more special.",
        label: "Shop Candles →",
        href: "/candles",
      },
    ],
  };

  const graduation: SeasonalFeature = {
    eyebrow: "Graduation Season",
    title: "Celebrate everything they accomplished.",
    description:
      "Mark graduation season with flowers, personalized keepsakes, shirts, and Port Allegany Gator favorites for the graduates you're proud of.",
    note:
      "Custom graduation items may require additional preparation time, so ordering early is encouraged.",
    background: "bg-[#284239]",
    accent: "text-[#a8e69a]",
    primary: {
      label: "Shop Graduation Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Personalized Gifts",
      href: "/custom",
    },
    cards: [
      {
        icon: "✿",
        title: "Graduation Flowers",
        description:
          "Celebrate the graduate with a fresh bouquet or arrangement.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "✦",
        title: "Keepsakes & Gifts",
        description:
          "Personalized creations can help make graduation memories last.",
        label: "Browse Custom Items →",
        href: "/custom",
      },
      {
        icon: "★",
        title: "Gator Pride",
        description:
          "Celebrate Port Allegany graduates with hometown apparel and Gator Gear.",
        label: "Shop Gator Gear →",
        href: "/gators",
      },
    ],
  };

  const summer: SeasonalFeature = {
    eyebrow: "Summer at Port Petals",
    title: "Bright, cheerful & made for summer.",
    description:
      "Shop colorful flowers, gifts, shirts, candles, and creative favorites for summer birthdays, gatherings, celebrations, and everyday moments.",
    note:
      "Check back throughout the summer as seasonal products and featured creations change.",
    background: "bg-[#557563]",
    accent: "text-[#e8efb8]",
    primary: {
      label: "Shop Summer Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Summer Favorites",
      href: "/custom",
    },
    cards: [
      {
        icon: "✿",
        title: "Bright Flowers",
        description:
          "Fresh color for birthdays, gatherings, celebrations, or just because.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "♡",
        title: "Summer Shirts",
        description:
          "Browse fun shirts and creative designs for the season.",
        label: "Shop Shirts →",
        href: "/apparel",
      },
      {
        icon: "✦",
        title: "Custom Summer Gifts",
        description:
          "Find personalized pieces and handmade creations for summertime occasions.",
        label: "Browse Custom Items →",
        href: "/custom",
      },
    ],
  };

  const gatorSeason: SeasonalFeature = {
    eyebrow: "Back to School & Gator Season",
    title: "Show your Port Allegany pride.",
    description:
      "Get ready for school, sports, and hometown events with Gator Gear, personalized items, shirts, flowers, and gifts from Port Petals.",
    note:
      "New school-spirit and seasonal items may be added throughout the season.",
    background: "bg-[#254f38]",
    accent: "text-[#a8e69a]",
    primary: {
      label: "Shop Gator Gear →",
      href: "/gators",
    },
    secondary: {
      label: "Browse Shirts",
      href: "/apparel",
    },
    cards: [
      {
        icon: "★",
        title: "Gator Gear",
        description:
          "Hometown apparel, accessories, and personalized gear for Port Allegany fans.",
        label: "Shop Gator Gear →",
        href: "/gators",
      },
      {
        icon: "♡",
        title: "School Spirit Shirts",
        description:
          "Find shirts and designs for games, events, and everyday Gator pride.",
        label: "Shop Shirts →",
        href: "/apparel",
      },
      {
        icon: "✦",
        title: "Personalized Favorites",
        description:
          "Make school spirit personal with names, numbers, and custom creations.",
        label: "Browse Custom Items →",
        href: "/custom",
      },
    ],
  };

  const fall: SeasonalFeature = {
    eyebrow: "Homecoming • Football • Gator Season",
    title: "Homecoming flowers & hometown pride.",
    description:
      "It's football season in Port Allegany. Celebrate Homecoming, Friday nights, and everything Gator with flowers, spirit wear, personalized gear, gifts, and seasonal Port Petals favorites.",
    note:
      "Homecoming flowers and seasonal favorites may be limited as event dates approach, so ordering early is encouraged.",
    background: "bg-[#151515]",
    accent: "text-[#ff7315]",
    primary: {
      label: "Shop Homecoming Flowers →",
      href: "/flowers#prom-homecoming",
    },
    secondary: {
      label: "Shop Gator Gear",
      href: "/gators",
    },
    cards: [
      {
        icon: "✿",
        title: "Homecoming Flowers",
        description:
          "Corsages, boutonnieres, matching sets, bouquets, and flowers for a memorable Homecoming.",
        label: "Shop Homecoming Flowers →",
        href: "/flowers#prom-homecoming",
      },
      {
        icon: "★",
        title: "Gator Pride",
        description:
          "Get game-day ready with Port Allegany Gator apparel, accessories, and personalized spirit gear.",
        label: "Shop Gator Gear →",
        href: "/gators",
      },
      {
        icon: "✦",
        title: "Fall Favorites",
        description:
          "Shop fall crafts, personalized gifts, candles, decor, and other seasonal Port Petals favorites.",
        label: "Browse Fall Favorites →",
        href: "/custom",
      },
    ],
  };

  const thanksgivingFeature: SeasonalFeature = {
    eyebrow: "Thanksgiving at Port Petals",
    title: "A little something for the people you're thankful for.",
    description:
      "Bring something beautiful to the table or show your appreciation with seasonal flowers, candles, gifts, and handmade Port Petals favorites.",
    note:
      "Thanksgiving selections may be limited as the holiday approaches.",
    background: "bg-[#78513d]",
    accent: "text-[#f2c99d]",
    primary: {
      label: "Shop Thanksgiving Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Hostess Gifts",
      href: "/custom",
    },
    cards: [
      {
        icon: "✿",
        title: "Flowers for the Table",
        description:
          "Add a fresh seasonal touch to Thanksgiving gatherings and celebrations.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "◈",
        title: "Easy Gifts",
        description:
          "Candles make a thoughtful little thank-you for hosts, friends, and family.",
        label: "Shop Candles →",
        href: "/candles",
      },
      {
        icon: "✦",
        title: "Made with Meaning",
        description:
          "Browse personalized and handmade gifts for someone you're especially thankful for.",
        label: "Browse Custom Items →",
        href: "/custom",
      },
    ],
  };

  const christmas: SeasonalFeature = {
    eyebrow: "Christmas at Port Petals",
    title: "Thoughtful gifts with a little holiday magic.",
    description:
      "Find flowers, candles, personalized gifts, festive shirts, handmade creations, and hometown favorites for everyone on your Christmas list.",
    note:
      "Custom and made-to-order gifts may need additional preparation time during the holiday season.",
    background: "bg-[#274b3a]",
    accent: "text-[#dce8bd]",
    primary: {
      label: "Shop Christmas Gifts →",
      href: "/custom",
    },
    secondary: {
      label: "Shop Holiday Flowers",
      href: "/flowers",
    },
    cards: [
      {
        icon: "✦",
        title: "Personalized Gifts",
        description:
          "Give something meaningful with custom and handmade Port Petals creations.",
        label: "Browse Gifts →",
        href: "/custom",
      },
      {
        icon: "✿",
        title: "Holiday Flowers",
        description:
          "Bring festive color to gatherings, gifts, and holiday tables.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "◈",
        title: "Candles & Stocking Stuffers",
        description:
          "Cozy scents and smaller gifts make holiday shopping a little easier.",
        label: "Shop Candles →",
        href: "/candles",
      },
    ],
  };

  const winter: SeasonalFeature = {
    eyebrow: "Winter at Port Petals",
    title: "A fresh start & something thoughtful.",
    description:
      "Brighten the winter months with flowers, candles, personalized gifts, shirts, and handmade favorites from Port Petals.",
    note:
      "New seasonal favorites will continue to arrive as Valentine's Day approaches.",
    background: "bg-[#49636a]",
    accent: "text-[#d9ecec]",
    primary: {
      label: "Shop Flowers →",
      href: "/flowers",
    },
    secondary: {
      label: "Browse Gifts",
      href: "/custom",
    },
    cards: [
      {
        icon: "✿",
        title: "Fresh Flowers",
        description:
          "Add some color to winter with fresh bouquets and arrangements.",
        label: "Shop Flowers →",
        href: "/flowers",
      },
      {
        icon: "◈",
        title: "Cozy Candles",
        description:
          "Warm scents and candle favorites for cold winter days.",
        label: "Shop Candles →",
        href: "/candles",
      },
      {
        icon: "✦",
        title: "Thoughtful Gifts",
        description:
          "Browse personalized and handmade items for birthdays and everyday gifting.",
        label: "Browse Gifts →",
        href: "/custom",
      },
    ],
  };

  if (today >= 115 && today <= 214) {
    return valentine;
  }

  const easterValue = dateValue(
    easter.month,
    easter.day
  );

  if (
    today >= 215 &&
    today <= Math.max(331, easterValue)
  ) {
    return spring;
  }

  if (
    today >= 401 &&
    today <= dateValue(5, mothersDay)
  ) {
    return mothersDayFeature;
  }

  if (
    today > dateValue(5, mothersDay) &&
    today <= 630
  ) {
    return graduation;
  }

  if (today >= 701 && today <= 815) {
    return summer;
  }

  if (today >= 816 && today <= 930) {
    return gatorSeason;
  }

  if (today >= 1001 && today <= 1031) {
    return fall;
  }

  if (
    today >= 1101 &&
    today <= dateValue(11, thanksgiving)
  ) {
    return thanksgivingFeature;
  }

  if (
    today > dateValue(11, thanksgiving) &&
    today <= 1225
  ) {
    return christmas;
  }

  return winter;
}

export default function SeasonalCallout() {
  const easternDate =
    getEasternDate();

  const feature =
    getSeasonalFeature(
      easternDate
    );

  const isOctober =
    easternDate.month === 10;

  return (
    <section
      className={`relative overflow-hidden ${feature.background} text-[#fffaf3]`}
    >
      {isOctober ? (
        <>
          {/* Gator-season background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_25%,rgba(255,115,21,.24),transparent_30%),radial-gradient(circle_at_82%_55%,rgba(255,115,21,.12),transparent_34%)]" />

          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] overflow-hidden lg:block">
            <Image
              src="/port-gators.jpeg"
              alt=""
              fill
              aria-hidden="true"
              sizes="58vw"
              className="scale-[1.08] object-contain object-right opacity-[0.13] mix-blend-screen grayscale-[15%]"
            />
          </div>

          <div className="pointer-events-none absolute right-[4%] top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#ff7315]/10 blur-[120px] lg:block" />

          <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ff7315]" />

          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#ff7315]/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,.08),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(255,255,255,.06),transparent_32%)]" />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.28em] ${feature.accent}`}
            >
              {feature.eyebrow}
            </p>

            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              {feature.title}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              {feature.description}
            </p>

            <p className="mt-4 max-w-2xl leading-7 text-white/65">
              {feature.note}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={feature.primary.href}
                className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 ${
                  isOctober
                    ? "bg-[#ff7315] hover:bg-[#e7640c]"
                    : "bg-[#e76d61] hover:bg-[#d95d52]"
                }`}
              >
                {feature.primary.label}
              </Link>

              <Link
                href={feature.secondary.href}
                className={`inline-flex items-center justify-center rounded-full border px-7 py-3.5 font-semibold text-white backdrop-blur transition ${
                  isOctober
                    ? "border-[#ff7315]/60 bg-[#ff7315]/10 hover:bg-[#ff7315]/20"
                    : "border-white/20 bg-white/10 hover:bg-white/15"
                }`}
              >
                {feature.secondary.label}
              </Link>
            </div>
          </div>

          <div>
            <div className="grid gap-4">
              {feature.cards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`group rounded-[1.6rem] border p-6 backdrop-blur transition hover:-translate-y-1 ${
                    isOctober
                      ? "border-[#ff7315]/20 bg-white/[0.07] hover:border-[#ff7315]/45 hover:bg-white/[0.10]"
                      : "border-white/10 bg-white/10 hover:bg-white/15"
                  }`}
                >
                  <div className="flex gap-5">
                    <span
                      className={`text-3xl ${
                        isOctober
                          ? "text-[#ff7315]"
                          : ""
                      }`}
                    >
                      {card.icon}
                    </span>

                    <div>
                      <h3 className="font-serif text-2xl font-semibold">
                        {card.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {card.description}
                      </p>

                      <span
                        className={`mt-4 inline-flex text-sm font-semibold ${feature.accent}`}
                      >
                        {card.label}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
