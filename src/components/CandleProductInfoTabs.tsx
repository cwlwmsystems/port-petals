"use client";

import { useState } from "react";

type Tab =
  | "description"
  | "delivery"
  | "use"
  | "safety"
  | "faq";

type CandleProductInfoTabsProps = {
  description: string;
};

export default function CandleProductInfoTabs({
  description,
}: CandleProductInfoTabsProps) {
  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "delivery", label: "Pickup & Delivery" },
    { id: "use", label: "How to Use" },
    { id: "safety", label: "Candle Tart Safety" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
      <div className="border-t border-[#284239]/10">
        <div className="flex gap-7 overflow-x-auto border-b border-[#284239]/10 pt-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 px-1 py-5 text-sm font-semibold transition ${
                  active
                    ? "border-[#e76d61] text-[#153f32]"
                    : "border-transparent text-[#68766f] hover:text-[#e76d61]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl py-8 text-[#52655d]">
          {activeTab === "description" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                About This Product
              </h2>

              <p className="mt-4 leading-8">
                {description}
              </p>
            </div>
          )}

          {activeTab === "delivery" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Pickup & Local Delivery
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                <p>
                  Pickup is available at 430 E Arnold Avenue,
                  Port Allegany, PA 16743.
                </p>

                <p>
                  Delivery is free within 3 miles of Port Allegany.
                  Delivery over 3 miles and up to 8 miles is $10.
                  Delivery to Smethport or Eldred is $15.
                </p>
              </div>
            </div>
          )}

          {activeTab === "use" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Using Candle Tarts
              </h2>

              <p className="mt-4 leading-8">
                Place an appropriate amount of wax tart into a wax warmer
                designed for scented wax products. Follow the instructions
                provided with your warmer and replace the wax when the scent
                has faded.
              </p>
            </div>
          )}

          {activeTab === "safety" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Candle Tart Safety
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                <p>
                  Use candle tarts only in a warmer designed for melting
                  scented wax.
                </p>

                <p>
                  Never leave a heated wax warmer unattended.
                </p>

                <p>
                  Keep warmers and melted wax away from children, pets,
                  flammable materials, and unstable surfaces.
                </p>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Candle Tart Questions
              </h2>

              <div className="mt-5 divide-y divide-[#284239]/10">
                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can I request a certain scent?
                  </summary>

                  <p className="mt-3 leading-7">
                    Yes. Scent preferences can be requested, but exact
                    fragrance availability depends on current inventory.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can candle tart bouquets be customized?
                  </summary>

                  <p className="mt-3 leading-7">
                    Color, theme, and scent preferences can be requested
                    for candle tart bouquets.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Do candle tart bouquets need advance notice?
                  </summary>

                  <p className="mt-3 leading-7">
                    Custom candle tart bouquets should be ordered at least
                    7 days in advance.
                  </p>
                </details>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
