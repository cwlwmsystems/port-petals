"use client";

import { useState } from "react";

type Tab =
  | "description"
  | "personalization"
  | "delivery"
  | "timing"
  | "faq";

type CustomItemInfoTabsProps = {
  description: string;
  leadTime: string;
};

export default function CustomItemInfoTabs({
  description,
  leadTime,
}: CustomItemInfoTabsProps) {
  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "personalization", label: "Personalization" },
    { id: "delivery", label: "Pickup & Delivery" },
    { id: "timing", label: "Lead Time" },
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
                About This Item
              </h2>

              <p className="mt-4 leading-8">
                {description}
              </p>

              <p className="mt-4 leading-7">
                Product images represent examples of the type of work
                Port Petals can create. Each custom piece may vary based
                on the requested personalization, materials, colors, and
                design.
              </p>
            </div>
          )}

          {activeTab === "personalization" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Personalization
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                <p>
                  Depending on the product, personalization can include
                  names, wording, player numbers, years, team colors,
                  themes, seasonal details, and other design requests.
                </p>

                <p>
                  Port Petals will review the requested design before the
                  order is finalized.
                </p>
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

          {activeTab === "timing" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Custom Order Lead Time
              </h2>

              <p className="mt-4 leading-8">
                {leadTime}
              </p>

              <p className="mt-4 leading-7">
                More detailed projects may require additional time
                depending on design complexity and material availability.
              </p>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Custom Item Questions
              </h2>

              <div className="mt-5 divide-y divide-[#284239]/10">
                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can I request a design that is not shown?
                  </summary>

                  <p className="mt-3 leading-7">
                    Yes. The catalog represents examples and common
                    product types. Port Petals can review other custom
                    ideas through the custom request form.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Is the listed price final?
                  </summary>

                  <p className="mt-3 leading-7">
                    Listed prices are starting prices. Final pricing may
                    change based on size, materials, personalization, and
                    design complexity.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Will my item look exactly like the example photo?
                  </summary>

                  <p className="mt-3 leading-7">
                    Not necessarily. Example photos show previous work or
                    the general style of item. Custom pieces are created
                    around the individual order.
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
