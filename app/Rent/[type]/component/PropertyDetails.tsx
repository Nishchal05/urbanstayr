"use client";

import { useState } from "react";
import PlacesInput from "@/app/components/PlacesInput";
import {
  Building2,
  MapPin,
  Phone,
  ChevronRight,
  Check,
} from "lucide-react";

interface FormData {
  pgName: string;
  sector: string;
  street: string;
  area: string;
  contact: string;
  latitude: number;
  longitude: number;
}

export default function PropertyDetails({
  setProperty,
  setflowno,
}: {
  setProperty: any;
  setflowno: any;
}) {
  const [form, setForm] = useState<FormData>({
    pgName: "",
    sector: "",
    street: "",
    area: "",
    contact: "",
    latitude: 0,
    longitude: 0,
  });

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));

  const handleSubmit = () => {
    setProperty((prev: any) => ({
      ...prev,
      name: form.pgName,
      sector: form.sector,
      street: form.street,
      area: form.area,
      location: form.area,
      phone: form.contact,
      latitude: form.latitude,
      longitude: form.longitude,
    }));

    setflowno((prev: number) => prev + 1);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Check size={14} />
            Property Setup
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Add Property Details
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl">
            Fill in your PG information so students and professionals can
            discover your property easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-6">
            {/* PG Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Property / PG Name
              </label>

              <div
                className="
                  flex items-center gap-3
                  rounded-2xl border border-slate-200
                  bg-slate-50 px-4 py-3.5
                  transition-all
                  focus-within:border-emerald-500
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-emerald-100
                "
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <Building2 size={20} />
                </div>

                <input
                  type="text"
                  placeholder="e.g. Sunrise PG for Girls"
                  value={form.pgName}
                  onChange={set("pgName")}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Sector + Street */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Sector */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Sector
                </label>

                <div
                  className="
                    rounded-2xl border border-slate-200
                    bg-slate-50 px-4 py-3.5
                    transition-all
                    focus-within:border-emerald-500
                    focus-within:bg-white
                    focus-within:ring-4
                    focus-within:ring-emerald-100
                  "
                >
                  <input
                    type="text"
                    placeholder="e.g. Sector 22"
                    value={form.sector}
                    onChange={set("sector")}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Street / Road
                </label>

                <div
                  className="
                    rounded-2xl border border-slate-200
                    bg-slate-50 px-4 py-3.5
                    transition-all
                    focus-within:border-emerald-500
                    focus-within:bg-white
                    focus-within:ring-4
                    focus-within:ring-emerald-100
                  "
                >
                  <input
                    type="text"
                    placeholder="e.g. MG Road"
                    value={form.street}
                    onChange={set("street")}
                    className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Area / Locality
              </label>

              <div
                className="
                  rounded-2xl border border-slate-200
                  bg-slate-50 p-2
                  transition-all
                  focus-within:border-emerald-500
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-emerald-100
                "
              >
                <PlacesInput
                  value={form.area}
                  onChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      area: val,
                    }))
                  }
                  onPlaceSelect={(place) =>
                    setForm((prev) => ({
                      ...prev,
                      area: place.name,
                      latitude: place.latitude,
                      longitude: place.longitude,
                    }))
                  }
                  placeholder="Search area or locality"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Contact Number
              </label>

              <div
                className="
                  flex items-center overflow-hidden
                  rounded-2xl border border-slate-200
                  bg-slate-50
                  transition-all
                  focus-within:border-emerald-500
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-emerald-100
                "
              >
                <div className="flex items-center gap-3 border-r border-slate-200 px-4 py-3.5 shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Phone size={18} />
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    +91
                  </span>
                </div>

                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={form.contact}
                  onChange={set("contact")}
                  className="flex-1 bg-transparent px-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Location Preview */}
            {form.area && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm shrink-0">
                    <MapPin size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-emerald-900">
                      Selected Location
                    </p>

                    <p className="mt-1 text-sm text-emerald-700 break-words">
                      {form.area}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setflowno((prev: number) => prev - 1);
                }}
                className="
                  w-full sm:w-auto
                  rounded-2xl border border-slate-300
                  bg-white px-6 py-3
                  text-sm font-semibold text-slate-700
                  hover:bg-slate-50
                  transition-all
                "
              >
                
                Back
              </button>

              <button
                onClick={handleSubmit}
                className="
                  w-full sm:w-auto
                  rounded-2xl bg-emerald-600
                  px-8 py-3
                  text-sm font-semibold text-white
                  shadow-lg shadow-emerald-200
                  hover:bg-emerald-700 hover:scale-[1.01]
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
              >
                Save & Continue
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}