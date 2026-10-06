"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const confirmationError =
    searchParams.get("error") === "confirmation";

  const requestedNext =
    searchParams.get("next");

  const next =
    requestedNext &&
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//")
      ? requestedNext
      : "/account";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSubmitting(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setErrorMessage(
        "We couldn't sign you in. Check your email and password and try again."
      );

      setSubmitting(false);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-[1.8rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5">
        {confirmationError && (
          <div
            role="alert"
            className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm leading-6 text-[#a7473f]"
          >
            We couldn&apos;t confirm that account link.
            Please try signing in or request a new
            confirmation email.
          </div>
        )}

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
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
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

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Signing In..."
            : "Sign In"}
        </button>

        <div className="text-center text-sm leading-6 text-[#607068]">
          <p>
            New to Port Petals?{" "}
            <Link
              href="/account/signup"
              className="font-semibold text-[#153f32] underline decoration-[#e76d61]/40 underline-offset-4"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-2">
            <Link
              href="/account/forgot-password"
              className="font-semibold text-[#36594c] underline underline-offset-4"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}
