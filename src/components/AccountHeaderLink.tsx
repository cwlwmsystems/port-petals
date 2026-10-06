import Link from "next/link";

export default function AccountHeaderLink() {
  return (
    <Link
      href="/account"
      aria-label="Customer account"
      title="Account"
      className="
        group
        inline-flex
        min-h-10
        items-center
        justify-center
        gap-2
        rounded-full
        px-2
        text-[#153f32]
        transition
        hover:bg-[#153f32]/5
        hover:text-[#e76d61]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#e76d61]
        focus-visible:ring-offset-2
        sm:px-3
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      >
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>

      <span className="hidden text-sm font-semibold sm:inline">
        Account
      </span>
    </Link>
  );
}
