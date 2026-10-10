"use client";

type Props = {
  action:
    () => void |
    Promise<void>;
};

export default function DeleteWorkButton({
  action,
}: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete this manual work item? This cannot be undone."
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#a7473f]/20 bg-white px-5 text-sm font-semibold text-[#a7473f] transition hover:bg-[#fff0ed]"
      >
        Delete Work
      </button>
    </form>
  );
}
