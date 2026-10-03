"use client";

import {
  useEffect,
  useState,
} from "react";

type BulkCatalogControlsProps = {
  productIds: string[];
};

export default function BulkCatalogControls({
  productIds,
}: BulkCatalogControlsProps) {
  const [selectedCount, setSelectedCount] =
    useState(0);

  function getCheckboxes() {
    return Array.from(
      document.querySelectorAll<
        HTMLInputElement
      >(
        'input[name="product_ids"][data-product-selector="true"]'
      )
    );
  }

  function refreshCount() {
    setSelectedCount(
      getCheckboxes().filter(
        (checkbox) =>
          checkbox.checked
      ).length
    );
  }

  function toggleAll(
    checked: boolean
  ) {
    getCheckboxes().forEach(
      (checkbox) => {
        checkbox.checked = checked;
      }
    );

    refreshCount();
  }

  useEffect(() => {
    const checkboxes =
      getCheckboxes();

    const listener = () =>
      refreshCount();

    checkboxes.forEach(
      (checkbox) =>
        checkbox.addEventListener(
          "change",
          listener
        )
    );

    refreshCount();

    return () => {
      checkboxes.forEach(
        (checkbox) =>
          checkbox.removeEventListener(
            "change",
            listener
          )
      );
    };
  }, [productIds]);

  const allSelected =
    productIds.length > 0 &&
    selectedCount ===
      productIds.length;

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border border-[#284239]/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-[#153f32]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(event) =>
              toggleAll(
                event.target.checked
              )
            }
            disabled={
              productIds.length === 0
            }
            className="h-4 w-4"
          />

          Select All
        </label>

        <span className="text-sm text-[#718078]">
          {selectedCount} selected
        </span>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={() =>
              toggleAll(false)
            }
            className="text-sm font-semibold text-[#e76d61]"
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          form="bulk-product-form"
          name="bulk_action"
          required
          defaultValue=""
          disabled={
            selectedCount === 0
          }
          className="min-h-11 rounded-xl border border-[#284239]/15 bg-white px-4 text-sm font-semibold outline-none disabled:cursor-not-allowed disabled:bg-[#f2f0ec]"
        >
          <option value="" disabled>
            Choose bulk action
          </option>

          <option value="published">
            Publish
          </option>

          <option value="hidden">
            Hide from Storefront
          </option>

          <option value="sold_out">
            Mark Sold Out
          </option>

          <option value="draft">
            Move to Draft
          </option>

          <option value="archived">
            Archive
          </option>
        </select>

        <button
          form="bulk-product-form"
          type="submit"
          disabled={
            selectedCount === 0
          }
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#284239] px-5 text-sm font-semibold text-white transition hover:bg-[#1d332b] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply to Selected
        </button>
      </div>
    </div>
  );
}
