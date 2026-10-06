"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const supabase = createClient();

    const redirectTo =
      `${window.location.origin}` +
      "/account/reset-password";

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        }
      );

    if (error) {
      setErrorMessage(
        "We couldn't send the reset email. Please try again."
      );

      setSubmitting(false);
      return;
    }

    setSuccessMessage(
      "If an account exists for that email, we've sent password reset instructions."
    );

    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-[1.8rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Email Address
          </span>

          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />
        </label>

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
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Sending..."
            : "Send Reset Email"}
        </button>

        <p className="text-center text-sm text-[#607068]">
          Remember your password?{" "}
          <Link
            href="/account/login"
            className="font-semibold text-[#153f32] underline decoration-[#e76d61]/40 underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
