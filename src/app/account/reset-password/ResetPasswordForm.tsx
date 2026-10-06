"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Use a password with at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "The passwords do not match."
      );
      return;
    }

    setSubmitting(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setErrorMessage(
        "We couldn't update your password. The reset link may have expired."
      );

      setSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Your password has been updated."
    );

    setSubmitting(false);

    setTimeout(() => {
      router.replace("/account");
      router.refresh();
    }, 1000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-[1.8rem] border border-[#284239]/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#153f32]">
            New Password
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
            ? "Updating..."
            : "Update Password"}
        </button>
      </div>
    </form>
  );
}
