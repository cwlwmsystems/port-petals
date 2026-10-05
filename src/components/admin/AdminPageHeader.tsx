import type {
  ReactNode,
} from "react";
import Link from "next/link";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#284239]/10 pb-5 sm:gap-5 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={
              backHref
            }
            className="mb-4 inline-flex text-sm font-semibold text-[#607068] transition hover:text-[#e76d61]"
          >
            ←{" "}
            {
              backLabel ??
              "Back"
            }
          </Link>
        )}

        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
            {
              eyebrow
            }
          </p>
        )}

        <h1 className="mt-1 break-words font-serif text-3xl font-semibold tracking-tight text-[#153f32] sm:text-4xl">
          {
            title
          }
        </h1>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#607068] sm:text-base">
            {
              description
            }
          </p>
        )}
      </div>

      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:shrink-0 lg:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
