import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type GuideItem = {
  label: string;
  href: string;
};

type RelatedArticle = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
};

type JournalFeatureLayoutProps = {
  category: string;
  title: string;
  introduction: string;
  imageSrc: string;
  imageAlt: string;
  publishedDate: string;
  readingTime: string;
  guideItems: GuideItem[];
  relatedArticles?: RelatedArticle[];
  children: ReactNode;
};

export default function JournalFeatureLayout({
  category,
  title,
  introduction,
  imageSrc,
  imageAlt,
  publishedDate,
  readingTime,
  guideItems,
  relatedArticles = [],
  children,
}: JournalFeatureLayoutProps) {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#284239]">
      {/* COVER */}
      <section className="relative isolate min-h-[640px] overflow-hidden bg-[#153f32] sm:min-h-[720px] lg:min-h-[780px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,35,28,.90)_0%,rgba(12,35,28,.76)_42%,rgba(12,35,28,.26)_72%,rgba(12,35,28,.12)_100%)]" />

        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#112f27] via-[#112f27]/62 to-transparent" />

        <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-between px-5 pb-12 pt-8 sm:min-h-[720px] sm:px-8 sm:pb-14 lg:min-h-[780px] lg:px-10 lg:pb-16">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-white/65"
          >
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/journal"
              className="transition hover:text-white"
            >
              Journal
            </Link>

            <span>/</span>

            <span className="text-white/90">
              {category}
            </span>
          </nav>

          <div className="max-w-5xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd0c8] backdrop-blur-sm">
                Port Petals Journal
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                {category}
              </span>
            </div>

            <h1 className="max-w-5xl font-serif text-[3.2rem] font-semibold leading-[.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.4rem]">
              {title}
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">
              {introduction}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
              <time>
                {publishedDate}
              </time>

              <span
                className="h-1 w-1 rounded-full bg-[#e76d61]"
                aria-hidden="true"
              />

              <span>
                {readingTime}
              </span>

              <span
                className="h-1 w-1 rounded-full bg-[#e76d61]"
                aria-hidden="true"
              />

              <span>
                Port Allegany, Pennsylvania
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE AREA */}
      <section className="bg-[#fffdf9]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[260px_minmax(0,780px)] lg:justify-center lg:gap-16 lg:px-10 lg:py-20">
          {/* SIDE RAIL */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e76d61]">
                In this guide
              </p>

              <nav
                aria-label="Article sections"
                className="mt-5 border-l border-[#284239]/15"
              >
                {guideItems.map(
                  (item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="block border-l-2 border-transparent py-2.5 pl-5 text-sm leading-6 text-[#718078] transition hover:border-[#e76d61] hover:text-[#153f32]"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>

              <div className="mt-9 border-t border-[#284239]/10 pt-7">
                <p className="font-serif text-xl font-semibold text-[#153f32]">
                  Port Petals
                </p>

                <p className="mt-2 text-sm leading-6 text-[#718078]">
                  Flowers, gifts, custom creations,
                  apparel and hometown favorites in
                  Port Allegany, Pennsylvania.
                </p>

                <Link
                  href="/flowers"
                  className="mt-4 inline-flex text-sm font-semibold text-[#e76d61]"
                >
                  Visit the flower shop →
                </Link>
              </div>
            </div>
          </aside>

          {/* STORY */}
          <article className="min-w-0">
            {children}
          </article>
        </div>
      </section>

      {/* RELATED */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-[#284239]/10 bg-[#f7f1e8]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                  Keep Reading
                </p>

                <h2 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.035em] text-[#153f32]">
                  More from the Port Petals Journal.
                </h2>
              </div>

              <Link
                href="/journal"
                className="text-sm font-semibold text-[#36594c] transition hover:text-[#e76d61]"
              >
                View all Journal guides →
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map(
                (article) => (
                  <Link
                    key={article.href}
                    href={article.href}
                    className="group flex min-h-[245px] flex-col rounded-[1.7rem] border border-[#284239]/10 bg-[#fffdf9] p-6 transition hover:-translate-y-1 hover:border-[#e76d61]/25 hover:shadow-[0_16px_40px_rgba(42,66,57,.09)] sm:p-7"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
                      {article.eyebrow}
                    </p>

                    <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[#153f32]">
                      {article.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-6 text-[#607068]">
                      {article.description}
                    </p>

                    <span className="mt-5 text-sm font-semibold text-[#36594c] transition group-hover:text-[#e76d61]">
                      Read guide →
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export function FeatureIntro({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-14 border-b border-[#284239]/10 pb-12">
      <div className="font-serif text-[1.7rem] leading-[1.5] text-[#284239] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.6rem] first-letter:font-semibold first-letter:leading-[.8] first-letter:text-[#e76d61]">
        {children}
      </div>
    </div>
  );
}

export function FeatureSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 py-10 first:pt-0 sm:py-12"
    >
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#153f32] sm:text-[2.8rem]">
        {title}
      </h2>

      <div className="mt-6 space-y-5 text-[1.04rem] leading-8 text-[#5d6d65]">
        {children}
      </div>
    </section>
  );
}

export function FeaturePullQuote({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <blockquote className="my-12 border-y border-[#284239]/10 py-10">
      <p className="max-w-3xl font-serif text-3xl font-semibold leading-[1.25] tracking-[-0.025em] text-[#153f32] sm:text-4xl">
        “{children}”
      </p>
    </blockquote>
  );
}

export function FeatureChecklist({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <aside className="my-12 overflow-hidden rounded-[1.8rem] bg-[#f7f1e8]">
      <div className="border-b border-[#284239]/10 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          {eyebrow}
        </p>

        <h3 className="mt-2 font-serif text-2xl font-semibold text-[#153f32]">
          {title}
        </h3>
      </div>

      <div className="grid gap-px bg-[#284239]/10 sm:grid-cols-2">
        {items.map(
          (item, index) => (
            <div
              key={item}
              className="flex gap-4 bg-[#fffdf9] px-6 py-5 sm:px-7"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e76d61] text-xs font-bold text-white">
                {index + 1}
              </span>

              <p className="text-sm leading-6 text-[#5d6d65]">
                {item}
              </p>
            </div>
          )
        )}
      </div>
    </aside>
  );
}

export function FeatureComparison({
  leftTitle,
  leftText,
  rightTitle,
  rightText,
}: {
  leftTitle: string;
  leftText: string;
  rightTitle: string;
  rightText: string;
}) {
  return (
    <div className="my-10 grid overflow-hidden rounded-[1.8rem] border border-[#284239]/10 md:grid-cols-2">
      <div className="bg-[#fff7f3] p-7 sm:p-8">
        <span className="text-3xl text-[#e76d61]">
          ✿
        </span>

        <h3 className="mt-4 font-serif text-2xl font-semibold text-[#153f32]">
          {leftTitle}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#607068]">
          {leftText}
        </p>
      </div>

      <div className="border-t border-[#284239]/10 bg-[#edf3e7] p-7 sm:p-8 md:border-l md:border-t-0">
        <span className="text-3xl text-[#36594c]">
          ✦
        </span>

        <h3 className="mt-4 font-serif text-2xl font-semibold text-[#153f32]">
          {rightTitle}
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#607068]">
          {rightText}
        </p>
      </div>
    </div>
  );
}

export function FeatureTimeline({
  items,
}: {
  items: {
    title: string;
    text: string;
  }[];
}) {
  return (
    <div className="my-10">
      {items.map(
        (item, index) => (
          <div
            key={item.title}
            className="grid grid-cols-[48px_1fr] gap-4"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#153f32] text-sm font-bold text-white">
                {index + 1}
              </div>

              {index !==
                items.length - 1 && (
                <div className="h-full min-h-14 w-px bg-[#284239]/15" />
              )}
            </div>

            <div className="pb-8">
              <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-[#607068]">
                {item.text}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
