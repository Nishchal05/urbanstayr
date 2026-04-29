"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PlacesInput from "@/app/_component/Input";
import { useAuth } from "@/app/context/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────────────────
type MainOption = "search" | "sell" | "buy" | "pg";

type FormState = {
  name: string; sector: string; area: string; street: string; phone: string;
  location: string;
  latitude: string; longitude: string;
  singleAC: boolean; singleCooler: boolean; singleTable: boolean;
  doubleAC: boolean; doubleCooler: boolean; doubleTable: boolean;
  tripleAC: boolean; tripleCooler: boolean; tripleTable: boolean; tripleFan: boolean;
  attachedWashroom: boolean; sharingWashroom: string;
  breakfast: boolean; lunch: boolean; dinner: boolean; menu: File | null;
  housekeeping: boolean; washingMachine: boolean; parking: boolean; kitchen: boolean;
  photoRooms: File | null; photoWashroom: File | null; photoKitchen: File | null;
  photoProperty: File | null; photoWashing: File | null; photoParking: File | null;
  photoDining: File | null; photoTerrace: File | null;
  rent: string; electricity: string;
};

type BooleanKeys = { [K in keyof FormState]: FormState[K] extends boolean ? K : never }[keyof FormState];
type StringKeys  = { [K in keyof FormState]: FormState[K] extends string  ? K : never }[keyof FormState];
type FileKeys    = { [K in keyof FormState]: FormState[K] extends File | null ? K : never }[keyof FormState];

type PlanId = "free" | "premium" | "pro";

interface Plan {
  id: PlanId; name: string; duration: string; price: string;
  priceNote: string; badge?: string; features: string[];
}

const PLANS: Plan[] = [
  {
    id: "free", name: "Starter", duration: "2 Months", price: "₹0",
    priceNote: "Free forever",
    features: ["1 Property Listing", "Email support"],
  },
  {
    id: "premium", name: "Premium", duration: "6 Months", price: "₹1,000",
    priceNote: "per month", badge: "Most Popular",
    features: ["Unlimited listings", "Priority placement", "Analytics dashboard", "24/7 support"],
  },
  {
    id: "pro", name: "Pro", duration: "9 Months", price: "₹900",
    priceNote: "per month", badge: "Best Value",
    features: ["Everything in Premium", "Featured badge", "Dedicated manager", "Social media boost"],
  },
];

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16M3 21h18M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M12 4v12M8 8l4-4 4 4" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PROPERTY_TYPES = ["1 BHK", "2 BHK", "1 RK", "House", "Land", "Villa", "Shop/Commercial", "Flat"];
const FORM_STEPS = ["Basic Info", "Room Details", "Washroom", "Food", "Services", "Photos", "Pricing"];
const LAST_FORM_STEP = FORM_STEPS.length - 1;

// ─── Sub-components ────────────────────────────────────────────────────────────
interface CheckboxProps { label: string; checked: boolean; onChange: () => void; }
function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group select-none">
      <span onClick={onChange} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${checked ? "bg-[#639922] border-[#639922]" : "border-gray-300 group-hover:border-[#639922]"}`}>
        {checked && <CheckIcon />}
      </span>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

interface StepIndicatorProps { steps: string[]; current: number; }
function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
      {steps.map((stepLabel, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${i < current ? "bg-[#639922] border-[#639922] text-white" : i === current ? "bg-white border-[#639922] text-[#639922]" : "bg-white border-gray-200 text-gray-400"}`}>
              {i < current ? <CheckIcon /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 whitespace-nowrap font-medium ${i === current ? "text-[#639922]" : "text-gray-400"}`}>{stepLabel}</span>
          </div>
          {i < steps.length - 1 && <div className={`h-0.5 w-6 sm:w-10 mx-1 mb-4 transition-all duration-300 ${i < current ? "bg-[#639922]" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; }
function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-[#639922] uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-[#e8f0da]" />{title}<span className="h-px flex-1 bg-[#e8f0da]" />
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}
function Field({ label, type = "text", placeholder, value, onChange, required = false }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-[#639922]">*</span>}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#639922] focus:border-[#639922] transition bg-white placeholder:text-gray-400" />
    </div>
  );
}

interface PhotoUploadProps { label: string; value: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }
function PhotoUpload({ label, value, onChange }: PhotoUploadProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e8f0da] rounded-xl py-4 px-3 cursor-pointer hover:border-[#639922] hover:bg-[#f0f7e6] transition-all duration-200 group">
        <UploadIcon />
        <span className="text-xs text-gray-400 mt-1 group-hover:text-[#639922] transition-colors">{value ? value.name : "Click to upload"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}

// ─── Plan Card ─────────────────────────────────────────────────────────────────
interface PlanCardProps { plan: Plan; selected: boolean; onSelect: () => void; }
function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  const isPopular = plan.id === "premium";
  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
        selected
          ? "border-[#639922] bg-[#f0f7e6] shadow-lg shadow-[#639922]/20"
          : "border-gray-200 bg-white hover:border-[#639922] hover:shadow-md"
      }`}
    >
      {plan.badge && (
        <span className={`absolute -top-3 left-4 text-[10px] font-bold px-3 py-1 rounded-full ${isPopular ? "bg-[#639922] text-white" : "bg-amber-400 text-white"}`}>
          {plan.badge}
        </span>
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-black text-gray-900 text-base">{plan.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{plan.duration}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-black ${selected ? "text-[#639922]" : "text-gray-800"}`}>{plan.price}</p>
          <p className="text-[10px] text-gray-400">{plan.priceNote}</p>
        </div>
      </div>
      <ul className="space-y-1.5 mb-4">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${selected ? "bg-[#639922]" : "bg-gray-100"}`}>
              <svg className={`w-2.5 h-2.5 ${selected ? "text-white" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition-all ${selected ? "bg-[#639922] text-white" : "bg-gray-100 text-gray-500"}`}>
        {selected ? "✓ Selected" : "Select Plan"}
      </div>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Rent() {
  const params = useParams();
  const router = useRouter();

  // Derive mainOption from the URL param — no useState needed
  const mainOption = (params?.type as MainOption) ?? "sell";

  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [step, setStep]                 = useState(0);
  const [showPlanScreen, setShowPlanScreen] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState("");

  // Subscription
  const [subLoading, setSubLoading]           = useState(true);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [selectedPlan, setSelectedPlan]       = useState<PlanId | null>(null);
  const [planSubmitting, setPlanSubmitting]   = useState(false);
  const [planError, setPlanError]             = useState("");

  const [form, setForm] = useState<FormState>({
    name: "", sector: "", area: "", street: "", phone: "", location: "",
    latitude: "", longitude: "",
    singleAC: false, singleCooler: false, singleTable: false,
    doubleAC: false, doubleCooler: false, doubleTable: false,
    tripleAC: false, tripleCooler: false, tripleTable: false, tripleFan: false,
    attachedWashroom: false, sharingWashroom: "",
    breakfast: false, lunch: false, dinner: false, menu: null,
    housekeeping: false, washingMachine: false, parking: false, kitchen: false,
    photoRooms: null, photoWashroom: null, photoKitchen: null,
    photoProperty: null, photoWashing: null, photoParking: null,
    photoDining: null, photoTerrace: null,
    rent: "", electricity: "",
  });

  const { user } = useAuth();

  // ── Auth redirect (safe — inside useEffect) ──────────────────────────────────
  useEffect(() => {
    if (!user) {
      router.push("/Login");
    }
  }, [user, router]);

  // ── Fetch subscription status on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await fetch("/api/partner/subscription");
        const data = await res.json();
        setHasSubscription(!!(data?.subscription));
      } catch {
        setHasSubscription(false);
      } finally {
        setSubLoading(false);
      }
    };
    fetchSub();
  }, []);

  const setF    = (key: StringKeys)  => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleF = (key: BooleanKeys) => () => setForm((f) => ({ ...f, [key]: !f[key] }));
  const setFile = (key: FileKeys)    => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.files?.[0] ?? null }));

  const handleFormComplete = () => {
    if (!hasSubscription) {
      setShowPlanScreen(true);
    } else {
      submitProperty();
    }
  };

  const submitProperty = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/partner/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, propertyType, listingType: mainOption }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      setShowPlanScreen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlanAndSubmit = async () => {
    if (!selectedPlan) { setPlanError("Please select a plan to continue."); return; }
    setPlanSubmitting(true);
    setPlanError("");
    try {
      const res = await fetch("/api/partner/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      if (!res.ok) throw new Error("Failed to set subscription");
      setHasSubscription(true);
      await submitProperty();
    } catch {
      setPlanError("Could not activate plan. Please try again.");
    } finally {
      setPlanSubmitting(false);
    }
  };

  const mealItems: { key: BooleanKeys; lbl: string }[] = [
    { key: "breakfast", lbl: "Breakfast" },
    { key: "lunch",     lbl: "Lunch" },
    { key: "dinner",    lbl: "Dinner" },
  ];

  const serviceItems: { key: BooleanKeys; lbl: string }[] = [
    { key: "housekeeping",   lbl: "Housekeeping" },
    { key: "washingMachine", lbl: "Washing Machine" },
    { key: "parking",        lbl: "Parking" },
    { key: "kitchen",        lbl: "Kitchen Access" },
  ];

  const photoItems: { key: FileKeys; lbl: string }[] = [
    { key: "photoRooms",    lbl: "Rooms" },
    { key: "photoWashroom", lbl: "Washroom" },
    { key: "photoKitchen",  lbl: "Kitchen" },
    { key: "photoProperty", lbl: "Whole Property" },
    { key: "photoWashing",  lbl: "Washing Area" },
    { key: "photoParking",  lbl: "Parking Area" },
    { key: "photoDining",   lbl: "Dining Area" },
    { key: "photoTerrace",  lbl: "Terrace Space" },
  ];

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (subLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f7e6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[#639922]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400 font-medium">Checking your account...</p>
        </div>
      </div>
    );
  }

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f7e6] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 bg-[#639922] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#639922]/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#639922]">Property Listed!</h2>
          <p className="text-gray-500 text-sm">Submitted successfully. Our team will review and publish it shortly.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setPropertyType(null);
              setStep(0);
              setShowPlanScreen(false);
              router.push("/Rent");
            }}
            className="mt-4 px-6 py-2.5 bg-[#639922] text-white rounded-xl font-semibold hover:bg-[#507a1b] transition"
          >
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  // ── Plan Selection Screen ────────────────────────────────────────────────────
  if (showPlanScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f7e6] text-black">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => setShowPlanScreen(false)}
            className="text-sm text-[#639922] flex items-center gap-1 mb-8 hover:underline"
          >
            ← Back to Form
          </button>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#f0f7e6] border border-[#e8f0da] rounded-full px-4 py-1.5 text-[#639922] text-xs font-semibold mb-4">
              <StarIcon /> One Last Step
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Your listing is ready! Select a plan to publish it. You can upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 mt-6">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mb-6">
            All plans include secure listing, partner dashboard access, and lead management.
          </p>

          {planError && <p className="text-sm text-red-500 text-center mb-4">{planError}</p>}
          {error     && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

          <button
            onClick={handlePlanAndSubmit}
            disabled={planSubmitting || submitting || !selectedPlan}
            className="w-full bg-[#639922] hover:bg-[#507a1b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#639922]/20"
          >
            {(planSubmitting || submitting) ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {planSubmitting ? "Activating Plan..." : "Submitting Property..."}
              </>
            ) : (
              <>Activate Plan & Submit Listing <ChevronRightIcon /></>
            )}
          </button>
        </main>
      </div>
    );
  }

  // ── Property Type Selection ──────────────────────────────────────────────────
  if ((mainOption === "sell" || mainOption === "buy" || mainOption === "pg") && !propertyType) {
    const isPG = mainOption === "pg";
    const types = isPG ? ["Single Room", "Double Sharing", "Triple Sharing", "Full Hostel"] : PROPERTY_TYPES;
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f7e6] p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.push("/Rent")} className="text-sm text-[#639922] flex items-center gap-1 mb-8 hover:underline">← Back</button>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {isPG ? "Select PG / Hostel Type" : `Select Property Type to ${mainOption === "sell" ? "Sell" : "Buy"}`}
          </h2>
          <p className="text-gray-400 text-sm mb-8">Choose the type that best describes your property</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {types.map((t) => (
              <button key={t} onClick={() => setPropertyType(t)}
                className="group border-2 border-gray-100 hover:border-[#639922] bg-white rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-[#639922]/20 hover:-translate-y-0.5">
                <div className="w-9 h-9 bg-[#f0f7e6] group-hover:bg-[#639922] rounded-xl flex items-center justify-center mb-3 transition-all duration-200 text-[#639922] group-hover:text-white">
                  <BuildingIcon />
                </div>
                <p className="font-bold text-gray-800 text-sm">{t}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Search Mode ──────────────────────────────────────────────────────────────
  if (mainOption === "search") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f7e6] p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.push("/")} className="text-sm text-[#639922] flex items-center gap-1 mb-8 hover:underline">← Back</button>
          <h2 className="text-3xl font-black text-gray-900 mb-6">Search Properties</h2>
          <div className="bg-white border border-[#e8f0da] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center border-2 border-[#e8f0da] rounded-xl overflow-hidden focus-within:border-[#639922] transition">
              <span className="px-3 text-[#639922]"><SearchIcon /></span>
              <input className="flex-1 py-3 pr-4 text-sm outline-none placeholder:text-gray-400" placeholder="Search by location, property name..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((t) => (
                <button key={t} className="border border-gray-200 hover:border-[#639922] hover:bg-[#f0f7e6] rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 transition-all duration-200">{t}</button>
              ))}
            </div>
            <button className="w-full bg-[#639922] hover:bg-[#507a1b] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
              <SearchIcon /> Search Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Multi-Step Form ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 text-black">
            <Section title="Property / PG Details">
              <Field label="Property / PG Name" placeholder="e.g. Green Heights PG" value={form.name} onChange={setF("name")} required />
            </Section>
            <Section title="Location Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Sector" placeholder="Sector 21" value={form.sector} onChange={setF("sector")} />
                <Field label="Area" placeholder="Civil Lines" value={form.area} onChange={setF("area")} />
                <Field label="Street" placeholder="Street No. 4" value={form.street} onChange={setF("street")} />
              </div>
            </Section>
            <Section title="Map Location">
              <div className="border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#639922]">
                <PlacesInput
                  value={form.location}
                  onChange={(val: string) => setForm((f) => ({ ...f, location: val }))}
                  placeholder="Search location (city, area...)"
                />
              </div>
            </Section>
            <Section title="Contact">
              <Field label="Contact Number" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={setF("phone")} required />
            </Section>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <Section title="Single Sharing">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Checkbox label="AC"            checked={form.singleAC}     onChange={toggleF("singleAC")} />
                <Checkbox label="Non-AC"        checked={!form.singleAC}    onChange={toggleF("singleAC")} />
                <Checkbox label="Cooler"        checked={form.singleCooler} onChange={toggleF("singleCooler")} />
                <Checkbox label="Table + Chair" checked={form.singleTable}  onChange={toggleF("singleTable")} />
              </div>
            </Section>
            <Section title="Double Sharing">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Checkbox label="AC"            checked={form.doubleAC}     onChange={toggleF("doubleAC")} />
                <Checkbox label="Non-AC"        checked={!form.doubleAC}    onChange={toggleF("doubleAC")} />
                <Checkbox label="Cooler"        checked={form.doubleCooler} onChange={toggleF("doubleCooler")} />
                <Checkbox label="Table + Chair" checked={form.doubleTable}  onChange={toggleF("doubleTable")} />
              </div>
            </Section>
            <Section title="Triple Sharing">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Checkbox label="AC"            checked={form.tripleAC}     onChange={toggleF("tripleAC")} />
                <Checkbox label="Cooler"        checked={form.tripleCooler} onChange={toggleF("tripleCooler")} />
                <Checkbox label="Fan"           checked={form.tripleFan}    onChange={toggleF("tripleFan")} />
                <Checkbox label="Table + Chair" checked={form.tripleTable}  onChange={toggleF("tripleTable")} />
              </div>
            </Section>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <Section title="Washroom Type">
              <Checkbox label="Attached Washroom" checked={form.attachedWashroom} onChange={toggleF("attachedWashroom")} />
            </Section>
            <Section title="Sharing Type">
              {(["Single", "Double", "Triple"] as const).map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                  <span onClick={() => setForm((f) => ({ ...f, sharingWashroom: t }))}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.sharingWashroom === t ? "border-[#639922] bg-[#639922]" : "border-gray-300"}`}>
                    {form.sharingWashroom === t && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm text-gray-700">{t} Sharing</span>
                </label>
              ))}
            </Section>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <Section title="Meals Provided">
              <div className="grid grid-cols-3 gap-3">
                {mealItems.map(({ key, lbl }) => (
                  <button key={key} onClick={toggleF(key)}
                    className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${form[key] ? "border-[#639922] bg-[#f0f7e6] text-[#639922]" : "border-gray-200 text-gray-500 hover:border-[#e8f0da]"}`}>
                    {lbl}
                  </button>
                ))}
              </div>
            </Section>
            <Section title="Menu Upload">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#e8f0da] rounded-xl py-6 cursor-pointer hover:border-[#639922] hover:bg-[#f0f7e6] transition-all">
                <UploadIcon />
                <p className="text-sm text-gray-400 mt-2">{form.menu ? form.menu.name : "Upload Menu PDF"}</p>
                <p className="text-xs text-gray-300 mt-1">PDF format only</p>
                <input type="file" accept=".pdf" className="hidden" onChange={setFile("menu")} />
              </label>
            </Section>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Section title="Available Services">
              <div className="grid grid-cols-2 gap-4">
                {serviceItems.map(({ key, lbl }) => (
                  <button key={key} onClick={toggleF(key)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${form[key] ? "border-[#639922] bg-[#f0f7e6]" : "border-gray-200 hover:border-[#e8f0da]"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form[key] ? "bg-[#639922]" : "bg-gray-100"}`}><CheckIcon /></div>
                    <span className={`text-sm font-semibold ${form[key] ? "text-[#639922]" : "text-gray-600"}`}>{lbl}</span>
                  </button>
                ))}
              </div>
            </Section>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Section title="Upload Property Photos">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photoItems.map(({ key, lbl }) => (
                  <PhotoUpload key={key} label={lbl} value={form[key]} onChange={setFile(key)} />
                ))}
              </div>
            </Section>
          </div>
        );

      case 6:
        return (
          <div className="space-y-5 text-black">
            <Section title="Pricing Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent <span className="text-[#639922]">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                    <input type="number" placeholder="8000" value={form.rent} onChange={setF("rent")}
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#639922] focus:border-[#639922] transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Electricity per Unit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                    <input type="number" placeholder="8" value={form.electricity} onChange={setF("electricity")}
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#639922] focus:border-[#639922] transition" />
                  </div>
                </div>
              </div>
            </Section>
            <div className="bg-[#f0f7e6] border border-[#e8f0da] rounded-2xl p-5 space-y-2">
              <p className="text-xs font-semibold text-[#639922] uppercase tracking-widest mb-3">Listing Summary</p>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span><span className="font-semibold text-gray-800">{propertyType ?? "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Name</span><span className="font-semibold text-gray-800">{form.name || "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Location</span><span className="font-semibold text-gray-800">{form.location || [form.sector, form.area].filter(Boolean).join(", ") || "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Monthly Rent</span><span className="font-semibold text-[#639922]">₹{form.rent || "—"}</span></div>
            </div>
            {!hasSubscription && (
              <p className="text-xs text-center text-gray-400">
                You'll choose a subscription plan on the next screen before publishing.
              </p>
            )}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f0f7e6] text-black">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => {
            if (step > 0) setStep((s) => s - 1);
            else setPropertyType(null);
          }}
          className="text-sm text-[#639922] flex items-center gap-1 mb-6 hover:underline"
        >
          ← {step > 0 ? "Previous Step" : "Back"}
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900">{step === 0 ? "Basic Information" : FORM_STEPS[step]}</h2>
          <p className="text-sm text-gray-400 mt-1">Step {step + 1} of {FORM_STEPS.length}</p>
        </div>

        <StepIndicator steps={FORM_STEPS} current={step} />

        <div className="bg-white border border-[#e8f0da] rounded-2xl p-6 shadow-sm">{renderStep()}</div>

        <div className="flex gap-3 mt-6">
          {step < LAST_FORM_STEP ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 bg-[#639922] hover:bg-[#507a1b] text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#639922]/20"
            >
              Continue <ChevronRightIcon />
            </button>
          ) : (
            <button
              onClick={handleFormComplete}
              disabled={submitting}
              className="flex-1 bg-[#639922] hover:bg-[#507a1b] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#639922]/20"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : hasSubscription ? (
                <>Submit Property <CheckIcon /></>
              ) : (
                <>Review & Choose Plan <ChevronRightIcon /></>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}