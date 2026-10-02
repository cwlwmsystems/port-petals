"use client";

import { useState } from "react";

type Tab =
  | "description"
  | "sizing"
  | "printing"
  | "delivery"
  | "care"
  | "faq";

type ShirtProductInfoTabsProps = {
  description: string;
  presetDesign: boolean;
  personalizable: boolean;
  maker?: string;
};

export default function ShirtProductInfoTabs({
  description,
  presetDesign,
  personalizable,
  maker,
}: ShirtProductInfoTabsProps) {
  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "sizing", label: "Sizing" },
    { id: "printing", label: "Design Details" },
    { id: "delivery", label: "Pickup & Delivery" },
    { id: "care", label: "Care" },
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
                About This Shirt
              </h2>

              <p className="mt-4 leading-8">
                {description}
              </p>

              {maker && (
                <p className="mt-4 leading-7">
                  Made by {maker}. Each finished shirt is prepared
                  with care by Port Petals.
                </p>
              )}
            </div>
          )}

          {activeTab === "sizing" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Shirt Sizing
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                <p>
                  Available sizes are shown on the product page.
                </p>

                <p>
                  Sizes and colors may vary by design. If a requested option is
                  unavailable, Port Petals will contact you before the
                  order is finalized.
                </p>
              </div>
            </div>
          )}

          {activeTab === "printing" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Design Details
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                {presetDesign && (
                  <p>
                    Screen-printed shirts currently use preset Port
                    Petals designs rather than customer-submitted
                    artwork.
                  </p>
                )}

                {personalizable && (
                  <p>
                    Personalized sports shirts can include a player name
                    and number. Enter the requested personalization when
                    selecting the shirt options above.
                  </p>
                )}
              </div>
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

          {activeTab === "care" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Shirt Care
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                <p>
                  Wash garments inside out in cool or cold water with
                  similar colors.
                </p>

                <p>
                  Use mild detergent and avoid bleach unless the garment
                  manufacturer specifically permits it.
                </p>

                <p>
                  For best longevity, tumble dry on low or air dry and
                  avoid ironing directly over printed artwork.
                </p>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Shirt Questions
              </h2>

              <div className="mt-5 divide-y divide-[#284239]/10">
                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can I submit my own screen-print design?
                  </summary>

                  <p className="mt-3 leading-7">
                    Not through the current online catalog. Screen-printed
                    shirts are currently limited to available preset
                    designs.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can I personalize my sports shirt?
                  </summary>

                  <p className="mt-3 leading-7">
                    Yes. Preferred colors can be requested, but the
                    finished pattern will be unique.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Are all sizes always available?
                  </summary>

                  <p className="mt-3 leading-7">
                    No. Available sizes and colors may vary by design.
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
