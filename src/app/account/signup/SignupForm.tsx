"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage(
        "Your passwords do not match."
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "Use a password with at least 8 characters."
      );
      return;
    }

    setSubmitting(true);

    const supabase = createClient();

    const callbackUrl =
      `${window.location.origin}` +
      "/account/auth/callback";

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

    if (error) {
      setErrorMessage(
        error.message ||
          "We couldn't create your account."
      );
      setSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Check your email to confirm your Port Petals account."
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
            Name
          </span>

          <input
            type="text"
            autoComplete="name"
            required
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
            autoComplete="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Password
          </span>

          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
          />

          <span className="text-xs leading-5 text-[#718078]">
            Use at least 8 characters.
          </span>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            Confirm Password
          </span>

          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
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
          <div
            role="status"
            className="rounded-xl bg-[#edf3e7] px-4 py-3 text-sm leading-6 text-[#31583b]"
          >
            <p className="font-semibold">
              Almost there.
            </p>

            <p className="mt-1">
              {successMessage}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            Boolean(successMessage)
          }
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Creating Account..."
            : "Create My Account"}
        </button>

        <p className="text-center text-sm leading-6 text-[#607068]">
          Already have an account?{" "}
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
