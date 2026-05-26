"use client";

import {
  Coffee,
  Soup,
  UtensilsCrossed,
  Upload,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface FoodProps {
  Property: any;
  setProperty: any;
  setflowno: any;
}

const mealOptions = [
  {
    key: "breakfast",
    label: "Breakfast",
    desc: "Morning meal available",
    icon: Coffee,
  },
  {
    key: "lunch",
    label: "Lunch",
    desc: "Afternoon meal service",
    icon: Soup,
  },
  {
    key: "dinner",
    label: "Dinner",
    desc: "Night meal included",
    icon: UtensilsCrossed,
  },
];

export default function Food({
  Property = {},
  setProperty,
  setflowno,
}: FoodProps) {
  const toggleMeal = (key: string) => {
    setProperty((prev: any) => ({
      ...prev,
      [key]: !prev?.[key],
    }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProperty((prev: any) => ({
      ...prev,
      menu: e.target.files?.[0] || null,
    }));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Check size={14} />
            Food & Dining
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Meal & Food Details
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600">
            Let students know which meals are available at your PG and upload
            the menu for better visibility.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          {/* Meal Selection */}
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Available Meals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the meals provided by your property.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {mealOptions.map((item) => {
                const Icon = item.icon;
                const active = Boolean(Property?.[item.key]);

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleMeal(item.key)}
                    className={`
                      relative overflow-hidden rounded-3xl border p-5
                      text-left transition-all duration-300
                      ${
                        active
                          ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md"
                      }
                    `}
                  >
                    {/* Check */}
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

                    {/* Icon */}
                    <div
                      className={`
                        mb-5 flex h-14 w-14 items-center justify-center rounded-2xl
                        ${
                          active
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      <Icon size={26} />
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.label}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Menu */}
          <div className="mt-10">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Upload Food Menu
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload your menu in image or PDF format.
              </p>
            </div>

            <label
              className="
                group flex cursor-pointer flex-col items-center justify-center
                rounded-3xl border-2 border-dashed border-slate-300
                bg-slate-50 px-6 py-10
                transition-all duration-300
                hover:border-emerald-400 hover:bg-emerald-50
              "
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm transition-all group-hover:bg-emerald-100">
                <Upload
                  size={28}
                  className="text-emerald-600"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Upload Menu File
              </h3>

              <p className="mt-2 text-center text-sm text-slate-500">
                Drag & drop your menu here or click to browse
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG or PDF
              </p>
            </label>

            {/* File Preview */}
            {Property?.menu && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <FileText size={22} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-emerald-900">
                    {Property.menu.name}
                  </p>

                  <p className="text-xs text-emerald-700">
                    Menu uploaded successfully
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Back */}
            <button
              type="button"
              onClick={() =>
                setflowno((prev: number) => prev - 1)
              }
              className="
                flex w-full items-center justify-center gap-2
                rounded-2xl border border-slate-300 bg-white
                px-6 py-3 text-sm font-semibold text-slate-700
                transition-all hover:bg-slate-50
                sm:w-auto
              "
            >
              <ChevronLeft size={18} />
              Back
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setflowno((prev: number) => prev + 1)
              }
              className="
                flex w-full items-center justify-center gap-2
                rounded-2xl bg-emerald-600
                px-8 py-3 text-sm font-semibold text-white
                shadow-lg shadow-emerald-200
                transition-all duration-300
                hover:scale-[1.01] hover:bg-emerald-700
                sm:w-auto
              "
            >
              Save & Continue
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}