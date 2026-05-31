"use client";

import { useState } from "react";
import axios from "axios";
import {
  IndianRupee,
  Zap,
  Wallet,
  Check,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";

interface PropertyPricingProps {
  Property: any;
  setProperty: any;
  setflowno: any;
}

export default function PropertyPricing({
  Property = {},
  setProperty,
  setflowno,
}: PropertyPricingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProperty((prev: any) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const createFormData = () => {
    const formData = new FormData();

    Object.entries(Property).forEach(([key, value]: any) => {
      if (key === "amenities" && typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]: any) => {
          formData.append(subKey, String(subValue));
        });
      } else if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file: File) => formData.append(key, file));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return formData;
  };

  const handlesubmission = async () => {
    try {
      setError("");
      if (!Property?.rent) {
        setError("Please enter monthly rent");
        return;
      }

      setLoading(true);

      const subscriptionResponse = await axios.get("/api/partner/subscription");

      if (subscriptionResponse.data.subscription) {
        const formData = createFormData();
        const res = await axios.post("/api/partner/property", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status >= 200 && res.status < 300) {
          setflowno((prev: number) => prev + 2);
        }
      } else {
        setflowno((prev: number) => prev + 1);
      }
    } catch (error: any) {
      console.error("Submission failed", error);
      setError(
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Check size={12} />
            Pricing Details
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Add Pricing Information
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 max-w-xl">
            Set your monthly rent and additional charges so students can clearly
            understand the pricing structure.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Rent Amount */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-emerald-300 hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Wallet size={18} />
                </div>
                <div className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-500 shadow-sm">
                  Monthly
                </div>
              </div>

              <div className="mt-3">
                <h2 className="text-sm font-semibold text-slate-900">Rent Amount</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Monthly rent charged per student.
                </p>
              </div>

              <div className="mt-4 flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                <div className="flex items-center gap-1.5 border-r border-slate-200 px-3 py-2.5">
                  <IndianRupee size={14} className="text-emerald-700" />
                  <span className="text-xs font-semibold text-slate-700">INR</span>
                </div>

                <input
                  type="number"
                  value={Property?.rent || ""}
                  onChange={handleChange("rent")}
                  placeholder="e.g. 6500"
                  className="flex-1 bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Electricity Charges */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-emerald-300 hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Zap size={18} />
                </div>
                <div className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-500 shadow-sm">
                  Optional
                </div>
              </div>

              <div className="mt-3">
                <h2 className="text-sm font-semibold text-slate-900">Electricity Charges</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Monthly electricity or utility charges.
                </p>
              </div>

              <div className="mt-4 flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                <div className="flex items-center gap-1.5 border-r border-slate-200 px-3 py-2.5">
                  <IndianRupee size={14} className="text-amber-700" />
                  <span className="text-xs font-semibold text-slate-700">INR</span>
                </div>

                <input
                  type="number"
                  value={Property?.electricity || ""}
                  onChange={handleChange("electricity")}
                  placeholder="e.g. 800"
                  className="flex-1 bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">
                <Receipt size={17} />
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-semibold text-emerald-800">Pricing Preview</h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-[11px] text-slate-500">Monthly Rent</p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      ₹{Property?.rent ? Number(Property.rent).toLocaleString("en-IN") : "0"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3">
                    <p className="text-[11px] text-slate-500">Electricity</p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      ₹{Property?.electricity ? Number(Property.electricity).toLocaleString("en-IN") : "0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
              <p className="text-xs font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              disabled={loading}
              onClick={handlesubmission}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-800 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:scale-[1.01] hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? "Submitting..." : "Submit"}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}