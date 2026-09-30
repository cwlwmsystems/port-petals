"use client";

import { useState } from "react";

type Tab =
  | "description"
  | "delivery"
  | "care"
  | "substitutions"
  | "faq";

type FlowerProductInfoTabsProps = {
  description: string;
  substitutionNote?: string;
};

export default function FlowerProductInfoTabs({
  description,
  substitutionNote,
}: FlowerProductInfoTabsProps) {
  const [activeTab, setActiveTab] =
    useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "delivery", label: "Pickup & Delivery" },
    { id: "care", label: "Flower Care" },
    { id: "substitutions", label: "Substitutions" },
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
                About This Arrangement
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

                <p>
                  Delivery availability and requested dates are subject
                  to confirmation by Port Petals.
                </p>
              </div>
            </div>
          )}

          {activeTab === "care" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Fresh Flower Care
              </h2>

              <div className="mt-4 space-y-3 leading-7">
                <p>
                  Keep fresh flowers in a cool location away from direct
                  sunlight, heating vents, and drafts.
                </p>

                <p>
                  Check the water level daily and replenish with clean
                  water as needed.
                </p>

                <p>
                  For hand-tied bouquets, trim the stems before placing
                  them into a clean vase with fresh water.
                </p>
              </div>
            </div>
          )}

          {activeTab === "substitutions" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Seasonal Flower Substitutions
              </h2>

              <p className="mt-4 leading-8">
                {substitutionNote ??
                  "Fresh flowers vary by season and availability. Comparable substitutions may be made while preserving the overall style, color palette, and value of the arrangement."}
              </p>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
                Flower Order Questions
              </h2>

              <div className="mt-5 divide-y divide-[#284239]/10">
                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    How far in advance should I order?
                  </summary>

                  <p className="mt-3 leading-7">
                    Please place flower orders at least 7 days in
                    advance.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Will my flowers look exactly like the photo?
                  </summary>

                  <p className="mt-3 leading-7">
                    Photos represent the overall style of the
                    arrangement. Flower varieties and exact colors may
                    vary based on seasonal availability.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can I request certain colors?
                  </summary>

                  <p className="mt-3 leading-7">
                    Yes. Color preferences can be requested, but exact
                    shades and flower varieties remain subject to
                    availability.
                  </p>
                </details>

                <details className="py-4">
                  <summary className="cursor-pointer font-semibold text-[#153f32]">
                    Can I include a card message?
                  </summary>

                  <p className="mt-3 leading-7">
                    Eligible arrangements can include a complimentary
                    short card message.
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
