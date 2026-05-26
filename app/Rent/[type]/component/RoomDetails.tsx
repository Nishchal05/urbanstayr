"use client";

import {
  Snowflake,
  Wind,
  Table2,
  Armchair,
  Bath,
  Sparkles,
  WashingMachine,
  Car,
  UtensilsCrossed,
  Check,
  ChevronRight,
} from "lucide-react";

interface RoomDetailsProps {
  Property: any;
  setProperty: any;
  setflowno: any;
}

const roomAmenities = [
  {
    key: "ac",
    label: "Air Conditioner",
    icon: Snowflake,
  },
  {
    key: "cooler",
    label: "Cooler",
    icon: Wind,
  },
  {
    key: "table",
    label: "Study Table",
    icon: Table2,
  },
  {
    key: "chair",
    label: "Chair",
    icon: Armchair,
  },
];

const extraAmenities = [
  {
    key: "attachedBathroom",
    label: "Attached Bathroom",
    icon: Bath,
  },
  {
    key: "housekeeping",
    label: "Housekeeping",
    icon: Sparkles,
  },
  {
    key: "washingMachine",
    label: "Washing Machine",
    icon: WashingMachine,
  },
  {
    key: "parking",
    label: "Parking",
    icon: Car,
  },
  {
    key: "kitchenAccess",
    label: "Kitchen Access",
    icon: UtensilsCrossed,
  },
];

export default function RoomDetails({
  Property,
  setProperty,
  setflowno,
}: RoomDetailsProps) {
  const sharingType = Property?.propertyType || "Double Sharing";

  const toggleAmenity = (key: string) => {
    setProperty((prev: any) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev?.amenities?.[key],
      },
    }));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Check size={14} />
            Room Setup
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Configure Room Details
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
            Add room facilities and amenities to make your listing more
            attractive for students and working professionals.
          </p>
        </div>

        {/* Sharing Type */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Sharing Type
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {sharingType}
              </h2>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
              Active Room Type
            </div>
          </div>
        </div>

        {/* Room Amenities */}
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Room Amenities
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select the facilities available inside the room.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {roomAmenities.map((item) => {
              const Icon = item.icon;
              const active = Property?.amenities?.[item.key];

              return (
                <button
                  key={item.key}
                  onClick={() => toggleAmenity(item.key)}
                  className={`
                    group relative overflow-hidden rounded-3xl border p-5
                    text-left transition-all duration-300
                    ${
                      active
                        ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md"
                    }
                  `}
                >
                  {/* Active Badge */}
                  <div
                    className={`
                      absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border
                      ${
                        active
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }
                    `}
                  >
                    {active && <Check size={14} />}
                  </div>

                  <div
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                      ${
                        active
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    <Icon size={26} />
                  </div>

                  <h4 className="text-base font-semibold text-slate-900">
                    {item.label}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Included in this room
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Amenities */}
        <div className="mt-10">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Additional Facilities
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add extra amenities available for tenants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {extraAmenities.map((item) => {
              const Icon = item.icon;
              const active = Property?.amenities?.[item.key];

              return (
                <button
                  key={item.key}
                  onClick={() => toggleAmenity(item.key)}
                  className={`
                    rounded-2xl border p-4 sm:p-5
                    flex items-center justify-between gap-4
                    transition-all duration-300
                    ${
                      active
                        ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                        ${
                          active
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="font-semibold text-slate-900 truncate">
                        {item.label}
                      </p>

                      <p className="text-sm text-slate-500">
                        Available for residents
                      </p>
                    </div>
                  </div>

                  <div
                    className={`
                      w-6 h-6 rounded-full border flex items-center justify-center shrink-0
                      ${
                        active
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }
                    `}
                  >
                    {active && <Check size={14} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setflowno((prev: number) => prev - 1)}
            className="
              w-full sm:w-auto rounded-2xl border border-slate-300 bg-white
              px-6 py-3 text-sm font-semibold text-slate-700
              hover:bg-slate-50 transition-all
            "
          >
            Back
          </button>

          <button
            onClick={() => setflowno((prev: number) => prev + 1)}
            className="
              w-full sm:w-auto rounded-2xl bg-emerald-600
              px-8 py-3 text-sm font-semibold text-white
              shadow-lg shadow-emerald-200
              hover:bg-emerald-700 hover:scale-[1.01]
              transition-all duration-300
              flex items-center justify-center gap-2
            "
          >
            Continue
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}