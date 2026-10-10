"use client";

import Link from "next/link";
import Script from "next/script";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };

    portPetalsTurnstileSuccess?: (
      token: string
    ) => void;

    portPetalsTurnstileExpired?: () => void;

    portPetalsTurnstileError?: () => void;
  }
}

export default function SignupForm() {
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    captchaToken,
    setCaptchaToken,
  ] = useState("");

  const [
    honeypot,
    setHoneypot,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const siteKey =
    process.env
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    window.portPetalsTurnstileSuccess =
      (token: string) => {
        setCaptchaToken(token);
      };

    window.portPetalsTurnstileExpired =
      () => {
        setCaptchaToken("");
      };

    window.portPetalsTurnstileError =
      () => {
        setCaptchaToken("");
        setErrorMessage(
          "The security check could not be completed. Please try again."
        );
      };

    return () => {
      delete window
        .portPetalsTurnstileSuccess;

      delete window
        .portPetalsTurnstileExpired;

      delete window
        .portPetalsTurnstileError;
    };
  }, []);

  function resetCaptcha() {
    setCaptchaToken("");

    if (
      typeof window !==
        "undefined" &&
      window.turnstile
    ) {
      window.turnstile.reset();
    }
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      honeypot.trim() !== ""
    ) {
      setSuccessMessage(
        "Check your email to confirm your Port Petals account."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setErrorMessage(
        "Your passwords do not match."
      );
      return;
    }

    if (
      password.length < 8
    ) {
      setErrorMessage(
        "Use a password with at least 8 characters."
      );
      return;
    }

    if (
      !siteKey
    ) {
      setErrorMessage(
        "Signup security is not configured."
      );
      return;
    }

    if (
      !captchaToken
    ) {
      setErrorMessage(
        "Please complete the security check."
      );
      return;
    }

    setSubmitting(true);

    const supabase =
      createClient();

    const callbackUrl =
      `${window.location.origin}` +
      "/account/auth/callback";

    const {
      error,
    } =
      await supabase.auth.signUp({
        email:
          email.trim(),
        password,

        options: {
          emailRedirectTo:
            callbackUrl,

          captchaToken,

          data: {
            full_name:
              fullName.trim(),
          },
        },
      });

    resetCaptcha();

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
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className="relative mt-8 rounded-[1.8rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8"
      >
        <div
          aria-hidden="true"
          className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
        >
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={
                honeypot
              }
              onChange={(
                event
              ) =>
                setHoneypot(
                  event.target
                    .value
                )
              }
            />
          </label>
        </div>

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#153f32]">
              Name
            </span>

            <input
              type="text"
              autoComplete="name"
              required
              value={
                fullName
              }
              onChange={(
                event
              ) =>
                setFullName(
                  event.target
                    .value
                )
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
              value={
                email
              }
              onChange={(
                event
              ) =>
                setEmail(
                  event.target
                    .value
                )
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
              value={
                password
              }
              onChange={(
                event
              ) =>
                setPassword(
                  event.target
                    .value
                )
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
              value={
                confirmPassword
              }
              onChange={(
                event
              ) =>
                setConfirmPassword(
                  event.target
                    .value
                )
              }
              className="min-h-12 rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
            />
          </label>

          {siteKey && (
            <div className="flex justify-center rounded-xl border border-[#284239]/10 bg-[#fffdf9] p-3">
              <div
                className="cf-turnstile"
                data-sitekey={
                  siteKey
                }
                data-theme="light"
                data-callback="portPetalsTurnstileSuccess"
                data-expired-callback="portPetalsTurnstileExpired"
                data-error-callback="portPetalsTurnstileError"
              />
            </div>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-[#fff0ed] px-4 py-3 text-sm font-medium text-[#a7473f]"
            >
              {
                errorMessage
              }
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
                {
                  successMessage
                }
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              Boolean(
                successMessage
              ) ||
              !siteKey
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
    </>
  );
}
