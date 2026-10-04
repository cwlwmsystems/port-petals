"use client";

import {
  FormEvent,
  useState,
} from "react";

type SubmitState =
  | "idle"
  | "sending"
  | "success"
  | "error";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#284239]/15 bg-white px-4 py-3 text-sm text-[#284239] outline-none transition placeholder:text-[#8a978f] focus:border-[#e76d61]/60 focus:ring-2 focus:ring-[#e76d61]/10";

const labelClass =
  "block text-sm font-semibold text-[#153f32]";

const sectionClass =
  "rounded-[1.6rem] border border-[#284239]/10 bg-white p-5 sm:p-7";

const floralOptions = [
  "Bridal bouquet",
  "Bridesmaid bouquets",
  "Junior bridesmaid bouquet",
  "Flower girl flowers",
  "Toss bouquet",
  "Groom boutonniere",
  "Groomsmen boutonnieres",
  "Father/grandfather boutonnieres",
  "Mother/grandmother corsages",
  "Officiant flowers",
  "Arch/arbor florals",
  "Aisle flowers",
  "Ceremony entrance flowers",
  "Altar/front-of-ceremony arrangements",
  "Memorial flowers",
  "Welcome/sign florals",
  "Cocktail table flowers",
  "Guest table centerpieces",
  "Sweetheart table flowers",
  "Head table flowers",
  "Cake flowers",
  "Bar/display flowers",
  "Restroom/detail flowers",
  "Other custom floral pieces",
];

export default function WeddingInquiryForm() {
  const [
    submitState,
    setSubmitState,
  ] =
    useState<SubmitState>(
      "idle"
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const payload = {
      contactName:
        formData.get(
          "contactName"
        ),
      role:
        formData.get("role"),
      partnerName:
        formData.get(
          "partnerName"
        ),
      email:
        formData.get("email"),
      phone:
        formData.get("phone"),
      preferredContact:
        formData.get(
          "preferredContact"
        ),
      weddingDate:
        formData.get(
          "weddingDate"
        ),
      flexibleDate:
        formData.get(
          "flexibleDate"
        ),
      ceremonyLocation:
        formData.get(
          "ceremonyLocation"
        ),
      receptionLocation:
        formData.get(
          "receptionLocation"
        ),
      ceremonySetting:
        formData.get(
          "ceremonySetting"
        ),
      receptionSetting:
        formData.get(
          "receptionSetting"
        ),
      guestCount:
        formData.get(
          "guestCount"
        ),
      plannerName:
        formData.get(
          "plannerName"
        ),
      plannerContact:
        formData.get(
          "plannerContact"
        ),
      weddingStyle:
        formData.get(
          "weddingStyle"
        ),
      weddingColors:
        formData.get(
          "weddingColors"
        ),
      flowerPreferences:
        formData.get(
          "flowerPreferences"
        ),
      flowersToAvoid:
        formData.get(
          "flowersToAvoid"
        ),
      inspiration:
        formData.get(
          "inspiration"
        ),
      budgetRange:
        formData.get(
          "budgetRange"
        ),
      budgetNotes:
        formData.get(
          "budgetNotes"
        ),
      bridalBouquetStyle:
        formData.get(
          "bridalBouquetStyle"
        ),
      bridesmaidCount:
        formData.get(
          "bridesmaidCount"
        ),
      boutonniereCount:
        formData.get(
          "boutonniereCount"
        ),
      corsageCount:
        formData.get(
          "corsageCount"
        ),
      centerpieceCount:
        formData.get(
          "centerpieceCount"
        ),
      centerpieceStyle:
        formData.get(
          "centerpieceStyle"
        ),
      archDetails:
        formData.get(
          "archDetails"
        ),
      ceremonyDetails:
        formData.get(
          "ceremonyDetails"
        ),
      receptionDetails:
        formData.get(
          "receptionDetails"
        ),
      cakeFlowers:
        formData.get(
          "cakeFlowers"
        ),
      memorialFlowers:
        formData.get(
          "memorialFlowers"
        ),
      deliverySetup:
        formData.get(
          "deliverySetup"
        ),
      setupTime:
        formData.get(
          "setupTime"
        ),
      teardownNeeded:
        formData.get(
          "teardownNeeded"
        ),
      floralPieces:
        formData.getAll(
          "floralPieces"
        ),
      additionalNotes:
        formData.get(
          "additionalNotes"
        ),
      website:
        formData.get(
          "website"
        ),
    };

    setSubmitState(
      "sending"
    );

    setErrorMessage("");

    try {
      const response =
        await fetch(
          "/api/wedding-inquiry",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              payload
            ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Unable to send your inquiry."
        );
      }

      setSubmitState(
        "success"
      );

      form.reset();

      window.setTimeout(
        () => {
          document
            .getElementById(
              "wedding-inquiry"
            )
            ?.scrollIntoView({
              behavior:
                "smooth",
              block: "start",
            });
        },
        100
      );
    } catch (error) {
      setSubmitState(
        "error"
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your inquiry."
      );
    }
  }

  if (
    submitState ===
    "success"
  ) {
    return (
      <div className="rounded-[1.8rem] border border-[#31583b]/15 bg-[#edf3e7] p-7 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#31583b]">
          Inquiry Sent
        </p>

        <h3 className="mt-3 font-serif text-3xl font-semibold text-[#153f32]">
          Your wedding inquiry
          has been sent to Port
          Petals.
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#607068]">
          Stacy will have the
          details you submitted
          so she can review your
          wedding date, floral
          needs, style, budget,
          and event logistics
          before following up.
        </p>

        <button
          type="button"
          onClick={() =>
            setSubmitState(
              "idle"
            )
          }
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#284239]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#284239]"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6"
    >
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Website
          <input
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          1. Contact Information
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Your name *
            <input
              required
              name="contactName"
              className={
                inputClass
              }
              placeholder="Full name"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            You are the... *
            <select
              required
              name="role"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                Choose one
              </option>
              <option value="Bride">
                Bride
              </option>
              <option value="Groom">
                Groom
              </option>
              <option value="Partner">
                Partner
              </option>
              <option value="Wedding Planner">
                Wedding Planner
              </option>
              <option value="Coordinator">
                Coordinator
              </option>
              <option value="Parent or Family Member">
                Parent or Family Member
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Partner / couple name
            <input
              name="partnerName"
              className={
                inputClass
              }
              placeholder="Partner or couple name"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Email *
            <input
              required
              type="email"
              name="email"
              className={
                inputClass
              }
              placeholder="you@example.com"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Phone *
            <input
              required
              type="tel"
              name="phone"
              className={
                inputClass
              }
              placeholder="Phone number"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Preferred contact method
            <select
              name="preferredContact"
              className={
                inputClass
              }
              defaultValue="Email"
            >
              <option>
                Email
              </option>
              <option>
                Phone
              </option>
              <option>
                Text
              </option>
            </select>
          </label>
        </div>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          2. Wedding Details
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Wedding date *
            <input
              required
              type="date"
              name="weddingDate"
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Is the date flexible?
            <select
              name="flexibleDate"
              className={
                inputClass
              }
              defaultValue="No"
            >
              <option>No</option>
              <option>Yes</option>
              <option>
                Somewhat
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Ceremony location
            <input
              name="ceremonyLocation"
              className={
                inputClass
              }
              placeholder="Venue, church, park, address, etc."
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Reception location
            <input
              name="receptionLocation"
              className={
                inputClass
              }
              placeholder="Venue or reception location"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Ceremony setting
            <select
              name="ceremonySetting"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Indoor
              </option>
              <option>
                Outdoor
              </option>
              <option>
                Church
              </option>
              <option>
                Barn
              </option>
              <option>
                Garden
              </option>
              <option>
                Other
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Reception setting
            <select
              name="receptionSetting"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Indoor
              </option>
              <option>
                Outdoor
              </option>
              <option>
                Tent
              </option>
              <option>
                Barn
              </option>
              <option>
                Banquet Hall
              </option>
              <option>
                Other
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Estimated guest count
            <input
              type="number"
              min="0"
              name="guestCount"
              className={
                inputClass
              }
              placeholder="Estimated guests"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Wedding planner / coordinator
            <input
              name="plannerName"
              className={
                inputClass
              }
              placeholder="Name, if applicable"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Planner contact information
            <input
              name="plannerContact"
              className={
                inputClass
              }
              placeholder="Email or phone"
            />
          </label>
        </div>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          3. Style & Floral Vision
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Wedding style
            <select
              name="weddingStyle"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select a style
              </option>
              <option>
                Romantic
              </option>
              <option>
                Garden
              </option>
              <option>
                Rustic
              </option>
              <option>
                Classic
              </option>
              <option>
                Elegant
              </option>
              <option>
                Modern
              </option>
              <option>
                Boho
              </option>
              <option>
                Minimal
              </option>
              <option>
                Wildflower
              </option>
              <option>
                Seasonal
              </option>
              <option>
                Not sure yet
              </option>
              <option>
                Other
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Wedding colors
            <input
              name="weddingColors"
              className={
                inputClass
              }
              placeholder="Example: sage, ivory, blush"
            />
          </label>
        </div>

        <label className={`${labelClass} mt-5`}>
          Flowers you love
          <textarea
            name="flowerPreferences"
            rows={3}
            className={
              inputClass
            }
            placeholder="Favorite flowers, greenery, colors, textures, etc."
          />
        </label>

        <label className={`${labelClass} mt-5`}>
          Flowers, colors, or styles to avoid
          <textarea
            name="flowersToAvoid"
            rows={3}
            className={
              inputClass
            }
            placeholder="Anything you definitely do not want"
          />
        </label>

        <label className={`${labelClass} mt-5`}>
          Inspiration and overall vision
          <textarea
            name="inspiration"
            rows={5}
            className={
              inputClass
            }
            placeholder="Describe your wedding look, Pinterest inspiration, dress style, venue feel, favorite arrangements, or anything else that helps explain the vision."
          />
        </label>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          4. Flowers You May Need
        </p>

        <p className="mt-3 text-sm leading-6 text-[#607068]">
          Check everything you
          are considering. You do
          not need to know final
          quantities yet.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {floralOptions.map(
            (option) => (
              <label
                key={
                  option
                }
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#284239]/10 bg-[#faf7f1] p-4 text-sm font-medium text-[#284239]"
              >
                <input
                  type="checkbox"
                  name="floralPieces"
                  value={
                    option
                  }
                  className="mt-0.5 h-4 w-4 accent-[#e76d61]"
                />

                <span>
                  {option}
                </span>
              </label>
            )
          )}
        </div>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          5. Personal Flowers
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Bridal bouquet style
            <select
              name="bridalBouquetStyle"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Compact / round
              </option>
              <option>
                Loose / garden style
              </option>
              <option>
                Cascading
              </option>
              <option>
                Wildflower / organic
              </option>
              <option>
                Minimal
              </option>
              <option>
                Not sure yet
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Number of bridesmaid bouquets
            <input
              type="number"
              min="0"
              name="bridesmaidCount"
              className={
                inputClass
              }
              placeholder="0"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Number of boutonnieres
            <input
              type="number"
              min="0"
              name="boutonniereCount"
              className={
                inputClass
              }
              placeholder="0"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Number of corsages
            <input
              type="number"
              min="0"
              name="corsageCount"
              className={
                inputClass
              }
              placeholder="0"
            />
          </label>
        </div>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          6. Ceremony Flowers
        </p>

        <label className={`${labelClass} mt-5`}>
          Arch / arbor flowers
          <textarea
            name="archDetails"
            rows={3}
            className={
              inputClass
            }
            placeholder="Full arch, corner clusters, greenery, partial coverage, no arch, not sure, etc."
          />
        </label>

        <label className={`${labelClass} mt-5`}>
          Ceremony details
          <textarea
            name="ceremonyDetails"
            rows={4}
            className={
              inputClass
            }
            placeholder="Aisle flowers, altar pieces, entrance arrangements, memorial flowers, reserved-seat flowers, welcome signs, or other ceremony needs."
          />
        </label>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          7. Reception Flowers
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Estimated number of centerpieces
            <input
              type="number"
              min="0"
              name="centerpieceCount"
              className={
                inputClass
              }
              placeholder="0"
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Centerpiece style
            <select
              name="centerpieceStyle"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Low arrangements
              </option>
              <option>
                Tall arrangements
              </option>
              <option>
                Bud vases
              </option>
              <option>
                Greenery
              </option>
              <option>
                Mixed styles
              </option>
              <option>
                Not sure yet
              </option>
            </select>
          </label>
        </div>

        <label className={`${labelClass} mt-5`}>
          Reception details
          <textarea
            name="receptionDetails"
            rows={4}
            className={
              inputClass
            }
            placeholder="Sweetheart table, head table, guest tables, cocktail tables, bar flowers, welcome table, seating chart flowers, fireplace/mantle, etc."
          />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Cake flowers
            <select
              name="cakeFlowers"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Yes
              </option>
              <option>
                No
              </option>
              <option>
                Maybe
              </option>
              <option>
                Not sure
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Memorial flowers
            <select
              name="memorialFlowers"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Yes
              </option>
              <option>
                No
              </option>
              <option>
                Maybe
              </option>
            </select>
          </label>
        </div>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          8. Budget & Logistics
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label
            className={
              labelClass
            }
          >
            Estimated floral budget
            <select
              name="budgetRange"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select a range
              </option>
              <option>
                Under $500
              </option>
              <option>
                $500–$1,000
              </option>
              <option>
                $1,000–$2,000
              </option>
              <option>
                $2,000–$3,500
              </option>
              <option>
                $3,500–$5,000
              </option>
              <option>
                $5,000+
              </option>
              <option>
                Not sure yet
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Delivery / setup
            <select
              name="deliverySetup"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Pickup
              </option>
              <option>
                Delivery only
              </option>
              <option>
                Delivery and setup
              </option>
              <option>
                Not sure yet
              </option>
            </select>
          </label>

          <label
            className={
              labelClass
            }
          >
            Florals need to be ready by
            <input
              type="time"
              name="setupTime"
              className={
                inputClass
              }
            />
          </label>

          <label
            className={
              labelClass
            }
          >
            Teardown / floral removal needed?
            <select
              name="teardownNeeded"
              className={
                inputClass
              }
              defaultValue=""
            >
              <option value="">
                Select
              </option>
              <option>
                Yes
              </option>
              <option>
                No
              </option>
              <option>
                Not sure
              </option>
            </select>
          </label>
        </div>

        <label className={`${labelClass} mt-5`}>
          Budget notes
          <textarea
            name="budgetNotes"
            rows={3}
            className={
              inputClass
            }
            placeholder="Priorities, areas where you would like to spend more or less, or anything Stacy should know about your budget."
          />
        </label>
      </section>

      <section
        className={
          sectionClass
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e76d61]">
          9. Anything Else?
        </p>

        <label className={`${labelClass} mt-5`}>
          Additional notes
          <textarea
            name="additionalNotes"
            rows={6}
            className={
              inputClass
            }
            placeholder="Anything else about the wedding, venue, floral vision, special traditions, family flowers, timing, accessibility, setup, or other details."
          />
        </label>
      </section>

      {submitState ===
        "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="rounded-[1.6rem] bg-[#153f32] p-6 text-white sm:p-7">
        <h3 className="font-serif text-2xl font-semibold">
          Ready to send your
          wedding details?
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          This inquiry is sent
          directly to Stacy at
          Port Petals. Submitting
          the form does not reserve
          the wedding date or create
          a binding order.
        </p>

        <button
          type="submit"
          disabled={
            submitState ===
            "sending"
          }
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e76d61] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#d85b50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState ===
          "sending"
            ? "Sending Inquiry..."
            : "Send Wedding Inquiry"}
        </button>
      </div>
    </form>
  );
}
