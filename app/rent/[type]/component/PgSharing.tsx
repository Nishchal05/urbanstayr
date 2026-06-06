import { useState, Dispatch, SetStateAction } from "react";
import { Check } from "lucide-react";

interface PgSharingProps {
  Property: any;
  setProperty: Dispatch<SetStateAction<any>>;
  setflowno: Dispatch<SetStateAction<number>>;
}

const sharing = [
  {
    id: "single",
    title: "Single Sharing",
    beds: 1,
    icon: "🛏️",
    desc: "Private space for maximum comfort",
  },
  {
    id: "double",
    title: "Double Sharing",
    beds: 2,
    icon: "🛏️🛏️",
    desc: "Perfect balance of privacy & affordability",
  },
  {
    id: "triple",
    title: "Triple Sharing",
    beds: 3,
    icon: "🛏️🛏️🛏️",
    desc: "Budget-friendly and social living",
  },
];

export default function PgSharing({ Property, setProperty, setflowno }: PgSharingProps) {
  const [selected, setSelected] = useState<string>(Property?.propertyType || "double");

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 mb-3">
            Sharing Type
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Choose Room Sharing Type
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sharing.map((item) => {
            const isActive = selected === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300
                  ${
                    isActive
                      ? "border-green-600 bg-white shadow-xl shadow-green-100 scale-[1.02]"
                      : "border-slate-200 bg-white hover:shadow-lg"
                  }`}
              >
                {/* Active Indicator */}
                <div
                  className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border transition-all
                  ${
                    isActive
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isActive && <Check size={11} />}
                </div>

                {/* Icon */}
                <div className="mb-4 text-2xl">{item.icon}</div>

                {/* Title */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold
                    ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.beds} Person{item.beds > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {item.desc}
                </p>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Capacity</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.beds} Bed{item.beds > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-slate-100 text-slate-700 group-hover:bg-green-100 group-hover:text-green-700"
                    }`}
                  >
                    {isActive ? "Selected" : "Select"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setProperty((prev: any) => ({ ...prev, propertyType: selected }));
              setflowno((prev: number) => prev - 1);
            }}
            className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            Back
          </button>
          
          <button
            disabled={!selected}
            onClick={() => {
              setProperty((prev: any) => ({ ...prev, propertyType: selected }));
              setflowno((prev: number) => prev + 1);
            }}
            className="w-full sm:w-auto rounded-xl bg-green-800 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:bg-emerald-700 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}