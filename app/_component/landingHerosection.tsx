"use client";

import { useState, useRef, useEffect } from "react";
import PlacesInput from "./Input";

/* ─── types ─────────────────────────────────────────────────── */
interface Filters {
  type: string;
  furnish: string[];
  minPrice: number;
  maxPrice: number;
  amenities: string[];
  gender: string[];
  sharing: string[];
  food: boolean;
  distance: string;
}

const DEFAULT_FILTERS: Filters = {
  type: "",
  furnish: [],
  minPrice: 2000,
  maxPrice: 30000,
  amenities: [],
  gender: [],
  sharing: [],
  food: false,
  distance: "",
};

/* ─── tiny helpers ───────────────────────────────────────────── */
function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}
function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
function countActiveFilters(f: Filters): number {
  return (
    (f.type ? 1 : 0) +
    f.furnish.length +
    f.amenities.length +
    f.gender.length +
    f.sharing.length +
    (f.food ? 1 : 0) +
    (f.distance ? 1 : 0) +
    (f.minPrice !== DEFAULT_FILTERS.minPrice || f.maxPrice !== DEFAULT_FILTERS.maxPrice ? 1 : 0)
  );
}

/* ─── icons (inline svg, no deps) ───────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const FilterIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 6h16M7 12h10M10 18h4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const ChevronDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CloseIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─── amenity data ───────────────────────────────────────────── */
const AMENITIES = [
  { key: "ac", label: "AC", emoji: "❄️" },
  { key: "kitchen", label: "Kitchen", emoji: "🍳" },
  { key: "washer", label: "Washer", emoji: "🫧" },
  { key: "fridge", label: "Fridge", emoji: "🧊" },
  { key: "parking", label: "Parking", emoji: "🚗" },
  { key: "wifi", label: "WiFi", emoji: "📶" },
  { key: "gym", label: "Gym", emoji: "🏋️" },
  { key: "security", label: "Security", emoji: "🔒" },
  { key: "power", label: "Power backup", emoji: "⚡" },
];

const PROPERTY_TYPES = ["PG", "Rental Flats", "Hostels"];
const FURNISH_OPTIONS = ["Furnished", "Semi-furnished", "Unfurnished"];
const GENDER_OPTIONS = ["Male", "Female", "Co-ed"];
const SHARING_OPTIONS = ["Single", "Double", "Triple", "4+"];
const DISTANCE_OPTIONS = [
  { value: "", label: "Any distance" },
  { value: "metro", label: "Near metro" },
  { value: "college", label: "Near college" },
  { value: "office", label: "Near office hub" },
  { value: "market", label: "Near market" },
];

/* ─── sub-components ─────────────────────────────────────────── */

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#639922]/40
        ${
          active
            ? "bg-[#639922] text-white border-[#639922] shadow-[0_2px_8px_rgba(99,153,34,0.30)]"
            : "bg-white/70 text-[#4a5940] border-[#d4e8b0] hover:border-[#639922] hover:text-[#3b6d11]"
        }
      `}
    >
      {active && (
        <span className="mr-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white/25">
          <CheckIcon />
        </span>
      )}
      {label}
    </button>
  );
}

function TogglePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-all duration-200
        ${
          active
            ? "bg-[#f0f8e8] text-[#3b6d11] border-[#97c459]"
            : "bg-white/60 text-[#7a9460] border-[#e2edcc] hover:border-[#97c459]"
        }
      `}
    >
      {label}
    </button>
  );
}

function AmenityChip({
  emoji,
  label,
  active,
  onClick,
}: {
  emoji: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-medium border transition-all duration-200
        ${
          active
            ? "bg-[#f0f8e8] text-[#3b6d11] border-[#97c459] shadow-[inset_0_0_0_1px_#97c45940]"
            : "bg-white/60 text-[#6b7c5a] border-[#e2edcc] hover:border-[#b8dA70]"
        }
      `}
    >
      <span className="text-[15px] leading-none">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10.5px] font-semibold tracking-[0.10em] text-[#8aa872] uppercase mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-[#e8f0da] my-4" />;
}

function FoodToggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#e2edcc] bg-white/50">
      <div className="flex items-center gap-2.5">
        <span className="text-[17px]">🍽️</span>
        <div>
          <p className="text-[13px] font-medium text-[#1a2e0f]">Meals included</p>
          <p className="text-[11px] text-[#8aa872]">Breakfast / lunch / dinner available</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`
          relative w-10 h-5.5 rounded-full transition-colors duration-300 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-[#639922]/40
          ${on ? "bg-[#639922]" : "bg-[#d4e8b0]"}
        `}
        style={{ width: 40, height: 22 }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-300"
          style={{ transform: on ? "translateX(18px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

/* ─── Price Range component ──────────────────────────────────── */
function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const RANGE_MIN = 0;
  const RANGE_MAX = 50000;
  const pct = (v: number) => ((v - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;

  const handleMin = (v: number) => {
    const clamped = Math.min(v, max - 500);
    onChange(clamped, max);
  };
  const handleMax = (v: number) => {
    const clamped = Math.max(v, min + 500);
    onChange(min, clamped);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="px-3 py-1.5 rounded-lg bg-[#f0f8e8] border border-[#c8e49a]">
          <p className="text-[10px] text-[#8aa872] font-medium">MIN</p>
          <p className="text-[13px] font-semibold text-[#3b6d11]">{fmt(min)}</p>
        </div>
        <div className="flex-1 mx-3 border-t border-dashed border-[#c8e49a]" />
        <div className="px-3 py-1.5 rounded-lg bg-[#f0f8e8] border border-[#c8e49a] text-right">
          <p className="text-[10px] text-[#8aa872] font-medium">MAX</p>
          <p className="text-[13px] font-semibold text-[#3b6d11]">{fmt(max)}</p>
        </div>
      </div>

      {/* dual thumb track */}
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1.5 bg-[#e2edcc] rounded-full" />
        <div
          className="absolute h-1.5 bg-[#639922] rounded-full"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <input
          type="range"
          min={RANGE_MIN}
          max={RANGE_MAX}
          step={500}
          value={min}
          onChange={(e) => handleMin(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: min > RANGE_MAX - 1000 ? 5 : 3 }}
        />
        <input
          type="range"
          min={RANGE_MIN}
          max={RANGE_MAX}
          step={500}
          value={max}
          onChange={(e) => handleMax(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 4 }}
        />
        {/* thumbs visual */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#639922] shadow-[0_1px_4px_rgba(99,153,34,0.35)] -translate-x-1/2 pointer-events-none z-10"
          style={{ left: `${pct(min)}%` }}
        />
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#639922] shadow-[0_1px_4px_rgba(99,153,34,0.35)] -translate-x-1/2 pointer-events-none z-10"
          style={{ left: `${pct(max)}%` }}
        />
      </div>

      {/* quick presets */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "Under ₹5k", min: 0, max: 5000 },
          { label: "₹5k–15k", min: 5000, max: 15000 },
          { label: "₹15k–30k", min: 15000, max: 30000 },
          { label: "30k+", min: 30000, max: 50000 },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.min, preset.max)}
            className={`px-3 py-1 rounded-full text-[11.5px] font-medium border transition-all
              ${
                min === preset.min && max === preset.max
                  ? "bg-[#639922] text-white border-[#639922]"
                  : "text-[#7a9460] border-[#d4e8b0] hover:border-[#97c459]"
              }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── main filter drawer ─────────────────────────────────────── */
function FilterDrawer({
  filters,
  setFilters,
  onClose,
  activeCount,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose: () => void;
  activeCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const set = (partial: Partial<Filters>) => setFilters({ ...filters, ...partial });

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 animate-fadeIn" />

      {/* drawer */}
      <div
        ref={ref}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-[#f8faf3] shadow-[−8px_0_40px_rgba(0,0,0,0.12)] animate-slideIn overflow-y-auto"
      >
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#f8faf3]/95 backdrop-blur border-b border-[#e2edcc]">
          <div className="flex items-center gap-3">
            <FilterIcon />
            <span className="text-[15px] font-semibold text-[#1a2e0f]">Filters</span>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#639922] text-white text-[11px] font-semibold">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[12.5px] font-medium text-[#8aa872] hover:text-[#639922] transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#e2edcc] hover:border-[#97c459] hover:bg-[#f0f8e8] transition-all"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="px-6 space-y-1 pb-28">

          {/* property type */}
          <SectionLabel>Property type</SectionLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {PROPERTY_TYPES.map((t) => (
              <Pill
                key={t}
                label={t}
                active={filters.type === t}
                onClick={() => set({ type: filters.type === t ? "" : t })}
              />
            ))}
          </div>

          <Divider />

          {/* furnishing */}
          <SectionLabel>Furnishing</SectionLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {FURNISH_OPTIONS.map((f) => (
              <TogglePill
                key={f}
                label={f}
                active={filters.furnish.includes(f)}
                onClick={() => set({ furnish: toggle(filters.furnish, f) })}
              />
            ))}
          </div>

          <Divider />

          {/* price */}
          <SectionLabel>Price range</SectionLabel>
          <PriceRange
            min={filters.minPrice}
            max={filters.maxPrice}
            onChange={(min, max) => set({ minPrice: min, maxPrice: max })}
          />

          <Divider />

          {/* amenities */}
          <SectionLabel>Amenities</SectionLabel>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {AMENITIES.map((a) => (
              <AmenityChip
                key={a.key}
                emoji={a.emoji}
                label={a.label}
                active={filters.amenities.includes(a.key)}
                onClick={() => set({ amenities: toggle(filters.amenities, a.key) })}
              />
            ))}
          </div>

          <Divider />

          {/* gender + sharing */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <SectionLabel>Gender</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {GENDER_OPTIONS.map((g) => (
                  <TogglePill
                    key={g}
                    label={g}
                    active={filters.gender.includes(g)}
                    onClick={() => set({ gender: toggle(filters.gender, g) })}
                  />
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Room sharing</SectionLabel>
              <div className="flex flex-col gap-1.5">
                {SHARING_OPTIONS.map((s) => (
                  <TogglePill
                    key={s}
                    label={s}
                    active={filters.sharing.includes(s)}
                    onClick={() => set({ sharing: toggle(filters.sharing, s) })}
                  />
                ))}
              </div>
            </div>
          </div>

          <Divider />

          {/* food */}
          <SectionLabel>Food & meals</SectionLabel>
          <FoodToggle on={filters.food} onChange={(v) => set({ food: v })} />

          <Divider />

          {/* distance */}
          <SectionLabel>Distance from landmark</SectionLabel>
          <div className="relative">
            <select
              value={filters.distance}
              onChange={(e) => set({ distance: e.target.value })}
              className="w-full appearance-none px-4 py-3 rounded-xl border border-[#d4e8b0] bg-white/70 text-[13px] text-[#1a2e0f] focus:outline-none focus:border-[#97c459] focus:ring-2 focus:ring-[#97c459]/20 transition-all cursor-pointer font-medium"
            >
              {DISTANCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8aa872] pointer-events-none">
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* sticky footer */}
        <div className="fixed bottom-0 right-0 w-full max-w-[420px] px-6 py-4 bg-[#f8faf3]/95 backdrop-blur border-t border-[#e2edcc]">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-[#639922] hover:bg-[#4f7a1b] active:scale-[0.98] text-white text-[14px] font-semibold shadow-[0_4px_16px_rgba(99,153,34,0.35)] transition-all duration-200"
          >
            Show results
            {activeCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-[12px]">
                {activeCount} applied
              </span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        .animate-fadeIn { animation: fadeIn 0.2s ease forwards; }
        .animate-slideIn { animation: slideIn 0.3s cubic-bezier(0.32,0.72,0,1) forwards; }
      `}</style>
    </>
  );
}

/* ─── active filter chips (shown below search bar) ───────────── */
function ActiveFilterChips({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const chips: { label: string; remove: () => void }[] = [];

  if (filters.type)
    chips.push({ label: filters.type, remove: () => setFilters({ ...filters, type: "" }) });
  filters.furnish.forEach((f) =>
    chips.push({ label: f, remove: () => setFilters({ ...filters, furnish: filters.furnish.filter((x) => x !== f) }) })
  );
  if (filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice)
    chips.push({
      label: `${fmt(filters.minPrice)} – ${fmt(filters.maxPrice)}`,
      remove: () => setFilters({ ...filters, minPrice: DEFAULT_FILTERS.minPrice, maxPrice: DEFAULT_FILTERS.maxPrice }),
    });
  filters.amenities.forEach((a) => {
    const found = AMENITIES.find((x) => x.key === a);
    chips.push({
      label: found ? found.label : a,
      remove: () => setFilters({ ...filters, amenities: filters.amenities.filter((x) => x !== a) }),
    });
  });
  filters.gender.forEach((g) =>
    chips.push({ label: g, remove: () => setFilters({ ...filters, gender: filters.gender.filter((x) => x !== g) }) })
  );
  filters.sharing.forEach((s) =>
    chips.push({ label: s, remove: () => setFilters({ ...filters, sharing: filters.sharing.filter((x) => x !== s) }) })
  );
  if (filters.food)
    chips.push({ label: "Meals included", remove: () => setFilters({ ...filters, food: false }) });
  if (filters.distance) {
    const opt = DISTANCE_OPTIONS.find((o) => o.value === filters.distance);
    chips.push({ label: opt?.label ?? filters.distance, remove: () => setFilters({ ...filters, distance: "" }) });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3 animate-[fadeUp_0.25s_ease]">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-[#f0f8e8] border border-[#c8e49a] text-[12px] font-medium text-[#3b6d11]"
        >
          {chip.label}
          <button
            onClick={chip.remove}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#c8e49a] transition-colors"
          >
            <CloseIcon />
          </button>
        </span>
      ))}
      <button
        onClick={() => setFilters(DEFAULT_FILTERS)}
        className="text-[12px] text-[#8aa872] hover:text-[#639922] font-medium transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
}

/* ─── main export ────────────────────────────────────────────── */
export default function LandingHeroSection() {
  const [location, setLocation] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const activeCount = countActiveFilters(filters);

  return (
    <>
      <section className="w-full max-h-screen mt-12 flex flex-col justify-center items-center text-center px-6">

        {/* heading */}
        <div className="flex flex-col items-center max-w-2xl">
          <div className="mb-4 px-4 py-1.5 rounded-full border border-[#c8e49a] bg-[#f0f8e8] text-[12px] font-medium text-[#4f7a1b] inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#639922] animate-pulse" />
            10,000+ verified listings across India
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a2e0f] mb-4 leading-tight tracking-tight">
            Find, Compare &amp; Choose Your{" "}
            <span className="text-[#639922]">Perfect Stay</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#4a5940] leading-relaxed max-w-md">
            Explore PGs, hostels, and rental flats with smart filters, real
            insights, and easy comparison — all in one place.
          </p>
        </div>

        {/* search bar */}
        <div className="w-full max-w-2xl mt-9">
          <div className="flex items-center gap-2 bg-white rounded-full border border-[#d4e8b0] px-5 py-1.5 shadow-[0_2px_16px_rgba(99,153,34,0.10)] focus-within:border-[#639922] focus-within:ring-2 focus-within:ring-[#639922]/10 transition-all">
            <SearchIcon />
            <div className="flex-1">
              <PlacesInput
                value={location}
                onChange={setLocation}
                placeholder="Search cities, areas..."
              />
            </div>
            <div className="hidden sm:block w-px h-6 bg-[#d4e8b0] shrink-0" />

            {/* filter button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`
                hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer relative
                ${
                  activeCount > 0
                    ? "border-[#97c459] bg-[#f0f8e8] text-[#3b6d11]"
                    : "border-[#d4e8b0] hover:bg-[#f0f8e8] text-[#3b6d11]"
                }
              `}
            >
              <FilterIcon />
              Filters
              {activeCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#639922] text-white text-[10px] font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            <button className="bg-[#639922] hover:bg-[#4f7a1b] active:scale-95 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-[0_2px_8px_rgba(99,153,34,0.30)]">
              Search
            </button>
          </div>

          {/* active filter chips */}
          <ActiveFilterChips filters={filters} setFilters={setFilters} />
        </div>

        {/* trust badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#7a9460]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97c459]" />
            10,000+ Listings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97c459]" />
            50+ Cities
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#97c459]" />
            Verified Properties
          </span>
        </div>
      </section>

      {/* filter drawer portal */}
      {drawerOpen && (
        <FilterDrawer
          filters={filters}
          setFilters={setFilters}
          onClose={() => setDrawerOpen(false)}
          activeCount={activeCount}
        />
      )}
    </>
  );
}