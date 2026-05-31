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
  { key: "breakfast", label: "Breakfast", desc: "Morning meal available", icon: Coffee },
  { key: "lunch", label: "Lunch", desc: "Afternoon meal service", icon: Soup },
  { key: "dinner", label: "Dinner", desc: "Night meal included", icon: UtensilsCrossed },
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProperty((prev: any) => ({
      ...prev,
      menu: e.target.files?.[0] || null,
    }));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Check size={12} />
            Food & Dining
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Meal & Food Details
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 max-w-xl">
            Let students know which meals are available at your PG and upload
            the menu for better visibility.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          {/* Meal Selection */}
          <div>
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-slate-800">Available Meals</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Select the meals provided by your property.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mealOptions.map((item) => {
                const Icon = item.icon;
                const active = Boolean((Property as any)?.[item.key]);

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleMeal(item.key)}
                    className={`
                      relative overflow-hidden rounded-xl border p-3.5
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
                        ${active ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"}
                      `}
                    >
                      {active && <Check size={10} />}
                    </div>

                    <div
                      className={`
                        mb-3 flex h-10 w-10 items-center justify-center rounded-lg
                        ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}
                      `}
                    >
                      <Icon size={18} />
                    </div>

                    <h3 className="text-xs font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Menu */}
          <div className="mt-6">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-slate-800">Upload Food Menu</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Upload your menu in image or PDF format.
              </p>
            </div>

            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-6 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-50">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition-all group-hover:bg-emerald-100">
                <Upload size={20} className="text-emerald-600" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-800">Upload Menu File</h3>
              <p className="mt-1 text-center text-xs text-slate-500">
                Drag & drop or click to browse
              </p>
              <p className="mt-0.5 text-xs text-slate-400">JPG, PNG or PDF</p>
            </label>

            {/* File Preview */}
            {(Property as any)?.menu && (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                  <FileText size={16} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-emerald-900">
                    {(Property as any).menu.name}
                  </p>
                  <p className="text-[11px] text-emerald-600">Menu uploaded successfully</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setflowno((prev: number) => prev - 1)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 sm:w-auto"
            >
              <ChevronLeft size={15} />
              Back
            </button>

            <button
              type="button"
              onClick={() => setflowno((prev: number) => prev + 1)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-800 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:scale-[1.01] hover:bg-emerald-700 sm:w-auto"
            >
              Save & Continue
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}