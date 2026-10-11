"use client";

import Script from "next/script";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    portPetalsAdminTurnstileSuccess?: (
      token: string
    ) => void;
    portPetalsAdminTurnstileExpired?: () => void;
    portPetalsAdminTurnstileError?: () => void;
    turnstile?: {
      reset: () => void;
    };
  }
}

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [captchaToken, setCaptchaToken] =
    useState("");
  const [errorMessage, setErrorMessage] =
    useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const siteKey =
    process.env
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
    "";

  useEffect(() => {
    window.portPetalsAdminTurnstileSuccess =
      (token: string) => {
        setCaptchaToken(token);
        setErrorMessage("");
      };

    window.portPetalsAdminTurnstileExpired =
      () => {
        setCaptchaToken("");
      };

    window.portPetalsAdminTurnstileError =
      () => {
        setCaptchaToken("");
        setErrorMessage(
          "The security check could not be completed. Please try again."
        );
      };

    return () => {
      delete window
        .portPetalsAdminTurnstileSuccess;
      delete window
        .portPetalsAdminTurnstileExpired;
      delete window
        .portPetalsAdminTurnstileError;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!siteKey) {
      setErrorMessage(
        "Security verification is unavailable."
      );
      return;
    }

    if (!captchaToken) {
      setErrorMessage(
        "Please complete the security check."
      );
      return;
    }

    setSubmitting(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      });

    if (error) {
      console.error(
        "Admin sign-in failed:",
        error.message
      );

      if (
        error.message
          .toLowerCase()
          .includes("captcha")
      ) {
        setErrorMessage(
          "The security check failed. Please complete it again."
        );
      } else {
        setErrorMessage(
          "Unable to sign in. Check your email and password and try again."
        );
      }

      setCaptchaToken("");

      if (window.turnstile) {
        window.turnstile.reset();
      }

      setSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

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
              className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
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
              className="rounded-xl border border-[#284239]/15 bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#e76d61] focus:ring-2 focus:ring-[#e76d61]/15"
            />
          </label>

          <div className="flex justify-center">
            {siteKey ? (
              <div
                className="cf-turnstile"
                data-sitekey={siteKey}
                data-theme="light"
                data-callback="portPetalsAdminTurnstileSuccess"
                data-expired-callback="portPetalsAdminTurnstileExpired"
                data-error-callback="portPetalsAdminTurnstileError"
              />
            ) : (
              <p className="text-sm font-medium text-[#a7473f]">
                Security verification is unavailable.
              </p>
            )}
          </div>

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
            disabled={
              submitting ||
              !siteKey ||
              !captchaToken
            }
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e76d61] px-6 py-3 font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Signing In..."
              : "Sign In"}
          </button>
        </div>
      </form>
    </>
  );
}
