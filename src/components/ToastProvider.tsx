"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone =
  | "success"
  | "error"
  | "info";

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (
    message: string,
    tone?: ToastTone
  ) => void;
};

const ToastContext =
  createContext<ToastContextValue | null>(
    null
  );

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] =
    useState<Toast[]>([]);

  const nextId =
    useRef(1);

  const dismiss =
    useCallback(
      (id: number) => {
        setToasts((current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
        );
      },
      []
    );

  const toast =
    useCallback(
      (
        message: string,
        tone: ToastTone =
          "success"
      ) => {
        const id =
          nextId.current++;

        setToasts((current) => [
          ...current.slice(-2),
          {
            id,
            message,
            tone,
          },
        ]);

        window.setTimeout(
          () => {
            dismiss(id);
          },
          3200
        );
      },
      [dismiss]
    );

  return (
    <ToastContext.Provider
      value={{ toast }}
    >
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end sm:px-0"
      >
        {toasts.map(
          (item) => (
            <ToastItem
              key={item.id}
              toast={item}
              onDismiss={() =>
                dismiss(
                  item.id
                )
              }
            />
          )
        )}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const frame =
      window.requestAnimationFrame(
        () =>
          setVisible(true)
      );

    return () =>
      window.cancelAnimationFrame(
        frame
      );
  }, []);

  const toneClasses = {
    success:
      "border-[#31583b]/15 bg-[#153f32] text-white",
    error:
      "border-[#a7473f]/20 bg-[#7d302a] text-white",
    info:
      "border-[#284239]/15 bg-white text-[#153f32]",
  };

  return (
    <div
      role={
        toast.tone === "error"
          ? "alert"
          : "status"
      }
      className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_16px_45px_rgba(21,63,50,0.22)] backdrop-blur transition-all duration-200 sm:w-auto sm:min-w-[320px] ${
        toneClasses[
          toast.tone
        ]
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          toast.tone ===
          "success"
            ? "bg-white/15"
            : toast.tone ===
                "error"
              ? "bg-white/15"
              : "bg-[#edf3e7]"
        }`}
        aria-hidden="true"
      >
        {toast.tone ===
        "success"
          ? "✓"
          : toast.tone ===
              "error"
            ? "!"
            : "i"}
      </span>

      <p className="min-w-0 flex-1 text-sm font-semibold leading-5">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg opacity-65 transition hover:bg-white/10 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

export function useToast() {
  const context =
    useContext(
      ToastContext
    );

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
}
