"use client";

import { useState } from "react";
import axios from "axios";
import {
  Check,
  Crown,
  Rocket,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface PricingProps {
  Property: any;
  setflowno: any;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    subtitle: "Perfect for getting started",
    description:
      "List your PG and explore the platform without any upfront cost.",
    features: [
      "Free for 3 months",
      "List up to 3 properties",
      "Basic listing visibility",
      "Standard support",
    ],
    icon: ShieldCheck,
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹600",
    subtitle: "Best for growing PG owners",
    description:
      "Boost your property reach with more listings and better visibility.",
    features: [
      "Up to 8 properties",
      "Higher visibility",
      "Priority listing",
      "Email support",
    ],
    icon: Rocket,
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹1000",
    subtitle: "Built for large PG businesses",
    description:
      "Scale your PG business with unlimited listings and premium support.",
    features: [
      "Unlimited properties",
      "Fast customer support",
      "Premium visibility",
      "Business growth tools",
    ],
    icon: Crown,
    highlight: false,
  },
];

export default function Pricing({
  Property,
  setflowno,
}: PricingProps) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createFormData = () => {
    const formData = new FormData();

    Object.entries(Property).forEach(([key, value]: any) => {
      // Flatten amenities object
      if (key === "amenities" && typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]: any) => {
          formData.append(subKey, String(subValue));
        });
      }

      // Multiple Files
      else if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file: File) => {
          formData.append(key, file);
        });
      }

      // Single File
      else if (value instanceof File) {
        formData.append(key, value);
      }

      // Normal Fields
      else if (
        value !== undefined &&
        value !== null
      ) {
        formData.append(key, String(value));
      }
    });

    return formData;
  };

  const handlePlanSelection = async (plan: string) => {
    try {
      setLoading(true);
      setError("");
      setSelectedPlan(plan);

      // Save subscription
      const subscriptionResponse = await axios.put(
        "/api/partner/subscription",
        {
          plan,
        }
      );

      if (
        subscriptionResponse.status >= 200 &&
        subscriptionResponse.status < 300
      ) {
        // Create Property
        const formData = createFormData();

        const propertyResponse = await axios.post(
          "/api/partner/property",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (
          propertyResponse.status >= 200 &&
          propertyResponse.status < 300
        ) {
          setflowno((prev: number) => prev + 1);
        }
      }
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Sparkles size={14} />
            Subscription Plans
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Choose Your Plan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-600">
            Start free and upgrade anytime as your PG business grows.
            Flexible plans designed for every stage.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const active = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`
                  relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm
                  transition-all duration-300
                  ${
                    plan.highlight
                      ? "border-emerald-500 shadow-xl shadow-emerald-100"
                      : "border-slate-200 hover:border-emerald-300 hover:shadow-lg"
                  }
                  ${
                    active
                      ? "ring-4 ring-emerald-100"
                      : ""
                  }
                `}
              >
                {/* Popular Badge */}
                {plan.highlight && (
                  <div className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`
                    flex h-16 w-16 items-center justify-center rounded-2xl
                    ${
                      plan.highlight
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  <Icon size={30} />
                </div>

                {/* Title */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-bold tracking-tight text-slate-900">
                    {plan.price}
                  </span>

                  {plan.price !== "Free" && (
                    <span className="mb-1 text-slate-500">
                      /month
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={12} />
                      </div>

                      <span className="text-sm text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  disabled={loading}
                  onClick={() =>
                    handlePlanSelection(plan.id)
                  }
                  className={`
                    mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3
                    text-sm font-semibold transition-all duration-300
                    ${
                      plan.highlight
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }
                    disabled:cursor-not-allowed disabled:opacity-70
                  `}
                >
                  {loading && selectedPlan === plan.id
                    ? "Processing..."
                    : "Choose Plan"}

                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Demo pricing UI for onboarding flow.
            Plans and pricing can be updated later.
          </p>
        </div>
      </div>
    </section>
  );
}