"use client";

import { useRef } from "react";
import {
  Upload,
  ImagePlus,
  BedDouble,
  Bath,
  CookingPot,
  Building2,
  WashingMachine,
  Car,
  UtensilsCrossed,
  Images,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface PropertyPicturesProps {
  Property: any;
  setProperty: any;
  setflowno: any;
}

const pictureCategories = [
  {
    key: "roomImages",
    label: "Room",
    desc: "Upload bedroom photos",
    icon: BedDouble,
  },
  {
    key: "washroomImages",
    label: "Washroom",
    desc: "Bathroom & washroom photos",
    icon: Bath,
  },
  {
    key: "kitchenImages",
    label: "Kitchen",
    desc: "Kitchen area pictures",
    icon: CookingPot,
  },
  {
    key: "propertyImages",
    label: "Property",
    desc: "Building exterior & entrance",
    icon: Building2,
  },
  {
    key: "washingImages",
    label: "Laundry",
    desc: "Washing machine area",
    icon: WashingMachine,
  },
  {
    key: "parkingImages",
    label: "Parking",
    desc: "Parking availability photos",
    icon: Car,
  },
  {
    key: "diningImages",
    label: "Dining",
    desc: "Dining & food area",
    icon: UtensilsCrossed,
  },
  {
    key: "otherImages",
    label: "Other",
    desc: "Additional property photos",
    icon: Images,
  },
];

export default function PropertyPictures({
  Property = {},
  setProperty,
  setflowno,
}: PropertyPicturesProps) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileUpload = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    setProperty((prev: any) => ({
      ...prev,
      [key]: files,
    }));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            <Check size={12} />
            Property Gallery
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Upload Property Pictures
          </h1>

          <p className="mt-1.5 text-xs text-slate-500 max-w-xl">
            High quality photos increase trust and improve booking chances for
            your property.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {pictureCategories.map((item) => {
              const Icon = item.icon;
              let rawFiles = Property?.[item.key];
              if (!rawFiles) rawFiles = [];
              if (typeof rawFiles === "string") rawFiles = [rawFiles];
              const uploadedFiles = Array.isArray(rawFiles) ? rawFiles : [];
              const hasFiles = uploadedFiles.length > 0;

              return (
                <div
                  key={item.key}
                  className={`
                    rounded-xl border p-3 transition-all duration-300
                    ${
                      hasFiles
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                    }
                  `}
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`
                        flex h-9 w-9 items-center justify-center rounded-lg
                        ${
                          hasFiles
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }
                      `}
                    >
                      <Icon size={17} />
                    </div>

                    {hasFiles && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check size={11} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-3">
                    <h3 className="text-xs font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      fileRefs.current[item.key]?.click()
                    }
                    className={`
                      mt-3 flex w-full flex-col items-center justify-center
                      rounded-xl border-2 border-dashed px-3 py-4
                      transition-all duration-300
                      ${
                        hasFiles
                          ? "border-emerald-300 bg-white hover:bg-emerald-50"
                          : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50"
                      }
                    `}
                  >
                    <input
                      ref={(el) => {
                        fileRefs.current[item.key] = el;
                      }}
                      type="file"
                      multiple
                      accept=".jpeg,.jpg,.png"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(item.key, e)
                      }
                    />

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      {hasFiles ? (
                        <ImagePlus size={17} className="text-emerald-600" />
                      ) : (
                        <Upload size={17} className="text-slate-600" />
                      )}
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-700">
                      {hasFiles ? "Change/Upload" : "Upload"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, JPEG, PNG
                    </p>
                  </button>

                  {/* Preview */}
                  {hasFiles && (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-3">
                      <p className="text-sm font-semibold text-emerald-800">
                        {uploadedFiles.length} file
                        {uploadedFiles.length > 1 ? "s" : ""} uploaded
                      </p>

                      <div className="mt-2 space-y-1">
                        {uploadedFiles
                          .slice(0, 2)
                          .map((file: any, index: number) => {
                            const isString = typeof file === "string";
                            const name = isString ? file.split("/").pop() : file.name;
                            return (
                              <p
                                key={index}
                                className="truncate text-xs text-slate-500"
                              >
                                {name}
                              </p>
                            );
                          })}

                        {uploadedFiles.length > 2 && (
                          <p className="text-xs text-emerald-700">
                            +{uploadedFiles.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Note */}
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-900">Tips for better photos</p>
            <ul className="mt-1.5 space-y-0.5 text-xs text-amber-700">
              <li>• Use bright and clean images</li>
              <li>• Upload landscape photos for better visibility</li>
              <li>• Avoid blurry or dark pictures</li>
            </ul>
          </div>

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