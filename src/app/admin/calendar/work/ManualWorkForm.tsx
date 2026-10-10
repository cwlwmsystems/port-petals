type ManualWorkValues = {
  title?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  source?: string | null;
  work_type?: string | null;
  production_start_date?: string | null;
  due_date?: string | null;
  due_time?: string | null;
  fulfillment_type?: string | null;
  status?: string | null;
  notes?: string | null;
};

type Props = {
  action:
    | ((formData: FormData) => void)
    | ((formData: FormData) => Promise<void>);
  values?: ManualWorkValues;
  submitLabel: string;
};

const inputClass =
  "min-h-11 rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base outline-none transition focus:border-[#e76d61]";

export default function ManualWorkForm({
  action,
  values = {},
  submitLabel,
}: Props) {
  return (
    <form
      action={action}
      className="mt-6 space-y-5"
    >
      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Work Details
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Customer & Job
        </h2>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Work Title *
            </span>

            <input
              type="text"
              name="title"
              required
              defaultValue={
                values.title ?? ""
              }
              placeholder="Example: Smith Funeral Arrangement"
              className={
                inputClass
              }
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Customer Name
              </span>

              <input
                type="text"
                name="customer_name"
                defaultValue={
                  values.customer_name ??
                  ""
                }
                placeholder="Optional"
                className={
                  inputClass
                }
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Customer Phone
              </span>

              <input
                type="tel"
                name="customer_phone"
                defaultValue={
                  values.customer_phone ??
                  ""
                }
                placeholder="Optional"
                className={
                  inputClass
                }
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Source *
              </span>

              <select
                name="source"
                required
                defaultValue={
                  values.source ??
                  "other"
                }
                className={
                  inputClass
                }
              >
                <option value="walk-in">
                  Walk-In
                </option>

                <option value="phone">
                  Phone
                </option>

                <option value="facebook">
                  Facebook / Messenger
                </option>

                <option value="email">
                  Email
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">
                Work Type *
              </span>

              <select
                name="work_type"
                required
                defaultValue={
                  values.work_type ??
                  "flowers"
                }
                className={
                  inputClass
                }
              >
                <option value="flowers">
                  Flowers
                </option>

                <option value="apparel">
                  Apparel
                </option>

                <option value="custom-gift">
                  Custom Gift
                </option>

                <option value="gator-gear">
                  Gator Gear
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Production
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Schedule & Fulfillment
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Production Start *
            </span>

            <input
              type="date"
              name="production_start_date"
              required
              defaultValue={
                values.production_start_date ??
                ""
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Due / Fulfillment Date *
            </span>

            <input
              type="date"
              name="due_date"
              required
              defaultValue={
                values.due_date ??
                ""
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Due Time
            </span>

            <input
              type="time"
              name="due_time"
              defaultValue={
                values.due_time
                  ? String(
                      values.due_time
                    ).slice(
                      0,
                      5
                    )
                  : ""
              }
              className={
                inputClass
              }
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Fulfillment *
            </span>

            <select
              name="fulfillment_type"
              required
              defaultValue={
                values.fulfillment_type ??
                "pickup"
              }
              className={
                inputClass
              }
            >
              <option value="pickup">
                Pickup
              </option>

              <option value="delivery">
                Delivery
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#284239]/10 bg-white p-5 shadow-[0_1px_3px_rgba(21,63,50,0.05)] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e76d61]">
          Management
        </p>

        <h2 className="mt-1 font-serif text-xl font-semibold text-[#153f32]">
          Status & Notes
        </h2>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Status *
            </span>

            <select
              name="status"
              required
              defaultValue={
                values.status ??
                "scheduled"
              }
              className={
                inputClass
              }
            >
              <option value="scheduled">
                Scheduled
              </option>

              <option value="in_production">
                In Production
              </option>

              <option value="ready">
                Ready
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">
              Notes
            </span>

            <textarea
              name="notes"
              rows={8}
              defaultValue={
                values.notes ?? ""
              }
              placeholder="Special instructions, colors, products, customer requests, payment notes, etc."
              className="resize-y rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-base leading-6 outline-none transition focus:border-[#e76d61]"
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#284239] px-6 text-sm font-semibold text-white transition hover:bg-[#1d332b]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
