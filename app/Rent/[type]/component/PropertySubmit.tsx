"use client";

import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function PropertySubmit() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[85vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-200 blur-2xl" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={52} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Sparkles size={14} />
              Submission Successful
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Property Submitted Successfully
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your property details have been received successfully.
              Our verification team will carefully review your
              listing and get back to you within{" "}
              <span className="font-semibold text-slate-900">
                24–48 hours
              </span>
              .
            </p>
          </div>

          {/* Status Cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <CheckCircle2 size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Submission Received
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your onboarding request is now in our system.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                <Clock3 size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Under Review
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Our team will verify property details and images.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <ShieldCheck size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                Approval Process
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Once approved, your property will go live.
              </p>
            </div>
          </div>

          {/* Thank You */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              Thank you for choosing{" "}
              <span className="font-semibold text-emerald-700">
                UrbanStayr
              </span>
              . We’re excited to help you grow your PG business
              and connect with more students and working
              professionals.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <button
              className="
                inline-flex items-center gap-2 rounded-2xl
                bg-emerald-600 px-6 py-3 text-sm font-semibold
                text-white shadow-lg shadow-emerald-200
                transition-all duration-300
                hover:scale-[1.02] hover:bg-emerald-700
              "
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}