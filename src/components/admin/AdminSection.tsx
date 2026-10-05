import type {
  ReactNode,
} from "react";

type Props = {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
};

export default function AdminSection({
  title,
  eyebrow,
  description,
  actions,
  children,
  className = "",
  flush = false,
}: Props) {
  const hasHeader =
    Boolean(
      title ||
      eyebrow ||
      description ||
      actions
    );

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#284239]/10 bg-white shadow-[0_1px_3px_rgba(21,63,50,0.05)] ${className}`}
    >
      {hasHeader && (
        <div className="flex flex-col gap-3 border-b border-[#284239]/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e76d61]">
                {
                  eyebrow
                }
              </p>
            )}

            {title && (
              <h2 className="mt-0.5 font-serif text-xl font-semibold text-[#153f32] sm:text-2xl">
                {
                  title
                }
              </h2>
            )}

            {description && (
              <p className="mt-1 text-sm text-[#718078]">
                {
                  description
                }
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div
        className={
          flush
            ? ""
            : "p-5 sm:p-6"
        }
      >
        {children}
      </div>
    </section>
  );
}
