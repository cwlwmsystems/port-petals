"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  changeMarketingConsent,
  updateCustomerContact,
  updateCustomerInterests,
} from "./actions";

const interestOptions = [
  {
    value:
      "flowers",
    label:
      "Flowers",
  },
  {
    value:
      "gifts-decor",
    label:
      "Gifts & Decor",
  },
  {
    value:
      "apparel",
    label:
      "Apparel",
  },
  {
    value:
      "gator-gear",
    label:
      "Gator Gear",
  },
  {
    value:
      "seasonal",
    label:
      "Seasonal",
  },
  {
    value:
      "weddings-events",
    label:
      "Weddings & Events",
  },
] as const;

type Props = {
  contactId: string;

  firstName:
    | string
    | null;

  lastName:
    | string
    | null;

  email:
    | string
    | null;

  phone:
    | string
    | null;

  currentInterests:
    string[];

  emailSubscribed:
    boolean;

  smsSubscribed:
    boolean;
};

export default function CustomerActions({
  contactId,
  firstName,
  lastName,
  email,
  phone,
  currentInterests,
  emailSubscribed,
  smsSubscribed,
}: Props) {
  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    saved,
    setSaved,
  ] =
    useState("");

  const [
    firstNameState,
    setFirstNameState,
  ] =
    useState(
      firstName ?? ""
    );

  const [
    lastNameState,
    setLastNameState,
  ] =
    useState(
      lastName ?? ""
    );

  const [
    emailState,
    setEmailState,
  ] =
    useState(
      email ?? ""
    );

  const [
    phoneState,
    setPhoneState,
  ] =
    useState(
      phone ?? ""
    );

  const [
    interests,
    setInterests,
  ] =
    useState<string[]>(
      currentInterests
    );

  function runAction(
    action:
      () => Promise<void>,
    successMessage: string
  ) {
    setError("");
    setSaved("");

    startTransition(
      async () => {
        try {
          await action();

          setSaved(
            successMessage
          );
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to update customer."
          );
        }
      }
    );
  }

  function saveContact() {
    runAction(
      () =>
        updateCustomerContact(
          contactId,
          {
            firstName:
              firstNameState,

            lastName:
              lastNameState,

            email:
              emailState,

            phone:
              phoneState,
          }
        ),

      "Contact information saved."
    );
  }

  function toggleInterest(
    value: string
  ) {
    setInterests(
      (current) =>
        current.includes(
          value
        )
          ? current.filter(
              (item) =>
                item !==
                value
            )
          : [
              ...current,
              value,
            ]
    );
  }

  function saveInterests() {
    runAction(
      () =>
        updateCustomerInterests(
          contactId,
          interests
        ),

      "Customer interests saved."
    );
  }

  function updateConsent(
    channel:
      | "email"
      | "sms",
    action:
      | "opted_in"
      | "opted_out"
  ) {
    const label =
      channel === "email"
        ? "Email"
        : "SMS";

    const actionLabel =
      action === "opted_in"
        ? "opt-in"
        : "opt-out";

    const confirmed =
      window.confirm(
        `Record an explicit ${label} marketing ${actionLabel} for this customer?`
      );

    if (!confirmed) {
      return;
    }

    runAction(
      () =>
        changeMarketingConsent(
          contactId,
          channel,
          action
        ),

      `${label} marketing consent updated.`
    );
  }

  const inputClass =
    "mt-2 min-h-11 w-full rounded-xl border border-[#284239]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#e76d61] disabled:bg-[#f5f3ef] disabled:text-[#718078]";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
          Edit Contact
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          Update the CRM contact record.
          Marketing permissions are managed
          separately below.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[#153f32]">
            First Name

            <input
              value={
                firstNameState
              }
              onChange={(
                event
              ) =>
                setFirstNameState(
                  event.target
                    .value
                )
              }
              disabled={
                isPending
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="block text-sm font-semibold text-[#153f32]">
            Last Name

            <input
              value={
                lastNameState
              }
              onChange={(
                event
              ) =>
                setLastNameState(
                  event.target
                    .value
                )
              }
              disabled={
                isPending
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="block text-sm font-semibold text-[#153f32]">
            Email

            <input
              type="email"
              value={
                emailState
              }
              onChange={(
                event
              ) =>
                setEmailState(
                  event.target
                    .value
                )
              }
              disabled={
                isPending
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="block text-sm font-semibold text-[#153f32]">
            Phone

            <input
              type="tel"
              value={
                phoneState
              }
              onChange={(
                event
              ) =>
                setPhoneState(
                  event.target
                    .value
                )
              }
              disabled={
                isPending
              }
              className={
                inputClass
              }
            />
          </label>
        </div>

        <button
          type="button"
          onClick={
            saveContact
          }
          disabled={
            isPending
          }
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#284239] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d332b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : "Save Contact"}
        </button>
      </section>

      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
          Customer Interests
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          Use interests for future
          segmentation and targeted
          campaigns.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {interestOptions.map(
            (option) => {
              const checked =
                interests.includes(
                  option.value
                );

              return (
                <label
                  key={
                    option.value
                  }
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                    checked
                      ? "border-[#31583b]/30 bg-[#e6f2e3]"
                      : "border-[#284239]/10 bg-[#faf7f1]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      checked
                    }
                    onChange={() =>
                      toggleInterest(
                        option.value
                      )
                    }
                    disabled={
                      isPending
                    }
                    className="h-4 w-4 accent-[#31583b]"
                  />

                  <span className="text-sm font-semibold text-[#153f32]">
                    {
                      option.label
                    }
                  </span>
                </label>
              );
            }
          )}
        </div>

        <button
          type="button"
          onClick={
            saveInterests
          }
          disabled={
            isPending
          }
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#284239] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d332b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : "Save Interests"}
        </button>
      </section>

      <section className="rounded-[1.75rem] border border-[#284239]/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-[#153f32]">
          Marketing Consent
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#607068]">
          Only record an opt-in when the
          customer has explicitly requested
          or authorized marketing contact.
          Every change is added to the
          consent history.
        </p>

        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-[#284239]/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[#153f32]">
                  Email Marketing
                </p>

                <p className="mt-1 text-sm text-[#607068]">
                  Current state:{" "}
                  <strong>
                    {emailSubscribed
                      ? "Subscribed"
                      : "Not subscribed"}
                  </strong>
                </p>
              </div>

              {emailSubscribed ? (
                <button
                  type="button"
                  onClick={() =>
                    updateConsent(
                      "email",
                      "opted_out"
                    )
                  }
                  disabled={
                    isPending
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#a7473f]/25 bg-[#fff0ed] px-4 text-sm font-semibold text-[#a7473f] disabled:opacity-60"
                >
                  Record Email Opt-Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    updateConsent(
                      "email",
                      "opted_in"
                    )
                  }
                  disabled={
                    isPending ||
                    !emailState.trim()
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#31583b] px-4 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Record Email Opt-In
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#284239]/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[#153f32]">
                  SMS Marketing
                </p>

                <p className="mt-1 text-sm text-[#607068]">
                  Current state:{" "}
                  <strong>
                    {smsSubscribed
                      ? "Subscribed"
                      : "Not subscribed"}
                  </strong>
                </p>
              </div>

              {smsSubscribed ? (
                <button
                  type="button"
                  onClick={() =>
                    updateConsent(
                      "sms",
                      "opted_out"
                    )
                  }
                  disabled={
                    isPending
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#a7473f]/25 bg-[#fff0ed] px-4 text-sm font-semibold text-[#a7473f] disabled:opacity-60"
                >
                  Record SMS Opt-Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    updateConsent(
                      "sms",
                      "opted_in"
                    )
                  }
                  disabled={
                    isPending ||
                    !phoneState.trim()
                  }
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#31583b] px-4 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Record SMS Opt-In
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-[#fff0ed] p-4 text-sm leading-6 text-[#a7473f]"
          >
            {error}
          </div>
        )}

        {saved && (
          <div
            aria-live="polite"
            className="mt-5 rounded-xl bg-[#e6f2e3] p-4 text-sm leading-6 text-[#31583b]"
          >
            {saved}
          </div>
        )}
      </section>
    </div>
  );
}
