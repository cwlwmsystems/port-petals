"use client";

import {
  FormEvent,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type CustomerProfileFormProps = {
  userId: string;
  email: string;
  initialName: string;
  initialPhone: string;
  initialBirthdayMonth: number | null;
  initialBirthdayDay: number | null;
};

export default function CustomerProfileForm({
  userId,
  email,
  initialName,
  initialPhone,
  initialBirthdayMonth,
  initialBirthdayDay,
}: CustomerProfileFormProps) {
  const [fullName, setFullName] =
    useState(initialName);

  const [phone, setPhone] =
    useState(initialPhone);

  const [birthdayMonth, setBirthdayMonth] =
    useState(
      initialBirthdayMonth?.toString() ?? ""
    );

  const [birthdayDay, setBirthdayDay] =
    useState(
      initialBirthdayDay?.toString() ?? ""
    );

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const month =
      birthdayMonth === ""
        ? null
        : Number(birthdayMonth);

    const day =
      birthdayDay === ""
        ? null
        : Number(birthdayDay);

    if (
      month !== null &&
      (month < 1 || month > 12)
    ) {
      setErrorMessage(
        "Choose a valid birthday month."
      );
      setSaving(false);
      return;
    }

    if (
      day !== null &&
      (day < 1 || day > 31)
    ) {
      setErrorMessage(
        "Choose a valid birthday day."
      );
      setSaving(false);
      return;
    }

    const supabase = createClient();

    const { error } =
      await supabase
        .from("customer_profiles")
        .update({
          full_name:
            fullName.trim() || null,

          phone:
            phone.trim() || null,

          birthday_month: month,
          birthday_day: day,

          updated_at:
            new Date().toISOString(),
        })
        .eq("user_id", userId);

    if (error) {
      console.error(
        "Profile update failed:",
        error
      );

      setErrorMessage(
        "We couldn't save your profile. Please try again."
      );

      setSaving(false);
      return;
    }

    setSuccessMessage(
      "Your profile has been updated."
    );

    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#284239]/10 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Name
          </span>

          <input
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Email Address
          </span>

          <input
            type="email"
            value={email}
            disabled
            className="min-h-12 cursor-not-allowed rounded-xl border border-[#284239]/10 bg-[#f2f0ec] px-4 py-3 text-[#718078]"
          />

          <span className="text-xs leading-5 text-[#718078]">
            Your account email is managed separately
            from your profile details.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Phone
          </span>

          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />
        </label>

        <div className="rounded-2xl bg-[#faf7f1] p-5">
          <p className="font-serif text-xl font-semibold text-[#153f32]">
            Birthday
          </p>

          <p className="mt-2 text-sm leading-6 text-[#607068]">
            Your birthday is optional. Port Petals may
            occasionally use it to send a small surprise
            or token of appreciation.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Month
              </span>

              <select
                value={birthdayMonth}
                onChange={(event) =>
                  setBirthdayMonth(
                    event.target.value
                  )
                }
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
              >
                <option value="">
                  Month
                </option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#153f32]">
                Day
              </span>

              <input
                type="number"
                min={1}
                max={31}
                inputMode="numeric"
                value={birthdayDay}
                onChange={(event) =>
                  setBirthdayDay(
                    event.target.value
                  )
                }
                placeholder="Day"
                className="min-h-12 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 outline-none focus:border-[#e76d61]"
              />
            </label>
          </div>

          <p className="mt-3 text-xs leading-5 text-[#718078]">
            We only store the month and day. Your birth
            year is not needed.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm font-medium text-[#a7473f]"
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p
            role="status"
            className="rounded-xl bg-[#edf3e7] px-4 py-3 text-sm font-medium text-[#31583b]"
          >
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
