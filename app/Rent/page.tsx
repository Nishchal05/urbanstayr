"use client";
import { useState } from "react";
import PlacesInput from "../_component/Input";

// ─── Types ─────────────────────────────────────────────────────────────────────
type FormState = {
  name: string; sector: string; area: string; street: string; phone: string;
  location: string;
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

type MainOption = "search" | "sell" | "buy" | "pg";

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
);
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
  </svg>
);
const BuildingIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16M3 21h18M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
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

// ─── Data ──────────────────────────────────────────────────────────────────────
const MAIN_OPTIONS: { id: MainOption; label: string; icon: React.ReactElement; desc: string }[] = [
  { id: "search", label: "Search Property", icon: <SearchIcon />, desc: "Find your dream property" },
  { id: "sell",   label: "Sell Property",   icon: <HomeIcon />,     desc: "List your property for sale" },
  { id: "buy",    label: "Buy Property",    icon: <BuildingIcon />, desc: "Browse properties to buy" },
  { id: "pg",     label: "PG / Hostel",     icon: <MapPinIcon />,   desc: "Find or list PG & hostels" },
];

const PROPERTY_TYPES = ["1 BHK", "2 BHK", "1 RK", "House", "Land", "Villa", "Shop/Commercial", "Flat"];
const FORM_STEPS = ["Basic Info", "Room Details", "Washroom", "Food", "Services", "Photos", "Pricing"];

// ─── Sub-components ────────────────────────────────────────────────────────────
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}
function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group select-none">
      <span
        onClick={onChange}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          checked ? "bg-green-400 border-green-400" : "border-gray-300 group-hover:border-green-400"
        }`}
      >
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              i < current ? "bg-green-400 border-green-400 text-white"
              : i === current ? "bg-white border-green-400 text-green-600"
              : "bg-white border-gray-200 text-gray-400"
            }`}>
              {i < current ? <CheckIcon /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 whitespace-nowrap font-medium ${i === current ? "text-green-600" : "text-gray-400"}`}>
              {stepLabel}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-6 sm:w-10 mx-1 mb-4 transition-all duration-300 ${i < current ? "bg-green-400" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; }
function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-green-100" />
        {title}
        <span className="h-px flex-1 bg-green-100" />
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
function Field({ label, type = "text", placeholder, value, onChange, required = false }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-green-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition bg-white placeholder:text-gray-400"
      />
    </div>
  );
}

interface PhotoUploadProps {
  label: string;
  value: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function PhotoUpload({ label, value, onChange }: PhotoUploadProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-xl py-4 px-3 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 group">
        <UploadIcon />
        <span className="text-xs text-gray-400 mt-1 group-hover:text-green-500 transition-colors">
          {value ? value.name : "Click to upload"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Rent() {
  const [mainOption, setMainOption]     = useState<MainOption | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [step, setStep]                 = useState(0);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState("");

  const [form, setForm] = useState<FormState>({
    name: "", sector: "", area: "", street: "", phone: "", location: "",
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

  const setF = (key: StringKeys) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleF = (key: BooleanKeys) => () =>
    setForm((f) => ({ ...f, [key]: !f[key] }));

  const setFile = (key: FileKeys) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.files?.[0] ?? null }));

  const handleSubmit = async () => {
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
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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

  // ── Success Screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900">Property Listed!</h2>
          <p className="text-gray-500 text-sm">Submitted successfully. Our team will review and publish it shortly.</p>
          <button
            onClick={() => { setSubmitted(false); setMainOption(null); setPropertyType(null); setStep(0); }}
            className="mt-4 px-6 py-2.5 bg-green-400 text-white rounded-xl font-semibold hover:bg-green-500 transition"
          >
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  // ── Landing ──────────────────────────────────────────────────────────────────
  if (!mainOption) {
    return (
      <div className="bg-gradient-to-br from-white via-green-50/40 to-white min-h-screen">
        <main className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-green-700 text-xs font-semibold mb-5 tracking-wide">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              Your Property,<br />
              <span className="text-green-400">Your Way.</span>
            </h1>
            <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed">
              Search, buy, sell or list your PG — everything in one professional platform.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {MAIN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMainOption(opt.id)}
                className="group relative bg-white border-2 border-gray-100 hover:border-green-400 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-green-100 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-400 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 text-green-500 group-hover:text-white">
                  {opt.icon}
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">{opt.label}</p>
                <p className="text-xs text-gray-400">{opt.desc}</p>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-green-400">
                  <ChevronRightIcon />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white border border-green-100 rounded-2xl p-6 grid grid-cols-3 gap-4 text-center shadow-sm">
            {([ ["12,400+", "Properties Listed"], ["98%", "Satisfaction Rate"], ["4.8★", "Partner Rating"] ] as [string, string][]).map(([num, lbl]) => (
              <div key={lbl}>
                <p className="text-2xl font-black text-green-400">{num}</p>
                <p className="text-xs text-gray-400 mt-1">{lbl}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── Property Type Selection ──────────────────────────────────────────────────
  if ((mainOption === "sell" || mainOption === "buy" || mainOption === "pg") && !propertyType) {
    const isPG = mainOption === "pg";
    const types = isPG
      ? ["Single Room", "Double Sharing", "Triple Sharing", "Full Hostel"]
      : PROPERTY_TYPES;

    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setMainOption(null)} className="text-sm text-green-600 flex items-center gap-1 mb-8 hover:underline">
            ← Back
          </button>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {isPG ? "Select PG / Hostel Type" : `Select Property Type to ${mainOption === "sell" ? "Sell" : "Buy"}`}
          </h2>
          <p className="text-gray-400 text-sm mb-8">Choose the type that best describes your property</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setPropertyType(t)}
                className="group border-2 border-gray-100 hover:border-green-400 bg-white rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-green-100 hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 bg-green-50 group-hover:bg-green-400 rounded-xl flex items-center justify-center mb-3 transition-all duration-200 text-green-500 group-hover:text-white">
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
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setMainOption(null)} className="text-sm text-green-600 flex items-center gap-1 mb-8 hover:underline">← Back</button>
          <h2 className="text-3xl font-black text-gray-900 mb-6">Search Properties</h2>
          <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center border-2 border-green-200 rounded-xl overflow-hidden focus-within:border-green-400 transition">
              <span className="px-3 text-green-400"><SearchIcon /></span>
              <input className="flex-1 py-3 pr-4 text-sm outline-none placeholder:text-gray-400" placeholder="Search by location, property name..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((t) => (
                <button key={t} className="border border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 transition-all duration-200">
                  {t}
                </button>
              ))}
            </div>
            <button className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
              <SearchIcon /> Search Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Multi-Step Form ──────────────────────────────────────────────────────────
  const totalSteps = FORM_STEPS.length;

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
              <div className="border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-300">
                <PlacesInput
                  value={form.location}
                  onChange={(val: string) => setForm((f) => ({ ...f, location: val }))}
                  placeholder="Search location (city, area...)"
                />
              </div>
            </Section>
            <Section title="Contact">
              <Field label="Contact Number" type="tel" placeholder="+## ##### #####" value={form.phone} onChange={setF("phone")} required />
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
                  <span
                    onClick={() => setForm((f) => ({ ...f, sharingWashroom: t }))}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      form.sharingWashroom === t ? "border-green-400 bg-green-400" : "border-gray-300"
                    }`}
                  >
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
                  <button
                    key={key}
                    onClick={toggleF(key)}
                    className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      form[key] ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-green-200"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </Section>
            <Section title="Menu Upload">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-xl py-6 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
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
                  <button
                    key={key}
                    onClick={toggleF(key)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      form[key] ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-green-200"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form[key] ? "bg-green-400" : "bg-gray-100"}`}>
                      <CheckIcon />
                    </div>
                    <span className={`text-sm font-semibold ${form[key] ? "text-green-700" : "text-gray-600"}`}>{lbl}</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent <span className="text-green-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="8000"
                      value={form.rent}
                      onChange={setF("rent")}
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Electricity per Unit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="8"
                      value={form.electricity}
                      onChange={setF("electricity")}
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                    />
                  </div>
                </div>
              </div>
            </Section>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">Listing Summary</p>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Type</span><span className="font-semibold text-gray-800">{propertyType ?? "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Name</span><span className="font-semibold text-gray-800">{form.name || "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Location</span><span className="font-semibold text-gray-800">{form.location || [form.sector, form.area].filter(Boolean).join(", ") || "—"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Monthly Rent</span><span className="font-semibold text-green-600">₹{form.rent || "—"}</span></div>
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 text-black">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => { if (step > 0) setStep((s) => s - 1); else setPropertyType(null); }}
          className="text-sm text-green-600 flex items-center gap-1 mb-6 hover:underline"
        >
          ← {step > 0 ? "Previous Step" : "Back"}
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900">
            {step === 0 ? "Basic Information" : FORM_STEPS[step]}
          </h2>
          <p className="text-sm text-gray-400 mt-1">Step {step + 1} of {totalSteps}</p>
        </div>

        <StepIndicator steps={FORM_STEPS} current={step} />

        <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
          {renderStep()}
        </div>

        <div className="flex gap-3 mt-6">
          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 bg-green-400 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
            >
              Continue <ChevronRightIcon />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-green-400 hover:bg-green-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Property <CheckIcon /></>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}