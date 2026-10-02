import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Custom Orders | Port Petals",
  description:
    "Contact Port Petals in Port Allegany, Pennsylvania to discuss a custom flower, gift, shirt, craft, or personalized order.",
};

export default function CustomOrderPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_48%,#edf3e7_100%)]" />
        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              Custom Orders
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              Have something special in mind?
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52655d]">
              For one-of-a-kind flowers, gifts, crafts, shirts, personalized
              pieces, or something you do not see online, contact Port Petals
              directly to talk through your idea.
            </p>

            <p className="mt-4 max-w-xl leading-7 text-[#607068]">
              Calling or emailing makes it easier to discuss the design,
              colors, wording, timing, budget, and other details that make a
              custom order unique.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+18146421253"
                className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#e76d61]/20 transition hover:-translate-y-0.5 hover:bg-[#d95d52]"
              >
                Call 814-642-1253
              </a>

              <a
                href="mailto:PortPetals@yahoo.com?subject=Custom%20Order%20Inquiry"
                className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-7 py-3.5 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Email Port Petals
              </a>
            </div>
          </div>

          <div className="relative h-[340px] overflow-hidden rounded-[2rem] shadow-lg">
            <Image
              src="/collections/customized-items.jpg"
              alt="Custom creations from Port Petals"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-[#284239]/10 bg-white/70 p-8 shadow-[0_16px_45px_rgba(42,66,57,0.08)] sm:p-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
              Before You Reach Out
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              A few details can help get things started.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#627169]">
              When you call or email, it helps to have an idea of what you
              would like and when you need it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Your Idea", "What you would like made or personalized."],
              ["Colors & Style", "Colors, theme, wording, names, or numbers."],
              ["Timing", "The date or occasion you need it for."],
              ["Budget", "An approximate budget, if you have one in mind."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-[1.4rem] border border-[#284239]/10 bg-[#fffdf9] p-5"
              >
                <h3 className="font-serif text-xl font-semibold text-[#153f32]">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#607068]">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[1.6rem] bg-[#edf3e7] p-6 text-center">
            <p className="font-serif text-2xl font-semibold text-[#153f32]">
              Ready to talk about your idea?
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="tel:+18146421253"
                className="inline-flex items-center justify-center rounded-full bg-[#e76d61] px-7 py-3.5 font-semibold text-white transition hover:bg-[#d95d52]"
              >
                Call Port Petals
              </a>

              <a
                href="mailto:PortPetals@yahoo.com?subject=Custom%20Order%20Inquiry"
                className="inline-flex items-center justify-center rounded-full border border-[#284239]/15 bg-white px-7 py-3.5 font-semibold text-[#284239] transition hover:border-[#e76d61]/40 hover:text-[#e76d61]"
              >
                Email PortPetals@yahoo.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
