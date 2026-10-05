"use client";

import {
  useState,
  useTransition,
} from "react";

import { updateWeddingLead } from "./actions";

type Props = {
  inquiryId: string;
  currentStatus: string;
  quoteStatus: string;
  quoteAmount:
    | number
    | string
    | null;
  consultationAt:
    | string
    | null;
  followUpAt:
    | string
    | null;
  lastContactedAt:
    | string
    | null;
  internalNotes:
    | string
    | null;
};

function toLocalInputValue(
  value: string | null
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  const offset =
    date.getTimezoneOffset() *
    60_000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

function toIsoValue(
  value: string
) {
  if (!value) {
    return "";
  }

  return new Date(
    value
  ).toISOString();
}

export default function WeddingLeadActions({
  inquiryId,
  currentStatus,
  quoteStatus,
  quoteAmount,
  consultationAt,
  followUpAt,
  lastContactedAt,
  internalNotes,
}: Props) {
  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    error,
    setError,
  ] = useState("");

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState(
    currentStatus
  );

  const [
    quoteState,
    setQuoteState,
  ] = useState(
    quoteStatus
  );

  const [
    amount,
    setAmount,
  ] = useState(
    quoteAmount === null
      ? ""
      : String(
          quoteAmount
        )
  );

  const [
    consultation,
    setConsultation,
  ] = useState(
    toLocalInputValue(
      consultationAt
    )
  );

  const [
    followUp,
    setFollowUp,
  ] = useState(
    toLocalInputValue(
      followUpAt
    )
  );

  const [
    lastContacted,
    setLastContacted,
  ] = useState(
    toLocalInputValue(
      lastContactedAt
    )
  );

  const [
    notes,
    setNotes,
  ] = useState(
    internalNotes ?? ""
  );

  function save() {
    setError("");
    setSaved(false);

    startTransition(
      async () => {
        try {
          await updateWeddingLead(
            inquiryId,
            {
              status:
                status as
                  | "new"
                  | "contacted"
                  | "consultation_scheduled"
                  | "quote_sent"
                  | "booked"
                  | "declined"
                  | "completed",

              quoteStatus:
                quoteState as
                  | "not_started"
                  | "draft"
                  | "sent"
                  | "accepted"
                  | "declined",

              quoteAmount:
                amount,

              consultationAt:
                toIsoValue(
                  consultation
                ),

              followUpAt:
                toIsoValue(
                  followUp
                ),

              lastContactedAt:
                toIsoValue(
                  lastContacted
                ),

              internalNotes:
                notes,
            }
          );

          setSaved(true);
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to update wedding lead."
          );
        }
      }
    );
  }

  const inputClass =
    "mt-2 min-h-11 w-full rounded-xl border border-[#284239]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#e76d61]";

  return (
    <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
        Lead Management
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#607068]">
        Track communication,
        consultation, quoting,
        booking, and follow-up.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block text-sm font-semibold text-[#153f32]">
          Lead Status

          <select
            value={status}
            onChange={(
              event
            ) =>
              setStatus(
                event.target
                  .value
              )
            }
            className={
              inputClass
            }
          >
            <option value="new">
              New
            </option>

            <option value="contacted">
              Contacted
            </option>

            <option value="consultation_scheduled">
              Consultation Scheduled
            </option>

            <option value="quote_sent">
              Quote Sent
            </option>

            <option value="booked">
              Booked
            </option>

            <option value="declined">
              Declined
            </option>

            <option value="completed">
              Completed
            </option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-[#153f32]">
          Consultation

          <input
            type="datetime-local"
            value={
              consultation
            }
            onChange={(
              event
            ) =>
              setConsultation(
                event.target
                  .value
              )
            }
            className={
              inputClass
            }
          />
        </label>

        <label className="block text-sm font-semibold text-[#153f32]">
          Next Follow-Up

          <input
            type="datetime-local"
            value={
              followUp
            }
            onChange={(
              event
            ) =>
              setFollowUp(
                event.target
                  .value
              )
            }
            className={
              inputClass
            }
          />
        </label>

        <label className="block text-sm font-semibold text-[#153f32]">
          Last Contacted

          <input
            type="datetime-local"
            value={
              lastContacted
            }
            onChange={(
              event
            ) =>
              setLastContacted(
                event.target
                  .value
              )
            }
            className={
              inputClass
            }
          />
        </label>

        <div className="border-t border-[#284239]/10 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#718078]">
            Quote
          </p>

          <label className="mt-4 block text-sm font-semibold text-[#153f32]">
            Quote Status

            <select
              value={
                quoteState
              }
              onChange={(
                event
              ) =>
                setQuoteState(
                  event.target
                    .value
                )
              }
              className={
                inputClass
              }
            >
              <option value="not_started">
                Not Started
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="sent">
                Sent
              </option>

              <option value="accepted">
                Accepted
              </option>

              <option value="declined">
                Declined
              </option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-semibold text-[#153f32]">
            Quote Amount

            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#607068]">
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(
                  event
                ) =>
                  setAmount(
                    event.target
                      .value
                  )
                }
                className="min-h-11 w-full rounded-xl border border-[#284239]/15 bg-white py-2 pl-7 pr-3 text-sm outline-none transition focus:border-[#e76d61]"
              />
            </div>
          </label>
        </div>

        <label className="block text-sm font-semibold text-[#153f32]">
          Internal Notes

          <textarea
            rows={8}
            value={notes}
            onChange={(
              event
            ) =>
              setNotes(
                event.target
                  .value
              )
            }
            placeholder="Private notes for Stacy..."
            className="mt-2 w-full rounded-xl border border-[#284239]/15 bg-white px-3 py-3 text-sm leading-6 outline-none transition focus:border-[#e76d61]"
          />
        </label>

        {error && (
          <div className="rounded-xl bg-[#fff0ed] p-3 text-sm text-[#a7473f]">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-xl bg-[#e6f2e3] p-3 text-sm font-medium text-[#31583b]">
            Wedding lead updated.
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={
            isPending
          }
          className="w-full rounded-xl bg-[#284239] px-5 py-3 font-semibold text-white transition hover:bg-[#1d332b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : "Save Lead"}
        </button>
      </div>
    </section>
  );
}
