import Link from "next/link";
import PaymentReturnClient from "@/components/PaymentReturnClient";

type PaymentReturnPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function PaymentReturnPage({
  searchParams,
}: PaymentReturnPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <main className="min-h-[70vh] bg-[#f7f1e8] text-[#284239]">
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <div className="rounded-3xl border border-[#284239]/10 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
              Order Confirmation
            </p>

            <h1 className="mt-3 font-serif text-4xl font-semibold text-[#153f32]">
              We couldn't find your order confirmation
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#607068]">
              We couldn't find the order details for this page.
              If you completed payment, please contact Port Petals before trying again.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <PaymentReturnClient orderId={orderId} />
  );
}
