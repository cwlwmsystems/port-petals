import Link from "next/link";

type PaymentReturnPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function PaymentReturnPage({
  searchParams,
}: PaymentReturnPageProps) {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-[70vh] bg-[#f7f1e8] text-[#284239]">
      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <div className="rounded-3xl border border-[#284239]/10 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            Payment Submitted
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
            Thank you
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
            Square has returned you to Port Petals. We are
            confirming your payment status.
          </p>

          {orderId && (
            <p className="mt-4 text-xs text-[#718078]">
              Order reference: {orderId}
            </p>
          )}

          <div className="mt-7 rounded-xl bg-[#f5efe6] p-4 text-sm leading-6 text-[#607068]">
            Do not submit another payment for this order.
            Payment confirmation will be handled securely
            through Square.
          </div>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50]"
          >
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}
