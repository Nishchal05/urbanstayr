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
  description: string;
}

export default function PropertyDetails({
  Property,
  setProperty,
  setflowno,
}: {
  Property: any;
  setProperty: any;
  setflowno: any;
}) {
  const [form, setForm] = useState<FormData>({
    pgName: Property?.name || "",
    sector: Property?.sector || "",
    street: Property?.street || "",
    area: Property?.area || "",
    contact: Property?.phone || "",
    latitude: Property?.latitude || 0,
    longitude: Property?.longitude || 0,
    description: Property?.description || "",
  });

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
      description: form.description,
    }));

    setflowno((prev: number) => prev + 1);
  };

  const handleBack = () => {
    // Optionally save state when going back
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
      description: form.description,
    }));
    setflowno((prev: number) => prev - 1);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Check size={12} />
            Property Setup
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Add Property Details
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 max-w-xl">
            Fill in your information so students and professionals can
            discover your property easily.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4">
            
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Property
              </label>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <Building2 size={15} />
                </div>

                <input
                  type="text"
                  placeholder="e.g. Sunrise PG for Girls"
                  value={form.pgName}
                  onChange={set("pgName")}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Sector + Street */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Sector
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                  <input
                    type="text"
                    placeholder="e.g. Sector 22"
                    value={form.sector}
                    onChange={set("sector")}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Street / Road
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                  <input
                    type="text"
                    placeholder="e.g. MG Road"
                    value={form.street}
                    onChange={set("street")}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Area / Locality
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                <PlacesInput
                  value={form.area}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, area: val }))
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
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Contact Number
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                <div className="flex items-center gap-2 border-r border-slate-200 px-3 py-2.5 shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Phone size={13} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">+91</span>
                </div>

                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={form.contact}
                  onChange={set("contact")}
                  className="flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Property Description
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                <textarea
                  rows={4}
                  placeholder="Tell us a bit about your property (amenities, nearby landmarks, atmosphere)..."
                  value={form.description}
                  onChange={set("description")}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 resize-none"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="mt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                Back
              </button>

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto rounded-xl bg-green-800 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                Save & Continue
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}