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
  { key: "ac", label: "Air Conditioner", icon: Snowflake },
  { key: "cooler", label: "Cooler", icon: Wind },
  { key: "table", label: "Study Table", icon: Table2 },
  { key: "chair", label: "Chair", icon: Armchair },
];

const extraAmenities = [
  { key: "attachedBathroom", label: "Attached Bathroom", icon: Bath },
  { key: "housekeeping", label: "Housekeeping", icon: Sparkles },
  { key: "washingMachine", label: "Washing Machine", icon: WashingMachine },
  { key: "parking", label: "Parking", icon: Car },
  { key: "kitchenAccess", label: "Kitchen Access", icon: UtensilsCrossed },
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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Check size={12} />
            Room Setup
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Configure Room Details
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 max-w-xl">
            Add room facilities and amenities to make your listing more
            attractive for students and working professionals.
          </p>
        </div>

        {/* Sharing Type Badge */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Sharing Type</p>
            <h2 className="mt-0.5 text-sm font-bold text-slate-900">{sharingType}</h2>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            Active
          </div>
        </div>

        {/* Room Amenities */}
        <div className="mt-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Room Amenities</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Select the facilities available inside the room.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roomAmenities.map((item) => {
              const Icon = item.icon;
              const active = Property?.amenities?.[item.key];

              return (
                <button
                  key={item.key}
                  onClick={() => toggleAmenity(item.key)}
                  className={`
                    group relative overflow-hidden rounded-xl border p-3.5
                    text-left transition-all duration-300
                    ${
                      active
                        ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                    }
                  `}
                >
                  <div
                    className={`
                      absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border
                      ${
                        active
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }
                    `}
                  >
                    {active && <Check size={10} />}
                  </div>

                  <div
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center mb-3
                      ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}
                    `}
                  >
                    <Icon size={17} />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900">{item.label}</h4>
                  <p className="mt-0.5 text-[11px] text-slate-400">In this room</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Amenities */}
        <div className="mt-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Additional Facilities</h3>
            <p className="mt-0.5 text-xs text-slate-500">Add extra amenities available for tenants.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {extraAmenities.map((item) => {
              const Icon = item.icon;
              const active = Property?.amenities?.[item.key];

              return (
                <button
                  key={item.key}
                  onClick={() => toggleAmenity(item.key)}
                  className={`
                    rounded-xl border p-3
                    flex items-center justify-between gap-3
                    transition-all duration-300
                    ${
                      active
                        ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                        ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}
                      `}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.label}</p>
                      <p className="text-[11px] text-slate-400">For residents</p>
                    </div>
                  </div>

                  <div
                    className={`
                      w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                      ${active ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"}
                    `}
                  >
                    {active && <Check size={10} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setflowno((prev: number) => prev - 1)}
            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            Back
          </button>

          <button
            onClick={() => setflowno((prev: number) => prev + 1)}
            className="w-full sm:w-auto rounded-xl bg-green-800 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            Continue
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}