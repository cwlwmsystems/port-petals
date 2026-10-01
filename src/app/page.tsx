import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Fresh Flowers",
    description:
      "Thoughtful bouquets and seasonal arrangements for life's everyday moments.",
    href: "/flowers",
    tone: "from-[#f8d8d2] to-[#f5c7bf]",
    accent: "#df6255",
    icon: "✿",
    image: "/heroes/flowers.jpg",
  },
  {
    name: "Candles",
    description:
      "Cozy scents and handmade favorites for gifting, relaxing, and home.",
    href: "/candles",
    tone: "from-[#f7ead4] to-[#efd7b7]",
    accent: "#c88654",
    icon: "◈",
    image: "/heroes/candles.jpg",
  },
  {
    name: "Custom Items",
    description:
      "Personalized gifts made with your names, colors, ideas, and special occasions in mind.",
    href: "/custom",
    tone: "from-[#e4f0df] to-[#cfe4c7]",
    accent: "#629e61",
    icon: "✦",
    image: "/heroes/custom.jpg",
  },
  {
    name: "Shirts",
    description:
      "Fun, comfortable shirts with seasonal, local, and creative designs.",
    href: "/shirts",
    tone: "from-[#f4dde4] to-[#edc8d4]",
    accent: "#c96f8c",
    icon: "♡",
    image: "/heroes/shirts.jpg",
  },
  {
    name: "Gator Gear",
    description:
      "Port Allegany spirit wear and hometown apparel for Gator fans of all ages.",
    href: "/gators",
    tone: "from-[#dfead8] to-[#c7dfbe]",
    accent: "#426c49",
    icon: "★",
    image: "/heroes/gator-gear.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">

      <section className="relative isolate overflow-hidden bg-[#f7eadc]">
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_44%,#f2eadb_100%)]" />

        <div className="absolute -left-32 top-12 -z-20 h-[430px] w-[430px] rounded-full bg-[#efa99f]/40 blur-[95px]" />
        <div className="absolute right-[-120px] top-[-40px] -z-20 h-[520px] w-[520px] rounded-full bg-[#c9e2ba]/55 blur-[100px]" />
        <div className="absolute bottom-[-160px] left-[35%] -z-20 h-[420px] w-[420px] rounded-full bg-[#f5cabb]/45 blur-[105px]" />

        <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-5 pb-32 pt-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:pb-28 lg:pt-16">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#36594c]">
                Port Allegany, Pennsylvania
              </p>
              <span className="h-px w-12 bg-[#e76d61]" />
            </div>

            <h1 className="text-[3.6rem] font-semibold leading-[0.95] tracking-[-0.055em] text-[#143d31] sm:text-7xl lg:text-[5.2rem]">
              Flowers, gifts &
              <span className="mt-2 block font-serif italic font-normal text-[#e76d61]">
                a little bit of happy.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#40584f]">
              Fresh flowers, cozy candles, personalized gifts, shirts, and
              hometown Gator gear — thoughtfully made and selected in Port
              Allegany.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#e76d61]/20 transition hover:-translate-y-0.5 hover:bg-[#d95d52]"
              >
                Shop Port Petals →
              </a>

              <a
                href="/custom"
                className="inline-flex items-center justify-center rounded-full border border-[#e76d61] bg-white/60 px-7 py-3.5 font-semibold text-[#284239] backdrop-blur transition hover:bg-white"
              >
                Request Something Custom
              </a>
            </div>
          </div>

          <div className="relative hidden h-full min-h-[440px] items-center justify-center lg:flex">
            <div className="absolute right-0 top-3 h-[430px] w-[430px] rounded-full bg-white/28 blur-2xl" />
            <div className="absolute right-[3%] top-[8%] h-[390px] w-[390px] rounded-[45%_55%_48%_52%] bg-[#efaca4]/25 blur-xl" />
            <div className="absolute right-[13%] top-[14%] h-[330px] w-[330px] -rotate-6 rounded-[55%_45%_60%_40%] bg-[#bbe0ab]/28 blur-xl" />

            <div className="relative z-10 w-full max-w-[420px]">
              <Image
                src="/port-petals-logo-transparent.png"
                alt="Port Petals"
                width={520}
                height={400}
                priority
                className="h-auto w-full mix-blend-multiply drop-shadow-[0_20px_40px_rgba(48,61,49,0.10)]"
              />
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-[-1px] left-0 h-28 w-full bg-[#f7f1e8]"
          style={{
            clipPath:
              "polygon(0 55%, 8% 67%, 18% 76%, 29% 73%, 40% 61%, 51% 50%, 63% 52%, 75% 65%, 88% 76%, 100% 70%, 100% 100%, 0 100%)",
          }}
        />

        <div
          className="absolute bottom-[14px] left-0 h-20 w-full bg-[#f1b8ad]/35"
          style={{
            clipPath:
              "polygon(0 54%, 8% 66%, 18% 75%, 29% 72%, 40% 60%, 51% 49%, 63% 51%, 75% 64%, 88% 75%, 100% 69%, 100% 80%, 88% 86%, 75% 76%, 63% 63%, 51% 61%, 40% 72%, 29% 84%, 18% 87%, 8% 78%, 0 66%)",
          }}
        />
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-10">
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#e76d61]" />
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Shop Our Collections
            </p>
            <span className="h-px w-12 bg-[#e76d61]" />
          </div>

          <h2 className="font-serif text-4xl font-semibold tracking-[-0.03em] text-[#163f32] sm:text-5xl">
            Something for Every Occasion
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#617068]">
            Explore Port Petals favorites, from fresh arrangements to custom
            creations and hometown apparel.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => (
            <a
              key={category.name}
              id={category.href.slice(1)}
              href={category.href}
              className="group overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/40 shadow-[0_12px_35px_rgba(42,66,57,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(42,66,57,0.14)]"
            >
              <div
                className={`relative h-52 overflow-hidden bg-gradient-to-br ${category.tone}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.85),transparent_34%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,.38),transparent_42%)]" />

                <div className="absolute -left-8 top-6 h-32 w-32 rounded-full bg-white/35 blur-2xl" />
                <div className="absolute -right-10 bottom-2 h-36 w-36 rounded-full bg-white/25 blur-2xl" />

                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="select-none text-7xl opacity-35 transition duration-300 group-hover:scale-110"
                      style={{ color: category.accent }}
                    >
                      {category.icon}
                    </span>
                  </div>
                )}

                <div
                  className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm"
                  style={{ color: category.accent }}
                >
                  {category.icon}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-[1.35rem] font-semibold leading-tight text-[#193f34]">
                  {category.name}
                </h3>

                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-[#596a62]">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: category.accent }}
                  >
                    Shop collection
                  </span>

                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-lg shadow-sm transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </main>
  );
}
