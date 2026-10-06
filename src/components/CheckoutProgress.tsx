type CheckoutStep =
  | "cart"
  | "details"
  | "payment"
  | "confirmation";

type CheckoutProgressProps = {
  currentStep: CheckoutStep;
};

const steps: {
  id: CheckoutStep;
  label: string;
}[] = [
  {
    id: "cart",
    label: "Cart",
  },
  {
    id: "details",
    label: "Details",
  },
  {
    id: "payment",
    label: "Payment",
  },
  {
    id: "confirmation",
    label: "Confirmation",
  },
];

export default function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <nav
      aria-label="Checkout progress"
      className="w-full"
    >
      <ol className="grid grid-cols-4">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;

          return (
            <li
              key={step.id}
              className="relative flex flex-col items-center text-center"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute right-1/2 top-4 h-px w-full ${
                    index <= currentIndex
                      ? "bg-[#e76d61]"
                      : "bg-[#284239]/15"
                  }`}
                />
              )}

              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  complete
                    ? "border-[#31583b] bg-[#31583b] text-white"
                    : active
                      ? "border-[#e76d61] bg-[#e76d61] text-white shadow-sm"
                      : "border-[#284239]/15 bg-[#f7f1e8] text-[#718078]"
                }`}
              >
                {complete ? "✓" : index + 1}
              </span>

              <span
                className={`mt-2 text-[11px] font-semibold sm:text-xs ${
                  active
                    ? "text-[#153f32]"
                    : complete
                      ? "text-[#31583b]"
                      : "text-[#829088]"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
