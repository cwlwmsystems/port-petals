import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbStructuredData } from "@/lib/seo/breadcrumbs";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gift Guide | Flowers, Candles, Custom Gifts & Gator Gear",
  description:
    "Find thoughtful gift ideas from Port Petals in Port Allegany, Pennsylvania, including flowers, candles, custom creations, shirts, and hometown Gator gear.",
};

const occasionCards = [
  {
    title: "Birthday",
    description:
      "Bright flowers, candles, personalized gifts, or a favorite-color custom creation can make a birthday feel much more personal.",
    href: "/flowers",
    cta: "Browse Birthday Ideas",
  },
  {
    title: "Thank You",
    description:
      "A small bouquet, candle, or custom gift can be a simple way to show appreciation without overcomplicating it.",
    href: "/candles",
    cta: "Find a Thank-You Gift",
  },
  {
    title: "Congratulations",
    description:
      "Celebrate graduations, promotions, new jobs, awards, team achievements, and other milestones with flowers or a personalized keepsake.",
    href: "/custom",
    cta: "Shop Celebration Gifts",
  },
  {
    title: "Thinking of You",
    description:
      "Flowers, a cozy candle, or a small local gift can be a thoughtful way to let someone know they are on your mind.",
    href: "/flowers",
    cta: "Send Something Thoughtful",
  },
  {
    title: "School Spirit",
    description:
      "Port Allegany Gator gear, personalized shirts, signs, and hometown gifts are ideal for athletes, students, families, and fans.",
    href: "/gators",
    cta: "Shop Gator Gifts",
  },
  {
    title: "Something One-of-a-Kind",
    description:
      "If the right gift does not already exist, Port Petals can help create something around a name, theme, color, activity, or occasion.",
    href: "/custom/request",
    cta: "Start a Custom Request",
  },
];


const breadcrumbStructuredData =
  buildBreadcrumbStructuredData([
      {
        name: "Home",
        path: "/",
      },
      {
        name: "Journal",
        path: "/journal",
      },
      {
        name: "Gift Guides",
        path: "/journal/gift-guides",
      },
  ]);

export default function GiftGuidesPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <JsonLd data={breadcrumbStructuredData} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-18">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Port Petals Journal
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Thoughtful gifts should feel personal.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#52655d]">
              Start with the person, the occasion, or the feeling you want the
              gift to create. Port Petals offers flowers, candles, custom
              creations, shirts, and hometown gifts that can be mixed and
              matched for something more meaningful.
            </p>

            <p className="mt-4 max-w-2xl leading-7 text-[#607068]">
              This guide is designed to help when you know you want to give
              something special but are not quite sure where to start.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/collections/fresh-flowers.jpg"
                alt="Fresh flowers from Port Petals"
                fill
                priority
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/collections/candles.jpg"
                alt="Candles from Port Petals"
                fill
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/collections/customized-items.jpg"
                alt="Custom creations from Port Petals"
                fill
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="relative h-[210px] overflow-hidden rounded-[1.7rem] shadow-md">
              <Image
                src="/collections/gators.jpg"
                alt="Port Allegany Gator gifts from Port Petals"
                fill
                sizes="(max-width: 1023px) 50vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Start here */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] bg-[#284239] p-8 text-[#fffaf3] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
            Not Sure What to Buy?
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Start with these four questions.
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Who is it for?", "Think about their personality, hobbies, style, and interests."],
              ["What is the occasion?", "Birthday, thank-you, celebration, sympathy, school event, or just because."],
              ["How personal should it be?", "Ready-made gifts are easy; custom items can make the gift more specific."],
              ["What is your budget?", "A thoughtful gift does not have to be large to feel meaningful."],
            ].map(([title, description], index) => (
              <article
                key={title}
                className="rounded-[1.3rem] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e76d61] text-xs font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-4 font-serif text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#e7dedc]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* By occasion */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Shop by Occasion
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
          Match the gift to the moment.
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {occasionCards.map((item) => (
            <article
              key={item.title}
              className="flex flex-col rounded-[1.7rem] border border-[#284239]/10 bg-white/70 p-7 shadow-sm"
            >
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                {item.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-[#607068]">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="mt-6 inline-flex text-sm font-semibold text-[#284239] transition hover:text-[#e76d61]"
              >
                {item.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Gift personality */}
      <section className="bg-[#edf3e7]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#36594c]">
            Shop by Personality
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Think about what they naturally enjoy.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "The Flower Lover",
                "A fresh bouquet or arrangement is the natural place to start.",
                "/flowers",
              ],
              [
                "The Homebody",
                "Candles and cozy home gifts work well for someone who loves a comfortable space.",
                "/candles",
              ],
              [
                "The Hometown Fan",
                "Port Allegany Gator gear makes a strong local gift for students, families, athletes, and alumni.",
                "/gators",
              ],
              [
                "The Person Who Has Everything",
                "A customized or personalized piece gives you more room to create something they do not already own.",
                "/custom",
              ],
            ].map(([title, description, href]) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[1.6rem] border border-[#284239]/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:border-[#e76d61]/25"
              >
                <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#607068]">
                  {description}
                </p>

                <span className="mt-5 inline-flex text-sm font-semibold text-[#284239] transition group-hover:text-[#e76d61]">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pairing ideas */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
              Build a Better Gift
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              Pairing two simple things can make the gift feel more complete.
            </h2>

            <p className="mt-5 leading-7 text-[#607068]">
              You do not always need one large item. A small combination often
              feels more intentional and gives the recipient more to enjoy.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              [
                "Flowers + Candle",
                "A classic combination for birthdays, thank-you gifts, housewarmings, and thinking-of-you moments.",
              ],
              [
                "Gator Gear + Personalized Item",
                "A strong choice for senior nights, athletes, coaches, school events, and hometown celebrations.",
              ],
              [
                "Flowers + Custom Keepsake",
                "Pairs something beautiful for today with something the recipient can keep.",
              ],
              [
                "Shirt + Gator Gift",
                "Works well for students, parents, grandparents, alumni, and dedicated Port Allegany fans.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-[#284239]/10 bg-white/75 p-6"
              >
                <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Budget guide */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#284239]/10 bg-[#faefe5] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Gift Planning
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Let the budget guide the size, not the thoughtfulness.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                Small Gesture
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#607068]">
                Candles, small floral pieces, simple custom items, and local
                gifts can still feel thoughtful without becoming a large
                purchase.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                Something Special
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#607068]">
                A larger arrangement, shirt, personalized product, or paired
                gift works well when the occasion deserves a little more.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/70 p-6">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                One-of-a-Kind
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#607068]">
                For major milestones or very specific ideas, a custom order can
                be designed around the recipient and your approximate budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local gifts */}
      <section className="bg-[#284239] text-[#fffaf3]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a8e69a]">
              Local & Hometown Gifts
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold">
              Sometimes the best gift is something that feels like home.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#e7dedc]">
              Port Allegany school spirit, local colors, personalized names and
              numbers, and hometown-themed products can make especially
              meaningful gifts for students, parents, grandparents, alumni,
              coaches, and fans.
            </p>

            <Link
              href="/gators"
              className="mt-6 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Shop Gator Gear
            </Link>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src="/collections/gators.jpg"
              alt="Port Allegany Gator gifts"
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Decision helper */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          Quick Decision Guide
        </p>

        <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
          Still deciding?
        </h2>

        <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white/70">
          {[
            ["I want something beautiful and classic.", "Start with flowers.", "/flowers"],
            ["I want something cozy and easy.", "Browse candles.", "/candles"],
            ["I want something personal.", "Look at custom creations.", "/custom"],
            ["I want something wearable.", "Browse shirts.", "/shirts"],
            ["I want something local.", "Shop Port Allegany Gator gear.", "/gators"],
            ["I have a very specific idea.", "Start a custom request.", "/custom/request"],
          ].map(([question, answer, href], index) => (
            <div
              key={question}
              className={`grid gap-3 p-6 md:grid-cols-[1fr_1fr_auto] md:items-center ${
                index !== 0 ? "border-t border-[#284239]/10" : ""
              }`}
            >
              <p className="font-semibold text-[#153f32]">{question}</p>

              <p className="text-sm text-[#607068]">{answer}</p>

              <Link
                href={href}
                className="text-sm font-semibold text-[#284239] transition hover:text-[#e76d61]"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Custom CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#e76d61]/15 bg-[#faefe5] p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
            Need Help Choosing?
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
            Tell Port Petals who you are shopping for.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607068]">
            If you have an occasion, personality, theme, color, school
            activity, or budget in mind but are not sure what to choose, reach
            out and we can help narrow down the options.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/custom/request"
              className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
            >
              Start a Custom Request
            </Link>

            <a
              href="tel:+18146421253"
              className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-6 py-3 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
            >
              Call 814-642-1253
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
