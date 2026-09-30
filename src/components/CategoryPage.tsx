import Image from "next/image";
import Link from "next/link";

type Product = {
  name: string;
  description: string;
  price: string;
  image: string;
};

type CategoryPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  sectionTitle: string;
  products: Product[];
};

export default function CategoryPage({
  eyebrow,
  title,
  description,
  heroImage,
  heroAlt,
  sectionTitle,
  products,
}: CategoryPageProps) {
  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#284239]">

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f7eadc_0%,#faefe5_50%,#eef3e5_100%)]" />

        <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-[#efa99f]/35 blur-[90px]" />
        <div className="absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c9e2ba]/45 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#36594c]">
              {eyebrow}
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-[#153f32] sm:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#52655d]">
              {description}
            </p>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-[2rem] shadow-lg">
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e76d61]">
            Shop {eyebrow}
          </p>

          <h2 className="mt-2 font-serif text-4xl font-semibold text-[#153f32]">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-[1.8rem] border border-[#284239]/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl font-semibold text-[#153f32]">
                    {product.name}
                  </h3>

                  <span className="shrink-0 text-sm font-semibold text-[#e76d61]">
                    {product.price}
                  </span>
                </div>

                <p className="mt-3 leading-7 text-[#5d6d65]">
                  {product.description}
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#e76d61] px-5 py-3 font-semibold text-white transition hover:bg-[#d95d52]"
                >
                  View Options
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
